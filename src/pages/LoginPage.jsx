import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login Successful!",
        description: "Welcome back to BizLink Alliance.",
      });
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Login - BizLink Alliance</title>
        <meta name="description" content="Login to your BizLink Alliance account to access your dashboard, connect with members, and manage your business profile." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-effect p-8 rounded-2xl shadow-lg w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-center mb-6 font-heading">
            Welcome <span className="gradient-text">Back</span>
          </h1>
          <p className="text-center text-light-grey mb-8 font-body">
            Sign in to continue your journey with BizLink Alliance.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-light-grey" />
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-white/5 border-white/10 font-body"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-light-grey" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 bg-white/5 border-white/10 font-body"
              />
            </div>
            <Button type="submit" className="w-full sacramento-gradient font-body" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <p className="text-center text-light-grey mt-8 font-body">
            Don't have an account?{' '}
            <Link to="/register" className="text-yellow-gold hover:underline font-body">
              Register Now
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;