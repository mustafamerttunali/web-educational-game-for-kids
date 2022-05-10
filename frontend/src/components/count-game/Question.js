import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'

export default function Question(props) {
  return (
    <div>
        <Col md={12}>
            <Card>
                <h1>Q:{props.questions[props.currentQuestionIndex].number} How many <strong>{props.questions[props.currentQuestionIndex].name}</strong> in the picture? :{props.questions[props.currentQuestionIndex].number_of_object}</h1>
                <Row>
                    {Array(props.questions[props.currentQuestionIndex].number_of_object).fill(0).map((_, index) => (
                        <Col md={6} key={index}>
                            <Card.Img   className='mx-auto d-block' variant="center" 
                                        src={(props.splitImagePath(props.questions[props.currentQuestionIndex].image_path))} 
                                        style={{height:"160px", width:"30%"}}/>
                            <hr></hr>
                        </Col>
                    ))}
                </Row>
            </Card>
        </Col>
    </div>
  )
}