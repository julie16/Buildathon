/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp,
  doc,
  updateDoc,
  increment,
  getDocFromServer
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

let db: any = null;
let auth: any = null;

// Lazy initialization
async function getFirebase() {
  if (db && auth) return { db, auth };
  
  try {
    const configModule = await import('../../firebase-applet-config.json');
    const firebaseConfig = configModule.default;
    
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
    
    // Auth anonymously for this simple forum (no full account needed yet)
    await signInAnonymously(auth);
    
    // Test connection
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (e) {
      console.warn("Firebase connected but test document failed (expected if rules are strict).");
    }
    
    return { db, auth };
  } catch (error) {
    console.error("Firebase not initialized. Ensure terms are accepted and config exists.", error);
    return null;
  }
}

export const firebaseService = {
  subscribeToPosts(callback: (posts: any[]) => void) {
    let unsubscribe = () => {};
    
    getFirebase().then(fb => {
      if (!fb) return;
      const q = query(collection(fb.db, 'posts'), orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(posts);
      }, (err) => {
        console.error("Subscription error:", err);
      });
    });
    
    return () => unsubscribe();
  },

  async createPost(title: string, content: string, author: string) {
    const fb = await getFirebase();
    if (!fb || !fb.auth.currentUser) throw new Error("Firebase non configuré");
    
    return addDoc(collection(fb.db, 'posts'), {
      title,
      content,
      author,
      authorId: fb.auth.currentUser.uid,
      createdAt: Timestamp.now(),
      likes: 0,
      commentsCount: 0
    });
  },

  async likePost(postId: string) {
    const fb = await getFirebase();
    if (!fb) return;
    const postRef = doc(fb.db, 'posts', postId);
    return updateDoc(postRef, {
      likes: increment(1)
    });
  },

  subscribeToComments(postId: string, callback: (comments: any[]) => void) {
    let unsubscribe = () => {};
    
    getFirebase().then(fb => {
      if (!fb) return;
      const q = query(collection(fb.db, `posts/${postId}/comments`), orderBy('createdAt', 'asc'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const comments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(comments);
      });
    });
    
    return () => unsubscribe();
  },

  async addComment(postId: string, content: string, author: string) {
    const fb = await getFirebase();
    if (!fb || !fb.auth.currentUser) throw new Error("Firebase non configuré");
    
    const postRef = doc(fb.db, 'posts', postId);
    await updateDoc(postRef, {
      commentsCount: increment(1)
    });
    
    return addDoc(collection(fb.db, `posts/${postId}/comments`), {
      postId,
      content,
      author,
      authorId: fb.auth.currentUser.uid,
      createdAt: Timestamp.now()
    });
  }
};
