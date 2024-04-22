import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import { axiosRes } from "../../api/axiosDefaults";
import CommentCreateForm from './CommentCreateForm';
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";
import Button from 'react-bootstrap/Button';
import btnStyles from "../../styles/Button.module.css";
import Alert from 'react-bootstrap/Alert';

function Comment({ postId, profile_image, profile_id }) {
    const [comments, setComments] = useState([]);
    const [errors, setErrors] = useState({});
    const [editingComment, setEditingComment] = useState(null);
    const currentUser = useCurrentUser();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const { data } = await axiosReq.get(`/comments/?post=${postId}`);
                setComments(data.results);
                console.log(data.results);
            } catch (err) {
                console.error('Error fetching comments:', err);
                setErrors({ fetch: 'Failed to load comments.' });
            }
        };

        fetchComments();
    }, [postId]);

    const addComment = (newComment) => {
        const itemIndex = comments.findIndex(oldComment => oldComment.id === newComment.id);
    if (itemIndex !== -1) {
        setComments(prevComments => prevComments.map(comment => comment.id === newComment.id ? newComment : comment));
    } else {
        setComments(prevComments => [newComment, ...prevComments]);
    }
};
    const handleDeleteComment = async (commentId) => {
        try {
            await axiosReq.delete(`/comments/${commentId}/`);
            setComments(prev => prev.filter(comment => comment.id !== commentId));
        } catch (err) {
            console.error('Failed to delete comment:', err);
            setErrors({ delete: `Failed to delete comment with ID ${commentId}.` });
        }
    };
    
    return (
        <div>
            {errors.fetch && <Alert variant="danger">{errors.fetch}</Alert>}
            <CommentCreateForm
                postId={postId}
                addComment={addComment}
                profile_image={currentUser?.profile_image}
                profile_id={currentUser?.id}
                commentToEdit={editingComment}
                setEditingComment={setEditingComment}
            />
            {comments.map((comment) => (
                <div key={`${comment.id}-${comment.created_at}`} className="card mb-3">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <Link to={`/profiles/${comment.profile_id}`} aria-label={`View ${comment.owner}'s profile`}>
                                <Avatar src={comment.profile_image} height={55} alt={`Avatar of ${comment.owner}`} />
                            </Link>
                            <div className="ml-3">
                                <p className="mb-1"><strong>{comment.owner}</strong></p>
                                <p>{comment.content}</p>
                                  <div>
                                    {comment.is_owner && (
                                        <div className="mt-2">
                                           <Button 
                                            variant="outline-primary" 
                                            className={btnStyles.Button}
                                            onClick={() => setEditingComment(comment)}
                                            aria-label="Edit comment">
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="outline-danger"
                                            className={`ml-2 ${btnStyles.Button}`} 
                                            onClick={() => handleDeleteComment(comment.id)}
                                            aria-label="Delete comment">
                                            Delete
                                        </Button>
                                        </div>
                                    )}
                                    </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            ))}
        </div>
    );
}
       
export default Comment;