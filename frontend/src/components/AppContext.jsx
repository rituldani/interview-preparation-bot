import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [questions, setQuestions] = useState("");
  const [transcript, setTranscript] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("")
  const [suggestion, setSuggestion] = useState("")

  return (
    <AppContext.Provider value={{ questions, setQuestions, transcript, setTranscript, currentIndex, setCurrentIndex, score, setScore, feedback, setFeedback, suggestion, setSuggestion }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
