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

function CommentCreateForm({ postId, setComments, profile_image, profile_id, commentToEdit }) {
    const [content, setContent] = useState(commentToEdit ? commentToEdit.content : '');
    const [error, setError] = useState('');

    const isEditing = !!commentToEdit;

    const handleChange = (event) => {
        setContent(event.target.value);
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const endpoint = isEditing ? `/comments/${commentToEdit.id}/` : '/comments/';
            const method = isEditing ? 'put' : 'post';
            const { data } = await axiosRes[method](endpoint, {
                content,
                post: postId,
            });

            setComments(prev => isEditing ? prev.map(c => c.id === data.id ? data : c) : [data, ...prev]);
            setContent('');
        } catch (err) {
            console.error('Error submitting comment:', err);
            setError('Failed to post comment. Please try again.');
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
