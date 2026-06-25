import { useState } from 'react';

import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { chartData } from '../../data/mockData';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { 
  Download, FileText, BarChart2, ShieldCheck, Database, Calendar 
} from 'lucide-react';

export function AdminReports() {
  const reports = [
    { id: 'rep1', name: 'Q2 Institutional Adoption Report', date: '2026-06-15', size: '2.4 MB', type: 'System' },
    { id: 'rep2', name: 'Average Student CGPA & Performance Matrix', date: '2026-06-10', size: '1.8 MB', type: 'Analytics' },
    { id: 'rep3', name: 'Platform Database & Server Logs Summary', date: '2026-06-01', size: '12.4 MB', type: 'Database' },
    { id: 'rep4', name: 'Q1 Financial & Premium License Report', date: '2026-05-15', size: '3.1 MB', type: 'Finance' },
  ];

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const triggerDownload = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert('Mock report download started successfully!');
    }, 1500);
  };

  return (
    <DashboardLayout title="System Reports" subtitle="Generate system performance metrics and download compliance statistics">
      <div className="space-y-6">
        {/* Analytics Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 border-slate-200 dark:border-slate-800 lg:col-span-2">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart2 size={18} className="text-indigo-500" />
              Subject Performance Averages
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.subjectWise} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="subject" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="avgMarks" fill="#6366F1" radius={[6, 6, 0, 0]} name="Average Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-indigo-500" />
                Compliance & Security
              </h4>
              <p className="text-xs leading-relaxed text-slate-500 mb-6">
                All uploaded documents are processed and encrypted. The evaluation pipeline complies with standard educational confidentiality norms.
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Database Backups</span>
                  <span className="font-bold text-emerald-600">Daily Automated</span>
                </div>
                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Encryption Method</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">AES-256 GCM</span>
                </div>
                <div className="flex items-center justify-between text-xs py-2">
                  <span className="text-slate-400">SSL Certificate</span>
                  <span className="font-bold text-emerald-600">Active</span>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4 rounded-xl" leftIcon={<Database size={16} />}>
              Configure Webhooks
            </Button>
          </Card>
        </div>

        {/* Available Reports list */}
        <Card className="p-6 border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">Exportable Log Archives</h4>
          <div className="space-y-4">
            {reports.map((report) => (
              <div 
                key={report.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 rounded-2xl transition-all gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">{report.name}</h5>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{report.size}</span>
                      <span>•</span>
                      <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-semibold text-[10px]">
                        {report.type}
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  size="sm"
                  variant="outline"
                  leftIcon={<Download size={14} />}
                  onClick={() => triggerDownload(report.id)}
                  isLoading={downloadingId === report.id}
                  className="rounded-xl flex-shrink-0 self-end sm:self-center"
                >
                  {downloadingId === report.id ? 'Preparing...' : 'Download PDF'}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
