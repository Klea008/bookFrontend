import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useUserStore from '../stores/useUserStore'

const Header = () => {
     const { logout } = useUserStore();

     const navigate = useNavigate(); 

     const handleLogout = async () => {
          await logout(); // Wait for logout to finish
          navigate('/login'); // Redirect to login page after logout
     }   
     

     return (
          <nav className="bg-gray-800 text-white p-4 mb-5">
               <div className="container mx-auto flex flex-wrap items-center justify-between">
                    <div className="text-lg font-bold">BookStore</div>
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                         <div className="flex flex-row gap-4 md:gap-8">
                              <Link to="/lh" className="hover:text-gray-400">Home</Link>
                              <Link to="/p" className="hover:text-gray-400">Search</Link>
                              <Link to="/" className="hover:text-gray-400">Explore</Link>
                              <Link to="/bl" className="hover:text-gray-400">My Lists</Link>
                         </div>
                    </div>

                    <button onClick={handleLogout} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"> Logout
                    </button>
               </div>
          </nav>

     )
}

export default Header