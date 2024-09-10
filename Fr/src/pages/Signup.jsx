import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import useUserStore from '../stores/useUserStore';

const Signup = () => {

     const [formData, setFormData] = useState({
          fullName: "",
          email: "",
          password: ""
     });

     const { signup } = useUserStore();
     
     const handleSubmit = async (e) => { 
          e.preventDefault();
          console.log(formData);
          signup(formData)
     }

     return (
          <div className='flex items-center justify-center mt-5'>
               <div className=' flex flex-col gap-4 w-96 border rounded bg-white px-7 py-10'>
                    <p className='text-2xl mb-3'>Register </p>
                    
                    <input type="text" placeholder='Full Name' onChange={(e) => setFormData({...formData, fullName: e.target.value})} className='p-3 border border-gray-30 rounded-sm text-sm' />
                    <input type="text" placeholder='Email' onChange={(e) => setFormData({ ...formData, email: e.target.value })} className='p-3 border border-gray-300 rounded-sm text-sm' />
                    <input type="text" placeholder='Password' onChange={(e) => setFormData({ ...formData, password: e.target.value })} className='p-3 border border-gray-300 rounded-sm text-sm' />

                    <input type="button" value="Register"
                         onClick={handleSubmit} className='p-3 border  rounded-md bg-blue-500 text-white text-sm' />
                    
                    <p className='text-sm text-center mt-2'>
                         Already have an account?
                         <Link to="/login" className='text-blue-500 underline'> Login</Link>
                    </p>
               </div>
          </div>
     )
}

export default Signup