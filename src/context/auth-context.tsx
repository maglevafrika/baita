
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, Role, UserInDb } from '@/lib/types';
import { getInitialUsers } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

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
  customLogoUrl: string | null;
  setCustomLogo: (url: string | null) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useAuth()
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserInDb[]>([]);
  const [loading, setLoading] = useState(true);
  const [customLogoUrl, setCustomLogoUrlState] = useState<string | null>(null);
  const [theme, setThemeState] = useState<Theme>('light');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        const initialUsers = getInitialUsers();
        setUsers(initialUsers);
        localStorage.setItem('users', JSON.stringify(initialUsers));
      }

      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      const storedLogo = localStorage.getItem('customLogoUrl');
      if(storedLogo) {
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
      localStorage.removeItem('users');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username: string): Promise<boolean> => {
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
      router.push('/dashboard');
      return true;
    }
    return false;
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
      toast({title: `Switched to ${role.replace('-', ' ')}`, description: "Your view has been updated."})
    }
  };

  const addUser = useCallback(async (userData: Omit<UserInDb, 'id'>): Promise<boolean> => {
    try {
      if (users.some(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
        toast({ title: "Username Exists", description: "This username is already taken.", variant: 'destructive'});
        return false;
      }
      const newUser: UserInDb = {
        ...userData,
        id: `USR-${Date.now()}`
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      toast({ title: "User Added", description: `${userData.name} has been created.`});
      return true;
    } catch(error: any) {
        toast({ title: "Error", description: `Failed to add user. ${error.message}`, variant: 'destructive'});
        return false;
    }
  }, [users, toast]);

  const updateUser = useCallback(async (userId: string, userData: Partial<Omit<UserInDb, 'id'>>): Promise<boolean> => {
    try {
      // Check for username collision if username is being changed
      if (userData.username && users.some(u => u.id !== userId && u.username.toLowerCase() === userData.username!.toLowerCase())) {
         toast({ title: "Username Exists", description: "This username is already taken.", variant: 'destructive'});
        return false;
      }

      const updatedUsers = users.map(u => u.id === userId ? { ...u, ...userData } : u);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // If the currently logged-in user is the one being updated, update their session data too
      if(user && user.id === userId) {
        const newSessionUser = updatedUsers.find(u => u.id === userId);
        if (newSessionUser) {
           const sessionUser: User = {
            id: newSessionUser.id,
            username: newSessionUser.username,
            name: newSessionUser.name,
            roles: newSessionUser.roles,
            activeRole: newSessionUser.roles.includes(user.activeRole) ? user.activeRole : newSessionUser.roles[0],
          };
          sessionStorage.setItem('user', JSON.stringify(sessionUser));
          setUser(sessionUser);
        }
      }
      
      if (!userData.password) {
        toast({ title: "User Updated", description: "User details have been saved." });
      }

      return true;
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to update user. ${error.message}`, variant: "destructive" });
        return false;
    }
  }, [users, toast, user]);

  const setCustomLogo = (url: string | null) => {
    setCustomLogoUrlState(url);
    if (url) {
      localStorage.setItem('customLogoUrl', url);
    } else {
      localStorage.removeItem('customLogoUrl');
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
  }

  const value = { user, users, loading, login, logout, switchRole, customLogoUrl, setCustomLogo, theme, setTheme, addUser, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
