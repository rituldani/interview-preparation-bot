import React, { useState } from 'react';
import axios from 'axios';
import { useAppContext } from './AppContext';
import Evaluate from './Evaluate';
import toast from 'react-hot-toast';

function AudioRecorder() {
  const { transcript, setTranscript, score, feedback, suggestion } = useAppContext();
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  // const [transcript, setTranscript] = useState("");

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new window.MediaRecorder(stream); // optional: `window.` for clarity

    const chunks = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'answer.webm');

      try {
        const res = await axios.post('http://localhost:3001/api/record/transcribe', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log(res.data.transcription)
        setTranscript(res.data.transcription);
      } catch (error) {
        console.error("Transcription failed", error);
      }
    };

    recorder.start();
    setMediaRecorder(recorder);
    setAudioChunks(chunks);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      // toast.success("recorded audio")
    }
  };

  return (
    <div>
      {
        (score || feedback || suggestion) ?
          "" : (
            <div className="m-4 items-center">
              {!isRecording ? (
                <button onClick={startRecording}>🎙️ Start Recording</button>
              ) : (
                <button onClick={stopRecording}>🛑 Stop Recording</button>
              )}
            </div>
          )
      }


      {
        transcript && (
          <Evaluate />
        )
      }
    </div >
  );
}

export default AudioRecorder;
