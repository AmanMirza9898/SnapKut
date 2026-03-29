"use client";

import React, { useState } from 'react';
import { 
  X, 
  Instagram, 
  Send, 
  MessageCircle, 
  Facebook, 
  User, 
  AtSign,
  Plus,
  Camera,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { addShortcut } from '@/app/actions/addShortcut';

const PLATFORMS = [
  { id: 'instagram', icon: Instagram, label: 'INSTAGRAM' },
  { id: 'telegram', icon: Send, label: 'TELEGRAM' },
  { id: 'whatsapp', icon: MessageCircle, label: 'WHATSAPP' },
  { id: 'facebook', icon: Facebook, label: 'FACEBOOK' },
];

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddAccountModal({ isOpen, onClose, onSuccess }: AddAccountModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const result = await addShortcut(selectedPlatform, username);
      if (result.success) {
        onSuccess();
        onClose();
        setUsername('');
      } else {
        alert(result.error);
      }
    } catch (error) {
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-3xl transition-all" 
        onClick={onClose}
      />
      
      {/* Modal Card - V5 Black Panel Style */}
      <div className="relative w-full max-w-md bg-black border border-white/10 rounded-[48px] p-10 shadow-[0_40px_100px_rgba(0,0,0,1)] animate-in fade-in zoom-in slide-in-from-bottom-10 duration-500">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
           <div className="w-10 h-1" /> {/* Layout Spacer */}
           <h2 className="text-2xl font-black text-white tracking-[0.2em] uppercase text-center">Add Account</h2>
           <button 
             onClick={onClose}
             className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:rotate-90"
           >
             <X size={20} className="text-white/40" />
           </button>
        </div>

        {/* Platform Horizontal Icons Selector */}
        <div className="flex justify-between items-center mb-12 px-2">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            const isSelected = selectedPlatform === platform.id;
            
            return (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className="flex flex-col items-center gap-4 group flex-1"
              >
                <div className={cn(
                  "w-16 h-16 rounded-[22px] flex items-center justify-center transition-all duration-500 relative",
                  isSelected 
                    ? "bg-[#39FF14]/20 border-2 border-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.5)] scale-110" 
                    : "bg-white/5 border border-white/10 group-hover:bg-white/10 hover:scale-105"
                )}>
                   <Icon size={26} className={isSelected ? "text-[#39FF14]" : "text-white/30 transition-colors"} strokeWidth={isSelected ? 3 : 2} />
                   
                   {/* Selected Dot / Marker */}
                   {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#39FF14] rounded-full border-2 border-black flex items-center justify-center">
                         <Check size={10} strokeWidth={4} className="text-black" />
                      </div>
                   )}
                </div>
                <span className={cn(
                  "text-[9px] font-black tracking-widest transition-all",
                  isSelected ? "text-[#39FF14] opacity-100" : "text-white/20 opacity-50"
                )}>
                  {platform.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Interface Form */}
        <div className="space-y-10">
           <div className="text-center">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Connect Unlimited Accounts</p>
              
              <div className="relative group">
                 {/* Decorative Input Inner Icons */}
                 <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#39FF14] transition-all">
                    <AtSign size={20} />
                 </div>

                 <input 
                   type="text"
                   placeholder="@aman_me Sync (Upcoming@)"
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   className={cn(
                     "w-full h-20 bg-white/5 border-2 rounded-[28px] px-16 text-white font-black placeholder:text-white/10 focus:outline-none transition-all text-lg tracking-wide",
                     username ? "border-[#39FF14]/40 bg-white/10" : "border-white/5 focus:border-[#39FF14]/20"
                   )}
                 />

                 {/* Focus Indicator / Glow Dot */}
                 <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    <div className={cn(
                      "w-3 h-3 rounded-full transition-all duration-500",
                      username ? "bg-[#39FF14] shadow-[0_0_12px_#39FF14] scale-125" : "bg-white/10"
                    )} />
                 </div>
              </div>
           </div>

           <p className="text-center text-[10px] uppercase font-black text-white/20 tracking-widest leading-relaxed">
             Paste Username, We Generate the <br/>
             <span className="text-[#39FF14]/60 tracking-[0.4em]">Deep Link Mode</span>
           </p>

           <button 
             disabled={loading || !username}
             onClick={handleSave}
             className={cn(
               "w-full h-20 bg-[#39FF14] rounded-[28px] flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_15px_40px_rgba(57,255,20,0.3)] disabled:opacity-30 disabled:grayscale",
               loading && "animate-pulse"
             )}
           >
              <span className="text-black font-black text-lg tracking-[0.2em] uppercase">
                {loading ? 'Generating...' : 'Save Shortcut'}
              </span>
              <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                 <ArrowUpRight size={20} className="text-black" strokeWidth={3} />
              </div>
           </button>
        </div>
      </div>
    </div>
  );
}

function ArrowUpRight({ className, size, strokeWidth }: { className?: string, size?: number, strokeWidth?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth || 2} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
    </svg>
  );
}
