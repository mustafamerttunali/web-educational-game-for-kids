import React, { useEffect, useState, useReducer } from 'react'
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap'
import HandModuleTest from '../hand-module/HandModuleTest';
import { GestureContext } from '../hand-module/GestureContext';
import { sendAnswers } from '../../utils/SendAnswers';

import SecretNav from '../secret-nav/SecretNav'

import Question from './Question';

const API = process.env.REACT_APP_API;

export default function CountGame() {
    const [user, setUser] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [buttonText, setButtonText] = useState("Next Question");
    const [userAnswers, setUserAnswers] = useState("");
    const [infoHand, setInfoHand] = useState("");
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [timer, setTimer] = useState(0);
    const [gesture] = React.useContext(GestureContext);
    const [isGameOver, setIsGameOver] = useState(false);

    const [coldStart, setColdStart] = useState(false);

    const numberHash = { one: 1, two: 2, three: 3, four: 4, five: 5 };


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
            setCurrentQuestion(data[currentQuestionIndex].number_of_object);
            setUser(data["player"]);
            const keys = Object.keys(data).filter(key => typeof data[key] === 'object');
            for(let i = 0; i < keys.length; i++){
                let key = keys[i];
                setQuestions(prevState => [...prevState, data[key]])
                setUserAnswers(prevState => {
                    return {...prevState, [data[key].number]: {
                        "name": data[key].name,
                        "correct_answer": data[key].number_of_object,
                        "user_answer": null,
                        "result": null,
                    }}
                })
            }
        }
        catch(error){
            console.log(error);
        }
        setColdStart(true);
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

        const interval = setInterval(async () => {
            if(count === 0){
                clearInterval(interval);
                if(userAnswer === currentQuestion){
                    setIsAnswerCorrect(true);
                    setInfoHand("Congrats! Your answer is correct! Redirecting to next question...");
                    setUserAnswers(prevState => {
                        return {
                            ...prevState, [questions[currentQuestionIndex].number]: {
                                "name": questions[currentQuestionIndex].name,
                                "correct_answer": questions[currentQuestionIndex].number_of_object,
                                "user_answer": userAnswer,
                                "result": true,
                            }
                        };
                    })
                    handleNextQuestion();
                }
                else{
                    setIsAnswerCorrect(false);
                    setInfoHand("Sorry! Your answer is incorrect! Redirecting to next question...");
                    setUserAnswers(prevState => {
                        return {
                            ...prevState, [questions[currentQuestionIndex].number]: {
                                "name": questions[currentQuestionIndex].name,
                                "correct_answer": questions[currentQuestionIndex].number_of_object,
                                "user_answer": userAnswer,
                                "result": false,
                            }
                        };
                    })
                    handleNextQuestion()
                }
                setIsAnswered(true);
            }
            else{
                setTimer(count);
                count--;
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [gesture])

    useEffect(() => {
        if(currentQuestionIndex === questions.length){
            if(coldStart){
                setIsGameOver(true);
                sendAnswers(userAnswers, `/count-game`);
                // Hide alert by document.getElementById("alert")
                document.getElementById("infoAlert").style.display = "none";
                setTimeout(() => {
                    window.location.href = '/dashboard';
                  }, 1500);
            }
        }else{
            try {
                setCurrentQuestion(questions[currentQuestionIndex].number_of_object);
            } catch (error) {
                
            }
        }
    }, [currentQuestionIndex])

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prevState => prevState + 1)
        if(currentQuestionIndex === questions.length - 2 ){
            setButtonText("Finish");
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
                        <Card.Body>
                                {

                                    isAnswered ?
                                        (
                                       isAnswerCorrect ?
                                            <Alert variant="success" id="infoAlert">
                                                {infoHand}
                                            </Alert>
                                        :
                                            <Alert variant="danger" id="infoAlert">
                                                {infoHand}
                                            </Alert>
                                        )
                                    :
                                        (
                                            gesture === null ? (
                                                <Alert  variant={"warning"} id="infoAlert">
                                                    {infoHand}
                                                </Alert>
                                            ) : (
                                                <Alert  variant={"primary"} id="infoAlert">
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
                            { isGameOver ? (
                                <Alert variant="info">
                                    <Alert.Heading className='text-center'>
                                        Game is over! Redirecting to the dashboard...
                                    </Alert.Heading>
                                </Alert>
                            ) : (
                                <div>
                                    <HandModuleTest isChoosingGame={false}/>
                                    <br></br>
                                    <Button variant="outline-primary" size="lg" onClick={() => {
                                        handleNextQuestion()
                                    }}> {buttonText}</Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

// try{
//     fetch(API + '/count-game', {
//         method: 'POST',
//         headers: {
//             Authorization: 'Bearer ' + localStorage.getItem('token'),
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(userAnswers)
//     }).then(res => res.json()).then(data => {
//         console.log(data);
//     }
//     )
// }
// catch(error){
//     console.log(error);
// }          