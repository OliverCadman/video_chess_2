import './App.css';

import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import React, {useState, useCallback} from 'react';

import { ColorContext } from './context/ColorContext';


// import { socket } from './connections/socket';
import Lobby from './Lobby/Lobby';
import ChessboardWrapper from './components/ui/Chessboard';

function App() {
  const [isCreator, setIsCreator] = useState(false);
  const [userName, setUserName] = useState("");

  const handleCreatorUserName = (input) => {
    setUserName(input);
  }

  const playerIsCreator = useCallback(() => {
    setIsCreator(true);
  }, []);

  const playerIsNotCreator = useCallback(() => {
    setIsCreator(false);
  }, [])
  return (
    <ColorContext.Provider value={{
      isCreator,
      playerIsCreator,
      playerIsNotCreator
    }}>
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<Lobby handleCreatorUserName={handleCreatorUserName}/>}></Route>
            <Route path="/game/:gameid" element={<ChessboardWrapper userName={userName}/>} />
          </Routes>
        </BrowserRouter>
      </div>
    </ColorContext.Provider>
  );
}


export default App;
