import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import { axiosRes } from "../../api/axiosDefaults";
import CommentCreateForm from './CommentCreateForm';
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";
import Button from 'react-bootstrap/Button';
import btnStyles from "../../styles/Button.module.css";

function Comment({ postId, profile_image, profile_id }) {
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
                />
            {comments.map((comment) => (
                <div key={`${comment.id}-${comment.created_at}`} className="d-flex align-items-center my-2">
                    <Link to={`/profiles/${comment.profile_id}`}>
                        <Avatar src={comment.profile_image} height={55} />
                    </Link>
                    <div className="ml-2">
                        <p>{comment.content}</p>
                        <div className={`${btnStyles.rightAligned}`}>
                        <button 
                            variant="primary"
                            className={`${btnStyles.Button} ${btnStyles.Blue}`}
                            type="submit"
                            onClick={() => setEditingComment(comment)}>Edit
                        </button>

                        <button 
                            variant="primary"
                            className={`${btnStyles.Button} ${btnStyles.Blue}`}
                            type="submit"
                            onClick={() => handleDeleteComment(comment.id)}>Delete
                        </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Comment;
