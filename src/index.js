import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://mithril-rem.fly.dev/api';

//axios.get('/users');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
