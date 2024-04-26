import React from "react";
import Container from "react-bootstrap/Container";
import { usePosts } from "../../contexts/PostsContext";
import Post from "./Post";

/**
 * LikedPosts component displays a list of posts that have been liked by the user.
 * It utilizes the PostsContext to fetch posts data and filters those with a like_id.
 * 
 * @returns {JSX.Element} Container wrapping liked posts or a message if none exist.
 */
const LikedPosts = () => {
  const { posts } = usePosts();
  const likedPosts = posts.filter(post => post.like_id != null);

  return (
    <Container>
        <div className="d-flex flex-column align-items-center">
            <div className="col-lg-8">
            {likedPosts.length > 0 ? (
                <section>
                    {likedPosts.map(post => <Post key={post.id} {...post} />)}
                </section>
            ) : (
                <h5 aria-live="polite">No liked posts yet!</h5>
            )}
            </div>
        </div>
    </Container>
  );
};

export default LikedPosts;
