import React, { useState, useEffect } from "react";
import { Users, Building2, FileCheck2, ShieldAlert, Search } from "lucide-react";
import { supabase } from "../../lib/supabase";

const DashboardSkeleton = () => (
  <div className="w-full animate-pulse space-y-8">
    <div className="flex justify-end mb-8">
      <div className="w-64 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-[1.75rem]" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 h-64 bg-gray-200 dark:bg-gray-800 rounded-[2rem]" />
      <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-[2rem]" />
    </div>
  </div>
);

export const AdminDashboardOverview: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [pendingKyc, setPendingKyc] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetching data from Supabase
        const { data: logs } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(5);
        const { data: kyc } = await supabase.from('kyc_requests').select('*').eq('status', 'pending');
        const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
        const { count: agencyCount } = await supabase.from('agencies').select('*', { count: 'exact', head: true });
        
        setRecentLogs(logs || []);
        setPendingKyc(kyc || []);
        
        setStats([
          { title: "Total System Users", value: (userCount || 0).toString(), change: "Active", icon: Users, desc: "Registered accounts" },
          { title: "Corporate Agencies", value: (agencyCount || 0).toString(), change: "Active", icon: Building2, desc: "Business tenants" },
          { title: "KYC Compliance Queue", value: (kyc?.length || 0).toString(), change: "Pending", icon: FileCheck2, desc: "Awaiting authorization" },
          { title: "Security Incidents", value: "0", change: "Stable", icon: ShieldAlert, desc: "System alerts" }
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredLogs = recentLogs.filter((log) => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="w-full font-sans text-[#141414] dark:text-gray-100">
      <div className="flex justify-end gap-4 mb-8">
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search audit trail logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-4 py-2.5 w-full bg-white dark:bg-[#141414] border border-neutral-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => {
          const IconComponent = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-[#141414] p-6 rounded-[1.75rem] border border-neutral-200 dark:border-gray-800 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-11 h-11 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black">
                  <IconComponent size={20} />
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{stat.change}</span>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase">{stat.title}</p>
              <h3 className="font-display text-3xl font-bold mt-1">{stat.value}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-[#141414] rounded-[2rem] border border-neutral-200 dark:border-gray-800 p-8">
          <h2 className="text-lg font-bold mb-6">KYC Verification Approvals</h2>
          <div className="space-y-4">
            {pendingKyc.length > 0 ? pendingKyc.map((kyc) => (
              <div key={kyc.id} className="p-4 rounded-2xl border border-neutral-100 dark:border-gray-700 bg-neutral-50 dark:bg-[#1A1A1A] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">{kyc.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{kyc.submitted_at}</p>
                </div>
                <button className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-medium">Authorize</button>
              </div>
            )) : <p className="text-sm text-gray-400">No pending requests.</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-[#141414] rounded-[2rem] border border-neutral-200 dark:border-gray-800 p-8">
          <h2 className="text-lg font-bold mb-6">Security Audit Logs</h2>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border-b border-neutral-100 dark:border-gray-700 pb-3">
                <p className="text-xs font-semibold">{log.action}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{log.target} • {log.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};