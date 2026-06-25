import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserProfile, createUserProfile, seedDatabase } from '../services/dbService';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  loginWithGoogle: (role: UserRole) => Promise<boolean>;
  registerUser: (email: string, password: string, name: string, role: UserRole, extra?: any) => Promise<boolean>;
  completeOnboarding: (role: UserRole, collegeId: string, collegeName: string, extra?: any) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Seed database and set auth listener
  useEffect(() => {
    let unsubscribe = () => {};
    
    async function init() {
      // Seed mock data into Firestore if database is empty
      await seedDatabase();

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        setIsLoading(true);
        if (firebaseUser) {
          try {
            const profile = await getUserProfile(firebaseUser.uid);
            if (profile) {
              setUser(profile);
            } else {
              // If Firebase Auth user exists but profile document doesn't,
              // fallback to session storage or create temporary profile
              const tempUser: User = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                email: firebaseUser.email || '',
                role: 'student',
                collegeId: '', // Empty means they need onboarding
                joinDate: new Date().toISOString().split('T')[0]
              };
              setUser(tempUser);
            }
          } catch (e) {
            console.error('Error fetching auth profile:', e);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });
    }

    init();

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      let firebaseUser;
      try {
        const credentials = await signInWithEmailAndPassword(auth, email, password);
        firebaseUser = credentials.user;
      } catch (signInError: any) {
        // If user is not found, auto-create account for demo purposes
        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
          try {
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            firebaseUser = credentials.user;
            
            // Create user profile in Firestore
            await createUserProfile(firebaseUser.uid, {
              id: firebaseUser.uid,
              name: email.split('@')[0].replace('.', ' '),
              email,
              role,
              college: 'MIT College of Engineering',
              collegeId: 'c1', // Seed default college for seamless demo
              joinDate: new Date().toISOString().split('T')[0]
            });
          } catch (signUpError) {
            console.error('Auto sign up error:', signUpError);
            setIsLoading(false);
            return false;
          }
        } else {
          console.error('Sign in error:', signInError);
          setIsLoading(false);
          return false;
        }
      }

      if (firebaseUser) {
        // Fetch profile details
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) {
          // Check if role matches selected portal. Reject if mismatch.
          if (profile.role !== role) {
            console.warn(`Role mismatch: Expected ${role}, but user is registered as ${profile.role}`);
            setIsLoading(false);
            return false;
          }
          setUser(profile);
          setIsLoading(false);
          return true;
        }
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Global login process error:', error);
      setIsLoading(false);
      return false;
    }
  }, []);

  const registerUser = useCallback(async (email: string, password: string, name: string, role: UserRole, extra?: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = credentials.user;
      if (firebaseUser) {
        const profilePayload: Partial<User> = {
          id: firebaseUser.uid,
          name,
          email,
          role,
          joinDate: new Date().toISOString().split('T')[0],
          ...extra
        };
        await createUserProfile(firebaseUser.uid, profilePayload);
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  }, []);

  const loginWithGoogle = useCallback(async (role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const credentials = await signInWithPopup(auth, provider);
      const firebaseUser = credentials.user;
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) {
          // Reject if role doesn't match selected portal
          if (profile.role !== role) {
            setIsLoading(false);
            throw new Error(`Your Google account is registered as a ${profile.role.toUpperCase()}. Please sign in using the correct portal.`);
          }
          setUser(profile);
        } else {
          // New User: Create temporary session pointing to Onboarding
          const tempUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || '',
            role,
            collegeId: '', // Force Onboarding Page
            joinDate: new Date().toISOString().split('T')[0]
          };
          setUser(tempUser);
        }
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const completeOnboarding = useCallback(async (role: UserRole, collegeId: string, collegeName: string, extra?: any): Promise<boolean> => {
    if (!user) return false;
    setIsLoading(true);
    try {
      const profilePayload: Partial<User> = {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
        college: collegeName,
        collegeId,
        joinDate: new Date().toISOString().split('T')[0],
        ...extra
      };
      await createUserProfile(user.id, profilePayload);
      
      // Reload profile
      const updatedProfile = await getUserProfile(user.id);
      if (updatedProfile) {
        setUser(updatedProfile);
      }
      setIsLoading(false);
      return true;
    } catch (e) {
      console.error('Error completing onboarding:', e);
      setIsLoading(false);
      return false;
    }
  }, [user]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (e) {
      console.error('Logout error:', e);
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, registerUser, completeOnboarding, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
