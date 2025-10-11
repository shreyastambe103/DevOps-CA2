import React from 'react'
import { AuthContext } from '../contacts/AuthProvider'
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';


const Logout = () => {
    const {logOut} = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from?.pathname || "/";
    const handleLogout = () => {
        logOut().then(() => {
            alert("sign out successfully !");
            navigate(from, {replace: true})
        }).catch((error) => {

        });
    }
  return (
    <div className='h-screen flex items-center justify-center' style={{backgroundColor : '#f29ad8'}}>
        <button className='px-8 py-2 text-white rounded shadow-xl' style={{backgroundColor:'	#008fbf',borderRadius: '1rem',height:'4rem', width:'10rem'
        }} onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Logout