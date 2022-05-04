import React, { useEffect, useState } from 'react'

import { Container, Row, Col } from 'react-bootstrap'

import SecretNav from '../secret-nav/SecretNav';

const API = process.env.REACT_APP_API;

export default function Dashboard() {
  const [user, setUser] = useState("");


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
        else{
          setUser(data['child_first_name']);
        }
      })
    } else{
      window.location.href = '/login';
    }
  }, []);

  return (
    <div>
      <Container>
        <Row>
          <SecretNav user={user}/>
        </Row>
      </Container>
    </div>
  )
}
