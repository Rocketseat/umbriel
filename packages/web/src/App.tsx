import React from 'react';
import { Router } from 'react-router-dom';

import Routes from './routes/main.routes';
import history from './services/history';

const App: React.FC = () => {
  return (
    <Router history={history}>
      <div id="app">
        <Routes />
      </div>
    </Router>
  );
}

export default App;
