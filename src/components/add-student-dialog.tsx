
"use client";

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import type { ProcessedSession, Semester, Session, StudentProfile, SessionStudent, TeacherRequest } from '@/lib/types';
import { UserPlus } from 'lucide-react';
import { useDatabase } from '@/context/database-context';

export const AddStudentDialog = ({ session, semester, teacherName, onStudentAdded, asChild, children }: { session: ProcessedSession, semester: Semester, teacherName: string, onStudentAdded: () => void, asChild?: boolean, children?: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { students: allStudents, updateSemester, addRequest } = useDatabase();
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();
    const { user } = useAuth();
    const isAdmin = user?.activeRole === 'admin';

    const handleAddStudent = async (student: StudentProfile) => {
        const studentToAdd: SessionStudent = { id: student.id, name: student.name, attendance: null, pendingRemoval: false };
        
        const updatedSchedule = JSON.parse(JSON.stringify(semester.masterSchedule));
        const daySessions = updatedSchedule[teacherName]?.[session.day];
        if (!daySessions) {
            toast({ title: "Error", description: "Day or teacher schedule not found!", variant: 'destructive'});
            return;
        }

        const sessionIndex = daySessions.findIndex((s: Session) => s.id === session.id);
        if (sessionIndex === -1) {
            toast({ title: "Error", description: "Session not found!", variant: 'destructive'});
            return;
        }

        const studentExists = daySessions[sessionIndex].students.some((s: SessionStudent) => s.id === student.id);
        if (studentExists) {
            toast({ title: "Student Already Enrolled", description: `${student.name} is already in this session.`, variant: "default" });
            return;
        }
        
        updatedSchedule[teacherName][session.day][sessionIndex].students.push(studentToAdd);
        
        const success = await updateSemester(semester.id, { masterSchedule: updatedSchedule });

        if (success) {
            toast({ title: "Student Added", description: `${student.name} has been added to the session.` });
            onStudentAdded();
            setIsOpen(false);
        }
    };
    
    const handleRequestAddStudent = async (student: StudentProfile) => {
        if (!user) return;
        
        const request: Omit<TeacherRequest, 'id'> = {
            type: 'add-student',
            status: 'pending',
            date: new Date().toISOString(),
            teacherId: user.id,
            teacherName: user.name,
            details: {
                studentId: student.id,
                studentName: student.name,
                sessionId: session.id,
                sessionTime: session.time,
                day: session.day,
                reason: `Teacher requested to add ${student.name} to their session.`,
                semesterId: semester.id
            }
        };
        const success = await addRequest(request);

        if (success) {
            toast({ title: "Request Sent", description: `Request to add ${student.name} has been sent for approval.` });
            onStudentAdded();
            setIsOpen(false);
        }
    }


    const filteredStudents = useMemo(() => {
        const sessionStudentIds = session.students.map(s => s.id);
        return allStudents.filter(student => 
            !sessionStudentIds.includes(student.id) &&
            student.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allStudents, searchTerm, session.students]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild={asChild}>
                {children ?? (
                    <Button variant="ghost" size="sm" className="w-full h-full text-xs text-muted-foreground font-normal">
                        <UserPlus className="mr-2 h-3 w-3" /> { isAdmin ? "Add Student" : "Request to Add"}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Student to Session</DialogTitle>
                    <DialogDescription>Search for an existing student to add to this session.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Input 
                        placeholder="Search student name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {filteredStudents.length > 0 ? filteredStudents.map(student => (
                            <div key={student.id} className="flex items-center justify-between p-2 border rounded-md">
                                <span>{student.name} ({student.level})</span>
                                <Button size="sm" onClick={() => isAdmin ? handleAddStudent(student) : handleRequestAddStudent(student)}>
                                    {isAdmin ? 'Add' : 'Request'}
                                </Button>
                            </div>
                        )) : <p className="text-sm text-muted-foreground text-center">No students found.</p>}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
