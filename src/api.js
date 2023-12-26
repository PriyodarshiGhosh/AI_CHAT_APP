import { supabase } from './supabase';
const OpenAIApi = require('openai');
// Get the OpenAI API key from environment variables
const openaiApiKey=process.env.NEXT_PUBLIC_API_KEY;
// Initialize OpenAI API client with the API key
const openai1 = new OpenAIApi({ apiKey: openaiApiKey ,dangerouslyAllowBrowser: true});
const handleUserQuery = async (userId, chatId, userQuery) => {
  try {
    // Call OpenAI API
    const aiReply = await openai1.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: userQuery
      // Add other parameters as needed
    });
    
    // Store in Supabase Messages table
    const { data, error } = await supabase.from('messages').insert([
      {
        user_id: userId,
        chat_id: chatId,
        query: userQuery,
        ai_reply: aiReply.choices[0].text,
      },
    ]);

    if (error) {
      console.error('Error inserting message into Supabase:', error.message);
    }

    return aiReply.choices[0].text;
  } catch (error) {
    console.error('Error handling user query:', error.message);
    throw error;
  }
};

export { handleUserQuery };
