import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import HandModuleTest from '../hand-module/HandModuleTest';

import SecretNav from '../secret-nav/SecretNav'

// import Question from './Question';

const API = process.env.REACT_APP_API;

export default function CountGame() {
    const [user, setUser] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);

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
                // Wait for the setQuestions to be set
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
    }



  return (
    <div>
        <Container>
            <SecretNav />
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
                    questions.length > 0 && questions[currentQuestion] &&
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
                        </Col>
                }

                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            {/* <HandModuleTest /> */}
                            <Button variant="primary" onClick={() => {
                                handleNextQuestion()
                                
                            }}> onClick </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </div>
  )
}


{
     /* {
                        // Show only 1 question at a time and hide the rest
                        questions.map((question, index) => {
                            
                            return (
                                <Card key={index} id={`question-${index}`} className="text-center questionsdiv">
                                    <Card.Header>
                                        <strong>{question.name}</strong>
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Text>
                                            {question.number}
                                        </Card.Text>
                                        <Button variant="primary" onClick={() => hideQuestion(`question-${index}`)}>
                                            Hide
                                        </Button>
                                    </Card.Body>
                                </Card>
                            )
                        })
                        
                    } */
}

    
                    {/* {
                    
                    questions.map((question) => (
                        <Col md={12} key={currentQuestion}>
                            <Card key={question._id} id={question.name + question.number}>
                                <h1>Q:{question.number} How many <strong>{question.name}</strong> in the picture? :{question.number_of_object}</h1>
                                <Row>
                                    {Array(question.number_of_object).fill(0).map((_, index) => (
                                        <Col md={6} key={index}>
                                            <Card.Img className='mx-auto d-block' variant="center" src={(splitImagePath(question.image_path))} style={{height:"160px", width:"30%"}}/>
                                            <hr></hr>
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        </Col>
                    ))
                    
                    } */}