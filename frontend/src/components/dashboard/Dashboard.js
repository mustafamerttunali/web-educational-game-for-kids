import React, { useEffect } from 'react'

const API = process.env.REACT_APP_API;

export default function Dashboard() {
 

  useEffect(() => {

    const token = localStorage.getItem('token');

    if (token) {
      fetch(API + '/dashboard', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data['status'] !== 200){
          window.location.href = '/login';
        }
      })
    } else{
      window.location.href = '/login';
    }
  }, []);

  return (
    <div>Dashboard</div>
  )
}
