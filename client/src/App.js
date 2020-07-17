import React from 'react';
import './App.css';
import TransactionSearch from './TransactionSearch';


// Use this function to get Current Date
function getCurrentDate() {
  return "2020-06-20T12:27:40 +04:00"
}

function App() {
  return (
    <div class="App">
      <h1 className="PageTitle">Transaction Returns</h1>
      <TransactionSearch today={getCurrentDate()}/>
    </div>
  );
}

export default App;
