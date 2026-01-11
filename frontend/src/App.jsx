import { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom"
import { SearchBar, HomePage, ReviewForm } from './components'

// --- Main App Component ---
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/ReviewForm" element={<ReviewForm/>}/>
      </Routes>
    </>
  );
}

export default App;
