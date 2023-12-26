// pages/login.js
import { useState } from 'react';
import { supabase } from '@/supabase';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../app/globals.css';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router=useRouter();
  const handleLogin = async () => {
    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log(user);
      if (error) {
        console.log('Error signing in:', error.message);
        toast.error('Invalid email or password');
        return;
      }

      console.log('User signed in successfully:', user);
      router.push('/profile')
      // Redirect to profile page or any other page as needed
    } catch (error) {
      console.log('Error:', error.message);
    }
  };
  const handleRegisterClick= async ()=>{
    router.push('/signup');

  }
  return (
    
    <div className="flex justify-center items-center h-screen" style={{
      backgroundImage: 'linear-gradient(0deg,#fff 50%, #000 50%)',
    }}>
      <ToastContainer />
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="grid gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"/>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <CardFooter className="flex justify-center"> {/* Updated alignment */}
                <Button type ="button" variant='outline' onClick={handleLogin}>Login</Button>
              </CardFooter>
              <div className="mt-4">
          <p className="text-gray-700 text-center">
            Do not have an account?
            <a className="text-blue-600 hover:text-blue-800 hover:cursor-pointer" onClick={handleRegisterClick}>
              Create a new account
            </a>
          </p>
        </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

