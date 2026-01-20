'use client';

import { Button } from "antd";
import React, { useState } from "react";
import { instance } from "@/app/service/http/instance";
import TextArea from "antd/es/input/TextArea";


function Page() { // Renamed 'page' to 'Page' for React component naming convention
  // --- AI Feature State and Logic ---
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e :any) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    setResult(""); // Clear previous result

    try {
        const response  = await instance.post('/callai', { prompt });
        
        console.log(response);   
        
        setResult(response.data.message);
        setLoading(false);
    }catch(err){
        console.log(err);
        setLoading(false); // Ensure loading is reset on error
        // Optionally, set an error message to display to the user
        setResult("Error generating content. Please try again.");
    }
  };

  // --- Calculator Feature State and Logic ---
  const [calculatorDisplay, setCalculatorDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false); // True when an operator has been pressed and awaiting the second number

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setCalculatorDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setCalculatorDisplay(calculatorDisplay === "0" ? digit : calculatorDisplay + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
        setCalculatorDisplay("0.");
        setWaitingForSecondOperand(false);
        return;
    }
    // Only add a decimal if one isn't already present in the current display
    if (!calculatorDisplay.includes(".")) {
      setCalculatorDisplay(calculatorDisplay + ".");
    }
  };

  const calculate = (first: number, second: number, op: string) => {
    if (op === '+') return first + second;
    if (op === '-') return first - second;
    if (op === '*') return first * second;
    if (op === '/') {
        if (second === 0) {
            alert("Cannot divide by zero!"); // Basic error alert
            return NaN; // Return NaN to indicate an invalid operation
        }
        return first / second;
    }
    return second; // Should ideally not be reached if operator is valid
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(calculatorDisplay);

    // If an operator exists and we're waiting for the second operand, just update the operator
    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      return;
    }

    // If firstOperand is null, store the current display value as the first operand
    if (firstOperand === null && !isNaN(inputValue)) {
      setFirstOperand(inputValue);
    } else if (operator) {
      // If an operator already exists and we have a first operand, calculate the result
      const resultValue = calculate(firstOperand!, inputValue, operator);
      if (isNaN(resultValue)) {
          resetCalculator(); // Reset on invalid calculation (e.g., division by zero)
          return;
      }
      setCalculatorDisplay(String(resultValue));
      setFirstOperand(resultValue); // The result becomes the new first operand for chaining
    }

    setWaitingForSecondOperand(true); // Prepare for the next number input
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    const inputValue = parseFloat(calculatorDisplay);

    if (firstOperand === null || operator === null || waitingForSecondOperand) {
      return; // Nothing to calculate or an operator was just pressed without a second number
    }
    
    const resultValue = calculate(firstOperand, inputValue, operator);
    if (isNaN(resultValue)) {
        resetCalculator(); // Reset on invalid calculation
        return;
    }
    setCalculatorDisplay(String(resultValue));
    setFirstOperand(null); // Clear first operand after calculation
    setOperator(null); // Clear operator
    setWaitingForSecondOperand(true); // Treat the result as the first operand for a potential new operation if an operator is pressed
  };

  const resetCalculator = () => {
    setCalculatorDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };


  return (
    // Main container using flexbox for side-by-side layout
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      {/* AI Section */}
      <div style={{ flex: 1 }}>
        <h1>Next.js Gemini AI API Call</h1>

        <TextArea 
            rows={4} 
            onChange={(e) => setPrompt(e.target.value)} 
            value={prompt}
            placeholder="Enter your prompt here..."
            style={{ marginBottom: '1rem' }} // Add some bottom margin
        />
            
        <Button onClick={handleSubmit} type="primary"> {/* Added Ant Design primary type */}
          {loading ? "Generating..." : "Generate Content"}
        </Button>
    

      {result && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: '#f9f9f9' // Light background for readability
          }}
        >
          <h2>Response:</h2>
          <p>{result}</p>
        </div>
      )}
      </div> {/* End AI Section */}

      {/* Calculator Section */}
      <div style={{ flex: 1, borderLeft: '1px solid #eee', paddingLeft: '2rem' }}>
        <h1>Calculator</h1>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#222", // Dark background for calculator display
            color: "#fff",
            textAlign: "right",
            fontSize: "2em",
            minHeight: "1.5em",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            overflow: 'hidden', // Prevent long numbers from breaking layout
            wordBreak: 'break-all' // Allow numbers to break if too long
          }}
        >
          {calculatorDisplay}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)", // 4 columns grid
            gap: "10px", // Space between buttons
          }}
        >
          {/* Number buttons (7, 8, 9, then division operator) */}
          {['7', '8', '9'].map(num => (
            <Button key={num} onClick={() => inputDigit(num)} style={{ height: '60px', fontSize: '1.5em' }}>
              {num}
            </Button>
          ))}
          <Button onClick={() => handleOperator('/')} style={{ height: '60px', fontSize: '1.5em' }}>÷</Button>

          {/* Number buttons (4, 5, 6, then multiplication operator) */}
          {['4', '5', '6'].map(num => (
            <Button key={num} onClick={() => inputDigit(num)} style={{ height: '60px', fontSize: '1.5em' }}>
              {num}
            </Button>
          ))}
          <Button onClick={() => handleOperator('*')} style={{ height: '60px', fontSize: '1.5em' }}>×</Button>

          {/* Number buttons (1, 2, 3, then subtraction operator) */}
          {['1', '2', '3'].map(num => (
            <Button key={num} onClick={() => inputDigit(num)} style={{ height: '60px', fontSize: '1.5em' }}>
              {num}
            </Button>
          ))}
          <Button onClick={() => handleOperator('-')} style={{ height: '60px', fontSize: '1.5em' }}>-</Button>

          {/* Zero, Decimal, and Addition operator */}
          <Button onClick={() => inputDigit('0')} style={{ height: '60px', fontSize: '1.5em', gridColumn: 'span 2' }}>0</Button> {/* '0' spans 2 columns */}
          <Button onClick={inputDecimal} style={{ height: '60px', fontSize: '1.5em' }}>.</Button>
          <Button onClick={() => handleOperator('+')} style={{ height: '60px', fontSize: '1.5em' }}>+</Button>

          {/* Clear (AC) and Equals (=) buttons */}
          <Button onClick={resetCalculator} style={{ height: '60px', fontSize: '1.5em', gridColumn: 'span 2' }}>AC</Button> {/* 'AC' spans 2 columns */}
          <Button onClick={handleEquals} type="primary" style={{ height: '60px', fontSize: '1.5em', gridColumn: 'span 2' }}>=</Button> {/* '=' spans 2 columns */}
        </div>
      </div> {/* End Calculator Section */}
    </div>
  );
}

export default Page;
