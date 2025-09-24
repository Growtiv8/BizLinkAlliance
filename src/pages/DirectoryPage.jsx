import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, Filter, MapPin, Phone, Mail, Globe, Star, Users, MessageSquare, Twitter, Linkedin, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from '@/lib/customSupabaseClient';
import GHLFrame from '@/components/GHLFrame';
import { GHL } from '@/lib/ghlConfig';

const DirectoryPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const industries = [
    'all', 'Legal Services', 'Marketing & Advertising', 'Construction', 'Accounting & Finance',
    'Technology', 'Healthcare', 'Real Estate', 'Consulting', 'Retail', 'Food & Beverage'
  ];

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        console.error('Error fetching businesses:', error);
        toast({ title: 'Error fetching directory', description: error.message, variant: 'destructive' });
      } else {
        const formattedBusinesses = data.map(profile => ({
          id: profile.id,
          name: profile.business_name,
          owner: profile.name,
          industry: profile.industry,
          description: profile.description || `A leading company in the ${profile.industry} sector.`,
          phone: profile.phone,
          email: profile.email, // This should come from auth.users table, but for simplicity we assume it's here
          membershipType: profile.membership_type,
          socials: profile.socials,
          rating: 4.5 + Math.random() * 0.5,
          image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop'
        }));
        setBusinesses(formattedBusinesses);
      }
      setLoading(false);
    };
    fetchBusinesses();
  }, [toast]);

  const filteredBusinesses = businesses.filter(business => {
    if (!business) return false;
    const matchesSearch = business.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.owner?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || business.industry === selectedIndustry;
    
    if (user?.user_metadata?.membership_type === 'free' && business.membershipType === 'premium') {
      return false;
    }
    
    return matchesSearch && matchesIndustry;
  });

  const handleConnect = (business) => {
    if (!user) {
      toast({ title: "Login Required", description: "Please login to connect with businesses.", variant: "destructive" });
      return;
    }
    if (user.user_metadata?.membership_type === 'free' && business.membershipType === 'premium') {
      toast({ title: "Premium Feature", description: "Upgrade to premium membership to connect with premium businesses.", variant: "destructive" });
      return;
    }
  };

  const handleSendMessage = (business) => {
    handleConnect(business);
  if (user && (user.user_metadata?.membership_type !== 'free' || business.membershipType !== 'premium')) {
        navigate(`/messages/${business.id}`, { state: { recipientName: business.owner, businessName: business.name } });
    }
  }

  return (
    <>
      <Helmet>
        <title>Business Directory - BizLink Alliance</title>
        <meta name="description" content="Browse Sacramento's premier business directory. Find trusted service providers, connect with professionals, and discover new business opportunities." />
      </Helmet>

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading">Business <span className="gradient-text">Directory</span></h1>
            <p className="text-xl text-light-grey max-w-3xl mx-auto font-body">Discover Sacramento's trusted business network. Connect with professionals and service providers in your industry.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="glass-effect p-6 rounded-2xl mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-light-grey" />
                <Input placeholder="Search businesses, industries, or owners..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/5 border-white/10 font-body" />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-light-grey" />
                <select value={selectedIndustry} onChange={(e) => setSelectedIndustry(e.target.value)} className="pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-md text-white appearance-none cursor-pointer w-full md:w-auto h-10 font-body">
                  {industries.map(industry => (<option key={industry} value={industry} className="bg-black">{industry === 'all' ? 'All Industries' : industry}</option>))}
                </select>
              </div>
            </div>
          </motion.div>

          <div className="mb-8">
            <p className="text-light-grey font-body">
              Showing {filteredBusinesses.length} businesses
              {user?.user_metadata.membership_type === 'free' && (<span className="ml-2 text-yellow-gold font-body">• Upgrade to premium to see all listings</span>)}
            </p>
          </div>

          {loading ? <div className="text-center py-12">Loading directory...</div> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBusinesses.map((business, index) => (
                <motion.div key={business.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="glass-effect rounded-2xl overflow-hidden business-card-hover">
                  <div className="relative">
                    <img className="w-full h-48 object-cover" alt={`${business.name} office`} src="https://images.unsplash.com/photo-1694388001616-1176f534d72f" />
                    <div className="absolute top-4 right-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium font-body ${business.membershipType === 'premium' ? 'bg-yellow-gold/20 text-yellow-gold border border-yellow-gold/30' : 'bg-light-grey/20 text-light-grey border border-light-grey/30'}`}>{business.membershipType === 'premium' ? 'Premium' : 'Member'}</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1 font-heading">{business.name}</h3>
                        <p className="text-yellow-gold font-medium font-body">{business.owner}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-gold fill-current" />
                        <span className="text-sm text-light-grey font-body">{business.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="mb-4"><span className="inline-block bg-yellow-gold/20 text-yellow-gold px-3 py-1 rounded-full text-sm font-body">{business.industry}</span></div>
                    <p className="text-light-grey mb-4 line-clamp-2 font-body">{business.description}</p>
                    <div className="space-y-2 mb-6">
                      {(user?.user_metadata.membership_type !== 'free' || business.membershipType !== 'premium') && (
                        <>
                          <div className="flex items-center text-sm text-light-grey font-body"><Phone className="h-4 w-4 mr-2" />{business.phone || 'N/A'}</div>
                          <div className="flex items-center text-sm text-light-grey font-body"><Mail className="h-4 w-4 mr-2" />{business.email}</div>
                        </>
                      )}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild><Button onClick={() => handleConnect(business)} className="w-full sacramento-gradient font-body" size="sm"><Users className="h-4 w-4 mr-2" />Connect</Button></DialogTrigger>
                      {user && (user.user_metadata.membership_type !== 'free' || business.membershipType !== 'premium') &&
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="font-heading">Connect with {business.owner}</DialogTitle>
                            <DialogDescription className="font-body">Reach out to {business.name} through their social channels or send a direct message.</DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col space-y-4 pt-4">
                             <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                               <div className="flex items-center space-x-3"><Linkedin className="h-5 w-5 text-yellow-gold" /><span className="text-white font-body">LinkedIn</span></div>
                               <Button variant="outline" size="sm" asChild disabled={!business.socials?.linkedin} className="font-body"><a href={business.socials?.linkedin} target="_blank" rel="noopener noreferrer">Visit</a></Button>
                             </div>
                             <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                               <div className="flex items-center space-x-3"><Twitter className="h-5 w-5 text-yellow-gold" /><span className="text-white font-body">Twitter</span></div>
                               <Button variant="outline" size="sm" asChild disabled={!business.socials?.twitter} className="font-body"><a href={business.socials?.twitter} target="_blank" rel="noopener noreferrer">Visit</a></Button>
                             </div>
                             <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                               <div className="flex items-center space-x-3"><Globe className="h-5 w-5 text-yellow-gold" /><span className="text-white font-body">Website</span></div>
                               <Button variant="outline" size="sm" asChild disabled={!business.socials?.website} className="font-body"><a href={business.socials?.website} target="_blank" rel="noopener noreferrer">Visit</a></Button>
                             </div>
                             <Button onClick={() => handleSendMessage(business)} className="w-full sacramento-gradient font-body"><MessageSquare className="h-4 w-4 mr-2"/>Send Message</Button>
                          </div>
                        </DialogContent>
                      }
                    </Dialog>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {(GHL.CONTACT_FORM_URL || GHL.CALENDAR_URL) && (
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {GHL.CONTACT_FORM_URL && (
                <div>
                  <h3 className="text-2xl font-bold mb-4 font-heading">Contact Us</h3>
                  <GHLFrame title="Contact" src={GHL.CONTACT_FORM_URL} height={900} />
                </div>
              )}
              {GHL.CALENDAR_URL && (
                <div>
                  <h3 className="text-2xl font-bold mb-4 font-heading">Book a Call</h3>
                  <GHLFrame title="Calendar" src={GHL.CALENDAR_URL} height={900} />
                </div>
              )}
            </div>
          )}

          {!loading && filteredBusinesses.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold mb-2 font-heading">No businesses found</h3>
              <p className="text-light-grey font-body">Try adjusting your search terms or filters to find what you're looking for.</p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default DirectoryPage;