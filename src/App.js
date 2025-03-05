import { React } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Board from './containers/Board/Board';

import './App.css';

function App() {
  const content = (
    <Routes>
      <Route path="/" element={<Board />}></Route>
      <Route path="*" element={<Navigate to="/" />}></Route>
    </Routes>
  );

  return (
    <Router>
      <Layout>{content}</Layout>
    </Router>
  );
}

export default App;
