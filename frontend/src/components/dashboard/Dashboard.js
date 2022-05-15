import React, { useEffect, useState } from 'react'

import { Container, Row, Col, Card } from 'react-bootstrap'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import SecretNav from '../secret-nav/SecretNav';

import Apple from '../../images/apple.png'
import Robot from '../../images/robot.png'
import Boy from '../../images/boy.png'

import "./Dashboard.css"

const API = process.env.REACT_APP_API;

export default function Dashboard() {
  const [user, setUser] = useState("");
  const [countGamePercentage, setCountGamePercentage] = useState(0);
  const [mathGamePercentage, setMathGamePercentage] = useState(0);
  const [choosingGamePercentage, setChoosingGamePercentage] = useState(0);
  const percentage = 66;

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
          console.log(data)
          setUser(data['child_first_name']);
          let totalChooseGame = data['total_choose_game'];
          let totalMathGame = data['total_math_game'];
          let totalCountGame = data['total_count_game'];

          setCountGamePercentage((totalCountGame[1] / totalCountGame[0] * 100).toFixed(0))
          setMathGamePercentage((totalMathGame[1] / totalMathGame[0] * 100).toFixed(0))
          setChoosingGamePercentage((totalChooseGame[1] / totalChooseGame[0] * 100).toFixed(0))
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
                <Card.Text className='text-justify'>
                Counting Game teaches children to count by using objects that we often use in our lives.
                <br></br>
                <br></br>
                </Card.Text>
                <a href="/count-game" className="btn btn-primary">Go to Game</a>
                <br></br>
                <br></br>
                  <CircularProgressbar value={countGamePercentage} text={`${countGamePercentage}%`} style={{height:"100px"}}/>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Img className='mx-auto d-block' id="kidImage" variant="center" src={Robot} style={{height:"120px", width:"30%"}}/>
              <Card.Body className='text-center'>
                <Card.Title className="text-center">Math Game</Card.Title>
                <Card.Text className="text-justify">
                  Math Game aims to teach children addition, subtraction, multiplication and division with simple numbers.
                </Card.Text>
                <a href="/math-game" className="btn btn-primary text-center">Go to Math Game</a>
                <br></br>
                <br></br>
                  <CircularProgressbar value={mathGamePercentage} text={`${mathGamePercentage}%`} style={{height:"100px"}}/>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Img className='mx-auto d-block' variant="center" src={Boy} style={{height:"120px", width:"20%"}}/>
              <Card.Body className='text-center'>
                <Card.Title className="text-center">Choosing Game</Card.Title>
                <Card.Text>
                  Choose game aims to teach young children about objects that are frequently used in our lives.
                  <br></br>
                  <br></br>
                </Card.Text>
                <a href="/choosing-game" className="btn btn-primary text-center">Go to Choosing Game</a>
                <br></br>
                <br></br>
                  <CircularProgressbar className="primary" value={choosingGamePercentage} text={`${choosingGamePercentage}%`} style={{height:"100px"}}/>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
