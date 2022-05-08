import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import HandModuleTest from '../hand-module/HandModuleTest';

import SecretNav from '../secret-nav/SecretNav'

import Robot from '../../images/robot.png'
import Question from './Question';

const API = process.env.REACT_APP_API;

export default function CountGame() {
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
            <SecretNav />
            <Row className='d-flex justify-content-left'>
                <Col md={12}>
                    <h1 className='text-center'>Counting Game</h1>
                    <hr></hr>
                </Col>
                <Col md={12}>
                    <Card className="text-center">
                        <Card.Header>Player: <strong>{user}</strong></Card.Header>
                    </Card>
                </Col>
                <Col md={8}>
                    <Question qNumber={1} object="Robot" image={Robot}/>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <HandModuleTest />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </div>
  )
}
