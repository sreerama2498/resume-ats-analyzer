import React, { useState } from 'react';
import axios from 'axios';

function App() {

  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const uploadResume = async () => {

    if (!file) {
      alert('Please select a resume');
      return;
    }

    const formData = new FormData();

    formData.append('resume', file);

    try {

      setLoading(true);

      const res = await axios.post(
        'http://localhost:5000/upload',
        formData
      );

      setResponse(res.data.result);

    } catch (error) {

      console.log(error);

      setResponse(
        'AI analysis failed. Please check OpenAI billing/quota.'
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div
      style={{
        padding: '40px',
        fontFamily: 'Arial',
      }}
    >

      <h1>AI Resume ATS Analyzer</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button
        onClick={uploadResume}
        style={{
          padding: '10px 20px',
          cursor: 'pointer',
        }}
      >
        Analyze Resume
      </button>

      <br /><br />

      {loading && (
        <h3>Analyzing Resume...</h3>
      )}

      {response && (
        <div
          style={{
            backgroundColor: '#f4f4f4',
            padding: '20px',
            borderRadius: '10px',
            whiteSpace: 'pre-wrap',
          }}
        >
          <h2>ATS Analysis Result</h2>

          <p>{response}</p>

        </div>
      )}

    </div>
  );
}

export default App;
