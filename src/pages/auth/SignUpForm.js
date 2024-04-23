import React, { useState, useRef, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import axios from "axios";
import { useRedirect } from "../../hooks/useRedirect";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { setTokenTimestamp } from "../../utils/utils";

/**
 * Sign-up form component.
 */
const SignUpForm = () => {
  useRedirect("loggedIn");
  const setCurrentUser = useSetCurrentUser();
  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
  });
  const { username, password1, password2 } = signUpData;
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const location = useLocation();
  const firstInputRef = useRef(null);

  useEffect(() => {
    firstInputRef.current && firstInputRef.current.focus();
  }, [errors]);
  
  /**
   * Handles the input change.
   */
  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
    setErrors({ ...errors, [event.target.name]: null });
  };

  /**
   * Handles the form submission.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/dj-rest-auth/registration/", signUpData);
      const signInResponse = await axios.post("/dj-rest-auth/login/", {
        username: signUpData.username,
        password: signUpData.password1,
      });
      setCurrentUser(signInResponse.data.user);
      setTokenTimestamp(signInResponse.data);

      const { from } = location.state || { from: { pathname: "/" } };
      history.replace(from);
    } catch (err) {
      // console.log(err.response?.data);
      setErrors(err.response?.data);
    }
  };

  return (
    <Container>
      <div className="d-flex flex-column align-items-center">
        <div className={`${appStyles.Content} p-4`}>
          <h2 className={styles.Header}>sign up</h2>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Control
                className={styles.Input}
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleChange}
                isInvalid={!!errors.username}
                ref={firstInputRef}
                aria-label="Username"
              />
              {errors.username && <Form.Control.Feedback type="invalid">
                {errors.username.join(", ")}
              </Form.Control.Feedback>}
            </Form.Group>
            <Form.Group controlId="password1">
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Password"
                name="password1"
                value={password1}
                onChange={handleChange}
                isInvalid={!!errors.password1}
                aria-label="Password"
              />
              {errors.password1 && <Form.Control.Feedback type="invalid">
                {errors.password1.join(", ")}
              </Form.Control.Feedback>}
            </Form.Group>
            <Form.Group controlId="password2">
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Confirm Password"
                name="password2"
                value={password2}
                onChange={handleChange}
                isInvalid={!!errors.password2}
                aria-label="Confirm Password"
              />
              {errors.password2 && <Form.Control.Feedback type="invalid">
                {errors.password2.join(", ")}
              </Form.Control.Feedback>}
            </Form.Group>

            <Button className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`} type="submit">
              Sign Up
            </Button>
            {errors.non_field_errors && <Alert variant="danger" className="mt-3">
              {errors.non_field_errors.join(", ")}
            </Alert>}
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default SignUpForm;
