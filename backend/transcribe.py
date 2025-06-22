import whisper
import sys

audio_path = sys.argv[1]

print("Running Whisper on:", audio_path)

model = whisper.load_model("base")
result = model.transcribe(audio_path)
print(result["text"])
