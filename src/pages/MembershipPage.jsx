import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, Star, Crown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const MembershipPage = () => {
  const { user, updateMembership } = useAuth();
  const { toast } = useToast();

  const handleUpgrade = (membershipType) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to upgrade your membership.",
        variant: "destructive"
      });
      return;
    }
    updateMembership(membershipType);
    toast({
      title: "Membership Upgraded!",
      description: `You are now a ${membershipType} member.`,
    });
  };

  const membershipTiers = [
    {
      name: 'Free Member',
      price: 'Free',
      description: 'Basic access to the BizLink Alliance network.',
      features: [
        'Limited directory access',
        'View public events',
        'Read blog posts',
        'Basic profile listing',
      ],
      buttonText: 'Current Plan',
      buttonVariant: 'outline',
      icon: Star,
      color: 'text-light-grey',
      type: 'free'
    },
    {
      name: 'Premium Member',
      price: '$29/month',
      description: 'Unlock full potential with advanced networking features.',
      features: [
        'Full directory access',
        'Create and manage events',
        'Direct messaging with all members',
        'Enhanced profile with social links',
        'Priority support',
        'Post on community board',
      ],
      buttonText: 'Upgrade to Premium',
      buttonVariant: 'default',
      icon: Crown,
      color: 'text-yellow-gold',
      type: 'premium'
    },
  ];

  return (
    <>
      <Helmet>
        <title>Membership - BizLink Alliance</title>
        <meta name="description" content="Explore BizLink Alliance membership options: Free and Premium tiers for Sacramento businesses. Upgrade for enhanced networking features." />
      </Helmet>
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
              Choose Your <span className="gradient-text">Membership</span>
            </h1>
            <p className="text-xl text-light-grey max-w-3xl mx-auto font-body">
              Select the plan that best fits your business needs and start connecting with Sacramento's finest.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {membershipTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-effect p-8 rounded-2xl shadow-lg flex flex-col business-card-hover"
              >
                <div className="flex items-center justify-center mb-4">
                  <tier.icon className={`h-12 w-12 ${tier.color}`} />
                </div>
                <h2 className="text-3xl font-bold text-center mb-2 font-heading">{tier.name}</h2>
                <p className="text-center text-light-grey mb-6 font-body">{tier.description}</p>
                <p className="text-5xl font-bold text-center mb-8 gradient-text font-heading">{tier.price}</p>

                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-light-grey font-body">
                      <CheckCircle className="h-5 w-5 text-yellow-gold mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {user && (user.user_metadata?.membership_type === tier.type) ? (
                  <Button className="w-full font-body" variant="outline" disabled>
                    {tier.buttonText}
                  </Button>
                ) : (
                  <Button 
                    className="w-full sacramento-gradient font-body" 
                    onClick={() => handleUpgrade(tier.type)}
                    disabled={user && user.user_metadata?.membership_type === 'premium' && tier.type === 'free'}
                  >
                    {tier.buttonText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MembershipPage;