import React, { useState, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser, useSetCurrentUser } from "../../contexts/CurrentUserContext";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

const ProfileEditForm = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const history = useHistory();
  const imageFile = useRef();

  const [profileImage, setProfileImage] = useState(currentUser?.profile_image || "");
  const [error, setError] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", profileImage);

    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.image,
      }));
      history.goBack();
    } catch (err) {
      console.log(err);
      setError(err.response?.data);
    }
  };

  return (
    <Container className={appStyles.Content}>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="image">
          <Form.Label>Profile Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            ref={imageFile}
            onChange={handleImageChange}
          />
        </Form.Group>

        {error && (
          <Alert variant="warning">
            An error occurred while updating the profile image. Please try again.
          </Alert>
        )}

        <Button
          className={`${btnStyles.Button} ${btnStyles.Blue}`}
          onClick={() => history.goBack()}
        >
          Cancel
        </Button>
        <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
          Save
        </Button>
      </Form>
    </Container>
  );
};

export default ProfileEditForm;
