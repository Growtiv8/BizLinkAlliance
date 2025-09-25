import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Send, User, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

const MessagesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { recipientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to access your messages.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const savedConversations = JSON.parse(localStorage.getItem('bizlink_conversations')) || [];
    setConversations(savedConversations);

    if (recipientId) {
  const recipientName = location.state?.recipientName || 'Unknown User';
      const businessName = location.state?.businessName || 'Unknown Business';
      let conversation = savedConversations.find(
        (conv) => (conv.participant1Id === user.id && conv.participant2Id === recipientId) ||
                   (conv.participant1Id === recipientId && conv.participant2Id === user.id)
      );

      if (!conversation) {
        conversation = {
          id: Date.now().toString(),
          participant1Id: user.id,
          participant1Name: user.user_metadata?.name || user.email,
          participant2Id: recipientId,
          participant2Name: recipientName,
          participant2Business: businessName,
          messages: [],
        };
        setConversations((prev) => [...prev, conversation]);
      }
      setActiveConversation(conversation);
    } else if (savedConversations.length > 0) {
      setActiveConversation(savedConversations[0]);
    }
  }, [user, recipientId, location.state, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const message = {
      id: Date.now(),
      senderId: user.id,
      senderName: user.name,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    const updatedConversations = conversations.map((conv) =>
      conv.id === activeConversation.id
        ? { ...conv, messages: [...conv.messages, message] }
        : conv
    );

    setConversations(updatedConversations);
    localStorage.setItem('bizlink_conversations', JSON.stringify(updatedConversations));
    setActiveConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
    setNewMessage('');
  };

  if (!user) {
    return null; // Redirect handled by useEffect
  }

  const getRecipient = (conversation) => {
    return conversation.participant1Id === user.id
      ? { id: conversation.participant2Id, name: conversation.participant2Name, business: conversation.participant2Business }
      : { id: conversation.participant1Id, name: conversation.participant1Name, business: conversation.participant1Business };
  };

  return (
    <>
      <Helmet>
        <title>Messages - BizLink Alliance</title>
        <meta name="description" content="Private messaging system for BizLink Alliance members. Connect and communicate directly with other professionals." />
      </Helmet>
      <div className="pt-24 pb-12 min-h-screen flex">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-grow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-effect rounded-2xl shadow-lg flex flex-grow overflow-hidden"
          >
            {/* Conversation List */}
            <div className="w-1/3 border-r border-white/10 p-4 flex flex-col">
              <h2 className="text-2xl font-bold mb-6 font-heading">Conversations</h2>
              <div className="flex-grow overflow-y-auto space-y-3">
                {conversations.length > 0 ? (
                  conversations.map((conv) => {
                    const recipient = getRecipient(conv);
                    const lastMessage = conv.messages[conv.messages.length - 1];
                    return (
                      <div
                        key={conv.id}
                        onClick={() => setActiveConversation(conv)}
                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          activeConversation?.id === conv.id
                            ? 'bg-yellow-gold/20 border border-yellow-gold'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="h-10 w-10 rounded-full bg-dark-grey flex items-center justify-center flex-shrink-0">
                          <User className="h-6 w-6 text-light-grey" />
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold text-white font-body">{recipient.name}</p>
                          <p className="text-sm text-light-grey truncate font-body">{lastMessage ? lastMessage.text : 'No messages yet'}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-light-grey font-body">No conversations yet.</div>
                )}
              </div>
            </div>

            {/* Message Area */}
            <div className="w-2/3 flex flex-col">
              {activeConversation ? (
                <>
                  <div className="p-4 border-b border-white/10 flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setActiveConversation(null)}>
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="h-10 w-10 rounded-full bg-dark-grey flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-light-grey" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white font-heading">{getRecipient(activeConversation).name}</h3>
                      <p className="text-sm text-light-grey font-body">{getRecipient(activeConversation).business}</p>
                    </div>
                  </div>
                  <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {activeConversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderId === user.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            msg.senderId === user.id
                              ? 'bg-yellow-gold/20 text-white'
                              : 'bg-white/5 text-white'
                          }`}
                        >
                          <p className="text-sm font-body">{msg.text}</p>
                          <p className="text-xs text-light-grey mt-1 font-body">
                            {format(parseISO(msg.timestamp), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 flex space-x-3">
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-grow bg-white/5 border-white/10 font-body"
                    />
                    <Button type="submit" className="sacramento-gradient font-body">
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex-grow flex items-center justify-center text-center text-light-grey font-body">
                  <div className="space-y-4">
                    <MessageSquare className="h-16 w-16 mx-auto" />
                    <p>Select a conversation or start a new one.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MessagesPage;