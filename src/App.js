import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import JournalPage from './components/JournalPage';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LoginPage} />
        <Route path="/journal" component={JournalPage} />
      </Switch>
    </Router>
  );
}

export default App;