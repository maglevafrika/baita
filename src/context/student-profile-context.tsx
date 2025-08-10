
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { StudentProfile, Grade, Evaluation, LevelChange } from "@/lib/types";
import { useDatabase } from './database-context';

interface StudentProfileContextType {
  student: StudentProfile | null;
  loading: boolean;
  handleAddGrade: (gradeData: Omit<Grade, 'id'>) => Promise<boolean>;
  handleUpdateStudentLevel: (newLevel: string, review: string) => Promise<boolean>;
  handleEvaluateStudent: (evaluationData: Omit<Evaluation, 'id'>) => Promise<boolean>;
}

const StudentProfileContext = createContext<StudentProfileContextType | undefined>(undefined);

export function StudentProfileProvider({ children, studentId }: { children: ReactNode; studentId: string; }) {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { students, updateStudent } = useDatabase();

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    };
    setLoading(true);
    const currentStudent = students.find(s => s.id === studentId);
    if(currentStudent) {
        setStudent(currentStudent);
    } else {
        setStudent(null);
    }
    setLoading(false);
  }, [studentId, students]);
  
  const handleAddGrade = useCallback(async (gradeData: Omit<Grade, 'id'>): Promise<boolean> => {
    if (!student) return false;
    const newGrade: Grade = {
        ...gradeData,
        id: `GRD-${Date.now()}`
    };
    const updatedGrades = [...(student.grades || []), newGrade];
    const success = await updateStudent(student.id, { grades: updatedGrades });

    if (success) {
      toast({ title: "Grade Added", description: "The new grade has been successfully recorded." });
    }
    return success;
  }, [student, updateStudent, toast]);

  const handleUpdateStudentLevel = useCallback(async (newLevel: string, review: string): Promise<boolean> => {
    if (!student) return false;
    
    if (newLevel === student.level) {
        toast({ title: "No Change", description: "The selected level is the same as the current level.", variant: "default" });
        return false;
    }

    const levelChangeEntry: LevelChange = {
        date: new Date().toISOString(),
        level: newLevel,
        review: review
    };

    const updatedLevelHistory = [...(student.levelHistory || []), levelChangeEntry];
    
    const success = await updateStudent(student.id, { level: newLevel, levelHistory: updatedLevelHistory });

    if (success) {
        toast({ title: "Level Updated", description: `${student.name}'s level has been changed to ${newLevel}.` });
    }
    return success;
  }, [student, updateStudent, toast]);

  const handleEvaluateStudent = useCallback(async (evaluationData: Omit<Evaluation, 'id'>): Promise<boolean> => {
    if (!student) return false;
    const newEvaluation: Evaluation = {
        ...evaluationData,
        id: `EVAL-${Date.now()}`
    };
    
    const updatedEvaluations = [...(student.evaluations || []), newEvaluation];
    const success = await updateStudent(student.id, { evaluations: updatedEvaluations });

    if (success) {
        toast({ title: "Evaluation Added", description: "The new evaluation has been successfully recorded." });
    }
    return success;
  }, [student, updateStudent, toast]);

  const value = { student, loading, handleAddGrade, handleUpdateStudentLevel, handleEvaluateStudent };

  return <StudentProfileContext.Provider value={value}>{children}</StudentProfileContext.Provider>;
}

export function useStudentProfile() {
  const context = useContext(StudentProfileContext);
  if (context === undefined) {
    throw new Error('useStudentProfile must be used within a StudentProfileProvider');
  }
  return context;
}
