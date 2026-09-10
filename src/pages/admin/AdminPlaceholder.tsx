import { LayoutDashboard } from 'lucide-react';
export default function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-sm border border-slate-200">
      <LayoutDashboard className="h-12 w-12 text-slate-300 mb-4" />
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md text-center">This module is currently under development. Check back later for updates.</p>
    </div>
  );
}
