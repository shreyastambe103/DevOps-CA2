import React from 'react'
import { AuthContext } from '../contacts/AuthProvider.jsx'
import { useLocation, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { Spinner } from 'flowbite-react';

const PrivateRoute = ({children}) => {
    const {user, loading} = useContext(AuthContext);
    const location = useLocation();

    if(loading){
        return <div className='text-center'>
            <Spinner aria-Label="Center-aligned spinner example "/>
        </div>
    }

    if(user){
        return children;
    }
  return (
    <Navigate to="/login" state={{from: location}} replace></Navigate>
  )
}

export default PrivateRoute