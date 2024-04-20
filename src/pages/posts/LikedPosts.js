import React from "react";
import { usePosts } from "../../contexts/PostsContext";
import Post from "./Post";

const LikedPosts = () => {
  const { posts } = usePosts();
  const likedPosts = posts.filter(post => post.like_id != null);

  return (
    <div>
        <div className="d-flex flex-column align-items-center">
            <div className="col-lg-8">
                {likedPosts.length > 0 ? (
                    likedPosts.map(post => <Post key={post.id} {...post} />)
                ) : (
                    <p>No liked posts yet!</p>
                )}
            </div>
        </div>
    </div>
  );
};

export default LikedPosts;