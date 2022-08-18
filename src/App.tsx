import Shop from './Pages/Shop';
import './App.css';
import { BrowserRouter } from 'react-router-dom'


function App() {
  return (
    <>
    <header className='flex justify-center p-8 bg-[#D6AD60]'>
      <h1 className='text-4xl'>
        The Marketplace
      </h1>
    </header>
    <BrowserRouter>
      <Shop/>
    </BrowserRouter>
    </>
    
  );
}

export default App;
