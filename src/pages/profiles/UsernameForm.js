import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useHistory, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { useCurrentUser, useSetCurrentUser } from "../../contexts/CurrentUserContext";
import btnStyles from "../../styles/Button.module.css";
import { toast } from 'react-toastify';

/**
 * UsernameForm - Component for changing a user's username.
 * Validates the username length and updates it in the backend on form submission.
 */
const UsernameForm = () => {
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  useEffect(() => {
    if (currentUser?.profile_id?.toString() === id) {
      setUsername(currentUser.username);
    } else {
      history.push("/");
    }
  }, [currentUser, history, id]);

  const handleChange = (event) => {
    setUsername(event.target.value);
    if (event.target.value.length < 3 || event.target.value.length > 30) {
      setErrors({ username: ["Your username must be between 3 and 30 characters long."] });
    } else {
      setErrors({ ...errors, username: null });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!errors.username && username.length >= 3 && username.length <= 30) {
      try {
        const response = await axiosRes.put("/dj-rest-auth/user/", { username });
        setCurrentUser((prevUser) => ({
          ...prevUser,
          username: response.data.username,
        }));
        history.goBack();
        toast.success("Username updated successfully!");
      } catch (err) {
        setErrors(err.response?.data);
        toast.error("Failed to update username.");
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6} className="mx-auto">
          <h2 className="text-center">Change Username</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new username"
                value={username}
                onChange={handleChange}
                aria-describedby="usernameHelpBlock"
              />
              <Form.Text id="usernameHelpBlock" muted>
                Your username must be unique, 3-30 characters long.
              </Form.Text>
              {errors.username && (
                <Alert variant="warning" className="mt-2">
                  {errors.username.join(", ")}
                </Alert>
              )}
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button
                className={`${btnStyles.Button} ${btnStyles.Black}`}
                onClick={() => history.goBack()}
              >
                Cancel
              </Button>
              <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                type="submit"
                disabled={!!errors.username || username.length < 3 || username.length > 30}
              >
                Save
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UsernameForm;
