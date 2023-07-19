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

  /**
   * Handles the change event for the image input field.
   */
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  /**
   * Handles the submit event for the form.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (content.trim() === "") {
      console.log("Can't post without text");
      setErrorMessage("Can't post without text");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    if (url) {
      formData.append("url", url);
    }

    if (image) {
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
      setImage(null);
      setErrorMessage("");

      setPosts((prevPosts) => ({
        ...prevPosts,
        results: [newPost, ...prevPosts.results],
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center">
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
            />
          </Form.Group>
          <Form.Group controlId="postUrl">
            <Form.Control
              type="text"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Add URL"
            />
          </Form.Group>
          <div className={styles.UploadContainer}>
            <Form.Group>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="d-flex justify-content-center">
                <Button
                  variant="primary"
                  type="submit"
                  className={`${btnStyles.Button} ${btnStyles.Blue}`}
                >
                  Post
                </Button>
              </div>
            </Form.Group>
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
    </Container>
  );
}

export default PostsPage;
