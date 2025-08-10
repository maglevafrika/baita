

export type Role = "admin" | "teacher" | "upper-management" | "high-level-dashboard";

export interface User {
  id: string;
  username: string;
  name: string;
  roles: Role[];
  activeRole: Role;
}

export interface UserInDb {
  id: string;
  username:string;
  name: string;
  password?: string;
  roles: Role[];
}

export interface InterviewEvaluation {
    notes: string;
    decision: 'approved' | 'rejected' | 'pending';
    criteria: {
        musicalNote: number;
        playingTechniques: number;
        musicalKnowledge: number;
        tuningLevel: number;
        generalTalent: number;
        psychologicalBalance: number;
    },
    generalScore: number;
}


export interface Applicant {
    id: string;
    name: string;
    gender: 'male' | 'female' | 'other';
    dob: string; // YYYY-MM-DD
    nationality: string;
    contact: {
        phone: string;
        email: string;
    };
    instrumentInterest: string;
    previousExperience: string; // text area
    status: 'pending-review' | 'interview-scheduled' | 'evaluated' | 're-evaluation' | 'approved' | 'rejected' | 'cancelled' | 'archived';
    applicationDate: string; // ISO String
    lastUpdated: string; // ISO String
    interviewDate?: string; // YYYY-MM-DD
    interviewTime?: string; // HH:MM
    interviewer?: string;
    evaluation?: InterviewEvaluation;
    evaluationNotes?: string; // Deprecated, replaced by evaluation
    cancellationReason?: string;
}

export interface StudentProfile {
  id: string;
  idPrefix?: string;
  name: string;
  gender?: 'male' | 'female';
  username?: string;
  dob?: string; // Stored as a string e.g. "YYYY-MM-DD"
  nationality?: string;
  instrumentInterest?: string;
  enrollmentDate?: string; // Stored as a string e.g. "YYYY-MM-DD"
  level: string;
  levelHistory?: LevelChange[];
  evaluations?: Evaluation[];
  grades?: Grade[];
  paymentPlan: 'monthly' | 'quarterly' | 'yearly' | 'none';
  installments?: Installment[];
  subscriptionStartDate?: string; // Stored as a string e.g. "YYYY-MM-DD"
  preferredPayDay?: number;
  dueDateChangeHistory?: DueDateChange[];
  avatar?: string;
  contact?: {
    phone: string;
    email: string;
  };
  enrolledIn: {
    semesterId: string;
    teacher: string;
    sessionId: string;
  }[];
  status?: 'active' | 'inactive' | 'deleted';
  deletionInfo?: {
    date: string;
    reason: string;
  };
}

export interface LevelChange {
  date: string; // Stored as a string e.g. "YYYY-MM-DD"
  level: string;
  review: string;
}

export interface Evaluation {
  id: string;
  date: string; // Stored as a string e.g. "YYYY-MM-DD"
  evaluator: string;
  criteria: { name: string; score: number }[];
  notes: string;
}

export interface Grade {
  id: string;
  subject: string;
  type: 'test' | 'assignment' | 'quiz';
  title: string;
  score: number;
  maxScore: number;
  date: string; // Stored as a string e.g. "YYYY-MM-DD"
  attachment?: {
    name: string;
    type: string;
    dataUrl: string;
  };
  notes?: string;
}

export type PaymentPlanType = 'monthly' | 'quarterly' | 'yearly';
export type PaymentMethod = 'visa' | 'mada' | 'cash' | 'transfer';


export interface PaymentSettings {
  monthly: number;
  quarterly: number;
  yearly: number;
}


export interface Installment {
  id: string;
  dueDate: string; // Stored as a string e.g. "YYYY-MM-DD"
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  paymentDate?: string; // Stored as a string e.g. "YYYY-MM-DD"
  gracePeriodUntil?: string; // Stored as a string e.g. "YYYY-MM-DD"
  invoiceNumber?: string;
  paymentMethod?: PaymentMethod;
}

export interface DueDateChange {
  date: string; // Stored as a string e.g. "YYYY-MM-DD"
  oldDay: number;
  newDay: number;
}

export interface SessionStudent {
    id: string;
    name: string;
    attendance: 'present' | 'absent' | 'late' | 'excused' | null;
    note?: string;
    pendingRemoval?: boolean;
}

export interface Session {
  id: string; // e.g., "Saturday-1300"
  time: string; // e.g., "1:00 PM"
  endTime?: string; // e.g., "3:00 PM"
  duration: number; // in hours
  students: SessionStudent[];
  specialization: string;
  type: 'practical' | 'theory';
  note?: string;
}

export interface ProcessedSession extends Session {
  day: string;
  startRow: number;
}


export interface WeeklyAttendance {
  [sessionId: string]: { // e.g., "Saturday-13"
    [studentId: string]: {
      status: 'present' | 'absent' | 'late' | 'excused';
      note?: string;
    };
  };
}

export interface Incompatibility {
    id: string;
    type: 'teacher-student' | 'student-student';
    person1Id: string;
    person1Name: string;
    person2Id: string;
    person2Name: string;
    reason: string;
}

export interface Leave {
    id: string;
    type: 'student' | 'teacher';
    personId: string; // either studentId or teacherId(userId)
    personName: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    reason: string;
    status: 'pending' | 'approved' | 'denied';
}


export interface TeacherSchedule {
  [day: string]: Session[];
}

export interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  teachers: string[];
  masterSchedule: {
    [teacherName: string]: TeacherSchedule
  }
  weeklyAttendance: {
    [weekStartDate: string]: { // YYYY-MM-DD format
      [teacherName:string]: WeeklyAttendance
    }
  },
  incompatibilities?: Incompatibility[];
}

export type TeacherRequestType = 'remove-student' | 'change-time' | 'add-student';

export interface TeacherRequest {
  id: string;
  type: TeacherRequestType;
  status: 'pending' | 'approved' | 'denied';
  date: string;
  teacherId: string;
  teacherName: string;
  details: {
    studentId: string;
    studentName: string;
    sessionId: string;
    sessionTime: string;
    day: string;
    reason: string;
    semesterId: string;
  };
}


export interface AppData {
  semesters: Semester[];
  students: StudentProfile[];
}
