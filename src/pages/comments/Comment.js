import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import CommentCreateForm from './CommentCreateForm';
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";
import Button from 'react-bootstrap/Button';
import btnStyles from "../../styles/Button.module.css";

function Comment({ postId }) {
    const [comments, setComments] = useState([]);
    const [editingComment, setEditingComment] = useState(null);
    const currentUser = useCurrentUser(); 

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const { data } = await axiosReq.get(`/comments/?post=${postId}`);
                setComments(data.results);
            } catch (err) {
                console.error('Error fetching comments:', err);
            }
        };

        fetchComments();
    }, [postId]);

    const handleAddComment = (newComment) => {
        setComments(prevComments => [newComment, ...prevComments]);
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axiosReq.delete(`/comments/${commentId}/`);
            setComments(prev => prev.filter(comment => comment.id !== commentId));
        } catch (err) {
            console.error('Failed to delete comment:', err);
        }
    };

    return (
        <div>
            <CommentCreateForm
                postId={postId}
                setComments={handleAddComment}
                profile_image={currentUser?.profile_image}
                profile_id={currentUser?.id}
                commentToEdit={editingComment}
                setEditingComment={setEditingComment}
            />
            {comments.map((comment) => (
                <div key={`${comment.id}-${comment.created_at}`} className="card mb-3">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <Link to={`/profiles/${comment.profile_id}`}>
                                <Avatar src={comment.profile_image} height={55} />
                            </Link>
                            <div className="ml-3">
                                <p className="mb-1"><strong>{comment.owner}</strong> - <small>{new Date(comment.created_at).toLocaleString()}</small></p>
                                <p>{comment.content}</p>
                            </div>
                        </div>
                        {comment.is_owner && (
                            <div className="mt-2">
                                <Button 
                                    variant="outline-primary" 
                                    className={btnStyles.Button}
                                    onClick={() => setEditingComment(comment)}>
                                    Edit
                                </Button>
                                <Button 
                                    variant="outline-danger"
                                    className={`ml-2 ${btnStyles.Button}`} 
                                    onClick={() => handleDeleteComment(comment.id)}>
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
       
export default Comment;
