import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'

export default function Question(props) {
  return (
    <div>
        <h2>Q{props.qNumber}: How many {props.object} can you see?</h2>
            <Col md={12}>
                <Card className="text-left" border="dark">
                    <Row>
                        <Col md={6}>
                            {/* For this part based on the number of the object */}
                            <Card.Img className='mx-auto d-block' variant="center" src={props.image} style={{height:"160px", width:"30%"}}/>
                        </Col>
                    </Row>
                </Card>
            </Col>
    </div>
  )
}