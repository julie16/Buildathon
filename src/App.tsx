/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Camera, Calendar, Users, Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Home from './views/Home';
import Diagnosis from './views/Diagnosis';
import CalendarView from './views/Calendar';
import Forum from './views/Forum';

function NavItem({ to, icon: Icon, label }: { to: string, icon: any, label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className="flex flex-col items-center gap-1 flex-1 py-1">
      <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-agro-forest text-white' : 'text-agro-forest/60'}`}>
        <Icon size={24} />
      </div>
      <span className={`text-[10px] font-medium ${isActive ? 'text-agro-forest' : 'text-agro-forest/60'}`}>
        {label}
      </span>
    </Link>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto relative overflow-x-hidden">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-agro-sand/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-2">
          <div className="bg-agro-forest p-1.5 rounded-lg text-white">
            <Sprout size={20} />
          </div>
          <h1 className="font-display italic font-bold text-xl tracking-tight">AgroConseil</h1>
        </div>
      </header>

      <main className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={useLocation().pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="p-6 mt-12 pb-32 text-center space-y-2 border-t border-agro-clay/10">
        <p className="text-[10px] uppercase font-bold tracking-widest text-agro-forest/40">
          Développé par Micrette T / 🇧🇯 pour le Buildathon 2026
        </p>
        <div className="flex justify-center gap-4 text-agro-forest/20">
          <Sprout size={16} />
          <Sprout size={16} />
          <Sprout size={16} />
        </div>
      </footer>

      <nav className="fixed bottom-6 left-6 right-6 h-18 bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-agro-clay/20 flex items-center justify-around px-2 z-50 max-w-[calc(100%-3rem)] mx-auto">

        <NavItem to="/" icon={HomeIcon} label="Accueil" />
        <NavItem to="/diagnosis" icon={Camera} label="Diagnostic" />
        <NavItem to="/calendar" icon={Calendar} label="Calendrier" />
        <NavItem to="/forum" icon={Users} label="Forum" />
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/forum" element={<Forum />} />
        </Routes>
      </Layout>
    </Router>
  );
}

