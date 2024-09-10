import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useUserStore from '../stores/useUserStore';

const Login = () => {

     const [formData, setFormData] = useState({
          email: "",
          password: ""
     })
     
     const { login, logout } = useUserStore();
     const handleLogin = async (e) => { 
          e.preventDefault();
          console.log(formData);
          login(formData)
     }

     const handleLogout = async () => {
          logout()
     }

     return (
          <div className='flex items-center justify-center my-5 px-4'>
               <div className='flex flex-col gap-4 w-full max-w-sm border rounded bg-white px-4 py-6 sm:px-6 md:px-7 md:py-8'>
                    <p className='text-xl sm:text-2xl mb-3'>Login</p>

                    <input
                         type="text"
                         placeholder='Email'
                         onChange={(e) => setFormData( {...formData, email: e.target.value})} //setEmail(e.target.value)}
                         className='p-3 border border-gray-300 rounded-md text-sm sm:text-base'
                    />
                    <input
                         type="password"
                         placeholder='Password'
                         onChange={(e) => setFormData( {...formData, password: e.target.value})} //setPassword(e.target.value)}
                         className='p-3 border border-gray-300 rounded-md text-sm sm:text-base'
                    />

                    <input
                         type="button"
                         value="Submit"
                         onClick={handleLogin}
                         className='p-3 border rounded-md bg-blue-500 text-white text-sm sm:text-base'
                    />
                    <input
                         type="button"
                         value="Login with Google"
                         className='p-3 border rounded-md bg-red-500 text-white text-sm sm:text-base'
                    />

                    <p className='text-sm text-center mt-2'>
                         You don't have an account yet?
                         <Link to="/signup" className='text-blue-500 underline'> Sign Up</Link>
                    </p>
               </div>
               <input
                    type="button"
                    value="Logout"
                    onClick={handleLogout}
                    className='p-3 border rounded-md bg-yellow-500 text-white text-sm sm:text-base'
               />
          </div>
     )
}

export default Login