import React from "react";
import Container from "react-bootstrap/Container";
import { usePosts } from "../../contexts/PostsContext";
import Post from "./Post";

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