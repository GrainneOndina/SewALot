import React, { useEffect, useState, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Form, Button, Alert, Container, Image } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser, useSetCurrentUser } from "../../contexts/CurrentUserContext";
import btnStyles from "../../styles/Button.module.css";

/**
 * Component for editing a user profile.
 */
const ProfileEditForm = () => {
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const history = useHistory();
  const imageInput = useRef();
  const [profileData, setProfileData] = useState({
    description: "",
    image: null,
  });
  const { description, image } = profileData;
  const [currentImage, setCurrentImage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data } = await axiosReq.get(`/profiles/${id}/`);
        setProfileData({
          description: data.description || "",
          image: null,  // Clear the file input to prevent sending it if not changed
        });
        setCurrentImage(data.image); // Keep the current image displayed
      } catch (err) {
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
    setCurrentImage(URL.createObjectURL(file)); // Update the display image
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.image,
      }));
      history.goBack();
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  return (
    <Container>
      <div className="d-flex flex-column align-items-center">
        <div className="col-lg-8">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={7}
                value={description}
                onChange={handleChange}
                aria-describedby="descriptionHelpBlock"
              />
              {errors.description && (
                <Alert variant="warning">{errors.description.join(", ")}</Alert>
              )}
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Profile Image</Form.Label>
              {currentImage && (
                <div>
                  <Image src={currentImage} alt="Profile" thumbnail />
                </div>
              )}
              <Form.Control
                type="file"
                accept="image/*"
                ref={imageInput}
                onChange={handleImageChange}
                aria-describedby="imageHelpBlock"
              />
              {errors.image && (
                <Alert variant="warning">{errors.image}</Alert>
              )}
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button
                className={`${btnStyles.Button} ${btnStyles.Black}`}
                onClick={() => history.goBack()}
              >
                Cancel
              </Button>
              <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
                Save
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default ProfileEditForm;
