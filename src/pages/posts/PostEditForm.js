import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
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
            } catch (error) {
                console.error("Failed to fetch post details:", error);
            }
        };
        fetchPost();
    }, [id]);

    const handleChange = event => {
        setPostData({ ...postData, [event.target.name]: event.target.value });
    };

    const handleChangeImage = event => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                //alert('Image size exceeds the limit of 2MB.');
                setErrors({...errors, image: 'Image size exceeds the limit of 2MB.'});
                setImageUrl(""); // Clear the image URL if the file is too large
                imageInput.current.value = ""; // Also clear the file input
                return;
            }
            setErrors({...errors, image: ''});
            //setImageError(""); // Clear any existing error messages
            setPostData({ ...postData, image: file });
            setImageUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("content", postData.content);
        if (postData.url) formData.append("url", postData.url);
        if (postData.image) formData.append("image", postData.image);

        try {
            const response = await axiosReq.put(`/posts/${id}/`, formData);
            updatePost(response.data);
            history.push("/feed");
        } catch (error) {
            console.error("Error updating post:", error);
            setErrors(error.response?.data || {});
            //alert("Failed to update post, please try again.");
        }
    };

    return (
        <div className="container">
            <div className="d-flex flex-column align-items-center">
                <div className="col-lg-8">
                    <Form className={styles.Form} onSubmit={handleSubmit}>
                        <Form.Group controlId="postContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="content"
                                value={postData.content}
                                onChange={handleChange}
                                aria-describedby="contentError"
                            />
                            {errors.content && <Alert variant="danger">{errors.content.join(", ")}</Alert>}
                        </Form.Group>

                        <Form.Group controlId="postUrl">
                            <Form.Label>URL</Form.Label>
                            <Form.Control
                                type="text"
                                name="url"
                                value={postData.url}
                                onChange={handleChange}
                                placeholder="Add URL"
                                aria-describedby="urlError"
                            />
                            {errors.url && <Alert variant="danger">{errors.url.join(", ")}</Alert>}
                        </Form.Group>

                        <Form.Group controlId="postImage">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                ref={imageInput}
                                onChange={handleChangeImage}
                                accept="image/*"
                                aria-describedby="imageError"
                            />
                            {imageUrl && (
                                <div className={styles.ImageContainer}>
                                    <Image src={imageUrl} alt="Selected" thumbnail className="img-fluid" />
                                </div>
                            )}
                            {errors.image && <Alert variant="danger">{errors.image}</Alert>}
                        </Form.Group>


                        <Button variant="primary" type="submit" className={`${btnStyles.Button} ${btnStyles.Blue}`}>
                            Update Post
                        </Button>
                        <Button
                            variant="secondary"
                            className={`${btnStyles.Button} ${btnStyles.Red}`}
                            onClick={() => history.goBack()}
                        >
                            Cancel
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default PostEditForm;
