import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'

export default function ChoosingGameQuestion(props) {
  return (
    <div>
        <Col md={12}>
            <Card>
                <h1>Please choose <strong>"{props.questions.correct_object}"</strong> below the image.{props.firstObjectImage} </h1>
                <br></br>
                <Row>
                  <Col md={6}>
                      <Card.Img   className='mx-auto d-block' variant="center" 
                                  src={props.firstObjectImage} 
                                  style={{height:"160px", width:"80%", border:props.firstObjectBorder}}/>

                  </Col>
                    <Col md={6}>
                        <Card.Img   className='mx-auto d-block' variant="center" 
                                        src={props.secondObjectImage} 
                                        style={{height:"160px", width:"60%", border:props.secondObjectBorder}}/>
                    </Col>
                </Row>
            </Card>
        </Col>
    </div>
  )
}
