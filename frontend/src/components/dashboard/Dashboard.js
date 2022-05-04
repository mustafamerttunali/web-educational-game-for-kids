import React, { useEffect, useState } from 'react'

import { Container, Row, Col, Card, Button } from 'react-bootstrap'

import SecretNav from '../secret-nav/SecretNav';

import Apple from '../../images/apple.png'
import Robot from '../../images/robot.png'
import Boy from '../../images/boy.png'

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
        <Row className='d-flex justify-content-center'>
          <SecretNav user={user}/>
          <Col md={12}>
            <h1 className='text-center'>Dashboard</h1>
            <hr></hr>
          </Col>

          <Col md={12}>
          <Card className="text-center">
              <Card.Header>Welcome to Web Educational Game for Kids, <strong>{user}</strong></Card.Header>
                <Card.Body>
                  <Card.Title>A COMP 204 project.</Card.Title>
                  <Card.Text>
                    A web application for kids to learn about the world around them. <br></br>
                    This project is developed by COMP 204 students at the MEF University. <br></br>
                    Instructor: Prof.Dr. Muhittin Gokmen.
                  </Card.Text>
              </Card.Body>
            </Card>
          </Col>
       
          <Col md={4}>
            <Card>
              <Card.Img className='mx-auto d-block' variant="center" src={Apple} style={{height:"120px", width:"30%"}}/>
              <Card.Body className='text-center'>
                <Card.Title className="text-center">Counting Game</Card.Title>
                <Card.Text>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit longer.
                </Card.Text>
                <a href="/counting-game" className="btn btn-primary">Go to Game</a>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Img className='mx-auto d-block' id="kidImage" variant="center" src={Robot} style={{height:"120px", width:"30%"}}/>
              <Card.Body className='text-center'>
                <Card.Title className="text-center">Math Game</Card.Title>
                <Card.Text>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit longer.
                </Card.Text>
                <a href="/math-game" className="btn btn-primary text-center">Go to Math Game</a>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Img className='mx-auto d-block' variant="center" src={Boy} style={{height:"120px", width:"20%"}}/>
              <Card.Body className='text-center'>
                <Card.Title className="text-center">Choosing Game</Card.Title>
                <Card.Text>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit longer.
                </Card.Text>
                <a href="/choosing-game" className="btn btn-primary text-center">Go to Choosing Game</a>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
