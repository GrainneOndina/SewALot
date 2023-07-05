import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import SignInForm from './pages/auth/SignInForm';
import SignUpForm from './pages/auth/SignUpForm';

function App() {
  const [loggedIn, setLoggedIn] = useState(true);

  const handleSignIn = () => {
    // Handle sign-in logic, e.g., making an API call
    setLoggedIn(true);
  };

  const handleSignOut = () => {
    // Handle sign-out logic, e.g., making an API call
    setLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <NavigationBar loggedIn={loggedIn} onSignOut={handleSignOut} />
        <h1>Sewlot</h1>
        {loggedIn ? (
          <div>
            <p>Welcome, you are signed in!</p>
            {/* Display other content for logged-in users */}
          </div>
        ) : (
          <div>
            <SignInForm onSignIn={handleSignIn} />
          </div>
        )}
        <Switch>
          <Route path="/signup" component={SignUpForm} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
