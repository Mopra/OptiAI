// DataFetcher.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OpenAI from 'openai';

const DataFetcher = () => {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/DataExport/GetDataExport?access_code=BceD8a6A4c9B905a0C6d2aeb703c4C99A16dee07cc565220c58235585d63331e&machineId=700a3579-8cdf-4afa-2bb8-08db9ef8e885')
      .then(res => {
        const relevantData = {
          shiftData: res.data.shiftData,
          //wasteData: res.data.wasteData,
          counterData: res.data.counterData
        };
        askOpenAI(relevantData);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch data from the API. Please try again later or contact OptiPeople at hi@optipeople.dk.");
        setIsLoading(false);
      });
  }, []);

  const askOpenAI = async (data) => {
    const openai = new OpenAI({
      apiKey: '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', 
      dangerouslyAllowBrowser: true,
    });

    const dataString = JSON.stringify(data);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ "role": "user", "content": `Based on this data from my machine: ${dataString}, what should I do to improve my machine's efficiency?  Give me one thing to improve upon for tomorrow. Make the answer concise an on point.` }],
        temperature: 0.7,
      });
      setResponse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error in OpenAI API call:", error);
      setError("Failed to process data with OpenAI. Please try again later or contact OptiPeople at hi@optipeople.dk.");
    } finally {
      setIsLoading(false); 
    }
  };

  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);


  return (
    <div>
      {isLoading && <div className="spinner"></div>}
      {error && <div className="error-message">{error}</div>}
      {response && <div><div className="AiResponseHeader">OpenAI Suggestion:</div><div class="AiResponse"> {response} </div></div>}
    </div>
  );
};

export default DataFetcher;
