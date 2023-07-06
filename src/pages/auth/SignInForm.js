import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from './SignUpForm';
import axios from 'axios';

const SignInForm = () => {
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUpClick = () => {
    setShowSignUpForm(true);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      // Perform sign-in logic, e.g., make an API call
      const response = await axios.post('/api/signin', {
        username,
        password,
      });

      // Handle successful sign-in
      console.log(response.data); // You can handle the response data accordingly

    } catch (error) {
      // Handle sign-in error
      setError('Sign-in failed. Please check your credentials.'); // Set an appropriate error message
    }
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
            {error && <p>{error}</p>}
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