import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Avatar from '../../components/Avatar';
import { axiosRes } from '../../api/axiosDefaults';
import styles from '../../styles/CommentCreateEditForm.module.css';
import btnStyles from "../../styles/Button.module.css";

/**
 * Form component for creating and editing comments.
 */
function CommentCreateForm({ postId, addComment, profile_image, profile_id, commentToEdit, setEditingComment }) {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const formRef = useRef(null);  // Create a reference for the form

    // Set content when commentToEdit changes
    useEffect(() => {
        setContent(commentToEdit ? commentToEdit.content : '');
        if (commentToEdit && formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [commentToEdit]);

    const isEditing = !!commentToEdit;

    const handleChange = (event) => {
        setContent(event.target.value);
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!content.trim()) {
            setError('Cannot post an empty comment.');
            return;
        }

        const endpoint = isEditing ? `/comments/${commentToEdit.id}/` : '/comments/';
        const method = isEditing ? 'put' : 'post';


        try {
            const { data } = await axiosRes[method](endpoint, {
                content,
                post: postId,
            });
            console.log(data); 

            if (isEditing) {
                addComment(data);
                setEditingComment(null);
            } else {
                addComment(data);
            }
            setContent('');
            setError('');
        } catch (err) {
            console.error('Error submitting comment:', err);
            setError('Failed to post comment. Please try again.');
        }
    };

    return (
        <Form ref={formRef} className="mt-2" onSubmit={handleSubmit} aria-label={isEditing ? "Edit Comment" : "Create Comment"}>
            <Form.Group>
                <InputGroup>
                    <Link to={`/profiles/${profile_id}`} aria-label="View profile">
                        <Avatar src={profile_image} height={55} alt={`Profile image for ${profile_id}`} />
                    </Link>
                    <Form.Control
                        className={styles.Form}
                        placeholder="Add a comment..."
                        as="textarea"
                        value={content}
                        onChange={handleChange}
                        isInvalid={!!error}
                        rows={2}
                        aria-label="Add a comment" 
                    />
                   
                </InputGroup>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="d-flex justify-content-center">
                <Button
                    variant="primary"
                    className={`${btnStyles.Button} ${btnStyles.Blue}`}
                    type="submit"
                    aria-label={isEditing ? "Update Comment" : "Post Comment"}
                >
                    {isEditing ? 'Update' : 'Post'}
                </Button>
            </div>
        </Form>
    );
}

export default CommentCreateForm;