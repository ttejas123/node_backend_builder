  //index.js
  const generateReactEntryFile = () => {
    return `
      import React from 'react';
      import ReactDOM from 'react-dom';
      import App from './App';
  
      ReactDOM.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
        document.getElementById('root')
      );
    `;
  };

  module.exports = generateReactEntryFile;