import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignInForm from './SignInForm';

const SignUpForm = () => {
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignInClick = () => {
    setShowSignInForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Handle sign-up logic, e.g., making an API call

    // Redirect the user upon successful sign-up
    history.push('/navbar');
  };

  return (
    <div>
            {!showSignInForm && (
        <>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
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
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{' '}
        <Link to="#" onClick={handleSignInClick}>
          Sign In
        </Link>
      </p>
      </>
      )}
      {showSignInForm && <SignInForm />}
    </div>
  );
};

export default SignUpForm;