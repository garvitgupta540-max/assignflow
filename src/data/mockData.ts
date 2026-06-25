import type { Assignment, Submission, Student, Teacher, Notification, College } from '../types';

export const mockStudents: Student[] = [
  {
    id: 's1', name: 'Arjun Sharma', email: 'arjun.sharma@college.edu',
    role: 'student', rollNumber: 'CS2021001', class: 'CS-A', semester: 6,
    cgpa: 8.7, totalSubmissions: 24, pendingAssignments: 3,
    department: 'Computer Science', college: 'MIT College of Engineering',
    joinDate: '2021-07-15',
  },
  {
    id: 's2', name: 'Priya Patel', email: 'priya.patel@college.edu',
    role: 'student', rollNumber: 'CS2021002', class: 'CS-A', semester: 6,
    cgpa: 9.1, totalSubmissions: 27, pendingAssignments: 1,
    department: 'Computer Science', college: 'MIT College of Engineering',
    joinDate: '2021-07-15',
  },
  {
    id: 's3', name: 'Rahul Gupta', email: 'rahul.gupta@college.edu',
    role: 'student', rollNumber: 'CS2021003', class: 'CS-B', semester: 6,
    cgpa: 7.8, totalSubmissions: 20, pendingAssignments: 5,
    department: 'Computer Science', college: 'MIT College of Engineering',
    joinDate: '2021-07-15',
  },
  {
    id: 's4', name: 'Sneha Reddy', email: 'sneha.reddy@college.edu',
    role: 'student', rollNumber: 'CS2021004', class: 'CS-B', semester: 6,
    cgpa: 8.2, totalSubmissions: 22, pendingAssignments: 2,
    department: 'Computer Science', college: 'MIT College of Engineering',
    joinDate: '2021-07-15',
  },
  {
    id: 's5', name: 'Vikram Singh', email: 'vikram.singh@college.edu',
    role: 'student', rollNumber: 'CS2021005', class: 'CS-A', semester: 6,
    cgpa: 6.9, totalSubmissions: 18, pendingAssignments: 7,
    department: 'Computer Science', college: 'MIT College of Engineering',
    joinDate: '2021-07-15',
  },
  {
    id: 's6', name: 'Ananya Iyer', email: 'ananya.iyer@college.edu',
    role: 'student', rollNumber: 'CS2021006', class: 'CS-A', semester: 6,
    cgpa: 9.4, totalSubmissions: 29, pendingAssignments: 0,
    department: 'Computer Science', college: 'MIT College of Engineering',
    joinDate: '2021-07-15',
  },
];

export const mockTeachers: Teacher[] = [
  {
    id: 't1', name: 'Dr. Meera Nair', email: 'meera.nair@college.edu',
    role: 'teacher', employeeId: 'EMP001',
    subjects: ['Data Structures', 'Algorithms', 'System Design'],
    totalAssignments: 28, totalStudents: 120, classes: ['CS-A', 'CS-B', 'IT-A'],
    department: 'Computer Science', college: 'MIT College of Engineering',
    joinDate: '2018-08-01',
  },
  {
    id: 't2', name: 'Prof. Rajesh Kumar', email: 'rajesh.kumar@college.edu',
    role: 'teacher', employeeId: 'EMP002',
    subjects: ['Database Management', 'Cloud Computing'],
    totalAssignments: 18, totalStudents: 80, classes: ['CS-A', 'CS-B'],
    department: 'Computer Science', college: 'MIT College of Engineering',
    joinDate: '2016-06-15',
  },
];

export const mockAssignments: Assignment[] = [
  {
    id: 'a1', title: 'Binary Search Tree Implementation',
    subject: 'Data Structures', description: 'Implement a complete Binary Search Tree with insert, delete, and search operations. Include all traversal methods (inorder, preorder, postorder). Submit a PDF with code and output screenshots.',
    teacherId: 't1', teacherName: 'Dr. Meera Nair', class: 'CS-A', semester: 6,
    dueDate: '2026-07-10T23:59:00', createdAt: '2026-06-20T10:00:00',
    totalMarks: 100, status: 'active', tags: ['DSA', 'Trees', 'Recursion'],
    submissionCount: 18, totalStudents: 32,
  },
  {
    id: 'a2', title: 'Dijkstra\'s Algorithm Visualization',
    subject: 'Algorithms', description: 'Implement Dijkstra\'s shortest path algorithm and create a visualization showing step-by-step execution on a sample graph. Use any programming language.',
    teacherId: 't1', teacherName: 'Dr. Meera Nair', class: 'CS-A', semester: 6,
    dueDate: '2026-07-15T23:59:00', createdAt: '2026-06-22T09:00:00',
    totalMarks: 80, status: 'active', tags: ['Graphs', 'Shortest Path'],
    submissionCount: 10, totalStudents: 32,
  },
  {
    id: 'a3', title: 'SQL Query Optimization Lab',
    subject: 'Database Management', description: 'Write optimized SQL queries for the given 15 problems. Explain the indexing strategy for each query. Submit screenshots of execution plans.',
    teacherId: 't2', teacherName: 'Prof. Rajesh Kumar', class: 'CS-A', semester: 6,
    dueDate: '2026-07-05T23:59:00', createdAt: '2026-06-18T11:00:00',
    totalMarks: 60, status: 'active', tags: ['SQL', 'Optimization', 'Indexing'],
    submissionCount: 25, totalStudents: 32,
  },
  {
    id: 'a4', title: 'Linked List Variations',
    subject: 'Data Structures', description: 'Implement singly, doubly, and circular linked lists with all standard operations.',
    teacherId: 't1', teacherName: 'Dr. Meera Nair', class: 'CS-B', semester: 6,
    dueDate: '2026-06-25T23:59:00', createdAt: '2026-06-10T08:00:00',
    totalMarks: 100, status: 'closed', tags: ['LinkedList', 'DSA'],
    submissionCount: 30, totalStudents: 30,
  },
  {
    id: 'a5', title: 'System Design: URL Shortener',
    subject: 'System Design', description: 'Design a scalable URL shortener service. Include architecture diagrams, database schema, and API documentation.',
    teacherId: 't1', teacherName: 'Dr. Meera Nair', class: 'CS-A', semester: 6,
    dueDate: '2026-07-20T23:59:00', createdAt: '2026-06-23T10:00:00',
    totalMarks: 120, status: 'active', tags: ['SystemDesign', 'Architecture'],
    submissionCount: 5, totalStudents: 32,
  },
  {
    id: 'a6', title: 'Cloud Deployment with AWS',
    subject: 'Cloud Computing', description: 'Deploy a full-stack web application on AWS using EC2, RDS, and S3. Document the setup process with screenshots.',
    teacherId: 't2', teacherName: 'Prof. Rajesh Kumar', class: 'CS-A', semester: 6,
    dueDate: '2026-07-25T23:59:00', createdAt: '2026-06-23T14:00:00',
    totalMarks: 100, status: 'draft', tags: ['AWS', 'Cloud', 'DevOps'],
    submissionCount: 0, totalStudents: 32,
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: 'sub1', assignmentId: 'a1', assignmentTitle: 'Binary Search Tree Implementation',
    studentId: 's1', studentName: 'Arjun Sharma', studentRoll: 'CS2021001',
    submittedAt: '2026-07-08T14:30:00', fileUrl: '#', fileName: 'BST_Arjun_CS2021001.pdf',
    fileSize: 2457600, status: 'evaluated', marks: 88, totalMarks: 100,
    feedback: 'Excellent implementation! Code is clean and well-commented. The traversal methods work correctly. Minor issue: delete operation for nodes with two children could be optimized. Overall great work!',
    evaluatedAt: '2026-07-09T10:00:00', evaluatedBy: 'Dr. Meera Nair',
  },
  {
    id: 'sub2', assignmentId: 'a3', assignmentTitle: 'SQL Query Optimization Lab',
    studentId: 's1', studentName: 'Arjun Sharma', studentRoll: 'CS2021001',
    submittedAt: '2026-07-04T22:15:00', fileUrl: '#', fileName: 'SQL_Lab_Arjun.pdf',
    fileSize: 1843200, status: 'evaluated', marks: 52, totalMarks: 60,
    feedback: 'Good work on most queries. Query 12 and 14 could use better index utilization. Execution plan screenshots are clear and well-annotated.',
    evaluatedAt: '2026-07-05T15:30:00', evaluatedBy: 'Prof. Rajesh Kumar',
  },
  {
    id: 'sub3', assignmentId: 'a2', assignmentTitle: 'Dijkstra\'s Algorithm Visualization',
    studentId: 's1', studentName: 'Arjun Sharma', studentRoll: 'CS2021001',
    submittedAt: '2026-07-12T18:00:00', fileUrl: '#', fileName: 'Dijkstra_Arjun.pdf',
    fileSize: 3145728, status: 'submitted', totalMarks: 80,
  },
  {
    id: 'sub4', assignmentId: 'a1', assignmentTitle: 'Binary Search Tree Implementation',
    studentId: 's2', studentName: 'Priya Patel', studentRoll: 'CS2021002',
    submittedAt: '2026-07-07T16:00:00', fileUrl: '#', fileName: 'BST_Priya_CS2021002.pdf',
    fileSize: 2097152, status: 'evaluated', marks: 95, totalMarks: 100,
    feedback: 'Outstanding work! The implementation is flawless. Excellent use of recursion and iterative approaches. The documentation is thorough.',
    evaluatedAt: '2026-07-09T11:00:00', evaluatedBy: 'Dr. Meera Nair',
  },
  {
    id: 'sub5', assignmentId: 'a1', assignmentTitle: 'Binary Search Tree Implementation',
    studentId: 's3', studentName: 'Rahul Gupta', studentRoll: 'CS2021003',
    submittedAt: '2026-07-11T23:50:00', fileUrl: '#', fileName: 'BST_Rahul.pdf',
    fileSize: 1572864, status: 'submitted', totalMarks: 100,
  },
  {
    id: 'sub6', assignmentId: 'a1', assignmentTitle: 'Binary Search Tree Implementation',
    studentId: 's4', studentName: 'Sneha Reddy', studentRoll: 'CS2021004',
    submittedAt: '2026-07-12T09:30:00', fileUrl: '#', fileName: 'BST_Sneha.pdf',
    fileSize: 2621440, status: 'submitted', totalMarks: 100,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1', userId: 's1', title: 'Assignment Evaluated',
    message: 'Your BST Implementation assignment has been evaluated. You scored 88/100.',
    type: 'evaluation', read: false, createdAt: '2026-07-09T10:05:00', link: '/student/submissions',
  },
  {
    id: 'n2', userId: 's1', title: 'New Assignment Posted',
    message: 'Dr. Meera Nair has posted a new assignment: System Design: URL Shortener.',
    type: 'assignment', read: false, createdAt: '2026-06-23T10:05:00', link: '/student/assignments/a5',
  },
  {
    id: 'n3', userId: 's1', title: 'Deadline Reminder',
    message: 'SQL Query Optimization Lab is due in 2 days. Submit before July 5, 2026.',
    type: 'reminder', read: true, createdAt: '2026-07-03T08:00:00', link: '/student/assignments/a3',
  },
  {
    id: 'n4', userId: 's1', title: 'SQL Lab Evaluated',
    message: 'Your SQL Query Optimization Lab has been evaluated. You scored 52/60.',
    type: 'evaluation', read: true, createdAt: '2026-07-05T15:35:00', link: '/student/submissions',
  },
  {
    id: 'n5', userId: 's1', title: 'Welcome to AssignFlow!',
    message: 'Your account has been set up successfully. Start exploring your assignments.',
    type: 'system', read: true, createdAt: '2021-07-15T09:00:00',
  },
];

export const mockColleges: College[] = [
  {
    id: 'c1', name: 'MIT College of Engineering', location: 'Mumbai, Maharashtra',
    totalTeachers: 48, totalStudents: 1240, joinDate: '2024-01-15',
    plan: 'college', status: 'active',
  },
  {
    id: 'c2', name: 'IIT Bombay', location: 'Mumbai, Maharashtra',
    totalTeachers: 120, totalStudents: 4500, joinDate: '2024-02-01',
    plan: 'enterprise', status: 'active',
  },
  {
    id: 'c3', name: 'BITS Pilani', location: 'Pilani, Rajasthan',
    totalTeachers: 95, totalStudents: 3800, joinDate: '2024-03-10',
    plan: 'enterprise', status: 'active',
  },
  {
    id: 'c4', name: 'Pune University', location: 'Pune, Maharashtra',
    totalTeachers: 30, totalStudents: 800, joinDate: '2024-05-20',
    plan: 'free', status: 'active',
  },
  {
    id: 'c5', name: 'VIT Vellore', location: 'Vellore, Tamil Nadu',
    totalTeachers: 85, totalStudents: 3200, joinDate: '2024-04-05',
    plan: 'college', status: 'active',
  },
  {
    id: 'c6', name: 'Poornima University', location: 'Jaipur, Rajasthan',
    totalTeachers: 55, totalStudents: 2400, joinDate: '2024-06-25',
    plan: 'college', status: 'active',
  },
];

export const chartData = {
  submissionsPerWeek: [
    { week: 'Week 1', submitted: 45, evaluated: 32 },
    { week: 'Week 2', submitted: 67, evaluated: 55 },
    { week: 'Week 3', submitted: 89, evaluated: 71 },
    { week: 'Week 4', submitted: 102, evaluated: 94 },
    { week: 'Week 5', submitted: 78, evaluated: 65 },
    { week: 'Week 6', submitted: 115, evaluated: 98 },
  ],
  marksDistribution: [
    { range: '0-40', count: 8 },
    { range: '41-60', count: 22 },
    { range: '61-75', count: 45 },
    { range: '76-90', count: 38 },
    { range: '91-100', count: 17 },
  ],
  subjectWise: [
    { subject: 'DSA', assignments: 8, avgMarks: 72 },
    { subject: 'Algorithms', assignments: 5, avgMarks: 68 },
    { subject: 'DBMS', assignments: 6, avgMarks: 79 },
    { subject: 'System Design', assignments: 4, avgMarks: 81 },
    { subject: 'Cloud', assignments: 3, avgMarks: 74 },
  ],
  platformGrowth: [
    { month: 'Jan', colleges: 12, students: 3200, assignments: 890 },
    { month: 'Feb', colleges: 18, students: 4800, assignments: 1240 },
    { month: 'Mar', colleges: 25, students: 7200, assignments: 1890 },
    { month: 'Apr', colleges: 34, students: 9800, assignments: 2560 },
    { month: 'May', colleges: 42, students: 12400, assignments: 3200 },
    { month: 'Jun', colleges: 51, students: 15600, assignments: 4100 },
  ],
};
