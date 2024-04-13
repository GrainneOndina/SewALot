import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import btnStyles from "../../styles/Button.module.css";
import Avatar from '../../components/Avatar';
import { axiosRes } from '../../api/axiosDefaults';
import styles from '../../styles/CommentCreateEditForm.module.css';

function CommentCreateForm({ postId, setComments, profile_image, profile_id, commentToEdit, setEditingComment }) {
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
        const endpoint = isEditing ? `/comments/${commentToEdit.id}/` : '/comments/';
        const method = isEditing ? 'put' : 'post';

        try {
            const { data } = await axiosRes[method](endpoint, {
                content,
                post: postId,
            });
            console.log(data); 

            if (isEditing) {
                setComments(prev => prev.map(c => c.id === data.id ? data : c));
                //setEditingComment(null); // Reset editing state after successful update
            } else {
                setComments(prev => [data, ...prev]);
            }
            setContent(''); // Clear the input field after submitting
        } catch (err) {
            console.error('Error submitting comment:', err);
            setError('Failed to post comment. Please try again.');
        }
    };

    return (
        <Form ref={formRef} className="mt-2" onSubmit={handleSubmit}>
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
                    {isEditing ? 'Update' : 'Post'}
                </Button>
            </div>
        </Form>
    );
    
}

export default CommentCreateForm;
