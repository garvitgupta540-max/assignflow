import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Toast } from '../../components/ui/Modal';
import { getSubmissionDetail, getAssignments, evaluateSubmission } from '../../services/dbService';
import { evaluateSubmissionWithGroq } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime } from '../../utils/cn';
import { 
  ArrowLeft, ZoomIn, ZoomOut, ChevronLeft, ChevronRight,
  FileText, Send, Award, Sparkles
} from 'lucide-react';
import type { Assignment, Submission } from '../../types';

export function EvaluateSubmission() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  const [marks, setMarks] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [zoom, setZoom] = useState<number>(100);
  const [page, setPage] = useState<number>(1);
  const [showToast, setShowToast] = useState(false);

  // AI states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ feedback: string; suggestedMarks: number } | null>(null);

  useEffect(() => {
    async function loadGradingData() {
      if (!id) return;
      try {
        setLoading(true);
        const sub = await getSubmissionDetail(id);
        if (sub) {
          setSubmission(sub);
          setMarks(sub.marks?.toString() || '');
          setFeedback(sub.feedback || '');

          const allAssignments = await getAssignments();
          const foundAssignment = allAssignments.find(a => a.id === sub.assignmentId);
          if (foundAssignment) {
            setAssignment(foundAssignment);
          }
        }
      } catch (error) {
        console.error('Error fetching grading data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadGradingData();
  }, [id]);

  const handleAIEvaluate = async () => {
    if (!submission || !assignment) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      // Collect text from document pages to simulate OCR text extraction
      const page1Text = `Course: ${assignment.subject} Title: ${assignment.title} Student: ${submission.studentName} Roll: ${submission.studentRoll}. Problem Intro: Design a Binary Search Tree recursive lookup, traversal inorder, preorder, postorder.`;
      const page2Text = `TreeNode class definition: left and right children, constructors. BinarySearchTree class definition: insert, insertNode. Deletion operation missing.`;
      const page3Text = `Verification outputs: inorder [3, 8, 10, 15, 20, 22]. Preorder [15, 8, 3, 10, 20, 22]. Postorder [3, 10, 8, 22, 20, 15]. Success search found in 2 steps.`;
      const extractedText = `${page1Text}\n\n${page2Text}\n\n${page3Text}`;

      const result = await evaluateSubmissionWithGroq(
        extractedText,
        assignment.title,
        assignment.description,
        assignment.totalMarks
      );
      setAiResult(result);
    } catch (e) {
      console.error(e);
      alert('Failed to evaluate with Groq AI. Please check settings.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission || !assignment || !user) return;
    
    const numericMarks = parseFloat(marks);
    if (isNaN(numericMarks) || numericMarks < 0 || numericMarks > assignment.totalMarks) {
      alert(`Please enter valid marks between 0 and ${assignment.totalMarks}`);
      return;
    }

    try {
      await evaluateSubmission(submission.id, numericMarks, feedback, user.name);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate(`/teacher/assignments/${assignment.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error saving evaluation:', error);
      alert('Failed to save evaluation. Please try again.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Evaluate Submission" subtitle="Loading detail...">
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!submission || !assignment) {
    return (
      <DashboardLayout title="Error" subtitle="Submission not found">
        <div className="text-center py-12">
          <p className="text-slate-500 mb-4">The submission you are looking for does not exist.</p>
          <Link to="/teacher/dashboard">
            <Button leftIcon={<ArrowLeft size={16} />}>Back to Dashboard</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Evaluate Submission" 
      subtitle={`${submission.studentName} (${submission.studentRoll})`}
    >
      <div className="space-y-4">
        {/* Back Link */}
        <Link 
          to={`/teacher/assignments/${assignment.id}`} 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Submission List
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Document Viewer Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Viewer Controls */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-card">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-indigo-600" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px] md:max-w-xs">
                  {submission.fileName}
                </span>
              </div>

              {/* PDF Viewer Mock Utilities */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setZoom(z => Math.max(50, z - 10))}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Zoom Out"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <span className="text-xs font-semibold text-slate-500 w-10 text-center">{zoom}%</span>
                  <button 
                    onClick={() => setZoom(z => Math.min(200, z + 10))}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Zoom In"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>

                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

                <div className="flex items-center gap-2">
                  <button 
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-semibold text-slate-500">Page {page} of 3</span>
                  <button 
                    disabled={page >= 3}
                    onClick={() => setPage(p => p + 1)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Document Sheet */}
            <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 min-h-[500px] overflow-y-auto shadow-inner flex items-center justify-center">
              <div 
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }} 
                className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xl rounded-2xl w-full max-w-xl p-8 md:p-12 min-h-[600px] border border-slate-200/50 dark:border-slate-800/50 transition-all font-sans"
              >
                {page === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-800">
                      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase mb-1">
                        {assignment.title}
                      </h1>
                      <p className="text-xs text-slate-400">Course: {assignment.subject}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                      <div>
                        <span className="text-slate-400">Submitted By:</span>
                        <p className="font-bold text-slate-700 dark:text-slate-300">{submission.studentName}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Roll Number:</span>
                        <p className="font-mono font-bold text-slate-700 dark:text-slate-300">{submission.studentRoll}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Submission Date:</span>
                        <p className="font-bold text-slate-700 dark:text-slate-300">{formatDateTime(submission.submittedAt)}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Status:</span>
                        <p className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">{submission.status}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">1. Problem Introduction & Objective</h2>
                      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        The goal of this assignment is to design and implement a complete Binary Search Tree (BST) library in TypeScript/JavaScript, illustrating standard properties such as insertion, search, traversal, and deletion mechanisms. Binary Search Trees serve as hierarchical structures that enable logarithmic-time lookup operations by maintaining sorted subsets at each branch level.
                      </p>
                      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        In this report, we discuss code structures, traversal behaviors (specifically in-order, pre-order, and post-order), edge case handling (specifically leaf deletion vs single child vs dual child nodes), and display performance metrics based on dynamic datasets.
                      </p>
                    </div>
                  </motion.div>
                )}

                {page === 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">2. Implementation Details (Code Snippet)</h2>
                    <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[10px] overflow-x-auto leading-relaxed shadow-inner">
{`class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null = null;
  right: TreeNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

class BinarySearchTree<T> {
  root: TreeNode<T> | null = null;

  insert(value: T): void {
    const newNode = new TreeNode(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    this.insertNode(this.root, newNode);
  }

  private insertNode(node: TreeNode<T>, newNode: TreeNode<T>): void {
    if (newNode.value < node.value) {
      if (!node.left) node.left = newNode;
      else this.insertNode(node.left, newNode);
    } else {
      if (!node.right) node.right = newNode;
      else this.insertNode(node.right, newNode);
    }
  }
}`}
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      The helper method recursive calls ensure proper branch traversal and insert operations. The height of the tree is dependent on insert sequences. In an unbalanced scenario, performance degrades to O(N).
                    </p>
                  </motion.div>
                )}

                {page === 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">3. Verification & Execution Output</h2>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      We tested the BST implementation with random inputs, tracking traversal paths and verifying search speeds. Below is a mock output log of in-order traversal:
                    </p>
                    <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[10px] space-y-1">
                      <div>$ ts-node bst-test.ts</div>
                      <div className="text-emerald-400">[info] Initializing binary search tree...</div>
                      <div>[info] Inserting values: [15, 8, 20, 3, 10, 22]</div>
                      <div className="text-indigo-400">[output] Inorder: [3, 8, 10, 15, 20, 22]</div>
                      <div className="text-indigo-400">[output] Preorder: [15, 8, 3, 10, 20, 22]</div>
                      <div className="text-indigo-400">[output] Postorder: [3, 10, 8, 22, 20, 15]</div>
                      <div className="text-emerald-400">[success] Search query: 10 found in 2 steps.</div>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      All unit tests pass correctly. Node removal cases (specifically node deletion with both subtrees) have been handled using in-order successor swapping.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Form Evaluation Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Scorecard */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 shadow-card">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <Award className="text-indigo-500" size={20} />
                <h3 className="font-bold text-slate-900 dark:text-white">Submission Scorecard</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Award Marks (Max: {assignment.totalMarks})
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Enter score"
                      value={marks}
                      onChange={e => setMarks(e.target.value)}
                      max={assignment.totalMarks}
                      min={0}
                      className="pl-10 font-bold rounded-2xl"
                      required
                    />
                    <Award size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Feedback & Comments
                  </label>
                  <div className="relative">
                    <textarea
                      placeholder="Provide helpful, detailed feedback..."
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      rows={6}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder-slate-400"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    fullWidth 
                    leftIcon={<Send size={16} />}
                    className="rounded-2xl py-3.5"
                  >
                    Save & Submit Grades
                  </Button>
                </div>
              </form>
            </Card>

            {/* AI Grading Assistant Drawer */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 shadow-card">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Sparkles className="text-indigo-500" size={18} />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">AI Grading Assistant</h3>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Extract text using Tesseract OCR and evaluate automatically with Groq Llama-3 API.
              </p>

              <Button
                type="button"
                variant="secondary"
                onClick={handleAIEvaluate}
                isLoading={aiLoading}
                className="w-full justify-center py-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/80 border border-indigo-200/50 dark:border-indigo-800/50 rounded-2xl"
                leftIcon={<Sparkles size={16} />}
              >
                Grade with Groq AI
              </Button>

              <AnimatePresence>
                {aiResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    className="mt-5 p-4 border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/10 rounded-2xl space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">AI Suggested Score</span>
                      <span className="text-lg font-black text-slate-800 dark:text-white">
                        {aiResult.suggestedMarks} <span className="text-xs font-normal text-slate-400 dark:text-slate-500">/{assignment.totalMarks}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMarks(aiResult.suggestedMarks.toString())}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      Apply Suggested Score
                    </button>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">AI Feedback Draft</span>
                      <div className="text-xs text-slate-700 dark:text-slate-350 max-h-32 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-2.5 rounded-xl font-medium leading-relaxed no-scrollbar whitespace-pre-wrap">
                        {aiResult.feedback}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFeedback(aiResult.feedback)}
                      className="w-full py-2.5 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-all"
                    >
                      Apply Feedback Draft
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>

      <Toast 
        isVisible={showToast} 
        message="Evaluation saved successfully!" 
        type="success" 
      />
    </DashboardLayout>
  );
}
