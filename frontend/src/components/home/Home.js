import React, { useEffect } from 'react'

import { Container, Row, Col, Card} from 'react-bootstrap'
import UnsecretNav from "../unsecret-nav/UnsecretNav";

import Apple from '../../images/apple.png'
import Robot from '../../images/robot.png'
import Boy from '../../images/boy.png'

// CSS
import "./Home.css"

const API = process.env.REACT_APP_API;

export default function Home() {

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
          window.location.href = '/dashboard';
        }
      })
    } else{
     
    }
  })
  
  return (
    <div>
      <Container>
        <UnsecretNav />
        <Row className='d-flex justify-content-center'>
          <Col md={12}>
            <h1 className='text-center'>Home</h1>
            <hr></hr>
          </Col>

          <Col md={12}>
          <Card className="text-center">
              <Card.Header>Welcome to Web Educational Game for Kids!</Card.Header>
                <Card.Body>
                  <Card.Title>A COMP 204 project.</Card.Title>
                  <Card.Text>
                    Please register/login to see the dashboard.
                  </Card.Text>
              </Card.Body>
            </Card>
          </Col>
       
          <Col md={4}>
            <Card>
              <Card.Img className='mx-auto d-block' variant="center" src={Apple} style={{height:"120px", width:"30%"}}/>
              <Card.Body>
                <Card.Title className="text-center">Counting Game</Card.Title>
                <Card.Text>
                Counting Game teaches children to count by using objects that we often use in our lives.
                <br></br>
                <br></br>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Img className='mx-auto d-block' id="kidImage" variant="center" src={Robot} style={{height:"120px", width:"30%"}}/>
              <Card.Body>
                <Card.Title className="text-center">Math Game</Card.Title>
                <Card.Text>
                  Math Game aims to teach children addition, subtraction, multiplication and division with simple numbers.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Img className='mx-auto d-block' variant="center" src={Boy} style={{height:"120px", width:"20%"}}/>
              <Card.Body>
                <Card.Title className="text-center">Choosing Game</Card.Title>
                <Card.Text>
                  Choose game aims to teach young children about objects that are frequently used in our lives.
                  <br></br>
                  <br></br>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
        </Row>
      </Container>
    </div>
  )
}
