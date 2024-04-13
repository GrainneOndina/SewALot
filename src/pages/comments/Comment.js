import React, { useEffect, useState } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import CommentCreateForm from './CommentCreateForm';
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function Comment({ postId }) {
    const [comments, setComments] = useState([]);
    const currentUser = useCurrentUser(); // Assuming this hook returns the current user data

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

    return (
        <div>
            <CommentCreateForm
                postId={postId}
                setComments={handleAddComment}
                profile_image={currentUser?.profile_image}
                profile_id={currentUser?.id}
            />
            {comments.map((comment) => (
                <div key={`${comment.id}-${comment.created_at}`}>
                    <p>{comment.content}</p>
                </div>
            ))}
        </div>
    );
}

export default Comment;
