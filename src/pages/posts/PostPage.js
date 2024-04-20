import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";
import Comment from "../comments/Comment";
import appStyles from "../../App.module.css";
import { usePosts } from "../../contexts/PostsContext";

function PostPage() {
    const { id } = useParams();
    const { updatePost } = usePosts();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await axiosReq.get(`/posts/${id}`);
            setPost(data);
        };
        fetchPost();
    }, [id]);

    const handlePostUpdate = (updatedData) => {
        updatePost(updatedData);
        setPost(updatedData);
    };

    return (
        <div className="container">
            <div className="d-flex flex-column align-items-center">
                <div className="col-lg-8">
                    <div className={appStyles.Content}>
                        {post ? (
                            <>
                                <Post {...post} handlePostUpdate={handlePostUpdate} />
                                <hr />
                                <h3>Comments</h3>
                                <Comment postId={id} />
                            </>
                        ) : (
                            <div>Loading...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostPage;
