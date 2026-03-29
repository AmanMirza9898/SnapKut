"use client";

import React, { Suspense } from 'react';
import { 
  Instagram, 
  Send, 
  MessageCircle, 
  Facebook, 
  CheckCircle2, 
  LayoutDashboard, 
  Zap,
  ArrowRight,
  Sparkle
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const PLATFORM_THEMES: any = {
  home: {
    title: "SnapKut Hub",
    icon: LayoutDashboard,
    brandColor: "#ffffff", 
    glow: "rgba(255, 255, 255, 0.05)",
    cta: "Secure Remote Access Active",
    description: "Your centralized communication remote. Tap any sidebar icon to jump directly into your inboxes."
  },
  instagram: {
    title: "Instagram DM",
    icon: Instagram,
    brandColor: "#E1306C",
    glow: "rgba(225, 48, 108, 0.3)",
    cta: "Open Insta DM Inbox",
    deepLink: "instagram://direct_inbox",
    description: "Verified Instagram bridge. Jump straight to direct message threads."
  },
  telegram: {
    title: "Telegram Chat",
    icon: Send,
    brandColor: "#0088cc",
    glow: "rgba(0, 136, 204, 0.3)",
    cta: "Open Tele DM Inbox",
    deepLink: "tg://",
    description: "Cloud-sync active. Access encrypted Telegram message streams."
  },
  whatsapp: {
    title: "WhatsApp",
    icon: MessageCircle,
    brandColor: "#25D366",
    glow: "rgba(37, 211, 102, 0.3)",
    cta: "Open WA Messages",
    deepLink: "whatsapp://",
    description: "WhatsApp business bridge. Direct access to your inbox threads."
  },
  messenger: {
    title: "Messenger",
    icon: Facebook,
    brandColor: "#0084FF",
    glow: "rgba(0, 132, 255, 0.3)",
    cta: "Open FB Inbox",
    deepLink: "fb-messenger://threads",
    description: "Cross-platform Messenger link. Unified threads ready."
  }
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const activePlatform = searchParams.get('platform') || 'home';
  const data = PLATFORM_THEMES[activePlatform] || PLATFORM_THEMES.home;
  const Icon = data.icon;

  const handleOpenInbox = () => {
    if (data.deepLink) {
       window.location.href = data.deepLink;
    }
  };

  return (
    <div key={activePlatform} className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in-95 duration-700">
      
      {/* Title / Greeting */}
      <div className="text-center space-y-4 mb-20 px-6">
         <div 
           className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border transition-all duration-700"
           style={{ backgroundColor: `${data.brandColor}10`, borderColor: `${data.brandColor}30` }}
         >
            <Sparkle size={14} style={{ color: data.brandColor }} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: data.brandColor }}>
               System Control Mode: {activePlatform.toUpperCase()}
            </span>
         </div>
         <h2 className="text-5xl lg:text-8xl font-black text-white tracking-widest uppercase flex flex-col items-center gap-2 drop-shadow-[0_0_30px_rgba(0,0,0,1)]">
           <span transition-all duration-700 style={{ color: data.brandColor }}>{data.title.split(' ')[0]}</span>
           <span className="opacity-80">{data.title.split(' ').slice(1).join(' ')}</span>
         </h2>
         <p className="text-white/20 font-bold uppercase tracking-[0.2em] text-[11px] max-w-lg mx-auto leading-relaxed border-t border-white/5 pt-6 mt-6">
           {data.description}
         </p>
      </div>

      {/* Main Remote Action Card */}
      <div className="relative w-full max-w-md group mb-16 px-6 sm:px-0">
         {/* Adaptive Glow */}
         <div 
           className="absolute inset-0 blur-[100px] rounded-full transition-all duration-1000 opacity-20 pointer-events-none group-hover:opacity-40" 
           style={{ backgroundColor: data.brandColor }}
         />
         
         <div 
           onClick={handleOpenInbox}
           className={cn(
             "relative h-[360px] bg-black border-[3px] rounded-[60px] flex flex-col items-center justify-center p-12 transition-all duration-700 cursor-pointer overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,1)]",
             "hover:scale-[1.05] active:scale-95"
           )}
           style={{ borderColor: activePlatform === 'home' ? 'rgba(255,255,255,0.05)' : `${data.brandColor}60` }}
         >
            {/* Top Light Ray */}
            <div 
              className="absolute inset-x-0 top-0 h-1 transition-all duration-700 blur-[8px]" 
              style={{ backgroundColor: data.brandColor, opacity: activePlatform === 'home' ? 0 : 0.6 }}
            />

            {/* Platform Icon Wrapper */}
            <div className={cn(
              "w-28 h-28 rounded-[38px] flex items-center justify-center transition-all duration-500 mb-10 relative",
              activePlatform !== 'home' ? "text-black" : "bg-white/5 text-white/20"
            )}
            style={{ backgroundColor: activePlatform === 'home' ? 'transparent' : data.brandColor, boxShadow: activePlatform === 'home' ? 'none' : `0 0 50px ${data.brandColor}50` }}
            >
               <Icon size={56} strokeWidth={3} className="relative z-10" />
               {activePlatform !== 'home' && (
                  <div className="absolute inset-0 rounded-[38px] blur-2xl opacity-40 animate-pulse" style={{ backgroundColor: data.brandColor }} />
               )}
            </div>

            <div className="text-center space-y-4">
               <h3 className="text-3xl font-black text-white tracking-widest uppercase flex items-center gap-4">
                 {activePlatform === 'home' ? 'Remote Active' : data.cta.split(' ').slice(1).join(' ')}
                 <ArrowRight size={24} style={{ color: data.brandColor }} className="group-hover:translate-x-3 transition-transform duration-500" />
               </h3>
               <div className="flex items-center justify-center">
                  <div 
                    className="px-4 py-1.5 rounded-xl border flex items-center gap-2 transition-all duration-700"
                    style={{ backgroundColor: `${data.brandColor}10`, borderColor: `${data.brandColor}30` }}
                  >
                     <Zap size={14} fill={data.brandColor} style={{ color: data.brandColor }} className="animate-bounce" />
                     <span className="font-black text-[10px] uppercase tracking-[0.2em]" style={{ color: data.brandColor }}>Verified Native Link 5.0</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Dynamic Status Banner */}
      <div 
        className="w-full max-w-sm h-20 rounded-[30px] flex items-center p-6 gap-6 transition-all duration-700 border"
        style={{ backgroundColor: `${data.brandColor}05`, borderColor: `${data.brandColor}15` }}
      >
         <div className="p-2 rounded-2xl transition-all duration-700 border" style={{ backgroundColor: `${data.brandColor}15`, borderColor: `${data.brandColor}30` }}>
            <CheckCircle2 size={24} strokeWidth={4} style={{ color: data.brandColor }} />
         </div>
         <div className="flex flex-col">
            <span className="font-black text-white tracking-widest uppercase text-xs opacity-90">All Services Connected</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: data.brandColor }}>Direct Bridge Active</span>
         </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#121212]"><div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
