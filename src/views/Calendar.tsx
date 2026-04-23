/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Sprout, Loader2, Info } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { PlantingCalendar } from '../types';

export default function CalendarView() {
  const [crop, setCrop] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [calendar, setCalendar] = useState<PlantingCalendar | null>(null);

  const generateCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop || !region) return;
    setLoading(true);
    try {
      const data = await geminiService.generateCalendar(crop, region);
      setCalendar(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-display font-bold">Calendrier de semis</h2>
        <p className="text-agro-forest/60 text-sm">Organisez votre saison agricole selon votre culture et votre climat.</p>
      </header>

      {!calendar && !loading && (
        <form onSubmit={generateCalendar} className="agro-card space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-agro-forest/50 flex items-center gap-1">
              <Sprout size={14} /> Culture
            </label>
            <input 
              type="text" 
              placeholder="Ex: Maïs, Manioc, Café..." 
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-agro-sand/50 border border-agro-clay/30 p-3 rounded-xl focus:ring-2 focus:ring-agro-emerald focus:outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-agro-forest/50 flex items-center gap-1">
              <MapPin size={14} /> Région / Ville
            </label>
            <input 
              type="text" 
              placeholder="Ex: Région de Kayes, Bouaké..." 
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-agro-sand/50 border border-agro-clay/30 p-3 rounded-xl focus:ring-2 focus:ring-agro-emerald focus:outline-none"
              required
            />
          </div>

          <button type="submit" className="agro-button-primary w-full">
            Générer mon calendrier
          </button>
        </form>
      )}

      {loading && (
        <div className="agro-card flex flex-col items-center justify-center py-12 space-y-4 text-center">
          <div className="relative">
            <CalendarIcon className="text-agro-forest/10" size={80} />
            <Loader2 className="absolute inset-0 m-auto animate-spin text-agro-forest" size={32} />
          </div>
          <p className="text-agro-forest/60 font-medium">Création de votre calendrier personnalisé...</p>
        </div>
      )}

      {calendar && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-bold text-lg">{calendar.crop}</h3>
              <p className="text-xs text-agro-forest/60 flex items-center gap-1">
                <MapPin size={12} /> {calendar.region}
              </p>
            </div>
            <button 
              onClick={() => setCalendar(null)}
              className="text-agro-earth text-sm font-bold underline"
            >
              Modifier
            </button>
          </div>

          <div className="space-y-4">
            {calendar.steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 group">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-agro-forest text-white flex items-center justify-center text-xs font-bold border-4 border-white shadow-sm z-10 group-first:bg-agro-earth">
                    {idx + 1}
                  </div>
                  {idx !== calendar.steps.length - 1 && (
                    <div className="w-0.5 h-full bg-agro-forest/10 -mt-1 mb-2" />
                  )}
                </div>
                <div className="agro-card p-4 flex-1 space-y-2 mb-2 group-hover:border-agro-emerald transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-agro-earth font-bold text-sm uppercase">{step.month}</span>
                    <span className="bg-agro-forest/5 px-2 py-1 rounded-md text-[10px] font-bold text-agro-forest underline">
                      {step.action}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-agro-forest/80">
                    {step.advice}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="agro-card bg-agro-emerald/5 border-agro-emerald/20 flex gap-3 p-4">
            <Info className="text-agro-emerald shrink-0" size={20} />
            <p className="text-xs text-agro-emerald/70 italic">
              Note: Ce calendrier est une suggestion générée par IA. Adaptez toujours les actions aux conditions météo réelles de votre champ.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
