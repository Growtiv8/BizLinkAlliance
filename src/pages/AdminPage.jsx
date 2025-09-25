import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Crown,
  Shield,
  Settings,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Plus,
  Calendar,
  MessageSquare,
  Clock,
  Lightbulb,
  Send,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { format, parseISO, formatDistanceToNow } from 'date-fns';

const AdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [members, setMembers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [events, setEvents] = useState([]);
  const [adminMessages, setAdminMessages] = useState([]);
  const [newAdminMessage, setNewAdminMessage] = useState('');
  const [meetings, setMeetings] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isMeetingFormOpen, setIsMeetingFormOpen] = useState(false);
  const [isMemberFormOpen, setIsMemberFormOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ title: '', date: '', time: '', agenda: '' });
  const [newMember, setNewMember] = useState({ name: '', email: '', businessName: '', membershipType: 'free' });

  const adminStats = [
    { title: 'Total Members', value: members.length, icon: Users, color: 'text-yellow-gold' },
    { title: 'Premium Members', value: members.filter(m => m.membershipType === 'premium').length, icon: Crown, color: 'text-yellow-gold' },
    { title: 'Active Businesses', value: businesses.length, icon: Building2, color: 'text-light-grey' },
    { title: 'Pending Members', value: members.filter(m => m.status === 'pending').length, icon: UserCheck, color: 'text-yellow-gold' },
  ];

  const mockMembers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@saclegal.com', businessName: 'Sacramento Legal Solutions', membershipType: 'premium', joinDate: '2024-01-15', status: 'active' },
    { id: 2, name: 'Mike Chen', email: 'mike@rivercitymarketing.com', businessName: 'River City Marketing', membershipType: 'premium', joinDate: '2024-02-03', status: 'active' },
    { id: 3, name: 'David Rodriguez', email: 'david@capitalconstruction.com', businessName: 'Capital Construction Co.', membershipType: 'free', joinDate: '2024-02-20', status: 'active' },
    { id: 4, name: 'Lisa Thompson', email: 'lisa@gsaccounting.com', businessName: 'Golden State Accounting', membershipType: 'premium', joinDate: '2024-01-08', status: 'pending' }
  ];

  useEffect(() => {
    const loadData = () => {
      const savedMembers = JSON.parse(localStorage.getItem('bizlink_members')) || mockMembers;
      setMembers(savedMembers);
      
      const savedBusinesses = JSON.parse(localStorage.getItem('bizlink_businesses')) || [];
      setBusinesses(savedBusinesses);
      
      const savedEvents = JSON.parse(localStorage.getItem('bizlink_events')) || [];
      setEvents(savedEvents);

      const savedAdminMessages = JSON.parse(localStorage.getItem('bizlink_admin_messages')) || [];
      setAdminMessages(savedAdminMessages);

      const savedMeetings = JSON.parse(localStorage.getItem('bizlink_meetings')) || [];
      setMeetings(savedMeetings);
      
      const savedSuggestions = JSON.parse(localStorage.getItem('bizlink_suggestions')) || [];
      setSuggestions(savedSuggestions);
      
      const savedActivities = JSON.parse(localStorage.getItem('bizlink_activities')) || [];
      setActivities(savedActivities);
    };

    loadData();
    if (!localStorage.getItem('bizlink_members')) {
        localStorage.setItem('bizlink_members', JSON.stringify(mockMembers));
    }
  }, []);

  const handleAdminMessageSubmit = (e) => {
    e.preventDefault();
    if (!newAdminMessage.trim()) return;
    const message = {
      id: Date.now(),
      author: user.user_metadata?.name || user.email,
      text: newAdminMessage,
      timestamp: new Date().toISOString()
    };
    const updatedMessages = [...adminMessages, message];
    setAdminMessages(updatedMessages);
    localStorage.setItem('bizlink_admin_messages', JSON.stringify(updatedMessages));
    setNewAdminMessage('');
  };
  
  const handleMeetingSubmit = (e) => {
    e.preventDefault();
  const meetingData = { ...newMeeting, id: Date.now(), scheduledBy: user.user_metadata?.name || user.email };
    const updatedMeetings = [...meetings, meetingData];
    setMeetings(updatedMeetings);
    localStorage.setItem('bizlink_meetings', JSON.stringify(updatedMeetings));
    setIsMeetingFormOpen(false);
    setNewMeeting({ title: '', date: '', time: '', agenda: '' });
    toast({ title: 'Meeting Scheduled!', description: 'The board has been notified.' });
  };

  const handleNewMemberSubmit = (e) => {
    e.preventDefault();
    const memberData = {
      ...newMember,
      id: Date.now(),
      status: 'active',
      joinDate: new Date().toISOString(),
    };
    const updatedMembers = [...members, memberData];
    setMembers(updatedMembers);
    localStorage.setItem('bizlink_members', JSON.stringify(updatedMembers));
    setIsMemberFormOpen(false);
    setNewMember({ name: '', email: '', businessName: '', membershipType: 'free' });
    toast({ title: 'Member Added!', description: `${memberData.name} is now part of the alliance.` });
  };

  const deleteSuggestion = (id) => {
    const updatedSuggestions = suggestions.filter(s => s.id !== id);
    setSuggestions(updatedSuggestions);
    localStorage.setItem('bizlink_suggestions', JSON.stringify(updatedSuggestions));
    toast({ title: 'Suggestion Removed', variant: 'destructive' });
  };
  
  const handleEventDelete = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('bizlink_events', JSON.stringify(updatedEvents));
    toast({ title: "Event Deleted", description: "The event has been successfully removed.", variant: "destructive" });
  };

  const handleMemberAction = (memberId, action) => {
    let memberName = '';
    const updatedMembers = members.map(member => {
      if (member.id === memberId) {
        memberName = member.name;
        if (action === 'approve') return { ...member, status: 'active' };
        if (action === 'suspend') return { ...member, status: 'suspended' };
        if (action === 'delete') return null;
      }
      return member;
    }).filter(Boolean);
    setMembers(updatedMembers);
    localStorage.setItem('bizlink_members', JSON.stringify(updatedMembers));
    const message = action === 'delete' ? `${memberName} has been removed.` : `Member ${memberName} has been ${action}d.`;
    toast({ title: "Member updated", description: message });
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'members', name: 'Members', icon: Users },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'communication', name: 'Admin Chat', icon: MessageSquare },
    { id: 'meetings', name: 'Meetings', icon: Clock },
    { id: 'suggestions', name: 'Suggestions', icon: Lightbulb },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  if (!user || user.user_metadata?.membership_type !== 'board') {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4 font-heading">Access Denied</h1>
          <p className="text-light-grey font-body">You need board member privileges to access this area.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - BizLink Alliance</title>
        <meta name="description" content="BizLink Alliance admin dashboard for board members to manage the network." />
      </Helmet>

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Crown className="h-8 w-8 text-yellow-gold" />
              <h1 className="text-4xl font-bold font-heading">Admin <span className="gradient-text">Dashboard</span></h1>
            </div>
            <p className="text-light-grey font-body">Manage BizLink Alliance network operations and member activities</p>
          </motion.div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {adminStats.map((stat, index) => (
                <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="glass-effect p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center`}><stat.icon className={`h-6 w-6 ${stat.color}`} /></div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1 font-heading">{stat.value}</div>
                  <div className="text-sm text-light-grey font-body">{stat.title}</div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="glass-effect rounded-2xl p-2 mb-8">
            <div className="flex space-x-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-body ${activeTab === tab.id ? 'bg-yellow-gold/20 text-yellow-gold' : 'text-light-grey hover:text-white hover:bg-white/5'}`}>
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4 font-heading">Recent Network Activity</h3>
                   <div className="space-y-4">
                      {activities.length > 0 ? activities.slice(0, 5).map(activity => (
                          <div key={activity.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                              <div>
                                  <p className="text-white font-body">{activity.text}</p>
                              </div>
                              <span className="text-xs text-light-grey font-body">{formatDistanceToNow(parseISO(activity.timestamp), { addSuffix: true })}</span>
                          </div>
                      )) : <p className="text-light-grey text-center py-8 font-body">No recent activity.</p>}
                  </div>
                </div>
                <div className="glass-effect rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-4 font-heading">Quick Actions</h3>
                    <div className="space-y-3">
                        <Button onClick={() => setIsMemberFormOpen(true)} className="w-full justify-start sacramento-gradient font-body"><Plus className="h-4 w-4 mr-2" />Add New Member</Button>
                        <Button onClick={() => setActiveTab('members')} className="w-full justify-start font-body" variant="outline"><UserCheck className="h-4 w-4 mr-2" />Approve Members</Button>
                        <Button onClick={() => setActiveTab('settings')} className="w-full justify-start font-body" variant="outline"><Settings className="h-4 w-4 mr-2" />System Settings</Button>
                    </div>
                </div>
              </div>
            )}
            
            {activeTab === 'communication' && (
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 font-heading">Board Communication Channel</h3>
                <div className="h-96 bg-white/5 rounded-lg p-4 overflow-y-auto flex flex-col space-y-4 mb-4">
                  {adminMessages.map(msg => (
                    <div key={msg.id} className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-yellow-gold font-body">{msg.author}</span>
                        <span className="text-xs text-light-grey font-body">{format(parseISO(msg.timestamp), "MMM d, h:mm a")}</span>
                      </div>
                      <p className="text-white font-body">{msg.text}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAdminMessageSubmit} className="flex space-x-4">
                  <Input value={newAdminMessage} onChange={(e) => setNewAdminMessage(e.target.value)} placeholder="Type a message to the board..." className="bg-white/5 font-body" />
                  <Button type="submit" className="sacramento-gradient font-body"><Send className="h-4 w-4" /></Button>
                </form>
              </div>
            )}

            {activeTab === 'meetings' && (
              <div className="glass-effect rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold font-heading">Board Meetings</h3>
                  <Button onClick={() => setIsMeetingFormOpen(true)} className="sacramento-gradient font-body"><Plus className="h-4 w-4 mr-2" />Schedule Meeting</Button>
                </div>
                <div className="space-y-4">
                  {meetings.length > 0 ? meetings.map(meeting => (
                    <div key={meeting.id} className="bg-white/5 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold text-white font-heading">{meeting.title}</h4>
                          <p className="text-sm text-yellow-gold font-body">{format(new Date(meeting.date), 'MMMM do, yyyy')} at {meeting.time}</p>
                          <p className="text-sm text-light-grey mt-2 font-body">Agenda: {meeting.agenda}</p>
                        </div>
                        <span className="text-xs text-dark-grey font-body">Scheduled by {meeting.scheduledBy}</span>
                      </div>
                    </div>
                  )) : <p className="text-light-grey text-center py-8 font-body">No meetings scheduled.</p>}
                </div>
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6 font-heading">Member Suggestions</h3>
                <div className="space-y-4">
                  {suggestions.length > 0 ? suggestions.map(s => (
                    <div key={s.id} className="bg-white/5 p-4 rounded-lg">
                       <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white font-body">{s.text}</p>
                            <p className="text-xs text-light-grey mt-2 font-body">From: {s.authorName} on {format(parseISO(s.timestamp), "MMM d, yyyy")}</p>
                        </div>
                        <Button size="icon" variant="destructive" onClick={() => deleteSuggestion(s.id)}><Trash2 className="h-4 w-4" /></Button>
                       </div>
                    </div>
                  )) : <p className="text-light-grey text-center py-8 font-body">No new suggestions.</p>}
                </div>
              </div>
            )}
            
            {activeTab === 'events' && (
              <div className="glass-effect rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold font-heading">Event Management</h3><Button className="sacramento-gradient font-body" onClick={() => toast({ title: "Navigate to Events page to add an event." })}><Plus className="h-4 w-4 mr-2" />Add Event</Button></div>
                <div className="overflow-x-auto">
                   <table className="w-full">
                     <thead><tr className="border-b border-white/10"><th className="text-left py-3 px-4 text-light-grey font-subhead">Event</th><th className="text-left py-3 px-4 text-light-grey font-subhead">Date</th><th className="text-left py-3 px-4 text-light-grey font-subhead">Type</th><th className="text-left py-3 px-4 text-light-grey font-subhead">Created By</th><th className="text-left py-3 px-4 text-light-grey font-subhead">Actions</th></tr></thead>
                     <tbody>
                       {events.map((event) => (
                         <tr key={event.id} className="border-b border-white/5">
                           <td className="py-4 px-4"><p className="text-white font-body">{event.title}</p></td>
                           <td className="py-4 px-4 text-light-grey font-body">{format(new Date(event.date), 'MM/dd/yyyy')} at {event.time}</td>
                           <td className="py-4 px-4"><span className={`inline-block px-2 py-1 rounded-full text-xs font-medium font-body ${event.type === 'admin' ? 'bg-yellow-gold/20 text-yellow-gold' : 'bg-yellow-gold/20 text-yellow-gold'}`}>{event.type}</span></td>
                           <td className="py-4 px-4 text-light-grey font-body">{event.authorName}</td>
                           <td className="py-4 px-4"><Button size="sm" variant="destructive" onClick={() => handleEventDelete(event.id)}><Trash2 className="h-3 w-3" /></Button></td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
              </div>
            )}

            {activeTab === 'members' && (
              <div className="glass-effect rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold font-heading">Member Management</h3><Button onClick={() => setIsMemberFormOpen(true)} className="sacramento-gradient font-body"><Plus className="h-4 w-4 mr-2" />Add Member</Button></div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-white/10"><th className="text-left py-3 px-4 text-light-grey font-subhead">Member</th><th className="text-left py-3 px-4 text-light-grey font-subhead">Business</th><th className="text-left py-3 px-4 text-light-grey font-subhead">Membership</th><th className="text-left py-3 px-4 text-light-grey font-subhead">Status</th><th className="text-left py-3 px-4 text-light-grey font-subhead">Actions</th></tr></thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.id} className="border-b border-white/5">
                          <td className="py-4 px-4"><div><p className="text-white font-body">{member.name}</p><p className="text-sm text-light-grey font-body">{member.email}</p></div></td>
                          <td className="py-4 px-4 text-light-grey font-body">{member.businessName}</td>
                          <td className="py-4 px-4"><span className={`inline-block px-2 py-1 rounded-full text-xs font-medium font-body ${member.membershipType === 'premium' ? 'bg-yellow-gold/20 text-yellow-gold' : 'bg-yellow-gold/20 text-yellow-gold'}`}>{member.membershipType}</span></td>
                          <td className="py-4 px-4"><span className={`inline-block px-2 py-1 rounded-full text-xs font-medium font-body ${member.status === 'active' ? 'bg-yellow-gold/20 text-yellow-gold' : member.status === 'pending' ? 'bg-yellow-gold/20 text-yellow-gold' : 'bg-destructive/20 text-destructive'}`}>{member.status}</span></td>
                          <td className="py-4 px-4"><div className="flex space-x-2">{member.status === 'pending' && (<Button size="sm" onClick={() => handleMemberAction(member.id, 'approve')} className="bg-yellow-gold hover:bg-yellow-gold/80"><UserCheck className="h-3 w-3" /></Button>)}<Button size="sm" variant="outline" onClick={() => {toast({title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"});}}><Edit className="h-3 w-3" /></Button><Button size="sm" variant="outline" onClick={() => handleMemberAction(member.id, 'suspend')} className="border-destructive text-destructive hover:bg-destructive/10"><UserX className="h-3 w-3" /></Button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="glass-effect rounded-2xl p-6"><h3 className="text-xl font-bold mb-6 font-heading">System Settings</h3><div className="text-center py-12"><Settings className="h-16 w-16 text-light-grey mx-auto mb-4" /><p className="text-light-grey mb-4 font-body">System settings panel coming soon</p><Button onClick={() => {toast({title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"});}} variant="outline" className="font-body">Request Feature</Button></div></div>
            )}
          </motion.div>
        </div>
      </div>
       {isMeetingFormOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-effect rounded-2xl p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 font-heading">Schedule New Meeting</h2>
            <form onSubmit={handleMeetingSubmit} className="space-y-4">
              <Input name="title" value={newMeeting.title} onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})} placeholder="Meeting Title" required className="bg-white/5 font-body" />
              <div className="flex space-x-4">
                <Input name="date" value={newMeeting.date} onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})} type="date" required className="bg-white/5 font-body"/>
                <Input name="time" value={newMeeting.time} onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})} type="time" required className="bg-white/5 font-body"/>
              </div>
              <Textarea name="agenda" value={newMeeting.agenda} onChange={(e) => setNewMeeting({...newMeeting, agenda: e.target.value})} placeholder="Meeting Agenda" rows="4" className="w-full bg-white/5 p-2 rounded-md font-body" required />
              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsMeetingFormOpen(false)} className="font-body">Cancel</Button>
                <Button type="submit" className="sacramento-gradient font-body">Schedule</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {isMemberFormOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-effect rounded-2xl p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 font-heading">Add New Member</h2>
            <form onSubmit={handleNewMemberSubmit} className="space-y-4">
              <Input value={newMember.name} onChange={(e) => setNewMember({...newMember, name: e.target.value})} placeholder="Full Name" required className="bg-white/5 font-body" />
              <Input type="email" value={newMember.email} onChange={(e) => setNewMember({...newMember, email: e.target.value})} placeholder="Email Address" required className="bg-white/5 font-body" />
              <Input value={newMember.businessName} onChange={(e) => setNewMember({...newMember, businessName: e.target.value})} placeholder="Business Name" required className="bg-white/5 font-body" />
              <select value={newMember.membershipType} onChange={(e) => setNewMember({...newMember, membershipType: e.target.value})} className="w-full bg-white/5 p-2 rounded-md border border-input text-sm font-body">
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option value="board">Board</option>
              </select>
              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsMemberFormOpen(false)} className="font-body">Cancel</Button>
                <Button type="submit" className="sacramento-gradient font-body">Add Member</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AdminPage;