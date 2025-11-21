import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import GameForm from "./pages/GameForm";
function App() {
  return (
    <>
    
    
    <Router>
      <Routes>
        
        
        
        <Route path="/" element={<GameForm />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
