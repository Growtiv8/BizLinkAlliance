import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Users, 
  Building2, 
  Calendar, 
  TrendingUp, 
  Star, 
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Linkedin,
  Twitter,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '@/lib/customSupabaseClient';

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [myEvents, setMyEvents] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: 0 rows
        console.error('Error fetching profile:', error);
        toast({ title: 'Error fetching profile', description: error.message, variant: 'destructive' });
      } else {
        setProfileData(data || {
          name: user.user_metadata.name,
          business_name: user.user_metadata.business_name,
          industry: user.user_metadata.industry,
          email: user.email,
          phone: '',
          description: '',
          socials: { linkedin: '', twitter: '', website: '' },
          membership_type: 'free',
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user, authLoading, navigate, toast]);

  useEffect(() => {
    if(user) {
      const fetchEvents = async () => {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('author_id', user.id);
        
        if (error) console.error('Error fetching events:', error);
        else setMyEvents(data);
      };
      fetchEvents();
    }
  }, [user]);
  
  const handleDeleteEvent = async (eventId) => {
    const { error } = await supabase.from('events').delete().eq('id', eventId);
    if (error) {
      toast({ title: 'Error deleting event', description: error.message, variant: 'destructive' });
    } else {
      setMyEvents(myEvents.filter(e => e.id !== eventId));
      toast({
        title: "Event Deleted",
        description: "Your event has been successfully removed.",
        variant: 'destructive'
      });
    }
  };

  const stats = [
    { title: 'Network Connections', value: '47', change: '+12%', icon: Users, color: 'text-yellow-gold' },
    { title: 'Profile Views', value: '234', change: '+8%', icon: TrendingUp, color: 'text-yellow-gold' },
    { title: 'Events Attended', value: '12', change: '+3', icon: Calendar, color: 'text-light-grey' },
    { title: 'Referrals Given', value: '8', change: '+2', icon: Star, color: 'text-yellow-gold' }
  ];

  const handleSaveProfile = async () => {
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...profileData,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    if (error) {
      toast({ title: 'Error updating profile', description: error.message, variant: 'destructive' });
    } else {
      setIsEditing(false);
      toast({ title: "Profile updated", description: "Your profile has been successfully updated." });
    }
  };

  const handleCancelEdit = () => {
    // Re-fetch or reset from original state if needed, for now just toggle edit mode
    setIsEditing(false);
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading dashboard...</p></div>;
  }

  if (!user || !profileData) {
    return null; // Should be redirected by useEffect
  }

  const dashboardTabs = [
    { id: 'profile', name: 'Profile', icon: Building2 },
    { id: 'events', name: 'My Events', icon: Calendar },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - BizLink Alliance</title>
        <meta name="description" content="Manage your BizLink Alliance profile, view connections, and track your networking activity." />
      </Helmet>

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 font-heading">
                  Welcome back, <span className="gradient-text">{profileData.name}</span>
                </h1>
                <p className="text-light-grey font-body">
                  {profileData.membership_type === 'board' ? 'Board Member' : 
                   profileData.membership_type === 'premium' ? 'Premium Member' : 'Free Member'} • 
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-effect p-6 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <span className="text-yellow-gold text-sm font-body">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1 font-heading">{stat.value}</div>
                <div className="text-sm text-light-grey font-body">{stat.title}</div>
              </motion.div>
            ))}
          </div>
          
          <div className="glass-effect rounded-2xl p-2 mb-8">
            <div className="flex space-x-2">
              {dashboardTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-body ${
                    activeTab === tab.id
                      ? 'bg-yellow-gold/20 text-yellow-gold'
                      : 'text-light-grey hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {activeTab === 'profile' && (
              <div className="glass-effect rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold font-heading">Business Profile</h2>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="font-body">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveProfile} size="sm" className="sacramento-gradient font-body">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" size="sm" className="font-body">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-yellow-gold/20 rounded-full flex items-center justify-center">
                      <Building2 className="h-10 w-10 text-yellow-gold" />
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            placeholder="Your name"
                            className="bg-white/5 border-white/10 font-body"
                          />
                          <Input
                            value={profileData.business_name}
                            onChange={(e) => setProfileData({...profileData, business_name: e.target.value})}
                            placeholder="Business name"
                            className="bg-white/5 border-white/10 font-body"
                          />
                        </div>
                      ) : (
                        <>
                          <h3 className="text-xl font-semibold text-white font-heading">{profileData.name}</h3>
                          <p className="text-yellow-gold font-medium font-body">{profileData.business_name}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-light-grey mb-2 font-body">Industry</label>
                      {isEditing ? (
                        <Input value={profileData.industry} onChange={(e) => setProfileData({...profileData, industry: e.target.value})} className="bg-white/5 border-white/10 font-body" />
                      ) : (
                        <p className="text-light-grey font-body">{profileData.industry}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-light-grey mb-2 font-body">Phone</label>
                      {isEditing ? (
                        <Input value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="bg-white/5 border-white/10 font-body" />
                      ) : (
                        <p className="text-light-grey font-body">{profileData.phone || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-light-grey mb-2 font-body">Email</label>
                      <p className="text-light-grey font-body">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-light-grey mb-2 font-body">Membership</label>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium font-body ${
                        profileData.membership_type === 'board' ? 'bg-yellow-gold/20 text-yellow-gold' :
                        profileData.membership_type === 'premium' ? 'bg-yellow-gold/20 text-yellow-gold' :
                        'bg-light-grey/20 text-light-grey'
                      }`}>
                        {profileData.membership_type}
                      </div>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="space-y-4 pt-4 border-t border-white/10">
                       <h3 className="text-lg font-semibold text-white font-heading">Social Links</h3>
                       <div className="space-y-2">
                        <div className="relative">
                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-grey" />
                            <Input value={profileData.socials?.linkedin || ''} onChange={(e) => setProfileData({...profileData, socials: {...profileData.socials, linkedin: e.target.value}})} placeholder="LinkedIn Profile URL" className="bg-white/5 border-white/10 pl-10 font-body" />
                        </div>
                         <div className="relative">
                            <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-grey" />
                            <Input value={profileData.socials?.twitter || ''} onChange={(e) => setProfileData({...profileData, socials: {...profileData.socials, twitter: e.target.value}})} placeholder="Twitter Profile URL" className="bg-white/5 border-white/10 pl-10 font-body" />
                        </div>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-grey" />
                            <Input value={profileData.socials?.website || ''} onChange={(e) => setProfileData({...profileData, socials: {...profileData.socials, website: e.target.value}})} placeholder="Website URL" className="bg-white/5 border-white/10 pl-10 font-body" />
                        </div>
                       </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-light-grey mb-2 font-body">Business Description</label>
                    {isEditing ? (
                      <textarea value={profileData.description || ''} onChange={(e) => setProfileData({...profileData, description: e.target.value})} placeholder="Tell others about your business..." rows={4} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-light-grey resize-none font-body" />
                    ) : (
                      <p className="text-light-grey font-body">{profileData.description || 'No description provided yet. Click edit to add one!'}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'events' && (
              <div className="glass-effect rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold font-heading">My Events</h2>
                   <Link to="/events">
                    <Button className="sacramento-gradient font-body">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Event
                    </Button>
                  </Link>
                </div>
                
                {myEvents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-light-grey font-subhead">Title</th>
                          <th className="text-left py-3 px-4 text-light-grey font-subhead">Date</th>
                          <th className="text-left py-3 px-4 text-light-grey font-subhead">Location</th>
                          <th className="text-left py-3 px-4 text-light-grey font-subhead">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                      {myEvents.map(event => (
                        <tr key={event.id} className="border-b border-white/5">
                          <td className="py-4 px-4 text-white font-body">{event.title}</td>
                          <td className="py-4 px-4 text-light-grey font-body">{format(new Date(event.date), 'MMM d, yyyy')} at {event.time}</td>
                          <td className="py-4 px-4 text-light-grey font-body">{event.location}</td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <Link to="/events">
                                <Button size="sm" variant="outline"><Edit3 className="h-4 w-4" /></Button>
                              </Link>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(event.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                   <div className="text-center py-12">
                     <Calendar className="h-16 w-16 text-light-grey mx-auto mb-4" />
                     <p className="text-light-grey mb-4 font-body">You haven't created any events yet.</p>
                     <Link to="/events">
                       <Button variant="outline" className="font-body">Create Your First Event</Button>
                     </Link>
                   </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;