/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export default function Diagnosis() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startDiagnosis = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const base64 = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      const diagnosis = await geminiService.diagnosePlant(base64, mimeType);
      setResult(diagnosis || "Désolé, je n'ai pas pu analyser cette photo.");
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'analyse. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-display font-bold">Diagnostic par IA</h2>
        <p className="text-agro-forest/60 text-sm">Prenez une photo claire des feuilles ou de la plante malade.</p>
      </header>

      <div className="space-y-4">
        <div className="agro-card p-0 overflow-hidden bg-agro-forest/5 border-dashed border-2 border-agro-clay/40 relative aspect-video flex items-center justify-center">
          {image ? (
            <img src={image} alt="Plante à diagnostiquer" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center space-y-2 p-6">
              <Camera className="mx-auto text-agro-forest/20" size={48} />
              <p className="text-xs text-agro-forest/40">Aucune image sélectionnée</p>
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 bg-agro-sand/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-2">
              <Loader2 className="animate-spin text-agro-forest" size={32} />
              <p className="text-sm font-bold animate-pulse text-agro-forest">Analyse en cours...</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="agro-button-secondary flex-1"
          >
            <ImageIcon size={20} />
            Galerie
          </button>
          <button 
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.capture = 'environment';
                fileInputRef.current.click();
              }
            }}
            className="agro-button-secondary flex-1"
          >
            <Camera size={20} />
            Photo
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {image && !loading && !result && (
          <button 
            onClick={startDiagnosis}
            className="agro-button-primary w-full shadow-lg shadow-agro-forest/20"
          >
            <Sparkles size={20} />
            Lancer l'analyse AI
          </button>
        )}

        {error && (
          <div className="agro-card bg-red-50 border-red-200 flex gap-3 text-red-600 p-4">
            <AlertCircle className="shrink-0" size={20} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="agro-card space-y-4"
          >
            <div className="flex items-center gap-2 text-agro-emerald">
              <Sparkles size={20} />
              <h3 className="font-bold">Résultat de l'analyse</h3>
            </div>
            <div className="markdown-body">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
            <button 
              onClick={() => { setImage(null); setResult(null); }}
              className="text-agro-forest/40 text-xs w-full text-center hover:text-agro-forest underline"
            >
              Nouveau diagnostic
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
