import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import SecretNav from '../secret-nav/SecretNav';
import UnsecretNav from '../unsecret-nav/UnsecretNav';
import Profile from './Profile';

const API = process.env.REACT_APP_API;

export default function AboutUs() {
    const [useSecretNav, setUseSecretNav] = useState(false);
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
                setUseSecretNav(false)
            }
            else{
              setUser(data['child_first_name']);
              setUseSecretNav(true)
            }
          })
        } else{
            setUseSecretNav(false)
        }
    }, []);

  return (
    <div>
        <Container>
            <Row className='d-flex justify-content-center'>
                {useSecretNav ? <SecretNav user={user}/> : <UnsecretNav/>}
                <Col md={12}>
                    <br></br>
                    <h1 className='text-center'>About Us</h1>
                    <hr></hr>
                </Col>
                <Col md={4}>
                   <Profile
                        name="Mustafa Mert Tunali"
                        text="Second year computer engineering student at MEF University."
                        github="https://github.com/mustafamerttunali"
                        linkedin="https://www.linkedin.com/in/mustafa-mert-tunali/"
                        image="profile/pp.png"
                    />
                </Col>
                <Col md={4}>
                   <Profile
                        name="Emir Cetin Memis"
                        text="Second year computer engineering student at MEF University."
                        github="https://github.com/SplishBoom"
                        linkedin="https://www.linkedin.com/in/emir-%C3%A7etin-memi%C5%9F-026b78221/"
                        image="profile/emir.png"
                    />
                </Col>
                <Col md={4}>
                   <Profile
                        name="Ahmet Yildiz"
                        text="Second year computer engineering student at MEF University."
                        github="https://github.com/yildizahmett"
                        linkedin="https://www.linkedin.com/in/yildizahmet/"
                        image="profile/ahmet.jpeg"
                    />
                </Col>
            </Row>
        </Container>
    </div>
  )
}
