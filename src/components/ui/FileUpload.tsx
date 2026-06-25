import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatFileSize } from '../../utils/cn';
import { Button } from './Button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({ onFileSelect, accept = '.pdf', maxSize = 25, className }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFile = useCallback((file: File) => {
    setError('');
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }
    if (accept && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are accepted');
      return;
    }
    setSelectedFile(file);
    simulateUpload(file);
  }, [maxSize, accept]);

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setIsSuccess(false);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(100);
        setIsUploading(false);
        setIsSuccess(true);
        onFileSelect(file);
      } else {
        setUploadProgress(Math.min(progress, 99));
      }
    }, 200);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const removeFile = () => {
    setSelectedFile(null);
    setIsSuccess(false);
    setUploadProgress(0);
    setError('');
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              'relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 cursor-pointer',
              isDragging
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            )}
            onClick={() => document.getElementById('file-upload-input')?.click()}
          >
            <input
              id="file-upload-input"
              type="file"
              accept={accept}
              className="hidden"
              onChange={handleInput}
            />
            <motion.div
              animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <div className={cn(
                'w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4',
                isDragging ? 'bg-indigo-100 dark:bg-indigo-900/40' : 'bg-slate-100 dark:bg-slate-700'
              )}>
                <Upload className={cn('w-8 h-8', isDragging ? 'text-indigo-600' : 'text-slate-400')} />
              </div>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isDragging ? 'Drop your file here' : 'Drag & drop your PDF'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                or click to browse — PDF only, max {maxSize}MB
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="border border-slate-200 dark:border-slate-700 rounded-3xl p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{selectedFile.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{formatFileSize(selectedFile.size)}</p>
              </div>
              {isSuccess && <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />}
              <button onClick={removeFile} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>
            {isUploading && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Uploading...</span>
                  <span className="font-semibold text-indigo-600">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
            {isSuccess && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-emerald-600 dark:text-emerald-400 font-medium"
              >
                ✓ File uploaded successfully. Ready to submit!
              </motion.p>
            )}
            {!isUploading && !isSuccess && (
              <Button variant="outline" size="sm" onClick={() => document.getElementById('file-upload-input')?.click()}>
                Replace File
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-2 text-sm text-rose-500"
        >
          <AlertCircle size={16} />
          {error}
        </motion.p>
      )}
    </div>
  );
}
