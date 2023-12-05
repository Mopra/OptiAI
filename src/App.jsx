// App.js
import React from 'react';
import DataFetcher from './DataFetcher';

function App() {
  return (
  <>
    <div className="App">
    
        <header>
          <h2>OptiAI Assistant</h2>
          <h1>What can OptiAI help you with today?</h1>
        </header>

        <DataFetcher />

        <footer className="appFooter">
          <div className="logo"></div>
          <div className="copyright">
            © {new Date().getFullYear()} OptiPeople ApS. All rights reserved.
          </div>
        </footer>

    </div>
  </>
  );
}

export default App;
