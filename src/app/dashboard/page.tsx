

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

// Import for Export
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Placeholder Dialogs
import { EnrollStudentDialog } from "@/components/enroll-student-dialog";
import { AddStudentDialog } from "@/components/add-student-dialog";
import { CreateSessionDialog } from "@/components/create-session-dialog";

const ImportScheduleDialog = ({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Import Schedule</DialogTitle>
                <DialogDescription>Functionality to bulk-import students from a CSV file coming soon.</DialogDescription>
            </DialogHeader>
            <p>Import form will be here.</p>
        </DialogContent>
    </Dialog>
);


const ScheduleGrid = ({ processedSessions, dayFilter, semester, teacherName, onUpdate, weekStartDate, studentLeaves }: { processedSessions: ProcessedSession[]; dayFilter: string; semester: Semester | undefined; teacherName: string; onUpdate: () => void; weekStartDate: string, studentLeaves: Leave[] }) => {
  const allDays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const isMobile = useIsMobile();
  const days = isMobile && dayFilter.toLowerCase() !== 'all' ? [dayFilter] : allDays;
  const timeSlots = Array.from({ length: 12 }, (_, i) => `${i + 10}:00`); // 10 AM to 9 PM (for slots ending at 10 PM)
  const { user } = useAuth();
  const { toast } = useToast();
  const { updateSemester, addRequest, updateStudent, students: allStudents } = useDatabase();
  
  const [sessionToCreate, setSessionToCreate] = useState<{day: string, time: string} | null>(null);

  const handleUpdateAttendance = async (studentId: string, sessionId: string, day: string, status: SessionStudent['attendance']) => {
      if (!semester || !user || !weekStartDate) return;
      const attendancePath = `weeklyAttendance.${weekStartDate}.${teacherName}.${sessionId}.${studentId}`;
      
      const updatedWeeklyAttendance = JSON.parse(JSON.stringify(semester.weeklyAttendance || {}));
      if (!updatedWeeklyAttendance[weekStartDate]) updatedWeeklyAttendance[weekStartDate] = {};
      if (!updatedWeeklyAttendance[weekStartDate][teacherName]) updatedWeeklyAttendance[weekStartDate][teacherName] = {};
      if (!updatedWeeklyAttendance[weekStartDate][teacherName][sessionId]) updatedWeeklyAttendance[weekStartDate][teacherName][sessionId] = {};
      
      updatedWeeklyAttendance[weekStartDate][teacherName][sessionId][studentId] = { status };
      
      const success = await updateSemester(semester.id, { weeklyAttendance: updatedWeeklyAttendance });
      if(success) {
          toast({ title: "Attendance updated", description: `Marked as ${status}.`});
          onUpdate();
      }
  };

  const handleRemoveStudent = async (student: SessionStudent, session: ProcessedSession) => {
    if (!semester || !user) return;
    const isTeacher = user?.activeRole === 'teacher';

    try {
        if (isTeacher) {
            // Teacher requests removal
            const request: Omit<TeacherRequest, 'id'> = {
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
                    reason: 'Teacher requested removal from schedule view.',
                    semesterId: semester.id
                }
            };
            
            const reqSuccess = await addRequest(request);

            if (reqSuccess) {
                // Also mark student as pending removal in master schedule
                const masterSchedule = JSON.parse(JSON.stringify(semester.masterSchedule));
                const daySessions = masterSchedule[teacherName]?.[session.day];
                const sessionIndex = daySessions.findIndex((s: Session) => s.id === session.id);
                if (sessionIndex > -1) {
                    const studentIndex = daySessions[sessionIndex].students.findIndex((s: SessionStudent) => s.id === student.id);
                    if (studentIndex > -1) {
                        masterSchedule[teacherName][session.day][sessionIndex].students[studentIndex].pendingRemoval = true;
                         await updateSemester(semester.id, { masterSchedule });
                         toast({ title: "Removal Requested", description: `Request to remove ${student.name} has been sent for approval.` });
                    }
                }
            }
        } else { // Admin directly removes
            const masterSchedule = JSON.parse(JSON.stringify(semester.masterSchedule));
            const daySessions = masterSchedule[teacherName]?.[session.day];
            if (!daySessions) throw new Error("Could not find day sessions for this teacher.");
            const sessionIndex = daySessions.findIndex((s: Session) => s.id === session.id);
            if(sessionIndex === -1) throw new Error("Could not find the session.");

            masterSchedule[teacherName][session.day][sessionIndex].students = 
                daySessions[sessionIndex].students.filter((s: SessionStudent) => s.id !== student.id);

            const studentProfile = allStudents.find(s => s.id === student.id);
            if (!studentProfile) throw new Error("Student profile not found to update enrollment.");

            const updatedEnrolledIn = studentProfile.enrolledIn.filter(e => !(e.semesterId === semester.id && e.sessionId === session.id));
            
            const studentUpdateSuccess = await updateStudent(student.id, { enrolledIn: updatedEnrolledIn });
            const semesterUpdateSuccess = await updateSemester(semester.id, { masterSchedule });

            if (studentUpdateSuccess && semesterUpdateSuccess) {
              toast({ title: "Student Removed", description: `${student.name} has been removed from the session.` });
            }
        }
        onUpdate();
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to process removal. ${error.message}`, variant: 'destructive'});
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

  if (isMobile && dayFilter.toLowerCase() === 'all' && filteredSessions.length > 0) {
    return <Card className="mt-4"><CardContent className="p-4 text-center text-muted-foreground">Please select a day to view the schedule.</CardContent></Card>;
  }

  if (!processedSessions || processedSessions.length === 0 || (isMobile && filteredSessions.length === 0 && dayFilter.toLowerCase() !== 'all')) {
    return <Card className="mt-4"><CardContent className="p-4 text-center text-muted-foreground">No schedule available for the selected teacher/day.</CardContent></Card>;
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
            {day}
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
                  <Card className="w-full h-full flex flex-col shadow-none bg-background/80 backdrop-blur-sm">
                    <CardHeader className="p-2">
                        <p className="font-semibold text-xs leading-tight">{session.specialization}</p>
                        <p className="text-xs text-muted-foreground">{session.time} - {session.endTime}</p>
                    </CardHeader>
                    <CardContent className="p-2 flex-grow flex flex-col gap-1 overflow-hidden">
                      <div className="flex justify-between items-center text-xs">
                        <Badge variant="secondary" className="font-normal">{session.type}</Badge>
                      </div>
                      <Separator className="my-1"/>
                      <div className="flex-grow overflow-y-auto pr-1">
                        {session.students && session.students.length > 0 ? (
                          <ul className="space-y-1 text-xs">
                            {session.students.map((student: SessionStudent) => {
                                const isOnLeave = studentLeaves.some(l => l.personId === student.id);
                                const attendance = isOnLeave ? 'excused' : student.attendance;
                                
                                return (
                                <li key={student.id} className={cn("flex justify-between items-center p-1 rounded group/student", student.pendingRemoval && "opacity-50")}>
                                    <div className="flex items-center gap-2">
                                    <User className="h-3 w-3 shrink-0" />
                                    <span className="font-medium">{student.name}</span>
                                    {student.pendingRemoval && <Hourglass className="h-3 w-3 text-destructive animate-spin" />}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/student:opacity-100">
                                                    <GripVertical className="h-4 w-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-1">
                                                <div className="flex gap-1">
                                                    <Button onClick={() => handleUpdateAttendance(student.id, session.id, day, 'present')} variant="ghost" size="icon" className="h-7 w-7"><Check className="text-green-600"/></Button>
                                                    <Button onClick={() => handleUpdateAttendance(student.id, session.id, day, 'absent')} variant="ghost" size="icon" className="h-7 w-7"><X className="text-red-600"/></Button>
                                                    <Button onClick={() => handleUpdateAttendance(student.id, session.id, day, 'late')} variant="ghost" size="icon" className="h-7 w-7"><Clock className="text-amber-600"/></Button>
                                                    <Button onClick={() => handleUpdateAttendance(student.id, session.id, day, 'excused')} variant="ghost" size="icon" className="h-7 w-7"><File className="text-blue-600"/></Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        <Button onClick={() => handleRemoveStudent(student, session)} variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/student:opacity-100">
                                            <Trash2 className="h-3 w-3 text-destructive" />
                                        </Button>
                                    </div>
                                </li>
                                )
                            })}
                          </ul>
                         ) : (
                            <div className="flex-grow flex items-center justify-center">
                                <p className="text-xs text-muted-foreground">No students enrolled</p>
                            </div>
                         )}
                      </div>
                    </CardContent>
                    {semester && (
                        <CardFooter className="p-1 border-t">
                            <AddStudentDialog session={session} semester={semester} teacherName={teacherName} onStudentAdded={onUpdate} asChild>
                                <Button variant="ghost" size="sm" className="w-full h-auto text-xs text-muted-foreground font-normal">
                                    <UserPlus className="mr-2 h-3 w-3" /> Enroll Student
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
    const { semesters, students, leaves, loading: dbLoading, addListener, removeListener } = useDatabase();
    const isAdmin = user?.activeRole === 'admin';
    const isMobile = useIsMobile();

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
        const id = addListener(setSemestersState);
        return () => removeListener(id);
    }, [semesters, addListener, removeListener]);

    useEffect(() => {
        if (semestersState.length > 0 && !selectedSemesterId) {
            const activeSemester = semestersState.find(s => isWithinInterval(new Date(), {start: new Date(s.startDate), end: new Date(s.endDate)})) || semestersState[0];
            setSelectedSemesterId(activeSemester.id);
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

    const handleExportPDF = () => {
        const scheduleElement = document.getElementById('schedule-grid-container');
        if (scheduleElement) {
            html2canvas(scheduleElement).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('l', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`schedule-${selectedTeacher}-${weekStart}.pdf`);
            });
        }
    };
    
    const handleExportCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Day,Time,Specialization,Type,Student Name,Attendance\n";

        processedSessions.forEach(session => {
            session.students.forEach(student => {
                const row = [
                    `"${session.day}"`,
                    `"${session.time}"`,
                    `"${session.specialization}"`,
                    `"${session.type}"`,
                    `"${student.name}"`,
                    `"${student.attendance || 'N/A'}"`
                ].join(",");
                csvContent += row + "\r\n";
            });
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `schedule-${selectedTeacher}-${weekStart}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    if (dbLoading || !selectedDate) {
        return (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    const weekEnd = addDays(new Date(weekStart), 5);
    
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl font-headline self-start">Admin Dashboard</h1>
                 {isAdmin && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsEnrolling(true)}><UserPlus/> Enroll Student</Button>
                        <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsImporting(true)}><Upload/> Import</Button>
                        <Button variant="outline" className="w-full sm:w-auto" onClick={handleExportPDF}><FileText/> Export PDF</Button>
                        <Button variant="outline" className="w-full sm:w-auto" onClick={handleExportCSV}><FileDown/> Export CSV</Button>
                    </div>
                 )}
            </div>
            
            <Card>
                <CardContent className="p-4 flex flex-col xl:flex-row xl:items-center gap-4">
                    {isAdmin && (
                        <>
                            <div className="w-full xl:w-auto flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                                <Select value={selectedSemesterId ?? ""} onValueChange={setSelectedSemesterId}>
                                  <SelectTrigger className="w-full xl:w-[180px]">
                                    <SelectValue placeholder="Select a semester" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {semestersState.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full xl:w-auto flex items-center gap-2">
                                 <Users className="w-5 h-5 text-muted-foreground" />
                                 <Select value={selectedTeacher} onValueChange={setSelectedTeacher} disabled={!selectedSemesterId || availableTeachers.length === 0}>
                                  <SelectTrigger className="w-full xl:w-[180px]">
                                    <SelectValue placeholder="Select a teacher" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableTeachers.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}
                     <div className="w-full xl:w-auto flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full xl:w-[240px] justify-start text-left font-normal">
                                    <span>{format(new Date(weekStart), 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent mode="single" selected={selectedDate || undefined} onSelect={(date) => date && setSelectedDate(date)} initialFocus/>
                            </PopoverContent>
                        </Popover>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedDate(addDays(selectedDate!, -7))}><ChevronLeft /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedDate(addDays(selectedDate!, 7))}><ChevronRight /></Button>
                        </div>
                    </div>
                    <div className="w-full xl:w-auto flex items-center gap-2 xl:ml-auto">
                         <Tabs value={dayFilter} onValueChange={setDayFilter} className="w-full md:w-auto">
                            <TabsList className="grid w-full grid-cols-4 md:grid-cols-7">
                                <TabsTrigger value="All">All</TabsTrigger>
                                <TabsTrigger value="Saturday">Sat</TabsTrigger>
                                <TabsTrigger value="Sunday">Sun</TabsTrigger>
                                <TabsTrigger value="Monday">Mon</TabsTrigger>
                                <TabsTrigger value="Tuesday">Tue</TabsTrigger>
                                <TabsTrigger value="Wednesday">Wed</TabsTrigger>
                                <TabsTrigger value="Thursday">Thu</TabsTrigger>
                            </TabsList>
                         </Tabs>
                    </div>
                </CardContent>
            </Card>

            <div className="overflow-x-auto">
                {isTeacherOnLeave ? (
                     <Card><CardContent className="p-6 text-center text-muted-foreground">You are on leave for this period. No classes to display.</CardContent></Card>
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
                    <Card><CardContent className="p-6 text-center text-muted-foreground">Please select a teacher to view their schedule.</CardContent></Card>
                )}
            </div>

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
