import React, { useState } from 'react'

// Boostrap
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'

import UnsecretNav from "../unsecret-nav/UnsecretNav";

// CSS
import './Login.css'

const API = process.env.REACT_APP_API;

export default function Login(props) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setemailError] = useState("");

  const [loginError] = useState("Cannot login! Email or password is incorrect!");
  const [loginSuccess] = useState("Successfully signed-in! Redirecting to dashboard...");

  const handleValidation = (event) => {
    let formIsValid = true;

    if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      formIsValid = false;
      setemailError("Email is not valid.");
      return false;
    } else {
      setemailError("");
      formIsValid = true;
    }
    return formIsValid;
  };

  // Destroy token: localStorage.removeItem('token');
  const loginSubmit = (e) => {
    e.preventDefault();
    let isFormValid = handleValidation();
    if(isFormValid){
      const formData = {
        'email': email,
        'password': password
    }

      fetch(API + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then(data => {
        if (data['status'] === 200){
          document.getElementById('loginError').style.display = 'none';
          document.getElementById('successLogin').style.display = 'block';  

          localStorage.setItem('token', data['access_token']);
          setTimeout(() => {
            window.location.href = '/dashboard';
          }
          , 1500);
        }
        else{
          document.getElementById('loginError').style.display = 'block';
          document.getElementById('successLogin').style.display = 'none';
        }
      })
    }
  };

  return (
    <div>
      <Container>
        <UnsecretNav />
        <Row className='d-flex justify-content-center'>
          <Col md={12}>
            <h1 className='text-center'>Login</h1>
            <hr></hr>
          </Col>
        
          <Col md={4}>
            <Form onSubmit={loginSubmit}>

              <Form.Group className="mb-3">
                <Form.Label>
                  Email
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="email" 
                                placeholder="Email"
                                id="EmailInput"
                                name="EmailInput"
                                aria-describedby='emailHelp'
                                onChange={(event) => setEmail(event.target.value)} />
                </Col>
                <small id="emailHelp" className="text-danger form-text">
                  {emailError}
                </small>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Password
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="password" 
                                placeholder="Password"
                                id="InputPassword"
                                onChange={(event) => setPassword(event.target.value)} />
                </Col>
                <Form.Text className="text-muted">
                  Don't you have an account? <a href="/register">Register</a>
                </Form.Text>
              </Form.Group>
              <Form.Text className="text-muted">
                  Forgot your password? <a href="/reset-password">Reset your password</a>
                  <br></br>
              </Form.Text>
              <br></br>

              <Col md={12} className='d-flex justify-content-left'>
                <Button variant="primary" type="submit">
                  Login
                </Button>
              </Col>

              <br></br>

              <Alert id="successLogin" variant={"success"}>
                {loginSuccess}
              </Alert>

              <Alert id="loginError" variant={"danger"}>
                {loginError}
              </Alert>

            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}