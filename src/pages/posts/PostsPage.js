import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Post from "./Post";
import Asset from "../../components/Asset";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import styles from "../../styles/PostsPage.module.css";
import { axiosReq } from "../../api/axiosDefaults";
import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import { Container } from "react-bootstrap";

/**
 * Component for rendering the posts page.
 */
function PostsPage({ message, filter = "", currentposts, hasLoaded, setPosts }) {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageURL, setImageURL] = useState(null);

/**
 * Handles the change event for the image input field.
 */
const handleImageChange = (event) => {
  const selectedImage = event.target.files[0];
  if (selectedImage) {
    if (selectedImage.size > 2 * 1024 * 1024) {
      setErrorMessage('Image size exceeds the limit. Please select a smaller image.');
      return;
    }
    setImage(selectedImage);

    // Create a temporary URL for the selected image file
    const imageURL = URL.createObjectURL(selectedImage);
    setImageURL(imageURL);
  }
};

/**
 * Handles the submit event for the form.
 */
const handleSubmit = async (event) => {
  event.preventDefault();

  if (content.trim() === "") {
    setErrorMessage("Can't post without text");
    return;
  }

  const formData = new FormData();
  formData.append("content", content);

  // Check if URL is provided and if it's a valid URL
  if (url) {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(url)) {
      setErrorMessage("Please enter a valid URL");
      return;
    }
    formData.append("url", url);
  }

  if (image) {
    if (image.size > 2 * 1024 * 1024) {
      setErrorMessage('Image size exceeds the limit. Please select a smaller image.');
      return;
    }
    
    formData.append("image", image);
  }

  if (!url && !image) {
    formData.delete("url");
    formData.delete("image");
  }

  try {
    const response = await axiosReq.post("/posts/", formData);
    const newPost = response.data;

    setContent("");
    setUrl("");
    setImage(null); // Reset image state to null after successful submission
    setImageURL(""); // Reset imageURL state to empty string after successful submission
    setErrorMessage("");

    setPosts((prevPosts) => ({
      ...prevPosts,
      results: [newPost, ...prevPosts.results],
    }));

    // Reset the form to clear the file input field
    event.target.reset();
  } catch (error) {
    // Handle error
  }
};

return (
  <div class="container">
    <div className="d-flex flex-column align-items-center">
      <div className="col-lg-8">
      <Form className={styles.Form} onSubmit={handleSubmit}>
        {errorMessage && <div className={styles.ErrorMessage}>{errorMessage}</div>}

        <Form.Group controlId="postContent">
       
          <Form.Control
            as="textarea"
            rows={3}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Add post"
            aria-label="Add Content to Post."
          />
        </Form.Group>
        <Form.Group controlId="postUrl">
         
          <Form.Control
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Add URL"
            aria-label="Add URL to Post."
          />
        </Form.Group>
        <div className={styles.UploadContainer}>
          <Form.Group>
           
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              placeholder="Add Image"
              aria-label="Add Image to post."
            />
          </Form.Group>
          {imageURL && (
            <div className={styles.ImageContainer}>
              <img
                src={imageURL}
                alt="Selected Image"
                className={styles.Image}
              />
            </div>
          )}
          <div className="d-flex justify-content-center">
            <Button
              variant="primary"
              type="submit"
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
            >
              Post
            </Button>
          </div>
        </div>
      </Form>
          {hasLoaded ? (
            <>
              {currentposts.length ? (
                <InfiniteScroll
                  children={currentposts.map((post) => (
                    <Post key={post.id} {...post} setPosts={setPosts} />
                  ))}
                  dataLength={currentposts.length}
                  loader={<Asset spinner />}
                  hasMore={!!currentposts.next}
                  next={() => fetchMoreData(currentposts, setPosts)}
                />
              ) : (
                <div className={appStyles.Content}>
                  <Asset src={NoResults} message={message} />
                </div>
              )}
            </>
          ) : (
            <div className={appStyles.Content}>
              <Asset spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostsPage;