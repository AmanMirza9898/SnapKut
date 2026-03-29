"use client";

import React from 'react';
import { 
  X, 
  House, 
  Instagram, 
  Send, 
  MessageCircle, 
  Facebook,
  Plus,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MENU_ITEMS = [
  { id: 'home', label: 'Home', icon: LayoutDashboard },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'telegram', label: 'Telegram', icon: Send },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'messenger', label: 'Messenger', icon: Facebook },
];

interface SidebarProps {
  isOpen: boolean;    // For mobile drawer mode
  activeId: string;
  onClose: () => void;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export default function Sidebar({ isOpen, activeId, onClose, onSelect, onAdd }: SidebarProps) {
  const content = (
    <div className="flex flex-col h-full glass border-r border-white/5 p-6 animate-in slide-in-from-left duration-300">
      {/* Header / Logo */}
      <div className="flex items-center justify-between mb-12">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#39FF14] flex items-center justify-center text-black shadow-[0_0_20px_#39FF14]">
               <span className="font-black text-lg">S</span>
            </div>
            <div className="flex flex-col">
               <span className="font-black text-white tracking-widest text-lg uppercase">SnapKut</span>
               <span className="text-[10px] font-bold text-[#39FF14] tracking-tighter uppercase opacity-50">Inbox Mode V5</span>
            </div>
         </div>
         <button onClick={onClose} className="lg:hidden p-2 text-white/40 hover:text-white transition-colors">
            <X size={24} />
         </button>
      </div>

      {/* Primary Connect Button */}
      <button 
        onClick={onAdd}
        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 mb-10 hover:bg-white/10 transition-all group active:scale-95"
      >
         <div className="w-8 h-8 rounded-full bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14] group-hover:scale-110 transition-transform">
            <Plus size={18} strokeWidth={3} />
         </div>
         <span className="font-bold text-white/80 group-hover:text-white transition-colors">Connect Service</span>
      </button>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-3">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all relative group",
                isActive 
                  ? "bg-[#39FF14]/10 border border-[#39FF14]/30" 
                  : "hover:bg-white/5 border border-transparent"
              )}
            >
              <div className={cn(
                "transition-all duration-300 p-2 rounded-xl",
                isActive ? "bg-[#39FF14] text-black shadow-[0_0_10px_#39FF14]" : "text-white/40 group-hover:text-white group-hover:bg-white/5"
              )}>
                <Icon size={20} strokeWidth={isActive ? 3 : 2} />
              </div>
              <span className={cn(
                "font-bold text-sm tracking-widest uppercase transition-all",
                isActive ? "text-[#39FF14]" : "text-white/40 group-hover:text-white"
              )}>
                {item.label}
              </span>

              {isActive && (
                 <div className="ml-auto w-1.5 h-10 rounded-full bg-[#39FF14] shadow-[0_0_15px_#39FF14] absolute right-4 top-1/2 -translate-y-1/2 opacity-20" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Account */}
      <div className="pt-6 border-t border-white/5 flex items-center gap-4 group cursor-pointer">
         <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#39FF14]/30 transition-all overflow-hidden relative">
            <div className="w-full h-full bg-gradient-to-br from-[#39FF14]/10 to-transparent absolute inset-0" />
            <span className="text-white/40 font-black text-xs relative">AM</span>
         </div>
         <div className="flex flex-col">
            <span className="text-white text-xs font-black uppercase tracking-wider group-hover:text-[#39FF14] transition-colors">Aman Mirza</span>
            <span className="text-[#39FF14]/40 text-[9px] font-bold uppercase tracking-tighter">System Root</span>
         </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[100] lg:hidden animate-in fade-in duration-300" 
          onClick={onClose}
        />
      )}

      {/* Permanent Desktop Sidebar */}
      <aside className="hidden lg:block w-80 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile Drawer */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-80 h-full z-[101] lg:hidden transition-all duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {content}
      </aside>
    </>
  );
}
