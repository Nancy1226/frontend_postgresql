import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Connect from '../pages/Connect';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard/>}></Route>
          <Route path='/' element={<Connect/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
