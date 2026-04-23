/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, Camera, Calendar, Users, Sprout, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div className="-mx-6 -mt-6 bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 overflow-hidden bg-agro-forest">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2070&auto=format&fit=crop" 
            alt="Agriculteur travaillant au lever du soleil" 
            className="w-full h-full object-cover opacity-60 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-agro-forest via-transparent to-agro-forest/40" />
        </div>

        <div className="relative z-10 space-y-8 py-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20"
          >
            <span className="w-2 h-2 rounded-full bg-agro-lime animate-pulse" />
            <span className="text-white text-xs font-bold uppercase tracking-wider">Innovation Agricole Durable</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-display font-medium text-white leading-[0.9] tracking-tight max-w-[12ch]"
          >
            Amener l'Innovation à votre <span className="italic">Parcours Agricole.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-base max-w-xs leading-relaxed"
          >
            De l'agriculture de précision aux pratiques durables, nous vous aidons à cultiver plus intelligemment et plus sereinement.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/diagnosis" className="agro-button-primary">
              Analyser <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats and Info Section */}
      <section className="p-6 space-y-12 bg-white rounded-t-[3rem] -mt-12 relative z-20 shadow-2xl">
        <div className="flex flex-wrap gap-2">
          {['À propos', 'Parcours', 'Vision', 'Mission'].map((tab) => (
            <button key={tab} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${tab === 'À propos' ? 'bg-agro-lime text-agro-forest border-agro-lime' : 'bg-white text-agro-forest/60 border-agro-clay/20'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-agro-forest" />
            <span className="text-[10px] font-bold uppercase text-agro-forest/40">Qui sommes-nous ?</span>
          </div>
          <h3 className="text-3xl font-display font-medium leading-tight">
            Engagés pour aider les agriculteurs à <span className="text-agro-earth">cultiver plus intelligemment</span> et obtenir de meilleurs rendements.
          </h3>
          <p className="text-sm text-agro-forest/60 leading-relaxed">
            En combinant technologie et durabilité, nous donnons aux agriculteurs les moyens d'augmenter leur productivité, de réduire les pertes et de contribuer à une terre plus saine.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-agro-sand/30 rounded-3xl p-6 space-y-4 relative overflow-hidden group border border-agro-clay/10">
            <div className="flex justify-between items-start">
              <div className="bg-white p-3 rounded-2xl shadow-sm">
                <CheckCircle2 className="text-agro-forest" size={24} />
              </div>
              <button className="bg-agro-forest text-white p-2 rounded-full group-hover:rotate-45 transition-transform">
                <ArrowUpRight size={20} />
              </button>
            </div>
            <div className="space-y-1">
              <span className="text-4xl font-display font-bold">10+</span>
              <h4 className="font-bold">Années d'Expérience</h4>
              <p className="text-xs text-agro-forest/50 leading-relaxed">
                Une décennie passée à innover dans le secteur agricole ouest-africain.
              </p>
            </div>
          </div>

          <div className="bg-agro-lime rounded-3xl p-6 space-y-4 relative overflow-hidden group border border-agro-forest/5">
            <div className="flex justify-between items-start">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Users className="text-agro-forest" size={24} />
              </div>
              <button className="bg-agro-forest text-white p-2 rounded-full group-hover:rotate-45 transition-transform">
                <ArrowUpRight size={20} />
              </button>
            </div>
            <div className="space-y-1 text-agro-forest">
              <span className="text-4xl font-display font-bold">85%</span>
              <h4 className="font-bold">Satisfaction Client</h4>
              <p className="text-xs text-agro-forest/70 leading-relaxed">
                Nos utilisateurs nous font confiance pour obtenir des diagnostics précis.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

