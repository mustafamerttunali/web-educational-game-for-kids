const API = process.env.REACT_APP_API;

const sendAnswers = (answerState, point) => {
    try{
        fetch(API + point, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(answerState)
        }).then(res => res.json()).then(data => {
            console.log(data);
        }
        )
    }
    catch(error){
        console.log(error);
    }          
}

export { sendAnswers };