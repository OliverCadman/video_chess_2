import './App.css';


// import { socket } from './connections/socket';
import Lobby from './Lobby/Lobby';
import Chessboard from './components/ui/Chessboard';

function App() {

  return (
    <div className="app">
      <Lobby />
      <Chessboard />
      <div>
        Some content
      </div>
    </div>
  );
}

export default App;
