/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Send, User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Forum() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const unsub = firebaseService.subscribeToPosts((data) => {
      setPosts(data);
      setLoading(false);
    });
    
    // Fallback if Firebase takes too long or fails
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError(true);
      }
    }, 5000);

    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent || !authorName) return;
    
    try {
      await firebaseService.createPost(newPostTitle, newPostContent, authorName);
      setNewPostTitle('');
      setNewPostContent('');
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la publication. Vérifiez que Firebase est configuré.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-agro-forest" size={32} />
        <p className="text-agro-forest/60">Connexion à La Palabre...</p>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="agro-card flex flex-col items-center justify-center py-12 text-center space-y-4">
        <Lock className="text-agro-earth/40" size={48} />
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Configuration nécessaire</h3>
          <p className="text-sm text-agro-forest/60">
            Le forum nécessite l'activation de Firebase. Veuillez accepter les termes dans l'interface de configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-bold">La Palabre</h2>
          <p className="text-agro-forest/60 text-sm">Échangez conseils et expériences entre membres.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="agro-button-primary py-2 px-4 text-sm"
          >
            Publier
          </button>
        )}
      </header>

      {showForm && (
        <form onSubmit={handleSubmit} className="agro-card space-y-4 animate-in fade-in slide-in-from-top-4">
          <input 
            type="text" 
            placeholder="Nom ou Pseudonyme" 
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full bg-agro-sand/50 border border-agro-clay/30 p-2 rounded-xl text-sm"
            required
          />
          <input 
            type="text" 
            placeholder="Titre du sujet" 
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            className="w-full bg-agro-sand/50 border border-agro-clay/30 p-2 rounded-xl font-bold"
            required
          />
          <textarea 
            placeholder="Votre message..." 
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="w-full bg-agro-sand/50 border border-agro-clay/30 p-3 rounded-xl min-h-[100px] text-sm"
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="agro-button-primary flex-1">Envoyer</button>
            <button type="button" onClick={() => setShowForm(false)} className="agro-button-secondary py-2">Annuler</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="agro-card text-center py-12 text-agro-forest/40">
            <MessageSquare className="mx-auto mb-2 opacity-20" size={48} />
            <p>Soyez le premier à lancer une discussion !</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="agro-card p-5 space-y-4 hover:border-agro-emerald transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-xs text-agro-forest/50 font-medium">
                  <User size={12} className="text-agro-earth" />
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>
                    {post.createdAt?.toDate ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true, locale: fr }) : 'À l\'instant'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-lg leading-tight">{post.title}</h3>
                <p className="text-sm text-agro-forest/80 line-clamp-3 leading-relaxed">
                  {post.content}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-2 border-t border-agro-clay/10">
                <button 
                  onClick={() => firebaseService.likePost(post.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-agro-forest/60 hover:text-agro-earth transition-colors"
                >
                  <ThumbsUp size={16} />
                  {post.likes || 0}
                </button>
                <div className="flex items-center gap-1.5 text-xs font-bold text-agro-forest/60">
                  <MessageSquare size={16} />
                  {post.commentsCount || 0}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
