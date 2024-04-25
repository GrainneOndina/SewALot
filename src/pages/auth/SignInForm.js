import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useHistory } from "react-router-dom";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";
import { setTokenTimestamp } from "../../utils/utils";

/**
 * Sign-in form component.
 */
function SignInForm() {
  const setCurrentUser = useSetCurrentUser();
  useRedirect("loggedIn");

  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = signInData;
  const [errors, setErrors] = useState({});
  const history = useHistory();

  /**
   * Handles the form submission.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      setTokenTimestamp(data);
      history.goBack();
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  /**
   * Handles the input change.
   */
  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Container>
      <div className="d-flex flex-column align-items-center">
        <div className={`${appStyles.Content} p-4`}>
          <h2 className={styles.Header}>sign in</h2>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                className={styles.Input}
                value={username}
                onChange={handleChange}
                isInvalid={!!errors.username}
                aria-label="Username"
              />
              {errors.username && <Form.Control.Feedback type="invalid">
                {errors.username.join(", ")}
              </Form.Control.Feedback>}
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                className={styles.Input}
                value={password}
                onChange={handleChange}
                isInvalid={!!errors.password}
                aria-label="Password"
              />
              {errors.password && <Form.Control.Feedback type="invalid">
                {errors.password.join(", ")}
              </Form.Control.Feedback>}
            </Form.Group>
            {/* Empty div for spacing */}
            <div style={{ height: "4rem" }}></div>
           
            <Button className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`} type="submit">
              Sign in
            </Button>

            {errors.non_field_errors && <Alert variant="danger" className="mt-3">
              {errors.non_field_errors.join(", ")}
            </Alert>}
          </Form>
        </div>
      </div>
      </Container>
  );
}

export default SignInForm;
