"use client";

import React, { useState, Suspense } from 'react';
import { 
  Menu, 
  Bell, 
  Settings as SettingsIcon,
  LogOut,
  User,
  Plus,
  Sparkles,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/dashboard/Sidebar';
import AddAccountModal from '@/components/dashboard/AddAccountModal';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePlatform = searchParams.get('platform') || 'home';

  const handleSelectPlatform = (id: string) => {
    router.push(`/dashboard?platform=${id}`);
    setIsSidebarOpen(false); // Close drawer on mobile
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden selection:bg-[#39FF14]/30 selection:text-white">
      {/* Background Neon Accent (Subtle) */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#39FF14]/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-[#39FF14]/5 blur-[100px] rounded-full -z-10 pointer-events-none" />

      {/* Sidebar Component (V5 Persistent/Drawer) */}
      <Sidebar 
        isOpen={isSidebarOpen}
        activeId={activePlatform}
        onClose={() => setIsSidebarOpen(false)}
        onSelect={handleSelectPlatform}
        onAdd={() => setIsAddModalOpen(true)}
      />

      {/* Add Account Modal */}
      <AddAccountModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
           router.refresh();
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]/50 relative">
        
        {/* Top Navbar - Glassmorphism Refined */}
        <header className="h-24 flex items-center justify-between px-6 lg:px-12 z-40 bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-white/5 sticky top-0">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all group"
            >
              <Menu className="text-white group-hover:text-[#39FF14] transition-colors" size={24} />
            </button>
            
            {/* Search or Meta Info */}
            <div className="hidden lg:flex items-center gap-4 px-5 h-12 rounded-2xl bg-white/5 border border-white/10 w-96 group focus-within:border-[#39FF14]/30 transition-all">
               <Search size={18} className="text-white/20 group-focus-within:text-[#39FF14] transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search or ask SnapKut AI..." 
                 className="bg-transparent border-none outline-none text-white/60 text-sm font-medium w-full placeholder:text-white/10"
               />
            </div>
          </div>

          <div className="flex items-center gap-6">
             {/* Global Add (Quick Action) */}
             <button 
               onClick={() => setIsAddModalOpen(true)}
               className="hidden sm:flex items-center gap-3 h-12 px-6 rounded-2xl bg-[#39FF14] text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] group"
             >
                <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-black text-xs uppercase tracking-widest">Connect</span>
             </button>

             {/* Profile Area */}
             <div className="flex items-center gap-4 pl-6 border-l border-white/5">
                <div className="flex flex-col items-end text-right hidden sm:flex">
                   <span className="text-xs font-black text-white tracking-widest uppercase">Root User</span>
                   <span className="text-[10px] font-bold text-[#39FF14]/60 uppercase tracking-tighter">SnapKut Pro</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-1 group hover:border-[#39FF14]/30 cursor-pointer transition-all relative overflow-hidden">
                   <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#39FF14]/20 to-transparent flex items-center justify-center">
                      <User size={20} className="text-white/40 group-hover:text-white transition-colors" />
                   </div>
                </div>
             </div>
          </div>
        </header>

        {/* Dynamic Content Switching */}
        <main className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top,_rgba(57, 255, 20, 0.03),_transparent_70%)]">
          <div className="p-4 lg:p-12 h-full">
             {children}
          </div>
        </main>
      </div>

    </div>
  );
}
