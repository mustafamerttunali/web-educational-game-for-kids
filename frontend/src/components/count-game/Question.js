import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'

export default function Question(props) {
  return (
    <div>
        <h2>Q{props.qNumber}: How many {props.object} can you see?</h2>
        {
            // loop props.numberOfObjects times
            Array(props.nOfObjects).fill(0).map((_, index) => {
                return (
                    <Col md={12} key={props.key}>
                        <Card key={index}>
                            <Row>
                                <Col md={6}>
                                    <Card.Img className='mx-auto d-block' variant="center" src={props.image} style={{height:"160px", width:"30%"}}/>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                )
            })
        }
    </div>
  )
}