import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Calendar as CalendarIcon, Plus, Users, Crown, Edit, Trash2, ExternalLink } from 'lucide-react';
import { format, parseISO, startOfDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { EVENTS_FEED_URL, FACEBOOK_PAGE_URL } from '@/lib/eventsConfig';
import FacebookEventsEmbed from '@/components/FacebookEventsEmbed';

const EventsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [eventsSource, setEventsSource] = useState('unknown'); // 'feed' | 'supabase' | 'unknown'
  const [eventsError, setEventsError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  const loadEventsFromSupabase = async () => {
    const { data, error } = await supabase.from('events').select('*, profiles(name)');
    if (error) {
      console.error('Error fetching events:', error);
      toast({ title: 'Error fetching events', description: error.message, variant: 'destructive' });
      setEventsError(error.message || 'Unknown Supabase error');
      return [];
    }
    return data.map(event => ({
      ...event,
      authorName: event.profiles.name,
      source: 'supabase',
    }));
  };

  const normalizeFeedEvent = (ev, idx) => {
    // Expected fields from Make.com JSON feed: title, description, date, time, location, authorName(optional), type(optional)
    return {
      id: ev.id || `feed-${idx}`,
      title: ev.title || 'Untitled',
      description: ev.description || '',
      date: ev.date, // ISO date string expected
      time: ev.time || '',
      location: ev.location || '',
      author_id: null,
      authorName: ev.authorName || 'Community',
      type: ev.type || 'member',
      url: ev.url || ev.link || '',
      source: 'feed',
    };
  };

  const isFacebookUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    try {
      const u = new URL(url, window.location.origin);
      return u.hostname.includes('facebook.com');
    } catch {
      return false;
    }
  };

  const loadEvents = async () => {
    try {
      if (EVENTS_FEED_URL) {
        const res = await fetch(EVENTS_FEED_URL, { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error(`Feed error ${res.status}`);
        const json = await res.json();
        const items = Array.isArray(json) ? json : (Array.isArray(json.items) ? json.items : []);
        const normalized = items.map(normalizeFeedEvent);
        setEvents(normalized);
        setEventsSource('feed');
        setEventsError('');
        return;
      }
    } catch (err) {
      console.error('Failed to load external events feed, falling back to Supabase:', err);
      toast({ title: 'Using fallback events', description: 'External events feed unavailable. Showing internal events.', variant: 'default' });
      setEventsError(err?.message || 'External feed error');
    }

    // Fallback to Supabase
    const sb = await loadEventsFromSupabase();
    setEvents(sb);
    setEventsSource('supabase');
  };

  useEffect(() => {
    loadEvents();
  }, []);
  
  const eventDates = useMemo(() => 
    events.map(event => {
      try {
        return startOfDay(parseISO(event.date));
      } catch (e) {
        console.error("Invalid date format for event:", event);
        return null;
      }
    }).filter(Boolean), 
  [events]);

  const handleDateSelect = (date) => {
    setSelectedDate(date || new Date());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const openForm = (eventToEdit = null) => {
    if (!user) {
      toast({ title: "Login Required", description: "You must be logged in to create or edit events.", variant: "destructive" });
      return;
    }
    if (user.user_metadata?.membership_type !== 'premium' && user.user_metadata?.membership_type !== 'board') {
      toast({ title: "Premium Feature", description: "You need a premium membership to create events.", variant: "destructive" });
      return;
    }

    if (eventToEdit) {
      setEditingEvent(eventToEdit);
      setNewEvent({
        title: eventToEdit.title,
        date: format(parseISO(eventToEdit.date), 'yyyy-MM-dd'),
        time: eventToEdit.time,
        location: eventToEdit.location,
        description: eventToEdit.description
      });
    } else {
      setEditingEvent(null);
      setNewEvent({ title: '', date: format(selectedDate, 'yyyy-MM-dd'), time: '', location: '', description: '' });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventPayload = {
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      author_id: user.id,
      type: user.user_metadata?.membership_type === 'board' ? 'admin' : 'member',
    };

    let error;
    if (editingEvent) {
      const { error: updateError } = await supabase.from('events').update(eventPayload).eq('id', editingEvent.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('events').insert(eventPayload);
      error = insertError;
    }

    if (error) {
      toast({ title: `Error ${editingEvent ? 'updating' : 'creating'} event`, description: error.message, variant: 'destructive' });
    } else {
      setIsFormOpen(false);
      toast({
        title: `Event ${editingEvent ? 'Updated' : 'Created'}!`,
        description: `Your event "${newEvent.title}" has been saved.`,
      });
      loadEvents();
    }
  };

  const handleDelete = async (eventId) => {
    const { error } = await supabase.from('events').delete().eq('id', eventId);
    if (error) {
      toast({ title: 'Error deleting event', description: error.message, variant: 'destructive' });
    } else {
      toast({
        title: "Event Deleted",
        description: "The event has been removed successfully.",
        variant: 'destructive'
      });
      loadEvents(); // Refresh events from DB
    }
  };

  const filteredEvents = events.filter(event => {
    try {
      return format(parseISO(event.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    } catch (e) {
      return false;
    }
  }).sort((a, b) => a.time.localeCompare(b.time));

  const upcomingEvents = useMemo(() => {
    const today = startOfDay(new Date());
    return events
      .filter(ev => {
        try { return parseISO(ev.date) >= today; } catch { return false; }
      })
      .sort((a, b) => {
        const ad = parseISO(a.date).getTime() - parseISO(b.date).getTime();
        if (ad !== 0) return ad;
        return (a.time || '').localeCompare(b.time || '');
      })
      .slice(0, 5);
  }, [events]);

  return (
    <>
      <Helmet>
        <title>Events - BizLink Alliance</title>
      </Helmet>
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2 font-heading">
                Network <span className="gradient-text">Events</span>
              </h1>
              <p className="text-light-grey font-body">
                Connect, learn, and grow with the BizLink community.
              </p>
              {EVENTS_FEED_URL && (
                <div className="mt-3 text-sm bg-yellow-500/10 text-yellow-200 border border-yellow-500/30 rounded-lg px-3 py-2">
                  Events are currently loaded from an external feed. Creating or editing events here won't update the external source.
                </div>
              )}
            </div>
            {user && (
              <Button onClick={() => openForm()} className="mt-4 md:mt-0 sacramento-gradient font-body">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            )}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="glass-effect rounded-2xl p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="p-0"
                  modifiers={{ events: eventDates }}
                  modifiersClassNames={{
                    events: 'day-with-event',
                  }}
                />
              </div>
              {FACEBOOK_PAGE_URL && (
                <div className="mt-6">
                  <FacebookEventsEmbed pageUrl={FACEBOOK_PAGE_URL} />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="glass-effect rounded-2xl p-6 min-h-[500px]">
                <h2 className="text-2xl font-bold mb-4 font-heading">
                  Events on <span className="gradient-text">{format(selectedDate, 'MMMM do, yyyy')}</span>
                </h2>
                {filteredEvents.length > 0 ? (
                  <div className="space-y-4">
                    {filteredEvents.map(event => (
                      <div key={event.id} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              {event.type === 'admin' ? 
                                <Crown className="h-5 w-5 text-yellow-gold" /> : 
                                <Users className="h-5 w-5 text-yellow-gold" />
                              }
                              <h3 className="text-xl font-semibold text-white font-heading">{event.title}</h3>
                            </div>
                            <p className="text-light-grey mt-1 font-body">{event.time} at {event.location}</p>
                            <p className="text-dark-grey font-body">by {event.authorName}</p>
                            <p className="mt-2 text-light-grey font-body">{event.description}</p>
                            {isFacebookUrl(event.url || event.link) && (
                              <a
                                href={event.url || event.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1 text-sm text-yellow-gold hover:underline"
                              >
                                <ExternalLink className="h-4 w-4" /> View on Facebook
                              </a>
                            )}
                          </div>
                          {user && user.id === event.author_id && (
                            <div className="flex space-x-2">
                                <Button size="sm" variant="ghost" onClick={() => openForm(event)}><Edit className="h-4 w-4" /></Button>
                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive/80" onClick={() => handleDelete(event.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="text-center py-16">
                      <CalendarIcon className="h-16 w-16 text-light-grey mx-auto mb-4" />
                      <p className="text-light-grey font-body">No events scheduled for this day.</p>
                      {eventsError && (
                        <p className="mt-2 text-yellow-200 text-sm">{eventsError}</p>
                      )}
                      {EVENTS_FEED_URL && eventsSource !== 'feed' && (
                        <p className="mt-1 text-yellow-200 text-xs">External feed may be unavailable. Showing internal events if any.</p>
                      )}
                    </div>
                    {upcomingEvents.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3 font-heading">Upcoming events</h3>
                        <div className="space-y-3">
                          {upcomingEvents.map(ev => (
                            <div key={ev.id} className="bg-white/5 p-3 rounded-md">
                              <div className="flex items-center gap-2">
                                {ev.type === 'admin' ?
                                  <Crown className="h-4 w-4 text-yellow-gold" /> :
                                  <Users className="h-4 w-4 text-yellow-gold" />
                                }
                                <div className="font-medium">{ev.title}</div>
                              </div>
                              <div className="text-sm text-light-grey">{format(parseISO(ev.date), 'MMM d, yyyy')} {ev.time && `• ${ev.time}`}</div>
                              {ev.location && <div className="text-sm text-dark-grey">{ev.location}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {isFormOpen && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-effect rounded-2xl p-8 w-full max-w-lg"
              >
                <h2 className="text-2xl font-bold mb-6 font-heading">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input name="title" value={newEvent.title} onChange={handleInputChange} placeholder="Event Title" required className="bg-white/5 font-body" />
                  <div className="flex space-x-4">
                    <Input name="date" value={newEvent.date} onChange={handleInputChange} type="date" required className="bg-white/5 font-body"/>
                    <Input name="time" value={newEvent.time} onChange={handleInputChange} type="time" required className="bg-white/5 font-body"/>
                  </div>
                  <Input name="location" value={newEvent.location} onChange={handleInputChange} placeholder="Location" required className="bg-white/5 font-body"/>
                  <textarea name="description" value={newEvent.description} onChange={handleInputChange} placeholder="Event Description" rows="4" className="w-full bg-white/5 p-2 rounded-md font-body" required />
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="font-body">Cancel</Button>
                    <Button type="submit" className="sacramento-gradient font-body">{editingEvent ? 'Save Changes' : 'Create Event'}</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventsPage;