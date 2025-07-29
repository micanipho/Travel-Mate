
import { FcGoogle } from 'react-icons/fc';
import {FaApple} from 'react-icons/fa';

const Login = () => {
  
  return (
    <section className="py-16 bg-orange-50 overflow-hidden relative ">
      <div className="flex items-center justify-center container p-10 mx-auto px-4">
        
        <div className="flex items-center justify-center overflow-hidden w-[40vw] h-[80vh]p-2 md:p-2">
          
          <div className="max-w-3xl mx-auto">
            <h2 className="font-fredoka text-6xl mb-6 text-primary text-center">Sign Up</h2>

                <p className="text-center p-4 text-gray-700 mb-4">
                    Create a new account to get started! If you already have an account, you can 
                    <a href="/signup" className="text-primary hover:underline"> sign in</a>.
                </p>

                <form className="space-y-4 p-2" method="POST" action="/dashboard">
                    <div>
                        <label htmlFor="fullname" className="block text-1xl font-medium text-primary">Fullname</label>
                        <input type="text" id="fullname" name="fullname" placeholder='John Doe' required className="mt-1 block w-full px-3 py-2 border border-primary/60 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-1xl font-medium text-primary">Email</label>
                        <input type="email" id="email" name="email" placeholder='johndoe@example.com' required className="mt-1 block w-full px-3 py-2 border border-primary/60 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-1xl font-medium text-primary">Password</label>
                        <input type="password" id="password" name="password" required className="mt-1 block w-full px-3 py-2 border border-primary/60 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                    </div>

                    <div className="flex justify-center items-center w-full px-4 md:px-0">

                      <button type="submit" className="w-[90%] bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 flex items-center justify-center"><span className="ml-2">Sign Up</span>
                      </button>
                      
                      <hr/>
                      <button type="submit" className="w-[90%] bg-white text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-100 transition duration-200 flex items-center justify-center border"> <FcGoogle className="w-6 h-6" /><span className="ml-2">Sign in with Google</span>
                      </button>                    
    
                      <button type="submit" className="w-[90%] bg-black text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-800 transition duration-200 flex items-center justify-center"><FaApple className="w-6 h-6" /><span className="ml-2">Sign in with Apple</span>
                      </button>
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
