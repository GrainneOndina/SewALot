import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Post from "./Post";
import Asset from "../../components/Asset";
import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Container } from "react-bootstrap";
import FollowedProfiles from "./FollowedProfiles";

function PostsPage({ message, filter = "" }) {
  const [posts, setPosts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState(null);
  const [query, setQuery] = useState("");
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosReq.get(
          `/posts/?${filter}search=${query}`
        );
        setPosts(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchPosts();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    if (url) {
      formData.append("url", url);
    }

    if (image) {
      formData.append("image", image);
    }

    // Exclude URL and image fields if both are empty
    if (!url && !image) {
      formData.delete("url");
      formData.delete("image");
    }

    try {
      const response = await axiosReq.post("/posts/", formData);
      const newPost = response.data; // Assuming the response contains the newly created post object

      setContent("");
      setUrl("");
      setImage(null);

      // Update the posts state to include the new post
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
                  <Button
                    variant="primary"
                    type="submit"
                    className={styles.PostButton}
                  >
                    Post
                  </Button>
                </Form.Group>
              </div>
            </Form>

            {hasLoaded ? (
              <>
                {posts.results.length ? (
                  <InfiniteScroll
                    children={posts.results.map((post) => (
                      <Post key={post.id} {...post} setPosts={setPosts} />
                    ))}
                    dataLength={posts.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!posts.next}
                    next={() => fetchMoreData(posts, setPosts)}
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
