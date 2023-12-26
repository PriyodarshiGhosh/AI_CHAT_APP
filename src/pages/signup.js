// pages/signup.js
import { useRouter } from 'next/router'; // Import the useRouter hook
import { useState } from 'react';
import { supabase } from '@/supabase';
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
export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Access the router object
  const router = useRouter();
  const handleLoginClick= async ()=>{
    router.push('/login');

  }
  const handleSignUp = async () => {
    try {
      const { user, error } = await supabase.auth.signUp({
        email:email,
        password:password,
      });

      if (error) {
        
        console.error('Error signing up:', error.message);
        toast.error('Invalid email or password must be greater than 6 characters');
        return;
      }

      console.log('User signed up successfully:', user);

      // Redirect to the login page
     toast.info("check your email for verification");
    } catch (error) {
      console.log("hiiii")
      console.error('Error:', error.message);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen" style={{
      backgroundImage: 'linear-gradient(0deg,#fff 50%, #000 50%)',
    }}>
      <ToastContainer/>
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <CardFooter className="flex justify-center"> {/* Updated alignment */}
              <Button type ="button" variant="outline" onClick={handleSignUp}>Sign Up</Button>
            </CardFooter>
            <div className="mt-4">
          <p className="text-gray-700 text-center">
            Already have an account?
            <a className="text-blue-600 hover:text-blue-800 hover:cursor-pointer" onClick={handleLoginClick}>
              SignIn
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
