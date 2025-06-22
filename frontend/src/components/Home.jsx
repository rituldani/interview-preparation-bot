import React, { useState } from 'react'
import axios from "axios"
import AudioRecorder from './MediaRecorder';
import { useAppContext } from './AppContext';
import toast from 'react-hot-toast';
function Home() {
    const { questions, setQuestions, currentIndex, setCurrentIndex, setTranscript, setScore, setFeedback, setSuggestion } = useAppContext();
    const [Role, setRole] = useState("")

    const speak = (text) => {
        window.speechSynthesis.cancel(); // Prevent overlap
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
    };

    const previousQuestion = () => {
        setTranscript("");
        const newIndex = Math.max(currentIndex - 1, 0);
        setCurrentIndex(newIndex);
        setScore(0)
        setFeedback("")
        setSuggestion("")
        speak(questions[newIndex]);
    };

    const nextQuestion = () => {
        setTranscript("");
        const newIndex = Math.min(currentIndex + 1, questions.length - 1);
        setCurrentIndex(newIndex);
        setScore(0)
        setFeedback("")
        setSuggestion("")
        speak(questions[newIndex]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent form reload
        console.log("Role:", Role)
        if (!Role) {
            return toast.error("Role is required")
        }
        try {
            const response = await axios.post(`${process.env.VITE_BACKEND_URL}/api/generator/questions`, { role: Role }, {
                withCredentials: true
            });
            console.log(response.data.questions);
            const allItems = response.data.questions;
            const filteredQuestions = allItems.filter(q => /^\d+\./.test(q.trim()));
            const cleanedText = filteredQuestions.map(q => q.replace(/^\d+\.\s*/, ''));
            setQuestions(cleanedText)
            setCurrentIndex(0); // start from first question
            speak(cleanedText[0]);
            setRole("");
        }
        catch (error) {
            console.log("Cannot generate", error)
        }
    } 

    return (
        <div>
            {questions.length > 0 ?
                (
                    <div className="mt-4">
                        <div className='border-3 border-zinc-500 p-6 m-6 rounded-md w-[900px]'>
                            <p className="font-bold">Question {currentIndex + 1}:</p>
                            <p>{questions[currentIndex]}</p>
                        </div>

                        {currentIndex === questions.length - 1 && (
                            <p className="text-green-500 mt-4">✅ You've reached the end of the questions!</p>
                        )}

                        <div className="m-6 flex justify-around ">
                            <button onClick={previousQuestion}> ⬅️ Previous Question </button>
                            <button onClick={() => speak(questions[currentIndex])}> 🔊 Repeat </button>
                            <button onClick={nextQuestion}> ➡️ Next Question </button>
                        </div>

                        <AudioRecorder />

                        <button onClick={()=>setQuestions("")} >Cancel</button>
                    </div>
                ) :
                (
                    <div className='flex flex-col gap-4 items-center'>
                        <h1>AI-Powered Interview Preparation Bot</h1>
                        <form onSubmit={handleSubmit} className=' bg-zinc-800 flex justify-around border border-zinc-600 p-6 rounded-md w-[800px]'>
                            <input
                                type='text'
                                placeholder='Enter Job Role'
                                value={Role}
                                onChange={(e) => setRole(e.target.value)}
                                className='p-2 border border-zinc-600 rounded-md w-[600px] bg-white text-black font-semibold'
                            />
                            <button className='w-[100px]' type='submit'>Send</button>
                        </form>
                    </div>
                )
            }
        </div>
    )
}

export default Home