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
import { toast } from 'react-toastify';

/**
 * Component for creating or editing a comment.
 * 
 * @param {Object} props Component properties
 * @param {number} props.postId ID of the post for the comment
 * @param {function} props.addComment Function to add the comment to the list
 * @param {string} props.profile_image URL to the user's profile image
 * @param {number} props.profile_id ID of the user's profile
 * @param {Object} props.commentToEdit The comment data that is being edited, if any
 * @param {function} props.setEditingComment Function to set the editing state
 * @returns {JSX.Element} The rendered form for creating or editing a comment
 */
function CommentCreateForm({ postId, addComment, profile_image, profile_id, commentToEdit, setEditingComment }) {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const textAreaRef = useRef(null);  // Reference for the textarea

    useEffect(() => {
        setContent(commentToEdit ? commentToEdit.content : '');
        if (commentToEdit && textAreaRef.current) {
            textAreaRef.current.focus();
            textAreaRef.current.style.boxShadow = '0 0 0 2px yellow';
        } else if (textAreaRef.current) {
            textAreaRef.current.style.boxShadow = 'none'; // Remove style when not editing
        }
    }, [commentToEdit]);

    const isEditing = !!commentToEdit;

    const handleChange = (event) => {
        setContent(event.target.value);
        setError('');
    };

    const handleCancel = () => {
        setEditingComment(null);
        setContent('');
        setError('');
        if (textAreaRef.current) {
            textAreaRef.current.style.boxShadow = 'none';
        }
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

            addComment(data);
            setContent('');
            setError('');
            handleCancel();
            toast.success(isEditing ? "Comment updated successfully!" : "Comment added successfully!");
        } catch (err) {
            setError('Failed to post comment. Please try again.');
            toast.error('Failed to submit comment.');
        }
    };

    return (
        <Form className="mt-2" onSubmit={handleSubmit} aria-label={isEditing ? "Edit Comment" : "Create Comment"}>
            <Form.Group>
                <InputGroup>
                    <Link to={`/profiles/${profile_id}`} aria-label="View profile">
                        <Avatar src={profile_image} height={55} alt={`Profile image for ${profile_id}`} />
                    </Link>
                    <Form.Control
                        ref={textAreaRef}
                        className={styles.Form}
                        placeholder="Add a comment..."
                        as="textarea"
                        value={content}
                        onChange={handleChange}
                        isInvalid={!!error}
                        rows={3}
                        aria-label="Add a comment" 
                    />
                </InputGroup>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="d-flex justify-content-between ">
                {isEditing && (
                    <Button
                        variant="secondary"
                        className={`${btnStyles.Button} ${btnStyles.Black}`}
                        onClick={handleCancel}
                        aria-label="Cancel edit"
                    >
                        Cancel
                    </Button>
                )}
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
