import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import LoginPage from './auth/pages/login/LoginPage';
import RegisterPage from './auth/pages/register/RegisterPage';
import {HeaderComponent} from './shared/Components/header/HeaderComponent.jsx';

function App() {
  return (
      <Router>
        <HeaderComponent />
        <Switch>
          <Route path="/login" exact>
            <LoginPage />
          </Route>
          <Route path='/register' exact>
            <RegisterPage />
          </Route>
        </Switch>
      </Router>
  );
}

export default App;
