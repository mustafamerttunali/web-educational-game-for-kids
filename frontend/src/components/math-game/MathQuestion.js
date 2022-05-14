import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'

export default function MathQuestion(props) {
  return (
    <div>
        <Col md={12}>
            <Card>
                <h1>Q:{props.questions[props.currentQuestionIndex].number} What is <strong>{props.questions[props.currentQuestionIndex].first_number} {props.questions[props.currentQuestionIndex].operator} {props.questions[props.currentQuestionIndex].second_number}</strong></h1>
            </Card>
        </Col>
    </div>
  )
}