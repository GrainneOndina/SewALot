import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { axiosReq } from "../../api/axiosDefaults";
import styles from "../../styles/PostCreateEditForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import { usePosts } from "../../contexts/PostsContext";

function PostEditForm() {
    const { id } = useParams();
    const history = useHistory();
    const { updatePost } = usePosts();
    const [postData, setPostData] = useState({ content: "", image: null });
    const [imageUrl, setImageUrl] = useState("");
    const imageInput = useRef(null);

    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await axiosReq.get(`/posts/${id}/`);
            setPostData({ content: data.content, image: data.image });
            setImageUrl(data.image);
        };
        fetchPost();
    }, [id]);

    const handleChange = event => {
        setPostData({ ...postData, [event.target.name]: event.target.value });
    };

    const handleChangeImage = event => {
        if (event.target.files[0]) {
            setPostData({ ...postData, image: event.target.files[0] });
            setImageUrl(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("content", postData.content);
        if (postData.image !== null) {
            formData.append("image", postData.image);
        }
        try {
            const response = await axiosReq.put(`/posts/${id}/`, formData);
            // Assuming response data is the updated post data:
            updatePost(response.data); // This will update the global state
            history.push("/feed");
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Failed to update post, please try again.");
        }
    };

    return (
        <div className="d-flex flex-column align-items-center">
            <div className="col-lg-8">
                <Form className={styles.Form} onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="content"
                            value={postData.content}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            ref={imageInput}
                            onChange={handleChangeImage}
                            accept="image/*"
                        />
                        {imageUrl && <img src={imageUrl} alt="Selected" />}
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Update Post
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default PostEditForm;
