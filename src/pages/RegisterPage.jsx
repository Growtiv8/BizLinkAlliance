import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { User, Mail, Lock, Building2, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signUp(email, password, {
      data: {
        name,
        business_name: businessName,
        industry,
      }
    });

    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registration Successful!",
        description: "Welcome to BizLink Alliance. Please check your email to confirm your account.",
      });
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Register - BizLink Alliance</title>
        <meta name="description" content="Join BizLink Alliance and register your business to connect with Sacramento's professional network." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-effect p-8 rounded-2xl shadow-lg w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-center mb-6 font-heading">
            Join <span className="gradient-text">BizLink Alliance</span>
          </h1>
          <p className="text-center text-light-grey mb-8 font-body">
            Create your account and start networking with Sacramento's business community.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-light-grey" />
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10 bg-white/5 border-white/10 font-body"
              />
            </div>
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
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-light-grey" />
              <Input
                type="text"
                placeholder="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="pl-10 bg-white/5 border-white/10 font-body"
              />
            </div>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-light-grey" />
              <Input
                type="text"
                placeholder="Industry (e.g., Tech, Legal, Marketing)"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                className="pl-10 bg-white/5 border-white/10 font-body"
              />
            </div>
            <Button type="submit" className="w-full sacramento-gradient font-body" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <p className="text-center text-light-grey mt-8 font-body">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-gold hover:underline font-body">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;