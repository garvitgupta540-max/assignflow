import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { getColleges, addCollege } from '../../services/dbService';
import { Search, Plus, MapPin, Calendar, Building } from 'lucide-react';
import type { College } from '../../types';

export function AdminUsers() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCollege, setNewCollege] = useState({
    name: '',
    location: '',
    totalTeachers: '',
    totalStudents: '',
    plan: 'college',
  });

  useEffect(() => {
    async function loadColleges() {
      try {
        setLoading(true);
        const data = await getColleges();
        setColleges(data);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      } finally {
        setLoading(false);
      }
    }
    loadColleges();
  }, []);

  const handleAddCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const addedId = await addCollege({
        name: newCollege.name,
        location: newCollege.location,
        totalTeachers: parseInt(newCollege.totalTeachers) || 0,
        totalStudents: parseInt(newCollege.totalStudents) || 0,
        plan: newCollege.plan as 'free' | 'college' | 'enterprise',
      });

      const newlyAddedCollege: College = {
        id: addedId,
        name: newCollege.name,
        location: newCollege.location,
        totalTeachers: parseInt(newCollege.totalTeachers) || 0,
        totalStudents: parseInt(newCollege.totalStudents) || 0,
        joinDate: new Date().toISOString().split('T')[0],
        plan: newCollege.plan as 'free' | 'college' | 'enterprise',
        status: 'active',
      };

      setColleges(prev => [newlyAddedCollege, ...prev]);
      setIsAddModalOpen(false);
      setNewCollege({
        name: '',
        location: '',
        totalTeachers: '',
        totalStudents: '',
        plan: 'college',
      });
    } catch (error) {
      console.error('Error adding college:', error);
      alert('Failed to register college. Please try again.');
    }
  };

  const filteredColleges = colleges.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout title="Institutional Partners" subtitle="Loading list...">
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Institutional Partners" subtitle="Manage registered colleges, universities, and schools">
      <div className="space-y-6">
        {/* Controls */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-80 relative">
            <Input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 rounded-2xl"
            />
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <Button 
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus size={16} />}
            className="rounded-2xl w-full md:w-auto"
          >
            Add New Institution
          </Button>
        </div>

        {/* Institution Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card hover:shadow-card-hover hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Building size={22} />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                    c.plan === 'enterprise' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400' :
                    c.plan === 'college' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {c.plan}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 dark:text-white leading-snug mb-1 font-sans">{c.name}</h3>
                
                <p className="flex items-center gap-1 text-xs text-slate-400 mb-6">
                  <MapPin size={12} />
                  {c.location}
                </p>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4 mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Teachers</span>
                    <p className="font-black text-slate-700 dark:text-slate-300 text-sm mt-0.5">{c.totalTeachers}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Students</span>
                    <p className="font-black text-slate-700 dark:text-slate-300 text-sm mt-0.5">{c.totalStudents.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-sans">
                  <Calendar size={12} />
                  Joined {new Date(c.joinDate).toLocaleDateString()}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Active
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add College Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Institutional Partner"
      >
        <form onSubmit={handleAddCollege} className="space-y-4">
          <Input
            label="Institution Name"
            type="text"
            placeholder="e.g. Stanford University"
            value={newCollege.name}
            onChange={e => setNewCollege(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            label="Location"
            type="text"
            placeholder="e.g. Stanford, California"
            value={newCollege.location}
            onChange={e => setNewCollege(prev => ({ ...prev, location: e.target.value }))}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Staff Count"
              type="number"
              placeholder="e.g. 50"
              value={newCollege.totalTeachers}
              onChange={e => setNewCollege(prev => ({ ...prev, totalTeachers: e.target.value }))}
              required
            />
            <Input
              label="Student Count"
              type="number"
              placeholder="e.g. 1500"
              value={newCollege.totalStudents}
              onChange={e => setNewCollege(prev => ({ ...prev, totalStudents: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Subscription Plan
            </label>
            <select
              value={newCollege.plan}
              onChange={e => setNewCollege(prev => ({ ...prev, plan: e.target.value }))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            >
              <option value="free">Free Trial</option>
              <option value="college">College Core</option>
              <option value="enterprise">Enterprise Custom</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit">
              Register Institution
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
