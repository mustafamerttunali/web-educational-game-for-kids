import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap'
import HandModuleTest from '../hand-module/HandModuleTest';

import SecretNav from '../secret-nav/SecretNav'

// import Question from './Question';

const API = process.env.REACT_APP_API;

export default function CountGame() {
    const [user, setUser] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [buttonText, setButtonText] = useState("Next Question");

    const splitImagePath = (imagePath) => {
        const split = imagePath.split("/");
        const imageName = split[split.length - 1];
        const finalPath =  `images/${imageName}`;
        return finalPath;
    }

    const getQuestions = async () => {
        try{
            const response = await fetch(API + '/count-game', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
                });
            const data = await response.json();
            console.log(data)
            setUser(data["player"]);
            const keys = Object.keys(data).filter(key => typeof data[key] === 'object');
            for(let i = 0; i < keys.length; i++){
                let key = keys[i];
                setQuestions(prevState => [...prevState, data[key]]);
            }
        }
        catch(error){
            console.log(error);
        }
    }
    useEffect(() => {
        getQuestions()
    }, []);

    const handleNextQuestion = () => {
        setCurrentQuestion(prevState => prevState + 1);
        if(currentQuestion === questions.length - 2 ){
            setButtonText("Finish");
        }
        else if(currentQuestion === questions.length - 1){
            alert("Game Over");
            // TODO: Post the answers to the backend
        }
    }

  return (
    <div>
        <Container>
            <SecretNav user={user}/>
            <Row className='d-flex justify-content-left'>
                <Col md={12}>
                    <h1 className='text-center'>Counting Game</h1>
                    <hr></hr>
                </Col>
                <Col md={12}>
                    <Card className="text-center">
                        <Card.Header>Player: <strong>{user}</strong></Card.Header>
                    </Card>
                </Col>
                <Col md={8}>

                {
                    questions.length > 0 && questions[currentQuestion] !== undefined ? (
                    <Col md={12}>
                            <Card>
                                <h1>Q:{questions[currentQuestion].number} How many <strong>{questions[currentQuestion].name}</strong> in the picture? :{questions[currentQuestion].number_of_object}</h1>
                                <Row>
                                    {Array(questions[currentQuestion].number_of_object).fill(0).map((_, index) => (
                                        <Col md={6} key={index}>
                                            <Card.Img className='mx-auto d-block' variant="center" src={(splitImagePath(questions[currentQuestion].image_path))} style={{height:"160px", width:"30%"}}/>
                                            <hr></hr>
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        </Col>) : (
                        currentQuestion === questions.length ? (
                            <div>
                                <br></br>
                                <Alert variant="info">
                                    <Alert.Heading className='text-center'>
                                        There are no question available for that game.
                                    </Alert.Heading>
                                </Alert>
                            </div>
                    ) : (
                        <h1>Loading...</h1> 
                        // TODO: Check if there are questions available
                        )
                    )
                }

                </Col>
                <Col md={4} className="text-center">
                    <Card>
                        <Card.Body>
                            <HandModuleTest/>
                            <br></br>
                            <Button variant="outline-primary" size="lg" onClick={() => {
                                handleNextQuestion()
                                
                            }}> {buttonText}</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </div>
  )
}