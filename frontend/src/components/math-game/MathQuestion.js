import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'

export default function MathQuestion(props) {

  return (
    <div>
        <Col md={12}>
            <Card>
                <h1><strong>What is the result of math question below?</strong></h1>
                <br></br>
                <Row>
                  <Col md={4}>
                      <Card.Img   className='mx-auto d-block' variant="center" 
                                  src={props.firstNumber} 
                                  style={{height:"160px", width:"100%"}}/>
                  </Col>
                  <Col md={4}>
                      <Card.Img   className='mx-auto d-block' variant="center" 
                                  src={props.operator} 
                                  style={{height:"160px", width:"100%"}}/>
                  </Col>
                  <Col md={4}>
                      <Card.Img   className='mx-auto d-block' variant="center" 
                                  src={props.secondNumber} 
                                  style={{height:"160px", width:"100%"}}/>
                  </Col>
                </Row>
            </Card>
        </Col>
    </div>
  )
}