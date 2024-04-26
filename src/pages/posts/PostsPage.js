import React, { useState, useRef } from "react";
import { usePosts } from "../../contexts/PostsContext";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Post from "./Post";
import Asset from "../../components/Asset";
import InfiniteScroll from "react-infinite-scroll-component";
import NoResults from "../../assets/no-results.png";
import styles from "../../styles/PostsPage.module.css";
import btnStyles from "../../styles/Button.module.css";
import { axiosReq } from "../../api/axiosDefaults";
import Alert from "react-bootstrap/Alert";
import { toast } from 'react-toastify';

function PostsPage({ message }) {
    const { posts, hasMore, loadMorePosts, setPosts } = usePosts();
    const [content, setContent] = useState("");
    const [url, setUrl] = useState("");
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef();  // Reference to the file input
    
    const handleContentChange = (e) => {
        setContent(e.target.value);
        setErrors(prevErrors => ({ ...prevErrors, content: "" }));  // Clear content error
    };
    
    const handleUrlChange = (e) => {
        setUrl(e.target.value);
        setErrors(prevErrors => ({ ...prevErrors, url: "" }));  // Clear URL error
    };
    
    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        if (selectedImage) {
            if (selectedImage.size > 2 * 1024 * 1024) {
                setErrors({ ...errors, image: 'Image size exceeds the limit of 2MB.' });
                setImage(null);
                setImageURL("");
                fileInputRef.current.value = "";
            } else {
                setErrors({ ...errors, image: '' });  // Clear image error
                setImage(selectedImage);
                setImageURL(URL.createObjectURL(selectedImage));
            }
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImageURL(null);
        fileInputRef.current.value = "";
        setErrors({ ...errors, image: '' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!content.trim()) {
            setErrors({ ...errors, content: "Can't post without text" });
            return;
        }

        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        if (url && !urlRegex.test(url)) {
            setErrors({ ...errors, url: "Please enter a valid URL" });
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
            fileInputRef.current.value = "";
            setErrors({});
            toast.success("Post added successfully!");
        } catch (error) {
            setErrors({ form: "Failed to create post, please try again." });
            toast.error("Failed to create post.");
        }
    };

    return (
        <Container>
            <div className="d-flex flex-column align-items-center">
                <div className="col-lg-8">
                    <Form className={styles.Form} onSubmit={handleSubmit}>
                        {errors.form && <Alert variant="danger">{errors.form}</Alert>}
                        <Form.Group controlId="postContent">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={content}
                                onChange={handleContentChange}
                                placeholder="Add post"
                                aria-label="Add content to post"
                            />
                            {errors.content && <Alert variant="danger">{errors.content}</Alert>}
                        </Form.Group>

                        <Form.Group controlId="postUrl">
                            <Form.Control
                                type="text"
                                value={url}
                                onChange={handleUrlChange}
                                placeholder="Add URL"
                                aria-label="Add URL to post"
                            />
                            {errors.url && <Alert variant="danger">{errors.url}</Alert>}
                        </Form.Group>

                        <div className={styles.UploadContainer}>
                            <Form.Group controlId="postImage">
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                    aria-label="Upload image for post"
                                />
                                {errors.image && <Alert variant="danger">{errors.image}</Alert>}
                                {imageURL && (
                                    <div className={styles.ImageContainer}>
                                        <div className="d-flex justify-content-center">
                                            <button 
                                                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                                                onClick={handleRemoveImage}>
                                                Remove Image
                                            </button>
                                        </div>
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
        </Container>
    );
}

export default PostsPage;
