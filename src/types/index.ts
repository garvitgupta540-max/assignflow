// Types for AssignFlow

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  college?: string;
  collegeId?: string;
  rollNumber?: string;
  employeeId?: string;
  joinDate: string;
}

export interface Student extends User {
  role: 'student';
  rollNumber: string;
  class: string;
  semester: number;
  cgpa: number;
  totalSubmissions: number;
  pendingAssignments: number;
  streak?: number;
  cgpaTrend?: { semester: number; gpa: number }[];
}

export interface Teacher extends User {
  role: 'teacher';
  employeeId: string;
  subjects: string[];
  totalAssignments: number;
  totalStudents: number;
  classes: string[];
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  teacherId: string;
  teacherName: string;
  class: string;
  semester: number;
  dueDate: string;
  createdAt: string;
  totalMarks: number;
  status: 'active' | 'closed' | 'draft';
  attachments?: string[];
  tags: string[];
  submissionCount: number;
  totalStudents: number;
  starterCode?: string;
  generatedPrompt?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  submittedAt: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  status: 'submitted' | 'evaluated' | 'late' | 'pending';
  marks?: number;
  totalMarks: number;
  feedback?: string;
  evaluatedAt?: string;
  evaluatedBy?: string;
  extractedText?: string;
  aiSuggestedMarks?: number;
  aiFeedback?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'assignment' | 'evaluation' | 'reminder' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface DashboardStats {
  totalAssignments: number;
  pendingSubmissions: number;
  evaluatedSubmissions: number;
  averageMarks: number;
  submissionRate: number;
  dueThisWeek: number;
}

export interface College {
  id: string;
  name: string;
  location: string;
  totalTeachers: number;
  totalStudents: number;
  joinDate: string;
  plan: 'free' | 'college' | 'enterprise';
  status: 'active' | 'inactive';
  studentInviteCode?: string;
  teacherInviteCode?: string;
}

export interface CommunityMessage {
  id: string;
  classCode: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  createdAt: string;
  isAi?: boolean;
}
