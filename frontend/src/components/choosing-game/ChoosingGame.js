import React, { useEffect } from 'react'
import ChoosingGameHandModule from './ChoosingGameHandModule'

import { HandCoordinateContext } from "../hand-module/GestureContext"; 

const API = process.env.REACT_APP_API;

export default function ChoosingGame() {
  const [handCoordinates] = React.useContext(HandCoordinateContext);
  const [user, setUser] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionAnswer, setCurrentQuestionAnswer] = useState(0);
  const [buttonText, setButtonText] = useState("Next Question");
  const [userAnswers, setUserAnswers] = useState("");
  const [infoHand, setInfoHand] = useState("");
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timer, setTimer] = useState(0);
  const [coldStart, setColdStart] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [variant, setVariant] = useState("warning");

  const getQuestions = async () => {
    try{
        const response = await fetch(API + '/choose-game', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        });
        const data = await response.json();
        console.log(data)
        setCurrentQuestionAnswer(data[currentQuestionIndex].correct_answer);
    }
    catch(error){
        console.log(error);
    }
  }

  useEffect(() => {
    getQuestions();
  }, []);

  useEffect(() => {
    console.log(handCoordinates);
  }, [handCoordinates]);

  return (
    <div>
        <ChoosingGameHandModule isChoosingGame={true} />
    </div>
  )
}
