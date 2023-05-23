import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';

// import MarvelService from './services/MarvelService';



import './style/style.scss';



const key = process.env.REACT_APP_MARVEL_API_KEY;
export {key};

// const marv = new MarvelService();
// marv.getOneCharacter(1010338).then(console.log);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

