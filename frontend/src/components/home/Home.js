import React from 'react'

import { Container, Row, Col, Image, Card} from 'react-bootstrap'

import Apple from '../../images/apple.png'
import Robot from '../../images/robot.png'
import Boy from '../../images/boy.png'

// CSS
import "./Home.css"

export default function Home() {
  

  return (
    <div>
      <Container>
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
                    With supporting text below as a natural lead-in to additional content.
                  </Card.Text>
              </Card.Body>
            </Card>
          </Col>
       
          <Col md={4}>
            <Card>
              <Card.Img className='mx-auto d-block' variant="center" src={Apple} style={{height:"120px", width:"40%"}}/>
              <Card.Body>
                <Card.Title className="text-center">Counting Game</Card.Title>
                <Card.Text>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit longer.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Img className='mx-auto d-block' variant="center" src={Robot} style={{height:"120px", width:"40%"}}/>
              <Card.Body>
                <Card.Title className="text-center">Math Game</Card.Title>
                <Card.Text>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit longer.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Img className='mx-auto d-block' variant="center" src={Boy} style={{height:"120px", width:"40%"}}/>
              <Card.Body>
                <Card.Title className="text-center">Choosing Game</Card.Title>
                <Card.Text>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit longer.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
        </Row>
      </Container>
    </div>
  )
}
