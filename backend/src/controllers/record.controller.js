// import path from "path"
// import fs from "fs"
// import { spawn } from "child_process"
// import { exec } from 'child_process';
// export const Recorder = async (req, res) => {

//     console.log("do i reaced")
//     // const filePath = path.join(__dirname, '..', req.file.path);
//     const filePath = req.file.path;
//     console.log(filePath)

//     exec(`whisper ${filePath} --language English --model base`, (error, stdout, stderr) => {
//         if (error) {
//             console.error('Transcription error:', error);
//             return res.status(500).json({ error: 'Whisper transcription failed.' });
//         }

//         // Output is saved in a .txt file, read it:
//         const txtFilePath = `${filePath}.txt`;
//         import('fs').then(fs => {
//             fs.readFile(txtFilePath, 'utf8', (err, data) => {
//                 if (err) {
//                     console.error('Error reading Whisper output:', err);
//                     return res.status(500).json({ error: 'Failed to read transcription output.' });
//                 }
//                 res.json({ transcript: data });
//             });
//         });
//     });

//     // const pythonProcess = spawn('python', ['transcribe.py', filePath]);

//     // let output = '';
//     // pythonProcess.stdout.on('data', (data) => {
//     //     output += data.toString();
//     // });

//     // pythonProcess.stderr.on('data', (data) => {
//     //     console.error('Python error:', data.toString());
//     // });

//     // pythonProcess.on('close', (code) => {
//     //     fs.unlinkSync(filePath); // delete temp file after processing
//     //     if (code !== 0) {
//     //         return res.status(500).json({ error: 'Failed to transcribe audio' });
//     //     }
//     //     res.json({ transcription: output.trim() });
//     // });
// }

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const Recorder = async (req, res) => {
    // const filePath = path.join(__dirname, '..', req.file.path);
    // const filePath = path.join(__dirname, req.file.path);
    const filePath = path.resolve(req.file.path);

    // console.log('Running Whisper on:', filePath);
    console.log('📁 Transcription starting for file:', filePath);
    console.log('⏳ Exists before processing?', fs.existsSync(filePath));


    // const pythonProcess = spawn('python', ['transcribe.py', filePath]);
    const pythonProcess = spawn('C:\\Users\\ritul\\AppData\\Local\\Programs\\Python\\Python313\\python.exe', ['transcribe.py', filePath]);


    let output = '';
    pythonProcess.stdout.on('data', (data) => {
        // output += data.toString();
        const text = data.toString();
        const lines = text.split('\n');
        const transcriptLine = lines.find(line => !line.startsWith('Running Whisper on:'));
        if (transcriptLine) output += transcriptLine;
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error('Python error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
        // Safely remove uploaded audio file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        if (code !== 0) {
            return res.status(500).json({ error: 'Failed to transcribe audio' });
        }

        res.json({ transcription: output.trim() });
    });
};
