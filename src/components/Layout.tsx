import React from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export default function Layout({ children, sidebar, rightPanel }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white overflow-hidden flex flex-col">
      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {sidebar && (
          <aside className="w-64 border-r border-white/10 bg-[#0b1f3a]/50 backdrop-blur-xl">
            {sidebar}
          </aside>
        )}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
        {rightPanel && (
          <aside className="w-96 border-l border-white/10 bg-[#0b1f3a]/50 backdrop-blur-xl">
            {rightPanel}
          </aside>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 pb-24">
          {children}
        </main>
        {/* Mobile Bottom Nav would go here */}
      </div>
    </div>
  );
}
