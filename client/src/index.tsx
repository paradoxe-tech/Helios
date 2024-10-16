import React, { useState } from 'react';
import "./index.css";
import ReactDOM from 'react-dom/client';
import * as defaults from '../../shared/defaults';

let rootNode = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(rootNode).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

import { Recoms } from './parts/Recoms';
import { Menu } from './parts/Menu';
import { Sidebar } from './parts/Sidebar';

function App() {
  const [selectedVideoScore, setSelectedVideoScore] = useState(defaults.defaultVideoScore);
  
  return (
    <main className="h-screen overflow-hidden flex flex-col">
      <Menu />
      <div className="flex flex-1">
        <Sidebar scores={selectedVideoScore} />
        <Recoms setScores={setSelectedVideoScore} />
      </div>
    </main>
  );
}