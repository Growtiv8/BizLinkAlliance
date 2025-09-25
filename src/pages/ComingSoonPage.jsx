import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Mail, ArrowRight, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import GHLFrame from '@/components/GHLFrame';
import { GHL } from '@/lib/ghlConfig';

const ComingSoonPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    const { error } = await supabase.from('waitlist').insert({ email });

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        toast({
          title: "Already on the list!",
          description: "This email address has already been registered.",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "You're on the list!",
        description: "We'll notify you as soon as we launch. Thanks for your interest!",
      });
      setEmail('');
    }
    setLoading(false);
  };

  if (GHL.WAITLIST_FORM_URL) {
    return (
      <>
        <Helmet>
          <title>Coming Soon - BizLink Alliance</title>
          <meta name="description" content="BizLink Alliance is launching soon! Sign up to be the first to know when Sacramento's premier business networking platform goes live." />
        </Helmet>
        <div className="min-h-screen flex items-center justify-center pt-16 pb-12">
          <div className="w-full max-w-3xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 font-heading">
              Join the <span className="gradient-text">Waitlist</span>
            </h1>
            <p className="text-center text-light-grey mb-6 font-body">We’ll notify you when we launch.</p>
            <GHLFrame title="Waitlist" src={GHL.WAITLIST_FORM_URL} height={900} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Coming Soon - BizLink Alliance</title>
        <meta name="description" content="BizLink Alliance is launching soon! Sign up to be the first to know when Sacramento's premier business networking platform goes live." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center text-center overflow-hidden relative">
        <div className="absolute inset-0 sacramento-gradient opacity-20"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex justify-center">
              <Building2 className="h-16 w-16 text-yellow-gold" />
            </div>
            
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="flex items-center space-x-2 bg-yellow-gold/20 px-4 py-2 rounded-full border border-yellow-gold/30">
                  <MapPin className="h-5 w-5 text-yellow-gold" />
                  <span className="text-light-grey font-body">Roseville, Citrus Heights, & The Greater Sacramento Area</span>
                </div>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold font-heading">
                <span className="gradient-text">BizLink Alliance</span>
                <br />
                <span className="text-white">is Coming Soon</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-light-grey max-w-2xl mx-auto font-body">
                We're putting the finishing touches on Roseville, Citrus Heights, and The Greater Sacramento Area's premier business networking platform. Get ready to connect, collaborate, and grow like never before.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-lg mx-auto"
            >
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-light-grey" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-white/5 border-white/10 h-12 text-lg font-body"
                  />
                </div>
                <Button type="submit" size="lg" className="sacramento-gradient text-lg px-8 py-4 pulse-glow font-body" disabled={loading}>
                  {loading ? 'Submitting...' : 'Notify Me'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
              <p className="text-sm text-light-grey mt-4 font-body">
                Sign up to be the first to know when we launch. No spam, we promise.
              </p>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute top-20 left-10 floating-animation">
          <div className="w-20 h-20 bg-yellow-gold/20 rounded-full blur-xl"></div>
        </div>
        <div className="absolute bottom-20 right-10 floating-animation" style={{ animationDelay: '2s' }}>
          <div className="w-32 h-32 bg-light-grey/20 rounded-full blur-xl"></div>
        </div>
      </div>
    </>
  );
};

export default ComingSoonPage;