import React, { useState } from 'react';
import './App.css';
import NavigationBar from './components/Navbar';
import SignInForm from './pages/auth/SignInForm';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSignIn = () => {
    // Handle sign-in logic, e.g., making an API call
    setLoggedIn(true);
  };

  const handleSignOut = () => {
    // Handle sign-out logic, e.g., making an API call
    setLoggedIn(false);
  };

  return (
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
          <p>Please sign in:</p>
          <SignInForm onSignIn={handleSignIn} />
        </div>
      )}
    </div>
  );
}

export default App;
