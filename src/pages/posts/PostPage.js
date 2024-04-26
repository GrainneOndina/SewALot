import React, { useEffect, useState } from "react";
import { usePosts } from "../../contexts/PostsContext";
import { useParams, useLocation } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Container from "react-bootstrap/Container";
import Post from "./Post";
import Comment from "../comments/Comment";
import appStyles from "../../App.module.css";
import { toast } from 'react-toastify';

/**
 * PostPage component that displays a single post along with its comments.
 * It fetches the post data based on the ID from the URL and handles updating the post.
 */
function PostPage() {
    const { id } = useParams();
    const location = useLocation();
    const { updatePost } = usePosts();
    const [post, setPost] = useState(null);

    useEffect(() => {
        /**
         * Fetches post data from the server.
         */
        const fetchPost = async () => {
            try {
                const { data } = await axiosReq.get(`/posts/${id}`);
                setPost(data);
            } catch (err) {
                console.error('Error fetching post:', err);
                toast.error('Error fetching post.');
            }
        };
        fetchPost();
    }, [id, location]);

    useEffect(() => {
        /**
         * If 'focus' parameter in URL query is 'comments', scrolls the comments section into view.
         */
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get("focus") === "comments") {
            const commentsSection = document.getElementById("commentsHeading");
            if (commentsSection) {
                commentsSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    }, [location, post]);    

    /**
     * Updates the post state locally and in the global context.
     * @param {Object} updatedData - The updated post data.
     */
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
