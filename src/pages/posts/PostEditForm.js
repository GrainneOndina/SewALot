import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";
import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { axiosReq } from "../../api/axiosDefaults";
import validUrl from 'valid-url';

/**
 * Component for editing a post.
 */
function PostEditForm() {
  const [errors, setErrors] = useState({});
  const [postData, setPostData] = useState({
    content: "",
    url: "",
    image: null,
  });
  const [imageUrl, setImageUrl] = useState("");
  const { content, url, image } = postData;

  const imageInput = useRef(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/${id}/`);
        const { content, url, image, is_owner } = data;
  
        if (is_owner) {
          setPostData({ content, url, image });
          setImageUrl(image); // Set imageUrl state with the image URL
        } else {
          history.push("/");
        }
      } catch (err) {
        // console.log(err);
      }
    };
  
    handleMount();
  }, [history, id]);
  

  /**
   * Handles the change event for input fields.
   */
  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

/**
 * Handles the change event for the image input field.
 */
const handleChangeImage = (event) => {
  if (event.target.files.length) {
    const selectedImage = event.target.files[0];
    // Check if the image size exceeds the limit (e.g., 2MB)
    if (selectedImage.size > 2 * 1024 * 1024) {
      // Show an alert message or take appropriate action to inform the user
      alert('Image size exceeds the limit. Please select a smaller image.');
    } else {
      setPostData({
        ...postData,
        image: selectedImage,
      });
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }
};

  /**
   * Handles the submit event for the form.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validate URL
    if (url && !validUrl.isUri(url)) {
      setErrors({ url: ['Please enter a valid URL.'] });
      return;
    }
  
    const formData = new FormData();
    formData.append("content", content);
    if (url) {
      formData.append("url", url);
    }
  
    if (imageInput?.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }
  
    // Exclude URL and image fields if both are empty
    if (!url && !image) {
      formData.delete("url");
      formData.delete("image");
    }
  
    try {
      await axiosReq.put(`/posts/${id}/`, formData);
      history.push(`/posts/${id}`);
    } catch (err) {
      // console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return (
    <div className="container">
      <div className="d-flex flex-column align-items-center">
        <div className="col-lg-8">
          
          <Form onSubmit={handleSubmit}>
            <div className={appStyles.Content}>
              <div className={styles.Container}>
                <Form.Group>
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="content"
                    value={content}
                    onChange={handleChange}
                  />
                </Form.Group>
                {errors?.content?.map((message, idx) => (
                  <Alert variant="warning" key={idx}>
                    {message}
                  </Alert>
                ))}

                <Form.Group>
                  <Form.Label>URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="url"
                    value={url || ""}
                    onChange={handleChange}
                    placeholder="Add URL"
                  />
                </Form.Group>
                {errors?.url?.map((message, idx) => (
                  <Alert variant="warning" key={idx}>
                    {message}
                  </Alert>
                ))}

                <Form.Group className="text-center">
                  <figure>
                    {image && (
                      <Image
                      className={`${appStyles.Image} ${styles.PostImage}`}
                      src={imageUrl}
                      rounded
                      fluid
                      />
                    )}
                  </figure>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleChangeImage}
                    ref={imageInput}
                  />
                </Form.Group>
                {errors?.image?.map((message, idx) => (
                  <Alert variant="warning" key={idx}>
                    {message}
                  </Alert>
                ))}
              </div>
              <div className="text-center">
                <Button
                  className={`${btnStyles.Button} ${btnStyles.Blue}`}
                  onClick={() => history.goBack()}
                >
                  Cancel
                </Button>
                <Button
                  className={`${btnStyles.Button} ${btnStyles.Blue}`}
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </div>
          </Form>

        </div>
      </div>
    </div>
  );
}

export default PostEditForm;