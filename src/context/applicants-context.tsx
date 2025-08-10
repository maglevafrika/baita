

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Applicant, StudentProfile, InterviewEvaluation } from "@/lib/types";
import { useAuth } from './auth-context';
import { addMinutes, format } from 'date-fns';
import { getInitialApplicants } from '@/lib/data';

function useLocalStorage<T>(key: string, initialValue: T[] | (() => T[])): [T[], React.Dispatch<React.SetStateAction<T[]>>] {
    const [storedValue, setStoredValue] = useState<T[]>(() => {
        if (typeof window === 'undefined') {
            return Array.isArray(initialValue) ? initialValue : initialValue();
        }
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                return JSON.parse(item);
            }
            const value = Array.isArray(initialValue) ? initialValue : initialValue();
            window.localStorage.setItem(key, JSON.stringify(value));
            return value;
        } catch (error) {
            console.log(error);
            return Array.isArray(initialValue) ? initialValue : initialValue();
        }
    });

    const setValue = (value: T[] | ((val: T[]) => T[])) => {
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
    return [storedValue, setValue];
}


interface ApplicantsContextType {
  applicants: Applicant[];
  loading: boolean;
  addApplicant: (applicantData: Omit<Applicant, 'id' | 'status' | 'applicationDate' | 'lastUpdated'>) => Promise<boolean>;
  updateApplicant: (applicantId: string, applicantData: Partial<Applicant>) => Promise<boolean>;
  deleteApplicant: (applicantId: string) => Promise<boolean>;
  scheduleInterviews: (applicantIds: string[], details: { date: string; startTime: string; duration: number; breakTime: number; teacherIds: string[] }) => Promise<boolean>;
  evaluateApplication: (applicantId: string, evaluation: InterviewEvaluation, enroll: boolean) => Promise<boolean>;
  cancelApplication: (applicantId: string, reason: string) => Promise<boolean>;
}

const ApplicantsContext = createContext<ApplicantsContextType | undefined>(undefined);

export function ApplicantsProvider({ children }: { children: ReactNode }) {
  const [applicants, setApplicants] = useLocalStorage<Applicant>('applicants', getInitialApplicants);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { users } = useAuth();

  useEffect(() => {
    setLoading(false);
  }, []);
  
  const addApplicant = useCallback(async (applicantData: Omit<Applicant, 'id' | 'status' | 'applicationDate' | 'lastUpdated'>): Promise<boolean> => {
    try {
      const newApplicant: Applicant = {
        ...applicantData,
        id: `APP-${Date.now()}`,
        status: 'pending-review',
        applicationDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      setApplicants(prev => [...prev, newApplicant]);
      toast({ title: "Applicant Added", description: `${applicantData.name} has been added.`});
      return true;
    } catch(error: any) {
      toast({ title: "Error", description: `Failed to add applicant. ${error.message}`, variant: 'destructive'});
      return false;
    }
  }, [setApplicants, toast]);

  const updateApplicant = useCallback(async (applicantId: string, applicantData: Partial<Applicant>): Promise<boolean> => {
    try {
        setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, ...applicantData, lastUpdated: new Date().toISOString() } : a));
        toast({ title: "Applicant Updated", description: "Applicant details have been saved." });
        return true;
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to update applicant. ${error.message}`, variant: "destructive" });
        return false;
    }
  }, [setApplicants, toast]);

  const deleteApplicant = useCallback(async (applicantId: string): Promise<boolean> => {
    try {
        setApplicants(prev => prev.filter(a => a.id !== applicantId));
        toast({ title: "Applicant Deleted", description: "The applicant has been permanently removed." });
        return true;
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to delete applicant. ${error.message}`, variant: "destructive" });
        return false;
    }
  }, [setApplicants, toast]);

  const scheduleInterviews = useCallback(async (
    applicantIds: string[], 
    details: { date: string; startTime: string; duration: number; breakTime: number; teacherIds: string[] }
  ): Promise<boolean> => {
    
    const { date, startTime, duration, breakTime, teacherIds } = details;

    const interviewers = users.filter(u => teacherIds.includes(u.id));
    if (interviewers.length === 0) {
        toast({ title: "No Interviewers", description: "The selected teachers could not be found.", variant: "destructive" });
        return false;
    }

    const [startHour, startMinute] = startTime.split(':').map(Number);
    let interviewTime = new Date(date);
    interviewTime.setHours(startHour, startMinute, 0, 0);

    const totalSlotTime = duration + breakTime;
    
    const schedules: Record<string, Date> = {};
    interviewers.forEach(interviewer => {
        schedules[interviewer.id] = new Date(interviewTime.getTime());
    });
    
    let applicantIndex = 0;
    const updatedApplicants = [...applicants];

    while(applicantIndex < applicantIds.length) {
        for(const interviewer of interviewers) {
             if(applicantIndex >= applicantIds.length) break;

             const applicantId = applicantIds[applicantIndex];
             const currentApplicantIndex = updatedApplicants.findIndex(a => a.id === applicantId);
             
             if (currentApplicantIndex > -1) {
                const assignedTime = schedules[interviewer.id];

                updatedApplicants[currentApplicantIndex] = {
                    ...updatedApplicants[currentApplicantIndex],
                    status: 'interview-scheduled',
                    interviewDate: date,
                    interviewTime: format(assignedTime, 'HH:mm'),
                    interviewer: interviewer.name,
                    lastUpdated: new Date().toISOString()
                };

                schedules[interviewer.id] = addMinutes(assignedTime, totalSlotTime);
             }
             applicantIndex++;
        }
    }

    try {
        setApplicants(updatedApplicants);
        toast({ title: "Interviews Scheduled", description: `Generated a schedule for ${applicantIds.length} applicants.` });
        return true;
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to schedule interviews. ${error.message}`, variant: "destructive" });
        return false;
    }
  }, [applicants, setApplicants, toast, users]);


  const evaluateApplication = useCallback(async (applicantId: string, evaluation: InterviewEvaluation, enroll: boolean): Promise<boolean> => {
    try {
        const applicantDoc = applicants.find(a => a.id === applicantId);
        if (!applicantDoc) throw new Error("Applicant not found");

        const updatedApplicant: Applicant = {
            ...applicantDoc,
            status: evaluation.decision === 'rejected' ? 'rejected' : 'approved',
            evaluation: evaluation,
            lastUpdated: new Date().toISOString()
        };

        setApplicants(prev => prev.map(a => a.id === applicantId ? updatedApplicant : a));

        if (evaluation.decision === 'approved' && enroll) {
            const allStudents: StudentProfile[] = JSON.parse(localStorage.getItem('students') || '[]');
            const newStudent: StudentProfile = {
                id: `STU-${Date.now()}`,
                name: applicantDoc.name,
                gender: applicantDoc.gender,
                dob: applicantDoc.dob,
                nationality: applicantDoc.nationality,
                instrumentInterest: applicantDoc.instrumentInterest,
                enrollmentDate: new Date().toISOString().split('T')[0],
                level: 'Beginner', // Default level
                paymentPlan: 'none',
                enrolledIn: [],
                levelHistory: [{
                    date: new Date().toISOString(),
                    level: 'Beginner',
                    review: 'Initial enrollment from application.'
                }],
            };
            localStorage.setItem('students', JSON.stringify([...allStudents, newStudent]));
        }

        const message = evaluation.decision === 'rejected' ? 'rejected' : (enroll ? 'approved and enrolled' : 'approved');
        toast({ title: "Application Evaluated", description: `The application has been ${message}.` });
        return true;
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to evaluate application. ${error.message}`, variant: "destructive" });
        return false;
    }
  }, [applicants, setApplicants, toast]);

  const cancelApplication = useCallback(async (applicantId: string, reason: string): Promise<boolean> => {
    try {
        setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: 'cancelled', cancellationReason: reason, lastUpdated: new Date().toISOString() } : a));
        toast({ title: "Application Cancelled", description: `The application has been cancelled.` });
        return true;
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to cancel application. ${error.message}`, variant: "destructive" });
        return false;
    }
  }, [setApplicants, toast]);

  const value = { 
    applicants, 
    loading, 
    addApplicant,
    updateApplicant,
    deleteApplicant,
    scheduleInterviews,
    evaluateApplication,
    cancelApplication,
  };

  return <ApplicantsContext.Provider value={value}>{children}</ApplicantsContext.Provider>;
}

export function useApplicants() {
  const context = useContext(ApplicantsContext);
  if (context === undefined) {
    throw new Error('useApplicants must be used within an ApplicantsProvider');
  }
  return context;
}
