import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";
import { axiosReq } from "../../api/axiosDefaults";
import styles from "../../styles/PostCreateEditForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import { usePosts } from "../../contexts/PostsContext";

function PostEditForm() {
    const { id } = useParams();
    const history = useHistory();
    const { updatePost } = usePosts();
    const [postData, setPostData] = useState({ content: "", url: "", image: null });
    const [imageUrl, setImageUrl] = useState("");
    const [originalUrl, setOriginalUrl] = useState("");
    const [errors, setErrors] = useState({});
    const imageInput = useRef(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await axiosReq.get(`/posts/${id}/`);
                setPostData({
                    content: data.content || "",
                    url: data.url || "",
                    image: data.image
                });
                setImageUrl(data.image || "");
                setOriginalUrl(data.url); // Store the original URL to compare later
            } catch (error) {
                console.error("Failed to fetch post details:", error);
            }
        };
        fetchPost();
    }, [id]);
    

    const handleChange = event => {
        const { name, value } = event.target;
        
        // Avoid handling file input through this handler
        if (event.target.type === 'file') return;
    
        setPostData(prevData => ({
            ...prevData,
            [name]: value
        }));
    
        if (name === "content" && value.trim() !== "" && errors.content) {
            setErrors(prevErrors => ({ ...prevErrors, content: null }));
        } else if (name === "url") {
            if (value.trim() === "" && postData.url) {
                setErrors(prevErrors => ({ ...prevErrors, url: null }));
            }
        }
    };    
    
    const handleImageChange = event => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setErrors({ ...errors, image: 'Image size exceeds the limit of 2MB.' });
                setImageUrl(""); // Clear the image URL if the file is too large
                imageInput.current.value = ""; // Also clear the file input
            } else {
                setPostData({ ...postData, image: file });
                setImageUrl(URL.createObjectURL(file));
                setErrors({ ...errors, image: null }); // Clear any existing image errors
            }
        } else {
            // Handle case where file is not selected or input is cleared
            setPostData(prev => ({ ...prev, image: null }));
            setImageUrl("");
        }
    };
    
    const handleSubmit = async event => {
        event.preventDefault();

        // Checking if the URL was originally present and now it's being cleared
        if (postData.url === "" && originalUrl) {
            setErrors(prevErrors => ({
                ...prevErrors,
                url: "URL field cannot be empty. Please provide a URL or leave the original."
            }));
            setPostData(prevData => ({ ...prevData, url: originalUrl })); // Reset URL to original
            return; // Stop the form submission if there's an error
        }
    
        const formData = new FormData();
        formData.append("content", postData.content);
        if (postData.url) {
            formData.append("url", postData.url);
        }
        if (postData.image instanceof File) {
            formData.append("image", postData.image);
        }
    
        try {
            const response = await axiosReq.put(`/posts/${id}/`, formData);
            updatePost(response.data);
            history.goBack();
        } catch (error) {
            console.error("Error updating post:", error);
            setErrors(error.response?.data || {});
        }
    };    

    return (
        <Container>
            <div className="d-flex flex-column align-items-center">
                <div className="col-lg-8">
                    <Form className={styles.Form} onSubmit={handleSubmit} encType="multipart/form-data">
                        <Form.Group controlId="postContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={7}
                                name="content"
                                value={postData.content}
                                onChange={handleChange}
                                aria-describedby="contentHelp contentError"
                            />
                            {errors.content && (
                                <Alert variant="danger">{errors.content}</Alert>
                            )}
                        </Form.Group>

                        <Form.Group controlId="postUrl">
                            <Form.Label>URL</Form.Label>
                            <Form.Control
                                type="text"
                                name="url"
                                value={postData.url}
                                onChange={handleChange}
                                placeholder={!postData.url ? "Add URL" : ""}
                                aria-describedby="urlHelp"
                            />
                            {errors.url && (
                                <Alert variant="danger">{errors.url}</Alert>
                            )}
                        </Form.Group>

                        <Form.Group controlId="postImage">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                ref={imageInput}
                                onChange={handleImageChange}
                                accept="image/*"
                                aria-describedby="imageHelp"
                            />
                            {imageUrl && (
                                <Image src={imageUrl} alt="Selected" thumbnail className="img-fluid" />
                            )}
                            {errors.image && (
                                <Alert variant="danger">{errors.image}</Alert>
                            )}
                        </Form.Group>

                        <div className="d-flex justify-content-between">
                            <Button variant="secondary" className={`${btnStyles.Button} ${btnStyles.Black}`} onClick={() => history.goBack()}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" className={`${btnStyles.Button} ${btnStyles.Blue}`}>
                                Update Post
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </Container>
    );
}

export default PostEditForm;
