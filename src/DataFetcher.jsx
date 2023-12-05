// DataFetcher.js
import React, { useState } from 'react';
import axios from 'axios';
import OpenAI from 'openai';

const DataFetcher = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDataAndAnalyze = async (messageType) => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/DataExport/GetDataExport?access_code=BceD8a6A4c9B905a0C6d2aeb703c4C99A16dee07cc565220c58235585d63331e&machineId=700a3579-8cdf-4afa-2bb8-08db9ef8e885');
      const relevantData = {
        shiftData: res.data.shiftData,
        //wasteData: res.data.wasteData,
        counterData: res.data.counterData
      };
      await askOpenAI(relevantData, messageType);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data from the API. Please try again later or contact OptiPeople at hi@optipeople.dk.");
    } finally {
      setIsLoading(false);
    }
  };

  const askOpenAI = async (data, messageType) => {
    const openai = new OpenAI({
      apiKey: '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', 
      dangerouslyAllowBrowser: true,
    });

    const dataString = JSON.stringify(data);
    let promptMessage;

    if (messageType === 'type1') {
      promptMessage = `
      Analyze the provided machine data from ${dataString}, covering the Time Span: current day, during the latest shifts. Identify the most critical aspect to optimize, focusing on counted units and production rate. Provide your analysis in the following format:
      1. Header: Include Machine Name, Time Span (dd-mm-yyyy), and Shift Names.
      2. Optimization: Offer a concise, actionable tip for optimization.
      3. Example: Give a specific example demonstrating how to implement this optimization.
      Format the response in html. (exclude html, head, body)
      Use lists whenever it makes sense in the response and example.
      Break the paragraphs up, so it's more easy to read.
      Make a <ul></ul> for the header.
      Don't start by saying anything. Just return the exact format.
      Hide "Header" from the beginning.
      `;
    } else if (messageType === 'type2') {
      promptMessage = `
      Analyze the provided machine data from ${dataString}, covering the Time Span: current day, during the latest shifts. Identify the most critical aspect to optimize, focusing on working hours and shifts to increase efficiency. Provide your analysis in the following format:
      1. Header: Include Machine Name, Time Span (dd-mm-yyyy), and Shift Names.
      2. Optimization: Offer a concise, actionable tip for optimization.
      3. Example: Give a specific example demonstrating how to implement this optimization.
      Format the response in html. (exclude html, head, body)
      Use lists whenever it makes sense in the response and example.
      Break the paragraphs up, so it's more easy to read.
      Make a <ul></ul> for the header.
      Don't start by saying anything. Just return the exact format.
      Hide "Header" from the beginning.
      `;
    } else if (messageType === 'type3') {
      promptMessage = `
      Analyze the provided machine data from ${dataString}, covering the Time Span: current day, during the latest shifts. Identify the most critical aspect to optimize, focusing calculating performance, units per hour and tell me how I can improve it tomorrow. Provide your analysis in the following format:
      1. Header: Include Machine Name, Time Span (dd-mm-yyyy), and Shift Names.
      2. Optimization: Offer a concise, actionable tip for optimization.
      3. Example: Give a specific example demonstrating how to implement this optimization.
      Format the response in html. (exclude html, head, body)
      Use lists whenever it makes sense in the response and example.
      Break the paragraphs up, so it's more easy to read.
      Make a <ul></ul> for the header.
      Don't start by saying anything. Just return the exact format.
      Hide "Header" from the beginning.
      `;
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ "role": "user", "content": promptMessage }],
        temperature: 0.7,
      });
      setResponse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error in OpenAI API call:", error);
      setError("Failed to process data with OpenAI. Please try again later or contact OptiPeople at hi@optipeople.dk.");
    }
  };

  return (
    <div className="dataFetcher">
      <nav>
          <button onClick={() => fetchDataAndAnalyze('type1')}>
            "Give me the most important thing to optimize, based on counted units and production rate."
          </button>
          <button onClick={() => fetchDataAndAnalyze('type2')}>
            "Give me a tip to optimize my working hours and shifts to increase efficiency."
          </button>
          <button onClick={() => fetchDataAndAnalyze('type3')}>
            "Calculate my performance and units per hour. Tell me how I could do it better tomorrow."
          </button>
      </nav>
      <div className="response">
        {isLoading && <div className="spinner"></div>}
        {error && <div className="error-message">{error}</div>}
        {response && <div className="AiResponse" dangerouslySetInnerHTML={{ __html: response }}></div>}
      </div>
    </div>
  );
};

export default DataFetcher;