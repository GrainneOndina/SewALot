import React, { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import SignInForm from "../pages/auth/SignInForm";
import SignUpForm from "../pages/auth/SignUpForm";
import styles from ".././styles/LandingPage.module.css";
import Button from "react-bootstrap/Button";

/**
 * LandingPage component that renders the landing page content,
 * allowing users to toggle between SignInForm and SignUpForm.
 * @returns {JSX.Element} The rendered JSX element.
 */
const LandingPage = () => {
  // State to control whether to show SignInForm or SignUpForm
  const [showSignInForm, setShowSignInForm] = useState(true);
  const toggleButtonRef = useRef(null);

  /**
   * Toggle between showing SignInForm and SignUpForm.
   */
  const toggleForm = () => {
    setShowSignInForm((prev) => !prev);
  };

  useEffect(() => {
    // Whenever the form toggles, focus the first input element in the form
    const focusableElement = document.querySelector('input');
    if (focusableElement) focusableElement.focus();
  }, [showSignInForm]);

  return (
    <Container>
      <main className="container">
        <div className="d-flex flex-column align-items-center">
          <div className="col-lg-8 text-center">
            <h1 className={styles.Header}>Welcome to SewLot</h1>
            <p className={styles.catch}>
              Your place to be inspired and share your sewing hobby. Discuss with others and find solutions together.
            </p>

            {showSignInForm ? <SignInForm /> : <SignUpForm />}

            <Button
              ref={toggleButtonRef}
              onClick={toggleForm}
              className={`mt-3 ${styles.ToggleFormLink}`}
              variant="link" // Use 'link' variant to make the button appear as a hyperlink
              style={{ textDecoration: 'none', color: 'blue' }}
            >
              {showSignInForm ? "Don't have an account? Sign up now!" : "Already have an account? Sign in!"}
            </Button>

            <img
              src="images/sewingmachin.jpg"
              alt="Sewing Machine"
              className="img-fluid"
              style={{ marginBottom: '30px' }}
            />
          </div>
        </div>
      </main>
    </Container>
  );
};


export default LandingPage;