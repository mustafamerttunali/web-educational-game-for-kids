import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap'
import HandModuleTest from '../hand-module/HandModuleTest';
import { GestureContext } from '../hand-module/GestureContext';

import SecretNav from '../secret-nav/SecretNav'

import Question from './Question';

const API = process.env.REACT_APP_API;

export default function CountGame() {
    const [user, setUser] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [buttonText, setButtonText] = useState("Next Question");
    const [infoHand, setInfoHand] = useState("");
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [timer, setTimer] = useState(0);
    const [gesture] = React.useContext(GestureContext);

    const numberHash = { one: 1, two: 2, three: 3, four: 4, five: 5 };
    const answers = {
        1:{
            "name": null,
            "number_of_object": null,
            "result": null,
            },
        }

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
            setCurrentQuestion(data[currentQuestionIndex].number_of_object);
            setUser(data["player"]);
            const keys = Object.keys(data).filter(key => typeof data[key] === 'object');
            for(let i = 0; i < keys.length; i++){
                let key = keys[i];
                console.log(data[key])
                setQuestions(prevState => [...prevState, data[key]]);
            }
        }
        catch(error){
            console.log(error);
        }
    }
    useEffect(() => {
        getQuestions()
    }, [])

    useEffect(() => {
        const userAnswer = numberHash[gesture];
        setIsAnswerCorrect(false);
        setIsAnswered(false);
        setTimer("");
        
        let count = 2;
        if(gesture === null || gesture === undefined){
            setInfoHand("Hand is not detected!");
            setIsAnswered(false);
            return;
        }
        else{
            setInfoHand("Getting your answer... Please hold your hand!");
        }

        const interval = setInterval(() => {
            if(count === 0){
                clearInterval(interval);
                if(userAnswer === currentQuestion){
                    setIsAnswerCorrect(true);
                    setInfoHand("Congrats! Your answer is correct! Redirecting to next question...");
                    handleNextQuestion();
                    // TODO: Add correct answers to state with question number
                }
                else{
                    setIsAnswerCorrect(false);
                    setInfoHand("Sorry! Your answer is incorrect! Redirecting to next question...");
                }
                setIsAnswered(true);
                // answers[currentQuestionIndex] = {
                //     "name": questions[currentQuestionIndex].name,
                //     "number_of_object": questions[currentQuestionIndex].number_of_object,
                //     "result": isAnswerCorrect,
                // }
            }
            else{
                setTimer(count);
                count--;
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [gesture])

    useEffect(() => {
        try {
            setCurrentQuestion(questions[currentQuestionIndex].number_of_object);
        } catch (error) {
            
        }
    }, [currentQuestionIndex])

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prevState => prevState + 1);
        
        if(currentQuestionIndex === questions.length - 2 ){
            setButtonText("Finish");
        }
        else if(currentQuestionIndex === questions.length - 1){
            alert("Game Over"); // TODO: Modal component, show how many questions user got correct
            console.log(answers)
            // setTimeout(() => {
            //     window.location.href = '/dashboard';
            //   }
            //   , 1500);
            // TODO: Post the answers to the backend
        }
        setCurrentQuestion(questions[currentQuestionIndex].number_of_object);
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
                        <Card.Body>
                                {

                                    isAnswered ?
                                        (
                                       isAnswerCorrect ?
                                            <Alert variant="success">
                                                {infoHand}
                                            </Alert>
                                        :
                                            <Alert variant="danger">
                                                {infoHand}
                                            </Alert>
                                        )
                                    :
                                        (
                                            gesture === null ? (
                                                <Alert  variant={"warning"}>
                                                    {infoHand}
                                                </Alert>
                                            ) : (
                                                <Alert  variant={"primary"}>
                                                    {infoHand}: {timer}
                                                </Alert>
                                            )
                                        )
                                }
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>

                {
                    questions.length > 0 && questions[currentQuestionIndex] !== undefined ? (
                        <Question   questions={questions} 
                                    currentQuestionIndex={currentQuestionIndex}
                                    splitImagePath={splitImagePath}/>
                        ) : (
                        currentQuestionIndex === questions.length ? (
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