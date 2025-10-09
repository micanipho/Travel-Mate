import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SignUpPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { register, isAuthenticated } = useAuth();
  const { toast } = useToast();

  React.useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register({
        firstName,
        lastName,
        email,
        password,
        phoneNumber: phoneNumber || undefined,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Account created successfully!",
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
    <section className="py-16 overflow-hidden relative bg-[#FFFCF8]">
      <div className="flex flex-col items-center justify-center container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl p-6 bg-[#FFFCF8] rounded-lg">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-6 tracking-tight">Sign Up</h1>

          <p className="text-center text-gray-700 mb-6">
            Create a new account to get started! If you already have an account, you can{' '}
            <a href="/login" className="text-primary hover:underline">sign in</a>.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-primary">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-primary/60 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-primary">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-primary/60 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="johndoe@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-primary/60 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-primary">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="+27 12 345 6789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-primary/60 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-primary/60 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <p className="text-xs text-gray-600 mt-1">
                Password must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <span>Sign Up</span>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-500 bg-[#FFFCF8]">Or continue with</span>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="w-12 h-12 bg-white text-gray-700 font-semibold rounded-md hover:bg-gray-100 transition duration-200 flex items-center justify-center border disabled:opacity-50"
                >
                  <FcGoogle className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  className="w-12 h-12 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition duration-200 flex items-center justify-center disabled:opacity-50"
                >
                  <FaApple className="w-6 h-6" />
                </button>
              </div>
            </div>

            <p className="text-gray-700 mt-4 text-sm text-center">
              Already have an account?{' '}
              <a href="/login" className="text-primary hover:underline">Sign in here</a>.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;
