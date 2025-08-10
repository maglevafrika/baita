

"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { getInitialSemesters, getInitialStudents, getInitialRequests, getInitialUsers, getInitialLeaves, getInitialPaymentSettings } from '@/lib/data';
import { Semester, StudentProfile, TeacherRequest, UserInDb, Leave, PaymentSettings } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type Listener<T> = (data: T[]) => void;

interface DatabaseContextType {
  semesters: Semester[];
  students: StudentProfile[];
  requests: TeacherRequest[];
  leaves: Leave[];
  paymentSettings: PaymentSettings;
  loading: boolean;
  addSemester: (semesterData: Omit<Semester, 'id' | 'teachers' | 'masterSchedule' | 'weeklyAttendance'>) => Promise<boolean>;
  updateSemester: (semesterId: string, semesterData: Partial<Omit<Semester, 'id'>>) => Promise<boolean>;
  addStudent: (studentData: Omit<StudentProfile, 'id'>) => Promise<boolean>;
  updateStudent: (studentId: string, studentData: Partial<Omit<StudentProfile, 'id'>>) => Promise<boolean>;
  deleteStudent: (studentId: string, reason: string) => Promise<boolean>;
  getStudent: (studentId: string) => Promise<StudentProfile | undefined>;
  addRequest: (requestData: Omit<TeacherRequest, 'id'>) => Promise<boolean>;
  updateRequest: (requestId: string, requestData: Partial<Omit<TeacherRequest, 'id'>>) => Promise<boolean>;
  getSemester: (semesterId: string) => Promise<Semester | undefined>;
  addLeave: (leaveData: Omit<Leave, 'id'>) => Promise<boolean>;
  updateLeave: (leaveId: string, leaveData: Partial<Omit<Leave, 'id'>>) => Promise<boolean>;
  updatePaymentSettings: (settings: Partial<PaymentSettings>) => Promise<boolean>;
  addListener: (listener: Listener<Semester>) => string;
  removeListener: (id: string) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: T | ((val: T) => T)) => void] {
  
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      const value = typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
      window.localStorage.setItem(key, JSON.stringify(value));
      return value;
    } catch (error) {
      console.log(error);
      return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}


export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [semesters, setSemesters] = useLocalStorage<Semester[]>('semesters', getInitialSemesters);
  const [students, setStudents] = useLocalStorage<StudentProfile[]>('students', getInitialStudents);
  const [requests, setRequests] = useLocalStorage<TeacherRequest[]>('requests', getInitialRequests);
  const [leaves, setLeaves] = useLocalStorage<Leave[]>('leaves', getInitialLeaves);
  const [paymentSettings, setPaymentSettings] = useLocalStorage<PaymentSettings>('paymentSettings', getInitialPaymentSettings);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const listenersRef = React.useRef<Record<string, Listener<Semester>>>({});

  useEffect(() => {
    // Check if initial users are needed (auth context does this for users)
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(getInitialUsers()));
    }
    setLoading(false);
  }, []);
  
  const addSemester = useCallback(async (semesterData: Omit<Semester, 'id' | 'teachers' | 'masterSchedule' | 'weeklyAttendance'>): Promise<boolean> => {
    try {
        const newSemester: Semester = {
            ...semesterData,
            id: `SEM-${Date.now()}`,
            teachers: [],
            masterSchedule: {},
            weeklyAttendance: {}
        };
        setSemesters(prev => [...prev, newSemester]);
        toast({ title: "Semester Added", description: `${semesterData.name} has been created.`});
        return true;
    } catch(error: any) {
        toast({ title: "Error", description: `Failed to add semester. ${error.message}`, variant: 'destructive'});
        return false;
    }
  }, [setSemesters, toast]);
  
  const updateSemester = useCallback(async (semesterId: string, semesterData: Partial<Omit<Semester, 'id'>>): Promise<boolean> => {
    try {
        setSemesters(prev => {
            const updated = prev.map(s => s.id === semesterId ? { ...s, ...semesterData } : s);
            Object.values(listenersRef.current).forEach(listener => listener(updated));
            return updated;
        });
        return true;
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to update semester. ${error.message}`, variant: "destructive" });
        return false;
    }
  }, [setSemesters, toast]);

  const addStudent = useCallback(async (studentData: Omit<StudentProfile, 'id'>): Promise<boolean> => {
    try {
        const newStudent: StudentProfile = {
            ...studentData,
            id: `STU-${Date.now()}`
        };
        setStudents(prev => [...prev, newStudent]);
        return true;
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to add student. ${error.message}`, variant: "destructive" });
        return false;
    }
  }, [setStudents, toast]);

  const updateStudent = useCallback(async (studentId: string, studentData: Partial<Omit<StudentProfile, 'id'>>): Promise<boolean> => {
    try {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, ...studentData } : s));
        return true;
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to update student. ${error.message}`, variant: "destructive" });
        return false;
    }
  }, [setStudents, toast]);

  const deleteStudent = useCallback(async (studentId: string, reason: string): Promise<boolean> => {
    try {
      const studentName = students.find(s => s.id === studentId)?.name || 'The student';
      setStudents(prev => prev.map(s => s.id === studentId ? { 
          ...s, 
          status: 'deleted',
          deletionInfo: {
            date: format(new Date(), 'yyyy-MM-dd'),
            reason: reason,
          },
          enrolledIn: [] // Un-enroll from all sessions
        } : s));
        
      toast({ title: "Student Deleted", description: `${studentName} has been marked as deleted.` });
      return true;
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to delete student. ${error.message}`, variant: "destructive" });
      return false;
    }
  }, [students, setStudents, toast]);

  const getStudent = useCallback(async (studentId: string): Promise<StudentProfile | undefined> => {
    return students.find(s => s.id === studentId);
  }, [students]);

  const getSemester = useCallback(async (semesterId: string): Promise<Semester | undefined> => {
    return semesters.find(s => s.id === semesterId);
  }, [semesters]);

  const addRequest = useCallback(async (requestData: Omit<TeacherRequest, 'id'>): Promise<boolean> => {
      try {
          const newRequest: TeacherRequest = {
              ...requestData,
              id: `REQ-${Date.now()}`
          };
          setRequests(prev => [...prev, newRequest]);
          return true;
      } catch (error: any) {
          toast({ title: "Error", description: `Failed to add request. ${error.message}`, variant: "destructive" });
          return false;
      }
  }, [setRequests, toast]);

  const updateRequest = useCallback(async (requestId: string, requestData: Partial<Omit<TeacherRequest, 'id'>>): Promise<boolean> => {
      try {
          setRequests(prev => prev.map(r => r.id === requestId ? { ...r, ...requestData } : r));
          return true;
      } catch (error: any) {
          toast({ title: "Error", description: `Failed to update request. ${error.message}`, variant: "destructive" });
          return false;
      }
  }, [setRequests, toast]);

  const addLeave = useCallback(async (leaveData: Omit<Leave, 'id'>): Promise<boolean> => {
    try {
        const newLeave: Leave = { ...leaveData, id: `LEAVE-${Date.now()}`};
        setLeaves(prev => [...prev, newLeave]);
        toast({ title: "Leave Request Submitted", description: `The request has been submitted for approval.` });
        return true;
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to submit leave request. ${error.message}`, variant: 'destructive' });
        return false;
    }
  }, [setLeaves, toast]);

  const updateLeave = useCallback(async (leaveId: string, leaveData: Partial<Omit<Leave, 'id'>>): Promise<boolean> => {
    try {
        setLeaves(prev => prev.map(l => l.id === leaveId ? { ...l, ...leaveData } : l));
        return true;
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to update leave request. ${error.message}`, variant: 'destructive' });
        return false;
    }
  }, [setLeaves, toast]);

  const updatePaymentSettings = useCallback(async (settings: Partial<PaymentSettings>): Promise<boolean> => {
    try {
      setPaymentSettings(prev => ({...prev, ...settings}));
      toast({ title: "Success", description: "Payment settings have been updated." });
      return true;
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to update settings. ${error.message}`, variant: 'destructive' });
      return false;
    }
  }, [setPaymentSettings, toast]);

  const addListener = useCallback((listener: Listener<Semester>) => {
    const id = `l_${Date.now()}_${Math.random()}`;
    listenersRef.current[id] = listener;
    return id;
  }, []);

  const removeListener = useCallback((id: string) => {
    delete listenersRef.current[id];
  }, []);


  const value = { 
      semesters, 
      students, 
      requests, 
      leaves,
      paymentSettings,
      loading, 
      addSemester, 
      updateSemester, 
      addStudent, 
      updateStudent,
      deleteStudent,
      getStudent,
      addRequest,
      updateRequest,
      getSemester,
      addLeave,
      updateLeave,
      updatePaymentSettings,
      addListener,
      removeListener,
  };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
