import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';
import { Toast } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { createAssignment } from '../../services/dbService';
import { extractTextFromDocument, generateStarterCodeForAssignment } from '../../services/aiService';
import { ChevronLeft, ClipboardList, Calendar, BookOpen, Star, Tag, Users, Sparkles } from 'lucide-react';

export function CreateAssignment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [generatedNotice, setGeneratedNotice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: '',
    totalMarks: '',
    class: '',
    tags: '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const generateAssignmentDraft = (selectedFile: File, extractedText: string) => {
    const baseName = selectedFile.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
    const titleSeed = baseName.replace(/\b\w/g, (char) => char.toUpperCase());
    const normalizedText = extractedText.toLowerCase();

    let subject = 'General';
    let title = titleSeed || 'New Assignment';
    let description = `Auto-generated from the uploaded reference material. Review the attached content carefully and prepare a complete solution with clear explanation and proper formatting.`;
    let tags = ['generated', 'upload'];

    if (normalizedText.includes('data structure') || normalizedText.includes('tree') || normalizedText.includes('bst') || normalizedText.includes('graph')) {
      subject = 'Data Structures';
      tags = ['data-structures', 'generated'];
    } else if (normalizedText.includes('sql') || normalizedText.includes('database')) {
      subject = 'Database Systems';
      tags = ['database', 'sql', 'generated'];
    } else if (normalizedText.includes('algorithm') || normalizedText.includes('dijkstra')) {
      subject = 'Algorithms';
      tags = ['algorithms', 'generated'];
    } else if (normalizedText.includes('network') || normalizedText.includes('os')) {
      subject = 'Computer Systems';
      tags = ['systems', 'generated'];
    }

    if (extractedText) {
      const firstMeaningfulLine = extractedText
        .split('\n')
        .map(line => line.trim())
        .find(line => line && !line.toLowerCase().startsWith('question'));

      if (firstMeaningfulLine && firstMeaningfulLine.length < 90) {
        title = firstMeaningfulLine.replace(/^question\s*\d*[:.-]?\s*/i, '').trim();
      }

      const cleanedText = extractedText.replace(/\s+/g, ' ').trim();
      description = `Auto-generated from the uploaded material. Students should answer the task below and provide a complete solution with explanations and relevant examples.\n\n${cleanedText.slice(0, 700)}`;
    }

    return { title, subject, description, tags: tags.join(', ') };
  };

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsAutoGenerating(true);
    setGeneratedNotice('');

    try {
      const extractedText = await extractTextFromDocument(selectedFile);
      const draft = generateAssignmentDraft(selectedFile, extractedText);

      setForm(prev => ({
        ...prev,
        title: prev.title || draft.title,
        subject: prev.subject || draft.subject,
        description: prev.description || draft.description,
        tags: prev.tags || draft.tags,
      }));
      setGeneratedNotice('Assignment details were generated from the uploaded file.');
    } catch (error) {
      console.error('Error generating assignment draft:', error);
      setGeneratedNotice('The file was uploaded, but the details could not be generated automatically.');
    } finally {
      setIsAutoGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    try {
      const { starterCode, instructions } = generateStarterCodeForAssignment(form.title, form.subject, form.description);

      await createAssignment({
        title: form.title,
        subject: form.subject,
        description: form.description,
        dueDate: new Date(form.dueDate).toISOString(),
        totalMarks: parseInt(form.totalMarks) || 100,
        class: form.class || 'CS-A',
        semester: 6,
        teacherId: user.id,
        teacherName: user.name,
        status: 'active',
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        totalStudents: 32,
        attachments: file ? [file.name] : [],
        starterCode,
        generatedPrompt: instructions,
      });

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/teacher/assignments');
      }, 2000);
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to publish assignment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Assignment" subtitle="Set up a new assignment for your students">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/teacher/assignments')}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors mb-6"
        >
          <ChevronLeft size={18} />
          Back to Assignments
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card space-y-5">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
              <ClipboardList size={18} className="text-indigo-500" /> Assignment Details
            </h3>

            <Input
              label="Assignment Title"
              placeholder="e.g. Binary Search Tree Implementation"
              value={form.title}
              onChange={handleChange('title')}
              leftIcon={<ClipboardList size={18} />}
              id="assignment-title"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Subject"
                placeholder="e.g. Data Structures"
                value={form.subject}
                onChange={handleChange('subject')}
                leftIcon={<BookOpen size={18} />}
                id="assignment-subject"
                required
              />
              <Input
                label="Target Class"
                placeholder="e.g. CS-A"
                value={form.class}
                onChange={handleChange('class')}
                leftIcon={<Users size={18} />}
                id="assignment-class"
                required
              />
            </div>

            <Textarea
              label="Description / Instructions"
              placeholder="Provide detail guidelines on what to implement and the expected submission format..."
              value={form.description}
              onChange={handleChange('description')}
              rows={5}
              id="assignment-desc"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Total Marks"
                type="number"
                placeholder="100"
                value={form.totalMarks}
                onChange={handleChange('totalMarks')}
                leftIcon={<Star size={18} />}
                id="assignment-marks"
                required
              />
              <Input
                label="Due Date & Time"
                type="datetime-local"
                value={form.dueDate}
                onChange={handleChange('dueDate')}
                leftIcon={<Calendar size={18} />}
                id="assignment-due"
                required
              />
              <Input
                label="Tags (comma separated)"
                placeholder="e.g. DSA, Trees"
                value={form.tags}
                onChange={handleChange('tags')}
                leftIcon={<Tag size={18} />}
                id="assignment-tags"
              />
            </div>
          </div>

          {/* Document Attachment */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
              <BookOpen size={18} className="text-indigo-500" /> Reference Material (Optional)
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Attach a PDF with the assignment questions for students to download.
            </p>
            <FileUpload onFileSelect={handleFileSelect} accept=".pdf" maxSize={50} />
            {isAutoGenerating && (
              <div className="mt-4 flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                <Sparkles size={16} />
                Generating assignment details from the uploaded file...
              </div>
            )}
            {generatedNotice && (
              <div className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
                {generatedNotice}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => navigate('/teacher/assignments')}>
              Cancel
            </Button>
            <Button variant="outline" type="button">
              Save as Draft
            </Button>
            <Button type="submit" isLoading={isLoading} leftIcon={<ClipboardList size={18} />}>
              Publish Assignment
            </Button>
          </div>
        </form>
      </div>
      <Toast isVisible={showToast} message="Assignment published successfully! 🎉" type="success" />
    </DashboardLayout>
  );
}
