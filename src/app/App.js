import React, { Component } from 'react'; //eslint-disable-line
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Form from './Form';

const App = () => (
  <Router>
    <div>
      <Route exact path='/' component={Form} />
    </div>
  </Router>
);

export default App;
