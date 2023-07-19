import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser, useSetCurrentUser } from "../../contexts/CurrentUserContext";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

/**
 * Component for editing a user profile.
 */
const ProfileEditForm = () => {
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const history = useHistory();
  const imageFile = useRef();

  const [profileData, setProfileData] = useState({
    description: "",
    image: "",
  });
  const { description, image } = profileData;

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data } = await axiosReq.get(`/profiles/${id}/`);
        const { description } = data;
        setProfileData((prevState) => ({
          ...prevState,
          description: description || "",
        }));
      } catch (err) {
        // console.log(err);
        history.push("/");
      }
    };

    fetchProfileData();
  }, [id, history]);

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProfileData({
      ...profileData,
      image: file,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    formData.append("image", image);

    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProfileData((prevState) => ({
        ...prevState,
        description: data.description, // Set the description value in the ProfileDataContext
      }));
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.image,
      }));
      history.goBack();
    } catch (err) {
      // console.log(err);
      setErrors(err.response?.data);
    }
  };

  return (
    <Container className={appStyles.Content}>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows={7}
            value={description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="image">
          <Form.Label>Profile Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            ref={imageFile}
            onChange={handleImageChange}
          />
        </Form.Group>

        {errors?.description?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}

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
