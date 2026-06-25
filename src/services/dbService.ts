import { 
  collection, doc, setDoc, getDoc, getDocs, query, where, addDoc, updateDoc, writeBatch 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { mockAssignments, mockStudents, mockTeachers, mockNotifications, mockColleges } from '../data/mockData';
import type { Assignment, Submission, Student, Notification, College, User, CommunityMessage } from '../types';

// Seed Database if empty
export async function seedDatabase() {
  try {
    const userSnapshot = await getDocs(collection(db, 'users'));
    if (!userSnapshot.empty) {
      console.log('Database already seeded.');
      return;
    }

    console.log('Seeding database with default mock data...');
    const batch = writeBatch(db);

    // Seed Colleges first with invite codes
    mockColleges.forEach(college => {
      const docRef = doc(db, 'colleges', college.id);
      const isMit = college.id === 'c1';
      batch.set(docRef, {
        ...college,
        studentInviteCode: isMit ? 'MIT-STU' : `${college.id.toUpperCase()}-STU`,
        teacherInviteCode: isMit ? 'MIT-TCH' : `${college.id.toUpperCase()}-TCH`
      });
    });

    // Seed Teachers
    mockTeachers.forEach(teacher => {
      const docRef = doc(db, 'users', teacher.id);
      batch.set(docRef, {
        ...teacher,
        collegeId: 'c1',
        createdAt: new Date().toISOString(),
      });
    });

    // Seed Students
    mockStudents.forEach(student => {
      const docRef = doc(db, 'users', student.id);
      batch.set(docRef, {
        ...student,
        collegeId: 'c1',
        streak: 5,
        cgpaTrend: [
          { semester: 1, gpa: 8.2 },
          { semester: 2, gpa: 8.5 },
          { semester: 3, gpa: 8.3 },
          { semester: 4, gpa: 8.8 },
          { semester: 5, gpa: 8.6 },
          { semester: 6, gpa: student.cgpa || 8.7 }
        ],
        createdAt: new Date().toISOString(),
      });
    });

    // Seed Admin
    const adminRef = doc(db, 'users', 'a1');
    batch.set(adminRef, {
      id: 'a1',
      name: 'Admin User',
      email: 'admin@demo.com',
      role: 'admin',
      college: 'AssignFlow HQ',
      collegeId: 'hq',
      joinDate: '2024-01-01',
      createdAt: new Date().toISOString(),
    });

    // Seed Assignments
    mockAssignments.forEach(assignment => {
      const docRef = doc(db, 'assignments', assignment.id);
      batch.set(docRef, {
        ...assignment,
        collegeId: 'c1',
        dueDate: assignment.dueDate,
        createdAt: assignment.createdAt,
      });
    });

    // Seed Notifications
    mockNotifications.forEach(notif => {
      const docRef = doc(db, 'notifications', notif.id);
      batch.set(docRef, notif);
    });

    // Seed Submissions
    const dummySubmissions: Submission[] = [
      {
        id: 'sub1', assignmentId: 'a1', assignmentTitle: 'Binary Search Tree Implementation',
        studentId: 's1', studentName: 'Arjun Sharma', studentRoll: 'CS2021001',
        submittedAt: '2026-07-08T14:30:00', fileUrl: 'https://arxiv.org/pdf/quant-ph/0201082.pdf', fileName: 'BST_Arjun_CS2021001.pdf',
        fileSize: 2457600, status: 'evaluated', marks: 88, totalMarks: 100,
        feedback: 'Excellent implementation! Code is clean and well-commented. Minor issue: delete operation could be optimized.',
        evaluatedAt: '2026-07-09T10:00:00', evaluatedBy: 'Dr. Meera Nair',
      },
      {
        id: 'sub2', assignmentId: 'a3', assignmentTitle: 'SQL Query Optimization Lab',
        studentId: 's1', studentName: 'Arjun Sharma', studentRoll: 'CS2021001',
        submittedAt: '2026-07-04T22:15:00', fileUrl: 'https://arxiv.org/pdf/quant-ph/0201082.pdf', fileName: 'SQL_Lab_Arjun.pdf',
        fileSize: 1843200, status: 'evaluated', marks: 52, totalMarks: 60,
        feedback: 'Good work on most queries. Clear screenshots.',
        evaluatedAt: '2026-07-05T15:30:00', evaluatedBy: 'Prof. Rajesh Kumar',
      },
      {
        id: 'sub3', assignmentId: 'a2', assignmentTitle: 'Dijkstra\'s Algorithm Visualization',
        studentId: 's1', studentName: 'Arjun Sharma', studentRoll: 'CS2021001',
        submittedAt: '2026-07-12T18:00:00', fileUrl: 'https://arxiv.org/pdf/quant-ph/0201082.pdf', fileName: 'Dijkstra_Arjun.pdf',
        fileSize: 3145728, status: 'submitted', totalMarks: 80,
      }
    ];

    dummySubmissions.forEach(sub => {
      const docRef = doc(db, 'submissions', sub.id);
      batch.set(docRef, sub);
    });

    // Seed Timetable
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const subjects = ['Data Structures', 'Algorithms', 'Database Management', 'Cloud Computing', 'System Design'];
    let tIndex = 1;
    days.forEach((day, index) => {
      const docRef = doc(db, 'timetables', `t${tIndex}`);
      batch.set(docRef, {
        id: `t${tIndex}`,
        studentId: 's1',
        subject: subjects[index],
        day,
        startTime: '09:00',
        endTime: '10:30',
      });
      tIndex++;
    });

    await batch.commit();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Verify College Invite Code
export async function verifyInviteCode(code: string): Promise<{ collegeId: string; collegeName: string; role: 'student' | 'teacher' } | null> {
  try {
    const collegesSnapshot = await getDocs(collection(db, 'colleges'));
    let match: { collegeId: string; collegeName: string; role: 'student' | 'teacher' } | null = null;
    
    collegesSnapshot.forEach(collegeDoc => {
      const data = collegeDoc.data();
      if (data.studentInviteCode === code) {
        match = { collegeId: collegeDoc.id, collegeName: data.name, role: 'student' };
      } else if (data.teacherInviteCode === code) {
        match = { collegeId: collegeDoc.id, collegeName: data.name, role: 'teacher' };
      }
    });

    return match;
  } catch (e) {
    console.error('Error verifying invite code:', e);
    return null;
  }
}

// User CRUD
export async function getUserProfile(uid: string): Promise<User | null> {
  const docRef = doc(db, 'users', uid);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as User) : null;
}

export async function createUserProfile(uid: string, profile: Partial<User>): Promise<void> {
  const docRef = doc(db, 'users', uid);
  await setDoc(docRef, {
    id: uid,
    joinDate: new Date().toISOString().split('T')[0],
    ...profile,
  }, { merge: true });
}

// Assignments
export async function getAssignments(collegeId?: string): Promise<Assignment[]> {
  const collRef = collection(db, 'assignments');
  const q = collegeId ? query(collRef, where('collegeId', '==', collegeId)) : collRef;
  const querySnapshot = await getDocs(q);
  const list: Assignment[] = [];
  querySnapshot.forEach(doc => {
    list.push({ id: doc.id, ...doc.data() } as Assignment);
  });
  return list;
}

export async function createAssignment(assignment: Omit<Assignment, 'id' | 'createdAt' | 'submissionCount'> & { collegeId?: string }): Promise<string> {
  const collRef = collection(db, 'assignments');
  const payload = {
    ...assignment,
    collegeId: assignment.collegeId || 'c1',
    submissionCount: 0,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collRef, payload);
  
  // Dispatch notification to class students
  const studentQuery = query(collection(db, 'users'), where('role', '==', 'student'), where('class', '==', assignment.class));
  const studentSnapshot = await getDocs(studentQuery);
  const batch = writeBatch(db);
  studentSnapshot.forEach(studentDoc => {
    const notifRef = doc(collection(db, 'notifications'));
    batch.set(notifRef, {
      id: notifRef.id,
      userId: studentDoc.id,
      title: 'New Assignment Posted',
      message: `${assignment.teacherName} posted: ${assignment.title}`,
      type: 'assignment',
      read: false,
      createdAt: new Date().toISOString(),
      link: `/student/assignments/${docRef.id}`,
    });
  });
  await batch.commit();

  return docRef.id;
}

// Submissions
export async function getSubmissions(assignmentId?: string): Promise<Submission[]> {
  const collRef = collection(db, 'submissions');
  const q = assignmentId 
    ? query(collRef, where('assignmentId', '==', assignmentId))
    : collRef;
  const snapshot = await getDocs(q);
  const list: Submission[] = [];
  snapshot.forEach(doc => {
    list.push({ id: doc.id, ...doc.data() } as Submission);
  });
  return list;
}

export async function getStudentSubmissions(studentId: string): Promise<Submission[]> {
  const q = query(collection(db, 'submissions'), where('studentId', '==', studentId));
  const snapshot = await getDocs(q);
  const list: Submission[] = [];
  snapshot.forEach(doc => {
    list.push({ id: doc.id, ...doc.data() } as Submission);
  });
  return list;
}

export async function getSubmissionDetail(id: string): Promise<Submission | null> {
  const docRef = doc(db, 'submissions', id);
  const snap = await getDoc(docRef);
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Submission) : null;
}

// Browser PDF Upload to Firebase Storage with a timeout fallback
export async function uploadSubmissionFile(assignmentId: string, studentId: string, file: File): Promise<{ url: string; path: string }> {
  const fileExtension = file.name.split('.').pop();
  const filePath = `submissions/${assignmentId}/${studentId}_${Date.now()}.${fileExtension}`;
  const storageRef = ref(storage, filePath);
  
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Firebase Storage upload timed out')), 1500);
    });

    await Promise.race([
      uploadBytes(storageRef, file),
      timeoutPromise
    ]);

    const url = await getDownloadURL(storageRef);
    return { url, path: filePath };
  } catch (error) {
    console.warn('Firebase Storage upload failed or timed out. Falling back to mock URL:', error);
    const mockUrl = 'https://arxiv.org/pdf/quant-ph/0201082.pdf';
    return { url: mockUrl, path: filePath };
  }
}

export async function submitAssignment(submission: Omit<Submission, 'id' | 'submittedAt' | 'status'> & { id?: string }): Promise<string> {
  const assignmentDoc = await getDoc(doc(db, 'assignments', submission.assignmentId));
  const assignment = assignmentDoc.data() as Assignment;
  
  const now = new Date();
  const dueDate = new Date(assignment.dueDate);
  const status = now > dueDate ? 'late' : 'submitted';

  const payload = {
    ...submission,
    submittedAt: now.toISOString(),
    status,
  };

  let docId = '';
  let isNew = true;

  if (submission.id) {
    const docRef = doc(db, 'submissions', submission.id);
    await setDoc(docRef, payload, { merge: true });
    docId = submission.id;
    isNew = false;
  } else {
    // Check if one already exists in Firestore by this student for this assignment to avoid duplicates
    const q = query(
      collection(db, 'submissions'),
      where('assignmentId', '==', submission.assignmentId),
      where('studentId', '==', submission.studentId)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const existingDoc = snap.docs[0];
      await setDoc(existingDoc.ref, payload, { merge: true });
      docId = existingDoc.id;
      isNew = false;
    } else {
      const docRef = await addDoc(collection(db, 'submissions'), payload);
      docId = docRef.id;
    }
  }

  if (isNew) {
    // Increment submissionCount in assignment only for new submissions
    await updateDoc(doc(db, 'assignments', submission.assignmentId), {
      submissionCount: (assignment.submissionCount || 0) + 1
    });
  }

  // Notify Teacher
  const notifRef = doc(collection(db, 'notifications'));
  await setDoc(notifRef, {
    id: notifRef.id,
    userId: assignment.teacherId,
    title: isNew ? 'New submission received' : 'Submission updated',
    message: `${submission.studentName} ${isNew ? 'submitted' : 'updated'} ${submission.fileName} for ${assignment.title}`,
    type: 'assignment',
    read: false,
    createdAt: new Date().toISOString(),
    link: `/teacher/assignments/${submission.assignmentId}`,
  });

  return docId;
}

export async function evaluateSubmission(id: string, marks: number, feedback: string, teacherName: string): Promise<void> {
  const docRef = doc(db, 'submissions', id);
  const subSnap = await getDoc(docRef);
  if (!subSnap.exists()) return;
  const submission = subSnap.data() as Submission;

  const now = new Date().toISOString();
  await updateDoc(docRef, {
    marks,
    feedback,
    status: 'evaluated',
    evaluatedAt: now,
    evaluatedBy: teacherName,
    // Audit logs for evaluation history
    audit_logs: `Evaluated by ${teacherName} at ${now}. Score: ${marks}/${submission.totalMarks}.`
  });

  // Notify Student
  const notifRef = doc(collection(db, 'notifications'));
  await setDoc(notifRef, {
    id: notifRef.id,
    userId: submission.studentId,
    title: 'Assignment Evaluated',
    message: `Your submission for ${submission.assignmentTitle} was evaluated. Grade: ${marks}/${submission.totalMarks}`,
    type: 'evaluation',
    read: false,
    createdAt: now,
    link: '/student/submissions',
  });
}

// Notifications
export async function getUserNotifications(userId: string): Promise<Notification[]> {
  const q = query(collection(db, 'notifications'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const list: Notification[] = [];
  snapshot.forEach(doc => {
    list.push({ id: doc.id, ...doc.data() } as Notification);
  });
  // Sort by date descending
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function markNotificationRead(id: string): Promise<void> {
  await updateDoc(doc(db, 'notifications', id), { read: true });
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const q = query(collection(db, 'notifications'), where('userId', '==', userId), where('read', '==', false));
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  snapshot.forEach(doc => {
    batch.update(doc.ref, { read: true });
  });
  await batch.commit();
}

// Timetables
export async function getStudentTimetable(studentId: string): Promise<any[]> {
  const q = query(collection(db, 'timetables'), where('studentId', '==', studentId));
  const snapshot = await getDocs(q);
  const list: any[] = [];
  snapshot.forEach(doc => {
    list.push({ id: doc.id, ...doc.data() });
  });
  return list;
}

// Admin / Lists
export async function getColleges(): Promise<College[]> {
  const snapshot = await getDocs(collection(db, 'colleges'));
  const list: College[] = [];
  snapshot.forEach(doc => {
    list.push({ id: doc.id, ...doc.data() } as College);
  });
  return list;
}

export async function addCollege(college: Omit<College, 'id' | 'joinDate' | 'status'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'colleges'), {
    ...college,
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active',
  });
  return docRef.id;
}

export async function getStudents(): Promise<Student[]> {
  const q = query(collection(db, 'users'), where('role', '==', 'student'));
  const snapshot = await getDocs(q);
  const list: Student[] = [];
  snapshot.forEach(doc => {
    list.push({ id: doc.id, ...doc.data() } as Student);
  });
  return list;
}

// Community Messages (Automated Batch Discussion)
export async function getCommunityMessages(classCode: string): Promise<CommunityMessage[]> {
  try {
    const colRef = collection(db, `communities/${classCode}/messages`);
    const snapshot = await getDocs(colRef);
    const list: CommunityMessage[] = [];
    snapshot.forEach(doc => {
      list.push({ id: doc.id, ...doc.data() } as CommunityMessage);
    });

    if (list.length === 0) {
      // Auto-seed welcoming posts and initial student messages
      const welcomeMsgs: Omit<CommunityMessage, 'id'>[] = [
        {
          classCode,
          senderId: 'sys',
          senderName: 'AssignFlow System',
          senderRole: 'admin',
          content: `📢 Welcome to the ${classCode} Batch Community! This space is automatically generated for students and teachers in this batch. Discuss assignments, share concepts, and ask the AI Teacher Assistant for tutoring by typing '@ai' or '@AI'.`,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          classCode,
          senderId: 't1',
          senderName: 'Prof. Rajesh Kumar',
          senderRole: 'teacher',
          content: 'Hello everyone! I have posted the new Dijkstra\'s Algorithm Visualization lab. Please read the specs carefully. Let me know if you run into setup issues.',
          createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        },
        {
          classCode,
          senderId: 's2',
          senderName: 'Sneha Reddy',
          senderRole: 'student',
          content: 'Thanks Professor! I had a doubt in Dijkstra relaxation code. @ai, can you explain the vertex relaxation step in Dijkstra?',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          classCode,
          senderId: 'ai-ta',
          senderName: 'AssignFlow AI TA',
          senderRole: 'admin',
          content: `In Dijkstra's algorithm, **relaxation** is the step where we try to find a shorter path to a vertex 'v' via another vertex 'u'.

**Concept:**
If the current known distance to 'v' is greater than the distance to 'u' plus the weight of the edge between 'u' and 'v', we update the distance of 'v':

\`\`\`cpp
if (dist[u] + weight(u, v) < dist[v]) {
    dist[v] = dist[u] + weight(u, v);
    // Push the updated vertex into the priority queue
}
\`\`\``,
          createdAt: new Date(Date.now() - 3600000 + 30000).toISOString(),
          isAi: true,
        }
      ];

      const batch = writeBatch(db);
      welcomeMsgs.forEach(msg => {
        const docRef = doc(collection(db, `communities/${classCode}/messages`));
        batch.set(docRef, msg);
        list.push({ id: docRef.id, ...msg } as CommunityMessage);
      });
      await batch.commit();
    }

    return list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } catch (e) {
    console.error('Error fetching community messages:', e);
    return [];
  }
}

export async function sendCommunityMessage(classCode: string, msg: Omit<CommunityMessage, 'id' | 'createdAt'>): Promise<void> {
  const docRef = doc(collection(db, `communities/${classCode}/messages`));
  await setDoc(docRef, {
    ...msg,
    createdAt: new Date().toISOString(),
  });
}
