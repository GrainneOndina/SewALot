import React, { useEffect, useState } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import { axiosRes } from "../../api/axiosDefaults";
import CommentCreateForm from './CommentCreateForm';
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function Comment({ postId }) {
    const [comments, setComments] = useState([]);
    const [editingComment, setEditingComment] = useState(null);
    const currentUser = useCurrentUser(); 

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const { data } = await axiosReq.get(`/comments/?post=${postId}`);
                console.log(data.results);
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
            await axiosRes.delete(`/comments/${commentId}/`);
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
    <div key={`${comment.id}-${comment.created_at}`}>
        <p>{comment.content}</p>
        <button onClick={() => setEditingComment(comment)}>Edit</button>
        <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
    </div>
            ))}
        </div>
    );
}

export default Comment;
