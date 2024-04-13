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
    <div className="container">
      <div className="d-flex flex-column align-items-center">
        <div className="col-lg-8">
          <h1 className={styles.Header}>Welcome to SewLot</h1>
          <p className={styles.catch}>
            Your place to be inspired and share your sewing hobby. Discuss with others and find solutions together.
          </p>

          {/* Render the SignInForm component */}
          {showSignInForm ? <SignInForm /> : <SignUpForm />}

          <div onClick={toggleForm} className={styles.ToggleFormLink} style={{ cursor: "pointer", color: "blue" }}>
            {showSignInForm ? (
              <div className="container, mt-3 text-center">
                <p>Don't have an account? Sign up now!</p>
              </div>
            ) : (
              <div className="container, mt-3 text-center">
                <p>Already have an account? Sign in!</p>
              </div>
            )}
          </div>

            <img
              src="images/sewingmachin.jpg"
              alt="Sewing Machine"
              className="img-fluid"
            />
          </div>
      </div>
    </div>
  );
};

export default LandingPage;