import Shop from './Pages/Shop';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom'


function App() {
  return (
    <>
    <header className='flex justify-center p-8 bg-[#D6AD60]'>
      <h1 className='text-4xl'>
        The Marketplace
      </h1>
    </header>
    <Router basename='/marketplace/'>
      <Shop/>
    </Router>
    </>
    
  );
}

export default App;
