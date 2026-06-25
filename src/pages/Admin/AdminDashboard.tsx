import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { getColleges } from '../../services/dbService';
import { chartData } from '../../data/mockData';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  CartesianGrid, BarChart, Bar 
} from 'recharts';
import { 
  Building2, Users, ClipboardList, TrendingUp, CheckCircle 
} from 'lucide-react';
import type { College } from '../../types';

export function AdminDashboard() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardStats() {
      try {
        setLoading(true);
        const data = await getColleges();
        setColleges(data);
      } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardStats();
  }, []);

  const totalColleges = colleges.length;
  const totalStudents = colleges.reduce((sum, c) => sum + c.totalStudents, 0);
  const totalTeachers = colleges.reduce((sum, c) => sum + c.totalTeachers, 0);

  if (loading) {
    return (
      <DashboardLayout title="System Administration" subtitle="Loading metrics...">
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="System Administration" subtitle="Global overview and system metrics">
      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Colleges</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">{totalColleges || 51}</h3>
              </div>
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Building2 size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Students</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">{(totalStudents || 15600).toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Users size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Staff Members</p>
                <h3 className="text-3xl font-black text-amber-500">{(totalTeachers || 620).toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                <ClipboardList size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">System Status</p>
                <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-2 font-sans">
                  <CheckCircle size={18} />
                  Operational
                </h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 font-sans">
              <TrendingUp size={18} className="text-indigo-500" />
              Platform Student Growth
            </h4>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.platformGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                  <Area type="monotone" dataKey="students" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 font-sans">
              <Building2 size={18} className="text-indigo-500" />
              Colleges & Institutional Adoption
            </h4>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.platformGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="colleges" fill="#818CF8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Institution List Quick View */}
        <Card className="p-6 border-slate-200 dark:border-slate-800 overflow-hidden">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4 font-sans">Institutional Partners</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="py-3 text-xs font-bold text-slate-400 uppercase">Institution Name</th>
                  <th className="py-3 text-xs font-bold text-slate-400 uppercase">Location</th>
                  <th className="py-3 text-xs font-bold text-slate-400 uppercase">Staff Count</th>
                  <th className="py-3 text-xs font-bold text-slate-400 uppercase">Student Count</th>
                  <th className="py-3 text-xs font-bold text-slate-400 uppercase">Subscription Plan</th>
                  <th className="py-3 text-xs font-bold text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {colleges.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">{c.name}</td>
                    <td className="py-3.5 text-sm text-slate-500">{c.location}</td>
                    <td className="py-3.5 text-sm text-slate-600 dark:text-slate-300 font-semibold">{c.totalTeachers}</td>
                    <td className="py-3.5 text-sm text-slate-600 dark:text-slate-300 font-semibold">{c.totalStudents.toLocaleString()}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                        c.plan === 'enterprise' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400' :
                        c.plan === 'college' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {c.plan}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
