import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { useHistory, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import btnStyles from "../../styles/Button.module.css";

/**
 * Component for the user password change form.
 */
const UserPasswordForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const currentUser = useCurrentUser();

  const [userData, setUserData] = useState({
    new_password1: "",
    new_password2: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentUser?.profile_id?.toString() !== id) {
      // Redirect user if they are not the owner of this profile
      history.push("/");
    }
  }, [currentUser, history, id]);

  /**
   * Handles the input change event.
   */
  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Handles the form submission.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.post("/dj-rest-auth/password/change/", userData);
      history.goBack();
    } catch (err) {
      // console.log(err);
      setErrors(err.response?.data);
    }
  };

  return (
    <Container className="py-2 mx-auto text-center" style={{ maxWidth: "500px" }}>
      <Form onSubmit={handleSubmit} aria-label="Change Password Form">
        <Form.Group controlId="new_password1">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            name="new_password1"
            value={userData.new_password1}
            onChange={handleChange}
            aria-describedby="password1Help"
            isInvalid={!!errors.new_password1}
          />
          <Form.Text id="password1Help" muted>
            Password must be 8-20 characters long.
          </Form.Text>
          {errors.new_password1 && (
            <Alert variant="warning" role="alert" aria-live="assertive">
              {errors.new_password1.join(", ")}
            </Alert>
          )}
        </Form.Group>

        <Form.Group controlId="new_password2">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm new password"
            name="new_password2"
            value={userData.new_password2}
            onChange={handleChange}
            aria-describedby="password2Help"
            isInvalid={!!errors.new_password2}
          />
          <Form.Text id="password2Help" muted>
            Please confirm your new password.
          </Form.Text>
          {errors.new_password2 && (
            <Alert variant="warning" role="alert" aria-live="assertive">
              {errors.new_password2.join(", ")}
            </Alert>
          )}
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button
            className={`${btnStyles.Button} ${btnStyles.Blue}`}
            onClick={() => history.goBack()}
          >
            cancel
          </Button>
          <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
            save
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default UserPasswordForm;
