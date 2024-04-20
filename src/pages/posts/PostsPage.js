import React, { useState } from "react";
import { usePosts } from "../../contexts/PostsContext";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Post from "./Post";
import Asset from "../../components/Asset";
import InfiniteScroll from "react-infinite-scroll-component";
import NoResults from "../../assets/no-results.png";
import styles from "../../styles/PostsPage.module.css";
import btnStyles from "../../styles/Button.module.css";
import { axiosReq } from "../../api/axiosDefaults";

function PostsPage({ message }) {
    const { posts, hasMore, loadMorePosts, setPosts } = usePosts();
    const [content, setContent] = useState("");
    const [url, setUrl] = useState("");
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);

    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        if (selectedImage && selectedImage.size <= 2 * 1024 * 1024) { 
            setImage(selectedImage);
            setImageURL(URL.createObjectURL(selectedImage));
        } else {
            alert('Image size exceeds the limit of 2MB.');
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImageURL(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!content.trim()) {
            alert("Can't post without text");
            return;
        }

        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        if (url && !urlRegex.test(url)) {
            alert("Please enter a valid URL");
            return;
        }

        const formData = new FormData();
        formData.append("content", content.trim());
        if (url) formData.append("url", url);
        if (image) formData.append("image", image);

        try {
            const response = await axiosReq.post("/posts/", formData);
            setPosts(prevPosts => [response.data, ...prevPosts]);
            setContent("");
            setUrl("");
            setImage(null);
            setImageURL(null);
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post, please try again.");
        }
    };

    return (
        <div className="container">
            <div className="d-flex flex-column align-items-center">
                <div className="col-lg-8">
                    <Form className={styles.Form} onSubmit={handleSubmit}>
                        <Form.Group controlId="postContent">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Add post"
                            />
                        </Form.Group>
                        <Form.Group controlId="postUrl">
                            <Form.Control
                                type="text"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
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
                                {imageURL && (
                                    <div className={styles.ImageContainer}>
                                        <button onClick={handleRemoveImage}>Remove Image</button>
                                        <img src={imageURL} alt="Selected" className={styles.Image} />
                                    </div>
                                )}
                            </Form.Group>
                            <div className="d-flex justify-content-center">
                                <Button variant="primary" type="submit" className={`${btnStyles.Button} ${btnStyles.Blue}`}>
                                    Post
                                </Button>
                            </div>
                        </div>
                    </Form>
                    {posts.length > 0 ? (
                        <InfiniteScroll
                            dataLength={posts.length}
                            next={loadMorePosts}
                            hasMore={hasMore}
                            loader={<Asset spinner />}
                        >
                            {posts.map(post => <Post key={post.id} {...post} />)}
                        </InfiniteScroll>
                    ) : (
                        <Asset src={NoResults} message={message} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostsPage;
