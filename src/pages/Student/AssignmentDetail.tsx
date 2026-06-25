import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge, getSubmissionBadgeVariant } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';
import { Modal, Toast } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { getAssignments, getStudentSubmissions, uploadSubmissionFile, submitAssignment } from '../../services/dbService';
import { formatDate, getDaysUntil } from '../../utils/cn';
import { Calendar, BookOpen, User, ChevronLeft, Upload, CheckCircle, Star, FileText } from 'lucide-react';
import type { Assignment, Submission } from '../../types';

export function AssignmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [existingSubmission, setExistingSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      if (!id || !user) return;
      try {
        setLoading(true);
        const [allAssignments, studentSubs] = await Promise.all([
          getAssignments(),
          getStudentSubmissions(user.id)
        ]);

        const foundAssignment = allAssignments.find(a => a.id === id);
        if (foundAssignment) {
          setAssignment(foundAssignment);
          const foundSub = studentSubs.find(s => s.assignmentId === id);
          if (foundSub) {
            setExistingSubmission(foundSub);
          }
        }
      } catch (error) {
        console.error('Error fetching assignment detail:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id, user, submitted]);

  const handleSubmit = async () => {
    if (!selectedFile || !assignment || !user) return;
    setIsSubmitting(true);
    try {
      // 1. Upload file to Firebase Storage
      const { url } = await uploadSubmissionFile(assignment.id, user.id, selectedFile);
      
      // 2. Submit assignment metadata to Firestore
      await submitAssignment({
        id: existingSubmission?.id,
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        studentId: user.id,
        studentName: user.name,
        studentRoll: user.rollNumber || 'CS2021001',
        fileUrl: url,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        totalMarks: assignment.totalMarks,
      });

      setSubmitted(true);
      setShowSubmitModal(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error: any) {
      console.error('Error uploading/submitting assignment:', error);
      alert(`Failed to submit: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Assignment Details" subtitle="Loading info...">
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!assignment) {
    return (
      <DashboardLayout title="Error" subtitle="Assignment not found">
        <div className="text-center py-12 max-w-md mx-auto space-y-4">
          <p className="text-slate-500">The assignment you are looking for does not exist.</p>
          <Button onClick={() => navigate('/student/assignments')} leftIcon={<ChevronLeft size={16} />}>
            Back to Assignments
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const daysLeft = getDaysUntil(assignment.dueDate);

  return (
    <DashboardLayout title={assignment.title} subtitle={assignment.subject}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/student/assignments')}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors"
        >
          <ChevronLeft size={18} />
          Back to Assignments
        </button>

        {/* Header Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-card">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={getSubmissionBadgeVariant(assignment.status)}>
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </Badge>
                {assignment.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{assignment.title}</h1>
              <p className="text-slate-600 dark:text-slate-400">{assignment.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-4xl font-black text-slate-900 dark:text-white">{assignment.totalMarks}</div>
              <div className="text-sm text-slate-400">Total Marks</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl">
            {[
              { icon: <BookOpen size={16} />, label: 'Subject', value: assignment.subject },
              { icon: <User size={16} />, label: 'Teacher', value: assignment.teacherName },
              { icon: <Calendar size={16} />, label: 'Due Date', value: formatDate(assignment.dueDate) },
              { icon: <Star size={16} />, label: 'Time Left', value: daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Today!' : `${daysLeft} days` },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
                  {item.icon}
                  {item.label}
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {assignment.starterCode && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Starter Code</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Use this generated template to begin your solution.</p>
              </div>
              {assignment.generatedPrompt && (
                <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-semibold">
                  {assignment.generatedPrompt}
                </span>
              )}
            </div>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 text-slate-100 p-4 text-sm leading-6 whitespace-pre-wrap">
              {assignment.starterCode}
            </pre>
          </motion.div>
        )}

        {/* Submission Status or Submit Button */}
        <AnimatePresence mode="wait">
          {existingSubmission && !submitted ? (
            <motion.div
              key="existing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card"
            >
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-indigo-500" /> Your Submission
              </h3>
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl mb-4">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                  <FileText size={20} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{existingSubmission.fileName}</p>
                  <p className="text-xs text-slate-500">Submitted {formatDate(existingSubmission.submittedAt)}</p>
                </div>
                <Badge variant={getSubmissionBadgeVariant(existingSubmission.status)}>
                  {existingSubmission.status}
                </Badge>
              </div>

              {existingSubmission.status === 'evaluated' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle size={20} className="text-emerald-600" />
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">Evaluated!</span>
                    <span className="ml-auto text-2xl font-black text-emerald-700 dark:text-emerald-300">
                      {existingSubmission.marks}/{existingSubmission.totalMarks}
                    </span>
                  </div>
                  {existingSubmission.feedback && (
                    <div>
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Feedback from {existingSubmission.evaluatedBy}</p>
                      <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">{existingSubmission.feedback}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {existingSubmission.status !== 'evaluated' && assignment.status === 'active' && (
                <div className="mt-4">
                  <Button
                    onClick={() => {
                      setSelectedFile(null);
                      setShowSubmitModal(true);
                    }}
                    className="w-full justify-center"
                    leftIcon={<Upload size={16} />}
                  >
                    Resubmit / Replace File
                  </Button>
                </div>
              )}
            </motion.div>
          ) : submitted ? (
            <motion.div
              key="success"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-3xl p-8 text-center"
            >
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-xl font-black text-emerald-800 dark:text-emerald-300 mb-2">Assignment Submitted!</h3>
              <p className="text-emerald-600 dark:text-emerald-400 text-sm">Your submission is under review. You'll be notified when it's evaluated.</p>
            </motion.div>
          ) : (
            <motion.div
              key="submit"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card"
            >
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Upload size={18} className="text-indigo-500" /> Submit Your Assignment
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                Upload your assignment as a PDF file. Make sure it's complete before submitting.
              </p>
              <Button
                onClick={() => {
                  setSelectedFile(null);
                  setShowSubmitModal(true);
                }}
                className="w-full justify-center"
                size="lg"
                leftIcon={<Upload size={18} />}
                disabled={assignment.status !== 'active'}
              >
                Upload & Submit Assignment
              </Button>
              {assignment.status !== 'active' && (
                <p className="text-xs text-slate-400 text-center mt-2">This assignment is closed for submissions.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submit Modal */}
      <Modal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="Submit Assignment" size="lg">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Upload your PDF for <strong>{assignment.title}</strong>. Once submitted, you can replace it before the deadline.
          </p>
          <FileUpload onFileSelect={setSelectedFile} accept=".pdf" maxSize={25} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowSubmitModal(false)} className="flex-1 justify-center">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!selectedFile}
              className="flex-1 justify-center"
            >
              Submit Assignment
            </Button>
          </div>
        </div>
      </Modal>

      <Toast isVisible={showToast} message="Assignment submitted successfully! 🎉" type="success" />
    </DashboardLayout>
  );
}
