import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(async (email, password, options) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const updateMembership = useCallback(async (membershipType) => {
    if (!session?.user) return { error: new Error('Not authenticated') };

    // Update in profiles table
    const { error } = await supabase
      .from('profiles')
      .update({ membership_type: membershipType, updated_at: new Date().toISOString() })
      .eq('id', session.user.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Membership update failed',
        description: error.message || 'Something went wrong',
      });
    }

    return { error };
  }, [session?.user, toast]);

  const elevateToBoard = useCallback(async () => {
    if (!session?.user) return { error: new Error('Not authenticated') };

    // 1) Update auth user metadata
    const { error: authErr } = await supabase.auth.updateUser({
      data: { membership_type: 'board' }
    });
    if (authErr) {
      toast({ variant: 'destructive', title: 'Admin elevation failed', description: authErr.message || 'Auth metadata update failed' });
      return { error: authErr };
    }

    // 2) Update profile membership_type
    const { error: profErr } = await supabase
      .from('profiles')
      .update({ membership_type: 'board', updated_at: new Date().toISOString() })
      .eq('id', session.user.id);

    if (profErr) {
      toast({ variant: 'destructive', title: 'Admin elevation failed', description: profErr.message || 'Profile update failed' });
      return { error: profErr };
    }

    // 3) Refresh session locally so UI reacts immediately
    const { data: fresh } = await supabase.auth.getSession();
    handleSession(fresh?.session || null);

    toast({ title: 'Admin role granted', description: 'You are now a board admin.' });
    return { error: null };
  }, [session?.user, toast, handleSession]);

  const updateProfile = useCallback(async (updates) => {
    if (!session?.user) return { error: new Error('Not authenticated') };
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: session.user.id, ...updates, updated_at: new Date().toISOString() }, { onConflict: 'id' });

    if (error) {
      toast({ variant: 'destructive', title: 'Profile update failed', description: error.message });
    }
    return { error };
  }, [session?.user, toast]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateMembership,
    elevateToBoard,
    updateProfile,
  }), [user, session, loading, signUp, signIn, signOut, updateMembership, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
