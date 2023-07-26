import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ShowNoteList from './components/ShowNoteList';
import UpdateNotePage from './components/UpdateNotePage';

const BASE_URL = 'http://localhost:5111/';

const App = () => {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<ShowNoteList BASE_URL={BASE_URL} />} />
            <Route path="/edit/:id" element={<UpdateNotePage BASE_URL={BASE_URL} />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;
