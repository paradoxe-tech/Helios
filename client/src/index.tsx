import React from 'react';
import "./index.css";
import ReactDOM from 'react-dom/client';

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
  return (
    <main className="h-screen flex flex-col">
      <Menu />
      <div className="flex flex-1">
        <Sidebar />
        <Recoms />
      </div>
    </main>
  );
}