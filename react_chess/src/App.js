import './App.css';

import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';


// import { socket } from './connections/socket';
import Lobby from './Lobby/Lobby';
import Chessboard from './components/ui/Chessboard';

function App() {

  return (
    <div className="app">
    <BrowserRouter>
      <Routes>
        <Route path='/' exact element={<Lobby />}></Route>
        <Route path='/game/:gameid' element={<Chessboard/>}/>
      </Routes>
    </BrowserRouter>
      
    </div>
  );
}


export default App;
