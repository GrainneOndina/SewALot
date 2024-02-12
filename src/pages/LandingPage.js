import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import SignInForm from "../pages/auth/SignInForm";
import SignUpForm from "../pages/auth/SignUpForm";
import styles from ".././styles/LandingPage.module.css";
import appStyles from ".././App.module.css";

/**
 * LandingPage component renders the landing page content.
 * @returns {JSX.Element} The rendered JSX element.
 */
const LandingPage = () => {
  // State to control whether to show SignInForm or SignUpForm
  const [showSignInForm, setShowSignInForm] = useState(true);

  /**
   * Toggle between showing SignInForm and SignUpForm.
   */
  const toggleForm = () => {
    setShowSignInForm((prev) => !prev);
  };

  return (
    <div  class="container">
     <div class="row justify-content-md-center">
      <h1 className={styles.Header}>Welcome to SewLot</h1>
      <p className={styles.catch}>
        Your place to be inspired and share your sewing hobby. Discuss with others and find solutions together.
      </p>

      {/* Render the SignInForm component */}
      {showSignInForm ? (
        <SignInForm />
      ) : (
        <SignUpForm />
      )}

      <div>
        {/* Toggle between showing sign-up or sign-in message */}
        {showSignInForm ? (
          <p>
            Don't have an account?{" "}
            <span onClick={toggleForm} style={{ cursor: "pointer", color: "blue" }}>
              Sign up now!
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={toggleForm} style={{ cursor: "pointer", color: "blue" }}>
              Sign in!
            </span>
          </p>
        )}
      </div>

        <img
          src="images/sewingmachin.jpg"
          alt="Sewing Machine"
          className="img-fluid"
        />
      </div>
    </div>
  );
};

export default LandingPage;
