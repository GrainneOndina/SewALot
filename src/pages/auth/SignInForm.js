import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from './SignUpForm';

const SignInForm = () => {
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUpClick = () => {
    setShowSignUpForm(true);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    // Handle sign-in logic, e.g., making an API call
  };

  return (
    <div>
      {!showSignUpForm && (
        <>
          <h2>Sign In</h2>
          <form onSubmit={handleSignIn}>
            <div>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Sign In</button>
          </form>
          <p>
            Don't have an account?{' '}
            <Link to="#" onClick={handleSignUpClick}>
              Sign Up
            </Link>
          </p>
        </>
      )}

      {showSignUpForm && <SignUpForm />}
    </div>
  );
};

export default SignInForm;
