import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThumbnailEditor from "./components/ThumbnailEditor";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThumbnailProvider } from "./contexts/ThumbnailContext";

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <ThumbnailProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ThumbnailEditor />} />
            </Routes>
          </BrowserRouter>
        </ThumbnailProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;