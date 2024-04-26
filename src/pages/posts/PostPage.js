import React, { useEffect, useState } from "react";
import { usePosts } from "../../contexts/PostsContext";
import { useParams, useLocation } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Container from "react-bootstrap/Container";
import Post from "./Post";
import Comment from "../comments/Comment";
import appStyles from "../../App.module.css";
import { toast } from 'react-toastify';

function PostPage() {
    const { id } = useParams();
    const location = useLocation();
    const { updatePost } = usePosts();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await axiosReq.get(`/posts/${id}`);
            setPost(data);
        };
        fetchPost();
    }, [id, location]);

    useEffect(() => {
        // Parse the query string for focus parameter
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get("focus") === "comments") {
            const commentsSection = document.getElementById("commentsHeading");
            if (commentsSection) {
                // Scroll the comments section into view at the top of the screen
                commentsSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    }, [location, post]);  // Dependency on 'post' ensures the post is loaded
    

    const handlePostUpdate = (updatedData) => {
        updatePost(updatedData);
        setPost(updatedData);
    };

    return (
        <Container>
                <div className="d-flex flex-column align-items-center" aria-live="polite">
                    <div className="col-lg-8">
                        <div className={appStyles.Content}>
                            {post ? (
                                <>
                                    <article>
                                        <Post {...post} handlePostUpdate={handlePostUpdate} />
                                    </article>
                                    <hr />
                                    <section aria-labelledby="commentsHeading">
                                        <h3 id="commentsHeading">Comments</h3>
                                        <Comment postId={id} />
                                    </section>
                                </>
                            ) : (
                                <div role="alert" aria-busy="true">Loading...</div>
                            )}
                        </div>
                    </div>
                </div>
        </Container>
    );
}

export default PostPage;