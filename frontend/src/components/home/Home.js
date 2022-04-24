import React, { useEffect } from 'react'

export default function Home() {
 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div>Home</div>
  )
}
