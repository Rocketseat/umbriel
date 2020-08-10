import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes/main.routes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div id="app">
        <Routes />
      </div>
    </BrowserRouter>
  );
};

export default App;
