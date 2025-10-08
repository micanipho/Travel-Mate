
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        setLocation('/dashboard');
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 overflow-hidden relative " style={{backgroundColor:'#FFFCF8'}}>
      <div className="flex items-center justify-center container p-10 mx-auto px-4">

        <div className="flex items-center justify-center overflow-hidden w-auto md:w-[40vw] lg:w-[40vw] p-2 md:p-2">

          <div className="max-w-3xl mx-auto">

            <h1 className="text-6xl font-bold text-gray-900 text-center mb-3 tracking-tight">TravelMate</h1>
            <p className="text-[20px] text-gray-500 text-center mb-3">Browse Taxi Ranks, Routes and <br />
              staying safe with real-time Alerts</p>
            <div className="w-[90%] flex items-center self-center justify-self-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">Sign In</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <form
              className="space-y-4 p-2 w-[300px] self-center justify-self-center"
              onSubmit={handleSubmit}
            >              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder='Email'
                  disabled={isSubmitting}
                  className="mt-1 block w-full px-3 py-2 border border-primary/60 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50"
                />
              </div>
              <div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder='Password'
                  disabled={isSubmitting}
                  className="mt-1 block w-full px-3 py-2 border border-primary/60 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-3 justify-center items-center w-full px-4 md:px-0">

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[100%] bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Logging in...
                    </>
                  ) : (
                    <span className="ml-2">Log In</span>
                  )}
                </button>

                <div className="w-[90%] flex items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="px-4 text-gray-500 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <div className='flex gap-5'>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="flex w-[60px] h-[40px] bg-white text-gray-700 font-semibold rounded-md hover:bg-gray-100 transition duration-200 flex items-center justify-center border disabled:opacity-50"
                  >
                    <FcGoogle className="w-6 h-6 "/>
                    
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="flex w-[60px] h-[40px] bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition duration-200 flex items-center justify-center disabled:opacity-50"
                  >
                    <FaApple className="w-6 h-6" />
                  </button>
                </div>

              </div>

              <p className="text-gray-700 mt-2 text-sm text-center">
                If you have forgotten your password, you can reset it by clicking
                <a href="/reset-password" className="text-primary hover:underline"> here</a>.
              </p>
            </form>

          </div>


        </div>
      </div>

    </section>
  );
};

export default Login;
