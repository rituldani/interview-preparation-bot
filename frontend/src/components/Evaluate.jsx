import React from 'react'
import { useAppContext } from './AppContext'
import axios from 'axios';

function Evaluate() {
    const { questions, transcript, currentIndex, score, setScore, feedback, setFeedback, suggestion, setSuggestion } = useAppContext();
    const currentQuestion = questions[currentIndex]

    const handleEvaluate = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/evaluation/evaluate`, {
                question: currentQuestion,
                answer: transcript
            }, {
                withCredentials: true
            });
            console.log(response.data.score)
            console.log(response.data.feedback)
            console.log(response.data.suggestion)
            setScore(response.data.score);
            setFeedback(response.data.feedback)
            setSuggestion(response.data.suggestion)
        }
        catch (error) {
            console.log("Evaluation error", error);
        }
    }
    return (
        <div className='items-center'>
            {
                (score || feedback || suggestion) ? (
                    <div className='w-[900px]'>
                        <p className='border-1 bg-[#8f2439] p-2 m-4 items-start rounded-sm'><strong>Score:</strong> {score}</p>
                        <p className='border-1 bg-[#8f2439] p-2 m-4 items-start rounded-sm'><strong>Feedback:</strong> {feedback}</p>
                        <p className='border-1 bg-[#8f2439] p-2 m-4 items-start rounded-sm'><strong>Suggestion:</strong> {suggestion}</p>
                    </div>
                ) :
                    (
                        <button className='m-4 items-center' onClick={handleEvaluate} >Evaluate</button>

                    )
            }
        </div>
    )
}

export default Evaluate