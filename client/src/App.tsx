import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Server } from './Server';

function App() {
  const server = new Server();
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    server.getTest().then((res) => {
      setData(res);
    })
  }
  useEffect(() => {
    fetchData();
  }, [])



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
        { JSON.stringify(data, null, 2) }
    </div>
  );
}

export default App;
