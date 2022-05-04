import React, { useEffect } from 'react'

export default function Logout() {
    // localStorage.removeItem('token');

    useEffect(() => {
        localStorage.removeItem('token');
        setTimeout(() => {
            window.location.href = '/login';
          }
          , 1500);
    }, []);
    
  return (
    <div>Logout... Please wait!</div>
  )
}