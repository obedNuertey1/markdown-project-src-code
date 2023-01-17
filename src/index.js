import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App';
//import Main from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper />
	{/*<Main />*/}
  </React.StrictMode>
);
