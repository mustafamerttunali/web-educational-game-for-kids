import React from 'react'

// Boostrap 
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div>
        <Container>
          <Row>
              <Col md ={12}>
                <p className="text-center"> 
                  {/* <small>
                    &copy; Copyright {currentYear} - Mustafa Mert Tunali, Ahmet Yildiz, Emir Çetin Memis
                  </small>  */}
                   <small>
                      {currentYear} - MEF Dynamics Eğitim
                  </small>
                </p> 
              </Col>
          </Row>
        </Container>
    </div>
  )
}