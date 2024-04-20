import React from "react";
import { usePosts } from "../../contexts/PostsContext"; // Adjust the path as necessary
import Post from "./Post"; // Adjust the path as necessary

const LikedPosts = () => {
  const { posts } = usePosts();
  const likedPosts = posts.filter(post => post.like_id != null); // Ensure you have like_id set correctly in your global state

  return (
    <div>
      {likedPosts.length > 0 ? (
        likedPosts.map(post => <Post key={post.id} {...post} />)
      ) : (
        <p>No liked posts yet!</p>
      )}
    </div>
  );
};

export default LikedPosts;