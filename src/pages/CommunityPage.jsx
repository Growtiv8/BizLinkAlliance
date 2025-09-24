import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MessageSquare, Send, User, Clock, ThumbsUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const CommunityPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('bizlink_community_posts')) || [];
    setPosts(savedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  }, []);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'You must be logged in to post on the community board.',
        variant: 'destructive',
      });
      return;
    }
    if (newPost.trim() === '') return;

    const post = {
      id: Date.now(),
      author: user.user_metadata?.name || user.email,
      content: newPost,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('bizlink_community_posts', JSON.stringify(updatedPosts));
    setNewPost('');
    toast({
      title: 'Post Submitted!',
      description: 'Your message is now live on the board.',
    });
  };
  
  const handleFeatureClick = () => {
    toast({
      title: "🚧 Feature In Progress",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>Community Board - BizLink Alliance</title>
        <meta name="description" content="Join the conversation on the BizLink Alliance community message board. Connect with other Sacramento professionals." />
      </Helmet>
      <div className="pt-16">
        <section className="py-20 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold font-heading"
            >
              Community <span className="gradient-text">Message Board</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-xl text-light-grey max-w-3xl mx-auto font-body"
            >
              Connect, share, and collaborate with fellow members of the BizLink Alliance.
            </motion.p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {user ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-effect p-6 rounded-2xl mb-8"
              >
                <form onSubmit={handlePostSubmit}>
                  <h2 className="text-2xl font-semibold text-white mb-4 font-heading">Start a Conversation</h2>
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="w-full p-3 bg-dark-grey/50 border border-light-grey/70 rounded-lg text-white focus:ring-2 focus:ring-yellow-gold focus:outline-none transition font-body"
                    rows="4"
                    placeholder={`What's on your mind, ${user.user_metadata?.name || user.email}?`}
                  ></textarea>
                  <div className="mt-4 flex justify-end">
                    <Button type="submit" className="sacramento-gradient font-body">
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-effect p-8 rounded-2xl mb-8 text-center"
              >
                <h2 className="text-2xl font-semibold text-white mb-4 font-heading">Join the Conversation!</h2>
                <p className="text-light-grey mb-6 font-body">You need to be a member to post on the community board. Log in or register to get started.</p>
                <div className="flex justify-center gap-4">
                  <Link to="/login"><Button variant="outline" className="font-body">Login</Button></Link>
                  <Link to="/register"><Button className="sacramento-gradient font-body">Register</Button></Link>
                </div>
              </motion.div>
            )}

            <div className="space-y-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-effect p-6 rounded-2xl"
                >
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-dark-grey flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-light-grey" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-white font-body">{post.author}</p>
                        <div className="flex items-center text-xs text-dark-grey font-body">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(post.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <p className="mt-2 text-light-grey whitespace-pre-wrap font-body">{post.content}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center space-x-6">
                    <button onClick={handleFeatureClick} className="flex items-center text-light-grey hover:text-yellow-gold transition-colors text-sm font-body">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      <span>Like ({post.likes})</span>
                    </button>
                    <button onClick={handleFeatureClick} className="flex items-center text-light-grey hover:text-yellow-gold transition-colors text-sm font-body">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      <span>Comment ({post.comments.length})</span>
                    </button>
                  </div>
                </motion.div>
              ))}
              {posts.length === 0 && (
                <div className="text-center py-12">
                   <MessageSquare className="h-16 w-16 text-light-grey mx-auto mb-4" />
                   <p className="text-light-grey font-body">No posts yet. Be the first to start a conversation!</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CommunityPage;