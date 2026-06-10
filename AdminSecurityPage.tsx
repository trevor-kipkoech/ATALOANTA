import React, { useState, useEffect } from "react";
import { Shield, Activity, ListChecks } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

export const AdminSecurityPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchSecurityData = async () => {
      setLoading(true);
      try {
        // Fetch sessions and logs from your PHP backend
        const response = await fetch('YOUR_PHP_API_ENDPOINT/get_security_data.php');
        const data = await response.json();
        
        setSessions(data.sessions || []);
        setLogs(data.logs || []);
      } catch (err) {
        console.error("Error fetching security data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSecurityData();
  }, []);

  return (
    <div className="space-y-6 relative">
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ width: "0%" }} animate={{ width: "100%" }} exit={{ opacity: 0 }}
            className="absolute top-0 left-0 h-1 bg-black dark:bg-white z-50 rounded-full"
          />
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: loading ? 0 : 1, y: loading ? 10 : 0 }}
        className="space-y-6"
      >
        <div className="bg-white dark:bg-[#141414] p-6 rounded-2xl border border-neutral-200/60 dark:border-gray-800 shadow-sm">
          <h1 className="text-xl font-bold text-[#141414] dark:text-white flex items-center gap-2">
            <Shield size={20} /> System Security
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Monitor system access, audit logs, and security protocols.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Sessions */}
          <div className="bg-white dark:bg-[#141414] p-6 rounded-2xl border border-neutral-200/60 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-emerald-500" /> Active Sessions
            </h3>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-[#0A0A0A]">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{session.user_name}</span>
                  <span className="text-xs text-gray-500">{session.ip_address}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white dark:bg-[#141414] p-6 rounded-2xl border border-neutral-200/60 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <ListChecks size={18} className="text-blue-500" /> Recent Audit Logs
            </h3>
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="border-b border-gray-100 dark:border-gray-800 pb-2">
                  <p className="text-sm text-gray-800 dark:text-gray-200">{log.action}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">{log.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};