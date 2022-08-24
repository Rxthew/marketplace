import Shop from './Pages/Shop';
import './App.css';
import { HashRouter } from 'react-router-dom'


function App() {
  return (
    <>
    <header className='flex justify-center p-8 bg-[#D6AD60]'>
      <h1 className='text-4xl'>
        The Marketplace
      </h1>
    </header>
    <HashRouter>
      <Shop/>
    </HashRouter>
    </>
    
  );
}

export default App;
