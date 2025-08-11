"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, Role, UserInDb } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Theme = "light" | "dark";

interface AuthContextType {
  user: User | null;
  users: UserInDb[];
  loading: boolean;
  login: (username: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
  addUser: (userData: Omit<UserInDb, 'id'>) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<Omit<UserInDb, 'id'>>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  customLogoUrl: string | null;
  setCustomLogo: (url: string | null) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useAuth();
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserInDb[]>([]);
  const [loading, setLoading] = useState(true);
  const [customLogoUrl, setCustomLogoUrlState] = useState<string | null>(null);
  const [theme, setThemeState] = useState<Theme>('light');
  const router = useRouter();
  const { toast } = useToast();

  // Initialize Firebase listeners and local storage
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    // Users listener
    const usersQuery = query(collection(db, 'users'), orderBy('name', 'asc'));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UserInDb));
      setUsers(usersData);
    });
    unsubscribes.push(unsubscribeUsers);

    // App settings listener (for logo and theme)
    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'app'), (snapshot) => {
      if (snapshot.exists()) {
        const settings = snapshot.data();
        if (settings.customLogoUrl !== undefined) {
          setCustomLogoUrlState(settings.customLogoUrl);
          if (settings.customLogoUrl) {
            localStorage.setItem('customLogoUrl', settings.customLogoUrl);
          } else {
            localStorage.removeItem('customLogoUrl');
          }
        }
        if (settings.theme !== undefined) {
          setThemeState(settings.theme);
          localStorage.setItem('app-theme', settings.theme);
        }
      }
      setLoading(false);
    });
    unsubscribes.push(unsubscribeSettings);

    // Initialize from localStorage for immediate display
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      const storedLogo = localStorage.getItem('customLogoUrl');
      if (storedLogo) {
        setCustomLogoUrlState(storedLogo);
      }
      
      const storedTheme = localStorage.getItem('app-theme') as Theme | null;
      if (storedTheme) {
        setThemeState(storedTheme);
      }
    } catch (error) {
      console.error("Failed to parse from storage", error);
      sessionStorage.removeItem('user');
      localStorage.removeItem('customLogoUrl');
      localStorage.removeItem('app-theme');
    }

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  const login = async (username: string): Promise<boolean> => {
    try {
      const userInDb = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
      
      if (userInDb) {
        const sessionUser: User = {
          id: userInDb.id,
          username: userInDb.username,
          name: userInDb.name,
          roles: userInDb.roles,
          activeRole: userInDb.roles[0], 
        };
        sessionStorage.setItem('user', JSON.stringify(sessionUser));
        setUser(sessionUser);
        
        // Update last login time
        await updateDoc(doc(db, 'users', userInDb.id), {
          lastLogin: new Date().toISOString(),
        });
        
        router.push('/dashboard');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const switchRole = (role: Role) => {
    if (user && user.roles.includes(role)) {
      const updatedUser = { ...user, activeRole: role };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast({
        title: `Switched to ${role.replace('-', ' ')}`,
        description: "Your view has been updated."
      });
    }
  };

  const addUser = useCallback(async (userData: Omit<UserInDb, 'id'>): Promise<boolean> => {
    try {
      // Check if username already exists
      if (users.some(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
        toast({
          title: "Username Exists",
          description: "This username is already taken.",
          variant: 'destructive'
        });
        return false;
      }

      const now = new Date().toISOString();
      await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: now,
        updatedAt: now,
        lastLogin: null,
      });

      toast({
        title: "User Added",
        description: `${userData.name} has been created successfully.`
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to add user: ${error.message}`,
        variant: 'destructive'
      });
      return false;
    }
  }, [users, toast]);

  const updateUser = useCallback(async (userId: string, userData: Partial<Omit<UserInDb, 'id'>>): Promise<boolean> => {
    try {
      // Check for username collision if username is being changed
      if (userData.username && users.some(u => u.id !== userId && u.username.toLowerCase() === userData.username!.toLowerCase())) {
        toast({
          title: "Username Exists",
          description: "This username is already taken.",
          variant: 'destructive'
        });
        return false;
      }

      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: new Date().toISOString(),
      });
      
      // If the currently logged-in user is the one being updated, update their session data too
      if (user && user.id === userId) {
        const updatedUserInDb = users.find(u => u.id === userId);
        if (updatedUserInDb) {
          const sessionUser: User = {
            id: updatedUserInDb.id,
            username: userData.username || updatedUserInDb.username,
            name: userData.name || updatedUserInDb.name,
            roles: userData.roles || updatedUserInDb.roles,
            activeRole: (userData.roles && !userData.roles.includes(user.activeRole)) 
              ? userData.roles[0] 
              : user.activeRole,
          };
          sessionStorage.setItem('user', JSON.stringify(sessionUser));
          setUser(sessionUser);
        }
      }
      
      if (!userData.password) {
        toast({
          title: "User Updated",
          description: "User details have been saved successfully."
        });
      }

      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update user: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }
  }, [users, toast, user]);

  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      // Prevent deleting the currently logged-in user
      if (user && user.id === userId) {
        toast({
          title: "Cannot Delete",
          description: "You cannot delete your own account while logged in.",
          variant: 'destructive'
        });
        return false;
      }

      await deleteDoc(doc(db, 'users', userId));
      
      toast({
        title: "User Deleted",
        description: "User has been deleted successfully."
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }
  }, [user, toast]);

  const setCustomLogo = async (url: string | null) => {
    try {
      await updateDoc(doc(db, 'settings', 'app'), {
        customLogoUrl: url,
        updatedAt: new Date().toISOString(),
      });
      
      // Local state will be updated by the listener
      toast({
        title: "Logo Updated",
        description: url ? "Custom logo has been set." : "Logo has been reset to default."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update logo: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      await updateDoc(doc(db, 'settings', 'app'), {
        theme: newTheme,
        updatedAt: new Date().toISOString(),
      });
      
      // Local state will be updated by the listener
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update theme: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const refreshUsers = async () => {
    try {
      setLoading(true);
      // Data will be refreshed automatically by the listeners
      setTimeout(() => setLoading(false), 1000);
    } catch (error: any) {
      console.error('Refresh error:', error);
      setLoading(false);
    }
  };

  const value = {
    user,
    users,
    loading,
    login,
    logout,
    switchRole,
    customLogoUrl,
    setCustomLogo,
    theme,
    setTheme,
    addUser,
    updateUser,
    deleteUser,
    refreshUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}