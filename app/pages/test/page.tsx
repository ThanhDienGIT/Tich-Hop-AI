'use client';

import { Button } from "antd";
import React, { useState } from "react";
import { instance } from "@/app/service/http/instance";
import TextArea from "antd/es/input/TextArea";


function page() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e :any) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
        const response  = await instance.post('/callai', { prompt });
        
        console.log(response)   
        
        setResult(response.data.message);
        setLoading(false)
    }catch(err){
        console.log(err)
    }
  };

  return (
    <div>
      <h1>Next.js Gemini AI API Call</h1>

        <TextArea rows={4} onChange={(e) => setPrompt(e.target.value)} value={prompt}/>
            
        <Button onClick={handleSubmit}>
          {loading ? "Generating..." : "Generate Content"}
        </Button>
    

      {result && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h2>Response:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default page;
