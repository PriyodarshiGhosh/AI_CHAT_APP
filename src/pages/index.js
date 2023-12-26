// pages/index.js
import '../app/globals.css';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
export default function Home() {
    const router=useRouter();
  const handle1=async()=>{
      router.push('/login')
  }
  const handle2=async()=>{
    router.push('/signup')
}
  return (
    <div style={{
        backgroundImage: 'linear-gradient(0deg,#fff 50%, #000 50%)',
      }}>
     
      <div className="flex justify-center items-center h-screen">
      <Button type ="button" variant='outline' onClick={handle1}>Login</Button>
      <Button type ="button" variant='outline' onClick={handle2}>SignUp</Button>
         
        
      </div>
    </div>
  );
}
