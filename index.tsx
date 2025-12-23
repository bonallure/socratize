//Turn react on and put the app on the page
//This file initializes the React application by locating the root DOM element, creating a React root, and
//rendering the main App component inside React.StrictMode.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
