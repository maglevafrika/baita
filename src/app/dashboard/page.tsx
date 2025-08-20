"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, Hourglass, Calendar, ChevronLeft, ChevronRight, BarChart3, UserPlus, Upload, FileDown, Check, X, Clock, File, Trash2, GripVertical, FileText } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Semester, SessionStudent, Session, ProcessedSession, StudentProfile, TeacherRequest, Leave, UserInDb } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { useDatabase } from "@/context/database-context";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { addDays, format, startOfWeek, isWithinInterval } from 'date-fns';
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from 'react-i18next';

// Import for Export
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Placeholder Dialogs
import { CreateSessionDialog } from "@/components/create-session-dialog";
import { ImportStudentsDialog } from "@/components/import-students-dialog";

interface ImportScheduleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImportScheduleDialog = ({
  isOpen,
  onOpenChange
}: ImportScheduleDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("importSchedule.title")}</DialogTitle>
          <DialogDescription>
            {t("importSchedule.description")}
          </DialogDescription>
        </DialogHeader>

        {/* CSV Upload Form */}
        <ImportStudentsDialog isOpen={isOpen} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};

// Enhanced EnrollStudentDialog Component
interface EnrollStudentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  students: StudentProfile[];
  semester: Semester;
  teachers: UserInDb[];
  onEnrollmentSuccess: () => void;
}

const EnrollStudentDialog = ({ 
  isOpen, 
  onOpenChange, 
  students, 
  semester, 
  teachers, 
  onEnrollmentSuccess 
}: EnrollStudentDialogProps) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { updateSemester, updateStudent } = useDatabase();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Get available students (not enrolled in selected session)
  const availableStudents = useMemo(() => {
    if (!selectedSession || !selectedTeacher) return students;
    
    const teacherSchedule = semester.masterSchedule?.[selectedTeacher];
    if (!teacherSchedule) return students;

    const enrolledStudentIds = new Set<string>();
    Object.values(teacherSchedule).forEach(sessions => {
      sessions.forEach(session => {
        if (session.id === selectedSession) {
          session.students.forEach(student => enrolledStudentIds.add(student.id));
        }
      });
    });

    return students.filter(student => !enrolledStudentIds.has(student.id));
  }, [students, selectedSession, selectedTeacher, semester.masterSchedule]);

  // Get available sessions for selected teacher
  const availableSessions = useMemo(() => {
    if (!selectedTeacher) return [];
    
    const teacherSchedule = semester.masterSchedule?.[selectedTeacher];
    if (!teacherSchedule) return [];

    const sessions: Array<{ id: string; day: string; time: string; specialization: string; type: string }> = [];
    Object.entries(teacherSchedule).forEach(([day, daySessions]) => {
      daySessions.forEach(session => {
        sessions.push({
          id: session.id,
          day,
          time: session.time,
          specialization: session.specialization,
          type: session.type
        });
      });
    });

    return sessions;
  }, [selectedTeacher, semester.masterSchedule]);

  const handleEnroll = async () => {
    if (!selectedStudentId || !selectedTeacher || !selectedSession) {
      toast({
        title: t('common.error'),
        description: t('enrollment.fillAllFields'),
        variant: "destructive"
      });
      return;
    }

    const studentToEnroll = students.find(s => s.id === selectedStudentId);
    if (!studentToEnroll) {
      toast({
        title: t('common.error'),
        description: t('enrollment.studentNotFound'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create SessionStudent object
      const studentData: SessionStudent = {
        id: studentToEnroll.id,
        name: studentToEnroll.name,
        attendance: null
      };

      // Update master schedule
      const masterSchedule = JSON.parse(JSON.stringify(semester.masterSchedule));
      const teacherSchedule = masterSchedule[selectedTeacher];
      
      // Find the session and add student
      let sessionFound = false;
      Object.keys(teacherSchedule).forEach(day => {
        const sessionIndex = teacherSchedule[day].findIndex((s: Session) => s.id === selectedSession);
        if (sessionIndex > -1) {
          masterSchedule[selectedTeacher][day][sessionIndex].students.push(studentData);
          sessionFound = true;
        }
      });

      if (!sessionFound) {
        throw new Error(t('enrollment.sessionNotFound'));
      }

      // Update student's enrolled sessions
      const updatedEnrolledIn = [
        ...studentToEnroll.enrolledIn,
        {
          semesterId: semester.id || "",
          sessionId: selectedSession,
          teacherName: selectedTeacher
        }
      ];

      // Update both semester and student
      await Promise.all([
        updateSemester(semester.id || "", { masterSchedule }),
        updateStudent(selectedStudentId, { enrolledIn: updatedEnrolledIn })
      ]);

      toast({
        title: t('enrollment.success'),
        description: t('enrollment.studentEnrolled', { studentName: studentToEnroll.name })
      });

      onEnrollmentSuccess();
      onOpenChange(false);
      
      // Reset form
      setSelectedStudentId("");
      setSelectedTeacher("");
      setSelectedSession("");
      
    } catch (error: any) {
      console.error('Enrollment error:', error);
      toast({
        title: t('common.error'),
        description: t('enrollment.failed', { message: error.message }),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('enrollment.title')}</DialogTitle>
          <DialogDescription>
            {t('enrollment.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('enrollment.selectStudent')}</label>
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger>
                <SelectValue placeholder={t('enrollment.chooseStudent')} />
              </SelectTrigger>
              <SelectContent>
                {availableStudents.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('enrollment.selectTeacher')}</label>
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger>
                <SelectValue placeholder={t('enrollment.chooseTeacher')} />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(teacher => (
                  <SelectItem key={teacher.id} value={teacher.name || ""}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('enrollment.selectSession')}</label>
            <Select 
              value={selectedSession} 
              onValueChange={setSelectedSession}
              disabled={!selectedTeacher}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('enrollment.chooseSession')} />
              </SelectTrigger>
              <SelectContent>
                {availableSessions.map(session => (
                  <SelectItem key={session.id} value={session.id}>
                    {session.day} - {session.time} ({session.specialization})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleEnroll} 
              disabled={isLoading || !selectedStudentId || !selectedTeacher || !selectedSession}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('enrollment.enrolling')}
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t('enrollment.enrollStudent')}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Enhanced AddStudentDialog Component
interface AddStudentDialogProps {
  session: ProcessedSession;
  semester: Semester;
  teacherName: string;
  onStudentAdded: () => void;
  children?: React.ReactNode;
  asChild?: boolean;
}

const AddStudentDialog = ({ 
  session, 
  semester, 
  teacherName, 
  onStudentAdded, 
  children, 
  asChild 
}: AddStudentDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { students } = useDatabase();
  const { updateSemester, updateStudent } = useDatabase();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Get students not already in this session
  const availableStudents = useMemo(() => {
    const enrolledIds = session.students.map(s => s.id);
    return students.filter(student => !enrolledIds.includes(student.id));
  }, [students, session.students]);

  const handleAddStudent = async () => {
    if (!selectedStudentId) return;

    const studentToAdd = students.find(s => s.id === selectedStudentId);
    if (!studentToAdd) return;

    setIsLoading(true);
    try {
      // Create SessionStudent object
      const studentData: SessionStudent = {
        id: studentToAdd.id,
        name: studentToAdd.name,
        attendance: null
      };

      // Update master schedule
      const masterSchedule = JSON.parse(JSON.stringify(semester.masterSchedule));
      const teacherSchedule = masterSchedule[teacherName];
      
      const sessionIndex = teacherSchedule[session.day].findIndex((s: Session) => s.id === session.id);
      if (sessionIndex > -1) {
        masterSchedule[teacherName][session.day][sessionIndex].students.push(studentData);
      }

      // Update student's enrolled sessions
      const updatedEnrolledIn = [
        ...studentToAdd.enrolledIn,
        {
          semesterId: semester.id || "",
          sessionId: session.id,
          teacherName: teacherName
        }
      ];

      await Promise.all([
        updateSemester(semester.id || "", { masterSchedule }),
        updateStudent(selectedStudentId, { enrolledIn: updatedEnrolledIn })
      ]);

      toast({
        title: t('enrollment.success'),
        description: t('enrollment.studentAdded', { studentName: studentToAdd.name })
      });

      onStudentAdded();
      setIsOpen(false);
      setSelectedStudentId("");
      
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: t('enrollment.addFailed', { message: error.message }),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const TriggerComponent = asChild ? children : (
    <Button variant="ghost" size="sm" className="w-full h-auto text-xs text-muted-foreground font-normal">
      <UserPlus className="mr-2 h-3 w-3" /> {t('actions.enrollStudent')}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {TriggerComponent}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('enrollment.addToSession')}</DialogTitle>
          <DialogDescription>
            {t('enrollment.addToSessionDesc', { 
              session: `${session.day} ${session.time} - ${session.specialization}` 
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('enrollment.selectStudent')}</label>
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger>
                <SelectValue placeholder={t('enrollment.chooseStudent')} />
              </SelectTrigger>
              <SelectContent>
                {availableStudents.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleAddStudent} 
              disabled={isLoading || !selectedStudentId}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('enrollment.adding')}
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t('enrollment.addStudent')}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ScheduleGrid = ({ 
  processedSessions, 
  dayFilter, 
  semester, 
  teacherName, 
  onUpdate, 
  weekStartDate, 
  studentLeaves 
}: { 
  processedSessions: ProcessedSession[]; 
  dayFilter: string; 
  semester: Semester | undefined; 
  teacherName: string; 
  onUpdate: () => void; 
  weekStartDate: string; 
  studentLeaves: Leave[] 
}) => {
  const { t } = useTranslation();
  
  // Define the day keys and their order
  const allDaysKeys = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  
  const isMobile = useIsMobile();
  const days = isMobile && dayFilter.toLowerCase() !== 'all' ? [dayFilter] : allDaysKeys;
  const timeSlots = Array.from({ length: 12 }, (_, i) => `${i + 10}:00`); // 10 AM to 9 PM (for slots ending at 10 PM)
  const { user } = useAuth();
  const { toast } = useToast();
  const { updateSemester, addTeacherRequest, updateStudent, students: allStudents } = useDatabase();
  
  const [sessionToCreate, setSessionToCreate] = useState<{day: string, time: string} | null>(null);

  const handleUpdateAttendance = async (studentId: string, sessionId: string, day: string, status: SessionStudent['attendance']) => {
      if (!semester || !user || !weekStartDate) return;
      const attendancePath = `weeklyAttendance.${weekStartDate}.${teacherName}.${sessionId}.${studentId}`;
      
      const updatedWeeklyAttendance = JSON.parse(JSON.stringify(semester.weeklyAttendance || {}));
      if (!updatedWeeklyAttendance[weekStartDate]) updatedWeeklyAttendance[weekStartDate] = {};
      if (!updatedWeeklyAttendance[weekStartDate][teacherName]) updatedWeeklyAttendance[weekStartDate][teacherName] = {};
      if (!updatedWeeklyAttendance[weekStartDate][teacherName][sessionId]) updatedWeeklyAttendance[weekStartDate][teacherName][sessionId] = {};
      
      updatedWeeklyAttendance[weekStartDate][teacherName][sessionId][studentId] = { status };
      
      try {
          await updateSemester(semester.id || "", { weeklyAttendance: updatedWeeklyAttendance });
          toast({ title: t('attendance.updated'), description: t('attendance.markedAs', { status: t(`attendance.${status}`) })});
          onUpdate();
      } catch (error) {
          console.error('Error updating attendance:', error);
          toast({ title: t('common.error'), description: t('attendance.updateFailed'), variant: "destructive" });
      }
  };

  const handleRemoveStudent = async (student: SessionStudent, session: ProcessedSession) => {
    if (!semester || !user) return;
    const isTeacher = user?.activeRole === 'teacher';

    try {
        if (isTeacher) {
            // Teacher requests removal
            const request: Omit<TeacherRequest, 'id' | 'createdAt' | 'updatedAt'> = {
                type: 'remove-student',
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
                    reason: t('removal.teacherReason'),
                    semesterId: semester.id || ""
                }
            };
            
            await addTeacherRequest(request);

            // Also mark student as pending removal in master schedule
            const masterSchedule = JSON.parse(JSON.stringify(semester.masterSchedule));
            const daySessions = masterSchedule[teacherName]?.[session.day];
            const sessionIndex = daySessions.findIndex((s: Session) => s.id === session.id);
            if (sessionIndex > -1) {
                const studentIndex = daySessions[sessionIndex].students.findIndex((s: SessionStudent) => s.id === student.id);
                if (studentIndex > -1) {
                    masterSchedule[teacherName][session.day][sessionIndex].students[studentIndex].pendingRemoval = true;
                     await updateSemester(semester.id || "", { masterSchedule });
                     toast({ title: t('removal.requested'), description: t('removal.requestSent', { studentName: student.name }) });
                }
            }
        } else { // Admin directly removes
            const masterSchedule = JSON.parse(JSON.stringify(semester.masterSchedule));
            const daySessions = masterSchedule[teacherName]?.[session.day];
            if (!daySessions) throw new Error(t('errors.daySessionsNotFound'));
            const sessionIndex = daySessions.findIndex((s: Session) => s.id === session.id);
            if(sessionIndex === -1) throw new Error(t('errors.sessionNotFound'));

            masterSchedule[teacherName][session.day][sessionIndex].students = 
                daySessions[sessionIndex].students.filter((s: SessionStudent) => s.id !== student.id);

            const studentProfile = allStudents.find(s => s.id === student.id);
            if (!studentProfile) throw new Error(t('errors.studentProfileNotFound'));

            const updatedEnrolledIn = studentProfile.enrolledIn.filter(e => !(e.semesterId === semester.id && e.sessionId === session.id));
            
            await updateStudent(student.id, { enrolledIn: updatedEnrolledIn });
            await updateSemester(semester.id || "", { masterSchedule });

            toast({ title: t('removal.studentRemoved'), description: t('removal.removedFromSession', { studentName: student.name }) });
        }
        onUpdate();
    } catch (error: any) {
        toast({ title: t('common.error'), description: t('removal.processFailed', { message: error.message }), variant: 'destructive'});
    }
  };

  const formatTimeForDisplay = (time: string) => {
      const date = new Date(`1970-01-01T${time}:00`);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  }

  const filteredSessions = useMemo(() => {
    if (dayFilter.toLowerCase() === 'all') return processedSessions;
    return processedSessions.filter(s => s.day.toLowerCase() === dayFilter.toLowerCase());
  }, [processedSessions, dayFilter])

  // Updated function to get translated day name
  const getDayName = (dayKey: string) => {
    const dayMap: { [key: string]: string } = {
      'Saturday': t('days.saturday'),
      'Sunday': t('days.sunday'),
      'Monday': t('days.monday'),
      'Tuesday': t('days.tuesday'),
      'Wednesday': t('days.wednesday'),
      'Thursday': t('days.thursday')
    };
    return dayMap[dayKey] || dayKey;
  };

  if (isMobile && dayFilter.toLowerCase() === 'all' && filteredSessions.length > 0) {
    return <Card className="mt-4"><CardContent className="p-4 text-center text-muted-foreground">{t('schedule.selectDayToView')}</CardContent></Card>;
  }

  if (!processedSessions || processedSessions.length === 0 || (isMobile && filteredSessions.length === 0 && dayFilter.toLowerCase() !== 'all')) {
    return <Card className="mt-4"><CardContent className="p-4 text-center text-muted-foreground">{t('schedule.noScheduleAvailable')}</CardContent></Card>;
  }

  return (
    <>
    <div id="schedule-grid-container" className={cn("grid gap-px bg-border", isMobile ? "grid-cols-[auto_1fr]" : "grid-cols-[auto_repeat(6,_1fr)] -ml-4 -mr-4")}>
      {/* Time Column */}
      <div className="flex flex-col">
        <div className="h-12 bg-background"></div>
        {timeSlots.map(time => (
            <div key={time} className="h-28 flex items-start justify-center bg-background pt-2 px-2 text-xs text-muted-foreground">
                {formatTimeForDisplay(time)}
            </div>
        ))}
      </div>

      {/* Day Columns */}
      {days.map((day) => day && (
        <div key={day} className="relative col-span-1 bg-background">
          <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm h-12 flex items-center justify-center font-semibold border-b">
            {getDayName(day)}
          </div>
          <div className="absolute top-12 left-0 w-full h-[calc(12_*_7rem)] grid grid-rows-[repeat(12,_7rem)] gap-px">
             {timeSlots.map((time, index) => (
                <div key={`${day}-${time}`} className="h-28 border-t group/cell relative">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-0 group-hover/cell:opacity-100 transition-opacity"
                        onClick={() => setSessionToCreate({ day, time: formatTimeForDisplay(time) })}
                    >
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            ))}
          </div>
          <div className="absolute top-12 left-0 w-full h-full">
            {filteredSessions
              .filter(session => session.day === day)
              .map(session => (
                <div
                  key={session.id}
                  className="absolute w-full p-1 z-20"
                  style={{ 
                    top: `${session.startRow * 7}rem`, 
                    height: `${session.duration * 7}rem` 
                  }}
                >
                  <Card className="w-full h-full flex flex-col shadow-sm bg-background/95 backdrop-blur-sm border-2 hover:border-primary/20 transition-colors">
                    <CardHeader className="p-3 pb-2">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold text-sm leading-tight">{session.specialization}</p>
                            <Badge variant="secondary" className="text-xs font-normal">{session.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">{session.time} - {session.endTime}</p>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 flex-grow flex flex-col gap-2 overflow-hidden">
                      <Separator className="my-1"/>
                      <div className="flex-grow overflow-y-auto space-y-2">
                          {session.students && session.students.length > 0 ? (
                              session.students.map((student: SessionStudent) => {
                                  const isOnLeave = studentLeaves.some(l => l.personId === student.id);
                                  const attendance = isOnLeave ? 'excused' : student.attendance;

                                  return (
                                      <div key={student.id} className={cn(
                                          "flex items-center justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 group/student border",
                                          student.pendingRemoval && "opacity-60 bg-destructive/10 border-destructive/20",
                                          !student.pendingRemoval && "border-border hover:border-primary/20"
                                      )}>
                                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                              <div className="relative">
                                                  <User className="h-4 w-4 text-muted-foreground" />
                                                  {/* Attendance Status Dot */}
                                                  <div className={cn(
                                                      "absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-background",
                                                      attendance === 'present' && "bg-green-500",
                                                      attendance === 'absent' && "bg-red-500",
                                                      attendance === 'late' && "bg-amber-500",
                                                      attendance === 'excused' && "bg-blue-500",
                                                      !attendance && "bg-gray-300"
                                                  )} />
                                              </div>
                                              <span className="font-medium text-sm truncate">{student.name}</span>
                                              <div className="flex gap-1">
                                                  {student.pendingRemoval && (
                                                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 h-5">
                                                          <Hourglass className="h-2.5 w-2.5 mr-1" />
                                                          Pending
                                                      </Badge>
                                                  )}
                                                  {isOnLeave && (
                                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-5 border-blue-200 text-blue-700">
                                                          On Leave
                                                      </Badge>
                                                  )}
                                              </div>
                                          </div>
                                          <div className="flex items-center gap-1 shrink-0">
                                              {/* Attendance Popover */}
                                              <Popover>
                                                  <PopoverTrigger asChild>
                                                      <Button
                                                          variant="ghost"
                                                          size="icon"
                                                          className="h-7 w-7 opacity-70 hover:opacity-100 group-hover/student:opacity-100 transition-all duration-200 hover:bg-primary/10 hover:text-primary"
                                                          title="Mark Attendance"
                                                      >
                                                          <GripVertical className="h-3.5 w-3.5" />
                                                      </Button>
                                                  </PopoverTrigger>
                                                  <PopoverContent className="w-auto p-2" align="end">
                                                      <div className="flex gap-1">
                                                          <Button
                                                              onClick={() => handleUpdateAttendance(student.id, session.id, day, 'present')}
                                                              variant="ghost"
                                                              size="icon"
                                                              className="h-8 w-8 hover:bg-green-50 hover:text-green-700 transition-colors"
                                                              title="Present"
                                                          >
                                                              <Check className="h-4 w-4" />
                                                          </Button>
                                                          <Button
                                                              onClick={() => handleUpdateAttendance(student.id, session.id, day, 'absent')}
                                                              variant="ghost"
                                                              size="icon"
                                                              className="h-8 w-8 hover:bg-red-50 hover:text-red-700 transition-colors"
                                                              title="Absent"
                                                          >
                                                              <X className="h-4 w-4" />
                                                          </Button>
                                                          <Button
                                                              onClick={() => handleUpdateAttendance(student.id, session.id, day, 'late')}
                                                              variant="ghost"
                                                              size="icon"
                                                              className="h-8 w-8 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                                                              title="Late"
                                                          >
                                                              <Clock className="h-4 w-4" />
                                                          </Button>
                                                          <Button
                                                              onClick={() => handleUpdateAttendance(student.id, session.id, day, 'excused')}
                                                              variant="ghost"
                                                              size="icon"
                                                              className="h-8 w-8 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                                              title="Excused"
                                                          >
                                                              <File className="h-4 w-4" />
                                                          </Button>
                                                      </div>
                                                  </PopoverContent>
                                              </Popover>

                                              {/* Enhanced Delete Button */}
                                              <Button
                                                  onClick={() => handleRemoveStudent(student, session)}
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-7 w-7 opacity-70 hover:opacity-100 group-hover/student:opacity-100 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                  title={`Remove ${student.name} from session`}
                                              >
                                                  <Trash2 className="h-3.5 w-3.5" />
                                              </Button>
                                          </div>
                                      </div>
                                  )
                              })
                          ) : (
                              <div className="flex-grow flex items-center justify-center py-6">
                                  <div className="text-center">
                                      <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                                          <User className="h-6 w-6 text-muted-foreground/60" />
                                      </div>
                                      <p className="text-sm text-muted-foreground font-medium">{t('schedule.noStudentsEnrolled')}</p>
                                      <p className="text-xs text-muted-foreground/80 mt-1">{t('schedule.addStudentsToStart')}</p>
                                  </div>
                              </div>
                          )}
                      </div>
                    </CardContent>
                    {semester && (
                        <CardFooter className="p-2 border-t bg-muted/20">
                            <AddStudentDialog session={session} semester={semester} teacherName={teacherName} onStudentAdded={onUpdate} asChild>
                                <Button variant="ghost" size="sm" className="w-full h-8 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors font-normal">
                                    <UserPlus className="mr-2 h-3.5 w-3.5" /> {t('actions.enrollStudent')}
                                </Button>
                            </AddStudentDialog>
                        </CardFooter>
                    )}
                  </Card>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
     {sessionToCreate && semester && (
        <CreateSessionDialog
            isOpen={!!sessionToCreate}
            onOpenChange={() => setSessionToCreate(null)}
            day={sessionToCreate.day}
            time={sessionToCreate.time}
            semester={semester}
            teacherName={teacherName}
            onSessionCreated={onUpdate}
        />
     )}
    </>
  );
};

export default function DashboardPage() {
    const { user, users } = useAuth();
    const { semesters, students, leaves, loading: dbLoading } = useDatabase();
    const isAdmin = user?.activeRole === 'admin';
    const isMobile = useIsMobile();
    const { t } = useTranslation();

    const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [dayFilter, setDayFilter] = useState('All');
    
    const [processedSessions, setProcessedSessions] = useState<ProcessedSession[]>([]);
    const [_, setForceUpdate] = useState({});

    const [isEnrolling, setIsEnrolling] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    // Prevent hydration error
    useEffect(() => {
        setSelectedDate(new Date());
    }, []);

    const weekStart = useMemo(() => {
        if (!selectedDate) return '';
        // Assuming week starts on Saturday
        const dayOfWeek = selectedDate.getDay();
        const difference = (dayOfWeek < 6) ? - (dayOfWeek + 1) : 0;
        const saturday = addDays(selectedDate, difference);
        return format(saturday, 'yyyy-MM-dd');
    }, [selectedDate]);
    
    const [semestersState, setSemestersState] = useState(semesters);
     useEffect(() => {
        setSemestersState(semesters);
    }, [semesters]);

    useEffect(() => {
        if (semestersState.length > 0 && !selectedSemesterId) {
            const activeSemester = semestersState.find(s => isWithinInterval(new Date(), {start: new Date(s.startDate), end: new Date(s.endDate)})) || semestersState[0];
            setSelectedSemesterId(activeSemester.id || null);
        }
    }, [semestersState, selectedSemesterId]);

    const selectedSemester = useMemo(() => {
        return semestersState.find(s => s.id === selectedSemesterId);
    }, [semestersState, selectedSemesterId]);

    const availableTeachers = useMemo(() => {
        if (!selectedSemester?.masterSchedule) return [];
        const teacherNames = Object.keys(selectedSemester.masterSchedule);
        const teacherUsers = users.filter(u => teacherNames.includes(u.name) && u.roles.includes('teacher'));

        if (user?.activeRole === 'teacher') {
            return teacherUsers.filter(t => t.name === user.name);
        }
        return teacherUsers;
    }, [selectedSemester, user, users]);

    useEffect(() => {
        if (availableTeachers.length > 0) {
            if (user?.activeRole === 'teacher' && user.name && availableTeachers.some(t => t.name === user.name)) {
                setSelectedTeacher(user.name);
            } else if (!selectedTeacher || !availableTeachers.some(t => t.name === selectedTeacher)) {
                setSelectedTeacher(availableTeachers[0].name);
            }
        } else if (availableTeachers.length === 0) {
            setSelectedTeacher("");
        }
    }, [availableTeachers, user, selectedTeacher]);

    const loadScheduleForTeacherAndWeek = useCallback(() => {
        if (!selectedSemester || !selectedTeacher || !weekStart) {
            setProcessedSessions([]);
            return;
        }

        const teacherSchedule = selectedSemester.masterSchedule?.[selectedTeacher] || {};
        const weeklyAttendance = selectedSemester.weeklyAttendance?.[weekStart]?.[selectedTeacher] || {};
        
        const newProcessedSessions: ProcessedSession[] = [];
        
        Object.entries(teacherSchedule).forEach(([day, sessions]) => {
            sessions.forEach(session => {
                const timeParts = session.time.match(/(\d+):(\d+)\s(AM|PM)/);
                if (!timeParts) return;

                let [, hourStr, , ampm] = timeParts;
                let hour = parseInt(hourStr, 10);
                
                if (ampm === 'PM' && hour !== 12) hour += 12;
                if (ampm === 'AM' && hour === 12) hour = 0; // Midnight case

                // The grid starts at 10 AM, so we subtract 10 to get the row index.
                const startRow = hour - 10;
                
                if (startRow >= 0) {
                    const sessionAttendance = weeklyAttendance[session.id] || {};
                    const studentsWithAttendance = session.students.map(student => ({
                        ...student,
                        attendance: sessionAttendance[student.id]?.status || null,
                    }));

                    newProcessedSessions.push({ 
                        ...session, 
                        students: studentsWithAttendance,
                        day, 
                        startRow 
                    });
                }
            });
        });
        setProcessedSessions(newProcessedSessions);
    }, [selectedSemester, selectedTeacher, weekStart]);

    const weekDates = useMemo(() => {
        if (!weekStart) return [];
        const start = new Date(weekStart);
        return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }, [weekStart]);

    const studentLeavesForWeek = useMemo(() => {
        return leaves.filter(l => 
            l.type === 'student' &&
            l.status === 'approved' &&
            weekDates.some(d => isWithinInterval(d, { start: new Date(l.startDate), end: new Date(l.endDate) }))
        );
    }, [leaves, weekDates]);

    const isTeacherOnLeave = useMemo(() => {
        if (!user || user.activeRole !== 'teacher') return false;
        return leaves.some(l => 
            l.type === 'teacher' &&
            l.personId === user.id &&
            l.status === 'approved' &&
            weekDates.some(d => isWithinInterval(d, { start: new Date(l.startDate), end: new Date(l.endDate) }))
        )
    }, [leaves, user, weekDates]);

    useEffect(() => {
        loadScheduleForTeacherAndWeek();
    }, [loadScheduleForTeacherAndWeek]);

    const handleUpdate = () => {
        loadScheduleForTeacherAndWeek();
        setForceUpdate({}); // Force re-render if needed
    };

    const handleExportPDF = async () => {
        const scheduleElement = document.getElementById('schedule-grid-container');
        if (scheduleElement) {
            try {
                const canvas = await html2canvas(scheduleElement, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: false
                });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('l', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`schedule-${selectedTeacher}-${weekStart}.pdf`);
            } catch (error) {
                console.error('PDF export failed:', error);
                // Fallback or error handling
            }
        }
    };
    
    const handleExportCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += `"${t('csv.day')}","${t('csv.time')}","${t('csv.specialization')}","${t('csv.type')}","${t('csv.studentName')}","${t('csv.attendance')}"\n`;

        processedSessions.forEach(session => {
            if (session.students.length > 0) {
                session.students.forEach(student => {
                    const row = [
                        `"${session.day}"`,
                        `"${session.time}"`,
                        `"${session.specialization}"`,
                        `"${session.type}"`,
                        `"${student.name}"`,
                        `"${student.attendance ? t(`attendance.${student.attendance}`) : t('common.na')}"`
                    ].join(",");
                    csvContent += row + "\r\n";
                });
            } else {
                // Include sessions with no students
                const row = [
                    `"${session.day}"`,
                    `"${session.time}"`,
                    `"${session.specialization}"`,
                    `"${session.type}"`,
                    `"${t('schedule.noStudentsEnrolled')}"`,
                    `"${t('common.na')}"`
                ].join(",");
                csvContent += row + "\r\n";
            }
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `schedule-${selectedTeacher}-${weekStart}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Summary Statistics
    const scheduleStats = useMemo(() => {
        const totalSessions = processedSessions.length;
        const totalStudents = processedSessions.reduce((sum, session) => sum + session.students.length, 0);
        const studentsPresent = processedSessions.reduce((sum, session) => 
            sum + session.students.filter(s => s.attendance === 'present').length, 0
        );
        const studentsAbsent = processedSessions.reduce((sum, session) => 
            sum + session.students.filter(s => s.attendance === 'absent').length, 0
        );
        const studentsOnLeave = studentLeavesForWeek.length;
        
        return {
            totalSessions,
            totalStudents,
            studentsPresent,
            studentsAbsent,
            studentsOnLeave,
            attendanceRate: totalStudents > 0 ? Math.round((studentsPresent / totalStudents) * 100) : 0
        };
    }, [processedSessions, studentLeavesForWeek]);

    if (dbLoading || !selectedDate) {
        return (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
                </div>
            </div>
        );
    }
    
    const weekEnd = addDays(new Date(weekStart), 5);
    
    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 self-start">
                    <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
                    {isTeacherOnLeave && (
                        <Badge variant="destructive" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {t('status.onLeave')}
                        </Badge>
                    )}
                </div>
                 {isAdmin && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto hover:bg-primary/5" onClick={() => setIsEnrolling(true)}>
                            <UserPlus className="mr-2 h-4 w-4"/> {t('actions.enrollStudent')}
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto hover:bg-primary/5" onClick={() => setIsImporting(true)}>
                            <Upload className="mr-2 h-4 w-4"/> {t('actions.import')}
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto hover:bg-primary/5" onClick={handleExportPDF}>
                            <FileText className="mr-2 h-4 w-4"/> {t('actions.exportPDF')}
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto hover:bg-primary/5" onClick={handleExportCSV}>
                            <FileDown className="mr-2 h-4 w-4"/> {t('actions.exportCSV')}
                        </Button>
                    </div>
                 )}
            </div>

            {/* Stats Cards */}
            {processedSessions.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-blue-500" />
                                <p className="text-sm font-medium text-muted-foreground">{t('stats.sessions')}</p>
                            </div>
                            <p className="text-2xl font-bold mt-1">{scheduleStats.totalSessions}</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-purple-500" />
                                <p className="text-sm font-medium text-muted-foreground">{t('stats.totalStudents')}</p>
                            </div>
                            <p className="text-2xl font-bold mt-1">{scheduleStats.totalStudents}</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                <p className="text-sm font-medium text-muted-foreground">{t('stats.present')}</p>
                            </div>
                            <p className="text-2xl font-bold mt-1">{scheduleStats.studentsPresent}</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <X className="h-4 w-4 text-red-500" />
                                <p className="text-sm font-medium text-muted-foreground">{t('stats.absent')}</p>
                            </div>
                            <p className="text-2xl font-bold mt-1">{scheduleStats.studentsAbsent}</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <File className="h-4 w-4 text-blue-500" />
                                <p className="text-sm font-medium text-muted-foreground">{t('stats.onLeave')}</p>
                            </div>
                            <p className="text-2xl font-bold mt-1">{scheduleStats.studentsOnLeave}</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-emerald-500" />
                                <p className="text-sm font-medium text-muted-foreground">{t('stats.attendance')}</p>
                            </div>
                            <p className="text-2xl font-bold mt-1">{scheduleStats.attendanceRate}%</p>
                        </CardContent>
                    </Card>
                </div>
            )}
            
            {/* Controls Card */}
            <Card className="shadow-sm">
                <CardContent className="p-4 flex flex-col xl:flex-row xl:items-center gap-4">
                    {isAdmin && (
                        <>
                            <div className="w-full xl:w-auto flex items-center gap-3">
                                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                                <Select value={selectedSemesterId || ""} onValueChange={setSelectedSemesterId}>
                                  <SelectTrigger className="w-full xl:w-[200px]">
                                    <SelectValue placeholder={t('dashboard.selectSemester')} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {semestersState.map(s => (
                                        <SelectItem key={s.id} value={s.id || ""}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full xl:w-auto flex items-center gap-3">
                                 <Users className="w-5 h-5 text-muted-foreground" />
                                 <Select value={selectedTeacher} onValueChange={setSelectedTeacher} disabled={!selectedSemesterId || availableTeachers.length === 0}>
                                  <SelectTrigger className="w-full xl:w-[200px]">
                                    <SelectValue placeholder={t('dashboard.selectTeacher')} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableTeachers.map(teacher => (
                                        <SelectItem key={teacher.id} value={teacher.name || ""}>
                                            {teacher.name}
                                        </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}
                     <div className="w-full xl:w-auto flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full xl:w-[260px] justify-start text-left font-normal">
                                    <span>{format(new Date(weekStart), 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent 
                                    mode="single" 
                                    selected={selectedDate || undefined} 
                                    onSelect={(date) => date && setSelectedDate(date)} 
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <div className="flex items-center gap-1">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 hover:bg-primary/10" 
                                onClick={() => setSelectedDate(addDays(selectedDate!, -7))}
                                title="Previous Week"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 hover:bg-primary/10" 
                                onClick={() => setSelectedDate(addDays(selectedDate!, 7))}
                                title="Next Week"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="w-full xl:w-auto flex items-center gap-2 xl:ml-auto">
                         <Tabs value={dayFilter} onValueChange={setDayFilter} className="w-full md:w-auto">
                            <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 bg-muted/50">
                                <TabsTrigger value="All" className="text-xs">{t('days.all')}</TabsTrigger>
                                <TabsTrigger value="Saturday" className="text-xs">{t('days.satShort')}</TabsTrigger>
                                <TabsTrigger value="Sunday" className="text-xs">{t('days.sunShort')}</TabsTrigger>
                                <TabsTrigger value="Monday" className="text-xs">{t('days.monShort')}</TabsTrigger>
                                <TabsTrigger value="Tuesday" className="text-xs">{t('days.tueShort')}</TabsTrigger>
                                <TabsTrigger value="Wednesday" className="text-xs">{t('days.wedShort')}</TabsTrigger>
                                <TabsTrigger value="Thursday" className="text-xs">{t('days.thuShort')}</TabsTrigger>
                            </TabsList>
                         </Tabs>
                    </div>
                </CardContent>
            </Card>

            {/* Schedule Grid */}
            <div className="overflow-x-auto rounded-lg border">
                {isTeacherOnLeave ? (
                     <Card className="border-0">
                         <CardContent className="p-8 text-center">
                             <div className="flex flex-col items-center gap-4">
                                 <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                                     <Clock className="h-8 w-8 text-muted-foreground" />
                                 </div>
                                 <div>
                                     <h3 className="text-lg font-semibold mb-2">{t('schedule.onLeaveTitle')}</h3>
                                     <p className="text-muted-foreground">{t('schedule.onLeaveMessage')}</p>
                                 </div>
                             </div>
                         </CardContent>
                     </Card>
                ) : selectedTeacher ? (
                    <ScheduleGrid 
                        processedSessions={processedSessions} 
                        dayFilter={dayFilter} 
                        semester={selectedSemester}
                        teacherName={selectedTeacher}
                        onUpdate={handleUpdate}
                        weekStartDate={weekStart}
                        studentLeaves={studentLeavesForWeek}
                    />
                ) : (
                    <Card className="border-0">
                        <CardContent className="p-8 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                                    <Users className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{t('schedule.selectTeacherTitle')}</h3>
                                    <p className="text-muted-foreground">{t('schedule.selectTeacherMessage')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

             {/* Dialog Components */}
             {selectedSemester && (
                <EnrollStudentDialog 
                    isOpen={isEnrolling} 
                    onOpenChange={setIsEnrolling} 
                    students={students}
                    semester={selectedSemester}
                    teachers={users.filter(u => u.roles.includes('teacher'))}
                    onEnrollmentSuccess={handleUpdate}
                />
            )}
            <ImportScheduleDialog isOpen={isImporting} onOpenChange={setIsImporting} />
        </div>
    );
}