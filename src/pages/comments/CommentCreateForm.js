import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import btnStyles from "../../styles/Button.module.css";
import Avatar from '../../components/Avatar';
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from '../../api/axiosDefaults';
import styles from '../../styles/CommentCreateEditForm.module.css';

function CommentCreateForm({ postId, setComments, profile_image, profile_id }) {
    const [content, setContent] = useState('');
    const [error, setError] = useState(''); // Ensure this is here

    const handleChange = (event) => {
        setContent(event.target.value);
        setError(''); // Clear any existing error when the user changes the content
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Submit handler called"); // Confirm method call
    
        if (!content.trim()) {
            console.log("Content is empty or only whitespace."); // Check this condition
            //alert("Can't post a comment without text."); // Alert should show here
            setError("Can't post a comment without text."); // Error should be set here
            return;
        }
    
        console.log("Attempting to post comment:", content); // Confirm content isn't empty
    
        try {
            const { data } = await axiosRes.post('/comments/', {
                content,
                post: postId,
            });
    
            console.log("Comment posted:", data); // Log the successful response
            setComments(prevComments => [data, ...prevComments]);
            setContent(''); // Clear the input field after successful submission
        } catch (err) {
            console.error('Error submitting comment:', err);
            setError('Failed to post comment. Please try again.'); // Set an error message for the UI
        }
    };
    

    return (
        <Form className="mt-2" onSubmit={handleSubmit}>
            <Form.Group>
                <InputGroup>
                    <Link to={`/profiles/${profile_id}`}>
                    <Avatar src={profile_image} height={55} />
                    </Link>
                    <Form.Control
                        className={styles.Form}
                        placeholder="Add a comment..."
                        as="textarea"
                        value={content}
                        onChange={handleChange}
                        isInvalid={!!error}
                        rows={2}
                    />
                    <Form.Control.Feedback type="invalid">
                        {error}
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>
            <div className="d-flex justify-content-center">
                <Button
                    variant="primary"
                    className={`${btnStyles.Button} ${btnStyles.Blue}`}
                    type="submit"
                >
                    Post
                </Button>
            </div>
        </Form>
    );
}

export default CommentCreateForm;
