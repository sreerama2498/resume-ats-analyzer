require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  dest: 'uploads/',
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res) => {
  res.send('ATS Resume Analyzer Backend Running');
});

app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    // 1. Log when the file is successfully uploaded/received by the route
    console.log('Resume uploaded');

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    // 2. Log the extracted text from the PDF
    console.log(resumeText);

    const prompt = `
Analyze this resume for ATS optimization.

Resume:
${resumeText}

Provide:
1. ATS score out of 100
2. Top 5 improvement suggestions
3. Missing skills
4. Resume strengths
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    // 3. Log the response coming back from OpenAI
    console.log(aiResponse);

    res.json({
      result: aiResponse,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: 'Failed to analyze resume',
    });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
