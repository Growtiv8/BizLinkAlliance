import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowRight, Users, Building2, Star, MapPin, HeartHandshake as Handshake, TrendingUp, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { format } from 'date-fns';
import { supabase } from '@/lib/customSupabaseClient';

const HomePage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(3);

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data);
      }
    };

    fetchEvents();
  }, []);

  const features = [
    {
      icon: Users,
      title: 'Network with Professionals',
      description: 'Connect with Sacramento\'s top business leaders and entrepreneurs'
    },
    {
      icon: Building2,
      title: 'Find Service Providers',
      description: 'Discover trusted businesses across all industries in the Sacramento area'
    },
    {
      icon: Handshake,
      title: 'Build Partnerships',
      description: 'Create meaningful business relationships that drive growth'
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      description: 'Access exclusive opportunities and referrals from network members'
    }
  ];

  const stats = [
    { number: '500+', label: 'Active Members' },
    { number: '50+', label: 'Industries' },
    { number: '1000+', label: 'Connections Made' },
    { number: '95%', label: 'Member Satisfaction' }
  ];

  return (
    <>
      <Helmet>
        <title>BizLink Alliance - Sacramento's Premier Business Network</title>
        <meta name="description" content="Join Sacramento's most trusted business networking platform. Connect with professionals, find service providers, and grow your business through meaningful partnerships." />
      </Helmet>

      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 sacramento-gradient opacity-20"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
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
                  <span className="gradient-text">BizLink</span>
                  <br />
                  <span className="text-white">Alliance</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-light-grey max-w-3xl mx-auto font-body">
                  Sacramento's premier business networking platform connecting professionals, 
                  service providers, and entrepreneurs in meaningful partnerships.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {!user ? (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="sacramento-gradient text-lg px-8 py-4 pulse-glow font-body">
                        Join the Network
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/directory">
                      <Button variant="outline" size="lg" className="text-lg px-8 py-4 font-body">
                        Browse Directory
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard">
                      <Button size="lg" className="sacramento-gradient text-lg px-8 py-4 font-body">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/directory">
                      <Button variant="outline" size="lg" className="text-lg px-8 py-4 font-body">
                        Browse Directory
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 floating-animation">
            <div className="w-20 h-20 bg-yellow-gold/20 rounded-full blur-xl"></div>
          </div>
          <div className="absolute bottom-20 right-10 floating-animation" style={{ animationDelay: '2s' }}>
            <div className="w-32 h-32 bg-light-grey/20 rounded-full blur-xl"></div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold gradient-text mb-2 font-heading">
                    {stat.number}
                  </div>
                  <div className="text-light-grey font-medium font-body">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
                Upcoming <span className="gradient-text">Events</span>
              </h2>
              <p className="text-xl text-light-grey max-w-3xl mx-auto font-body">
                Join our upcoming networking events, workshops, and seminars.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events && events.length > 0 ? (
                events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="glass-effect p-6 rounded-2xl business-card-hover flex flex-col"
                  >
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 text-yellow-gold text-sm font-medium mb-2 font-body">
                         <Calendar className="h-4 w-4" />
                         <span>{format(new Date(event.date), 'EEEE, MMMM do, yyyy')}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white font-heading">{event.title}</h3>
                      <p className="text-light-grey text-sm font-body">{event.location}</p>
                    </div>
                    <p className="text-light-grey flex-grow font-body">{event.description.substring(0, 100)}...</p>
                    <div className="mt-4 flex justify-between items-center">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium font-body ${
                          event.type === 'admin' 
                            ? 'bg-yellow-gold/20 text-yellow-gold' 
                            : 'bg-yellow-gold/20 text-yellow-gold'
                        }`}>
                          {event.type === 'admin' ? 'Official Event' : 'Member Event'}
                        </span>
                        <Link to="/events">
                            <Button variant="ghost" size="sm" className="font-body">
                                View Details <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="md:col-span-2 lg:col-span-3 text-center py-12">
                   <Calendar className="h-16 w-16 text-light-grey mx-auto mb-4" />
                   <p className="text-light-grey font-body">No upcoming events scheduled. Check back soon!</p>
                </div>
              )}
            </div>
            <div className="text-center mt-12">
              <Link to="/events">
                <Button variant="outline" size="lg" className="font-body">
                  View All Events
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
                Why Choose <span className="gradient-text">BizLink Alliance</span>?
              </h2>
              <p className="text-xl text-light-grey max-w-3xl mx-auto font-body">
                We're more than just a directory - we're a community of Sacramento businesses 
                working together to create opportunities and drive growth.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-effect p-6 rounded-2xl business-card-hover"
                >
                  <div className="w-12 h-12 bg-yellow-gold/20 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-yellow-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white font-heading">
                    {feature.title}
                  </h3>
                  <p className="text-light-grey font-body">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-yellow-gold/20 to-light-grey/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-heading">
                Ready to <span className="gradient-text">Connect</span>?
              </h2>
              <p className="text-xl text-light-grey font-body">
                Join hundreds of Sacramento businesses already growing through our network.
              </p>
              
              {!user && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/membership">
                    <Button size="lg" className="sacramento-gradient text-lg px-8 py-4 font-body">
                      View Membership Options
                      <Star className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/directory">
                    <Button variant="outline" size="lg" className="text-lg px-8 py-4 font-body">
                      Browse Members
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;