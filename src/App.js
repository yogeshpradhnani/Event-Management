// import logo from './logo.svg';
// import './App.css';

import { BrowserRouter, Route, Routes } from "react-router";
import AuthForm from "./Components/AuthForm";
import HomePage from "./Components/HomePage";
import BookedEvents from "./Components/BookedEvents";

function App() {
  return (
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/booked" element={<BookedEvents />} />

      </Routes>
    </BrowserRouter>
  </>
  );
}

export default App;
