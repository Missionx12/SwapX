import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import {
  getMatchMessages,
  sendMessage,
  subscribeToMessages,
  markMessagesAsRead
} from '@/services/interactionService';
import { Database } from '@/integrations/supabase/types';

type Message = Database['public']['Tables']['messages']['Row'];

const Chat = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages and subscribe to new ones
  useEffect(() => {
    if (!matchId || !user) return;

    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getMatchMessages(matchId);
        setMessages(fetchedMessages);
        
        // Mark messages as read
        await markMessagesAsRead(matchId, user.id);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = subscribeToMessages(matchId, (message) => {
      setMessages(prev => [...prev, message]);
      
      // Mark new message as read if it's not from the current user
      if (message.sender_id !== user.id) {
        markMessagesAsRead(matchId, user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [matchId, user, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user || !matchId) return;
    
    setIsSending(true);
    try {
      await sendMessage(matchId, user.id, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please sign in to access chat</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-background z-10 border-b">
        <div className="p-4 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft />
          </Button>
          <h1 className="text-lg font-bold ml-2">Chat</h1>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-swapx-purple"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === user.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender_id === user.id
                    ? 'bg-swapx-purple text-white'
                    : 'bg-gray-100'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isSending}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="bg-swapx-purple hover:bg-swapx-purple/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>

      <Navigation />
    </div>
  );
};

export default Chat; 