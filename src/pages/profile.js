// profile.js
'use client'
import { handleUserQuery } from '@/api';
import { useEffect, useState } from 'react';
import { supabase } from '@/supabase';
import Modal from 'react-modal'; 
import { useRouter } from 'next/router';
import '../app/globals.css';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {Card} from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
   // Set the root element for accessibility
  export default function Profile() {
    const [userId, setUserId] = useState(null);
    const [chats, setChats] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [modelReply, setModelReply] = useState('');
    const [latestChat, setLatestChat] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const router=useRouter();
//     const [refreshed, setRefreshed] = useState(false);
const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
      } else {
        // Redirect to the login page after signing out
        router.push('/login');
      }
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };
useEffect(() => {
    if (!sessionStorage.getItem('refreshed')) {
      sessionStorage.setItem('refreshed', 'true');
      window.location.reload();
    } else {
      sessionStorage.removeItem('refreshed');
    }
  }, []);
     
    useEffect(() => {
      // Fetch user ID
      const fetchUserId = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.error('Error fetching user:', error.message);
            router.push('/login');
          // Handle the error, e.g., redirect to login
        } else {
          setUserId(user.id);
          fetchChats(user.id);
        }
      };
  
      fetchUserId();
    }, );
    useEffect(() => {
        if (typeof window !== 'undefined') {
          Modal.setAppElement('#root');
          console.log("one")
        }
      }, []);
      // Clear session if manually navigating to login
      useEffect(() => {
        if (router.pathname === '/login') {
          supabase.auth.signOut();
        }
      }, [router.pathname]);
      useEffect(() => {
        if (router.pathname === '/signup') {
          supabase.auth.signOut();
        }
      }, [router.pathname]);
      
    const fetchChats = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('chats')
          .select('*')
          .eq('user_id', userId);
  
        if (error) {
          console.error('Error fetching chats:', error.message);
        } else {
          setChats(data);
        }
      } catch (error) {
        console.error('Error fetching chats:', error.message);
      }
    };
  
    const fetchMessages = async (chatId) => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('query,ai_reply')
          .eq('chat_id', chatId);
  
        if (error) {
          console.error('Error fetching messages:', error.message);
        } else {
          setMessages(data);
          console.log(messages);
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error('Error fetching messages:', error.message);
      }
    };
  
    const handleChatClick = (chatId) => {
      
        console.log('Chat clicked');
        setChatId(chatId);
        fetchMessages(chatId);
      
    };
  
    const handleQuery = async () => {
      if (!chatId) {
        console.error('Error: No chat ID available.');
        return;
      }
    
      try {
        // Call the handleUserQuery function to get AI reply
        const aiReply = await handleUserQuery(userId, chatId, prompt);
        setModelReply(aiReply);
    
        // Fetch messages again after getting AI reply
        const { data, error } = await supabase
          .from('messages')
          .select('query, ai_reply')
          .eq('chat_id', chatId);
    
        if (error) {
          console.error('Error fetching messages:', error.message);
        } else {
          setMessages(data); // Update messages state with the new conversation
          setIsModalOpen(true); // Open the modal to display the conversation
        }
      } catch (error) {
        console.error('Error handling query:', error.message);
      }
    };
    
  
    const handleNewChat = async () => {
        try {
          // Insert a new chat into the Chats table
          const { data, error } = await supabase.from('chats').insert([
            {
              user_id: userId,
              // Add other chat-related fields as needed
            },
          ]);
    
          if (error) {
            console.error('Error creating new chat:', error.message);
          } else {
            // Assume the newly created chat has an ID field
            const { data: recentChat, error: recentChatError } = await supabase
              .from('chats')
              .select('id, user_id')
              .eq('user_id', userId)
              .order('timestamp', { ascending: false })
              .limit(1);
    
            if (recentChatError) {
              console.error('Error fetching recent chat:', recentChatError.message);
            } else {
              // Set the chatId to the id of the most recent chat
              const newChatId = recentChat[0].id;
              setChatId(newChatId);
              setLatestChat(recentChat);
              window.location.reload();
              setIsModalOpen(true);
            }
          }
        } catch (error) {
          console.error('Error handling new chat:', error.message);
        }
      };
      const handleDeleteChat = async (chatId) => {
        
        try {
          const { error } = await supabase
            .from('chats')
            .delete()
            .eq('id', chatId);
      
          if (error) {
            console.error('Error deleting chat:', error.message);
          } else {
            // Remove the deleted chat from the UI
            
            setIsModalOpen(false);
            setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
            console.log('Chat deleted successfully!');
            console.log(chats); // Add this line to check the updated state
          }
        } catch (error) {
          console.error('Error deleting chat:', error.message);
        }
        
      };
      
      
  
    return (
      <div>
        {/* Your existing content */}
  
        {/* Display past chats as scrollable cards */}
        <div style={{ display: 'flex', height: '100vh',backgroundImage: 'linear-gradient(0deg,#fff 50%, #000 50%)',}} >
        <Card className="w-[350px]" backgroundcolor= 'black'>
        <Button type ="button" onClick={handleNewChat}>New Chat</Button>
        <Button onClick={handleSignOut}>Sign Out</Button>
        <div style={{ flex: 1, overflowY: 'auto' }}>
        {latestChat &&(
             <div
             key={latestChat[0].id}
             onClick={() => handleChatClick(latestChat[0].id)}
             style={{
               border: '1px solid #ccc',
               padding: '10px',
               margin: '5px',
               cursor: 'pointer',
               color: 'black'
             }}
           >
             Chat ID: {latestChat[0].id}
             {/* Display other relevant chat information */}
           </div>

        )}
          {chats.map((chat) => (
            <div
              key={chat.id}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                margin: '5px',
                cursor: 'pointer',
                color: 'black'
              }}
            >
              Chat ID: {chat.id}
              {/* Display other relevant chat information */}
              <Button onClick={() => handleChatClick(chat.id)}>View</Button>
              <Button onClick={() => handleDeleteChat(chat.id)}>Delete</Button>
            </div>
            
          ))}
        </div>
        </Card>

        </div>
        {/* Modal */}
        <div id="root">
        <Modal
    isOpen={isModalOpen}
    onRequestClose={() => setIsModalOpen(false)}
    contentLabel="User Query Modal"
    style={{
      overlay: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
      },
      content: {
        width: '50%', // Adjust this as needed
        backgroundColor: 'white',
        color: 'black',
        border: 'none',
        marginLeft: 'auto',
      },
    }}
  >
          {/* Your existing modal content for prompts and replies */}
          <Label htmlFor="Prompt">Enter Your Prompt</Label>
         <Textarea id="Prompt" type="Prompt" placeholder="Prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} autoComplete="prompt"/>
          <Button onClick={() => handleQuery(prompt)}>Submit Prompt</Button>
  
          <h2>Model Reply</h2>
          <p>{modelReply}</p>
          <h2>Previous Conversations</h2>
{messages && messages.length > 0 ? (
  messages.map((message, index) => (
    <div
    key={index}
    style={{
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '10px',
      margin: '10px 0',
    }}
  >
    <div>
      <h4>Your Prompt</h4>
      <p>{message.query}</p>
    </div>
    <div>
      <h4>Ai answer</h4>
      <p>{message.ai_reply}</p>
    </div>
  </div>
  ))
) : (
  <p>No previous conversations found.</p>
)}
        </Modal>
        </div>
      </div>
    );
  }
  
