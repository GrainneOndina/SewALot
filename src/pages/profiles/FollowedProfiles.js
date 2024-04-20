import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "../posts/Post";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const FollowedProfiles = () => {
  const [posts, setPosts] = useState([]);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchFollowedPosts = async () => {
      if (currentUser) {
        // Fetch the profiles the current user follows
        try {
          // Assuming you have an endpoint to get followers/following details
          const { data: followersData } = await axiosReq.get(`/followers/?owner=${currentUser.id}`);
          const followedIds = followersData.results.map(follower => follower.followed).join(',');

          // Fetch posts based on these followed IDs
          if (followedIds.length > 0) {
            const { data: postsData } = await axiosReq.get(`/posts/?created_by=${followedIds}`);
            setPosts(postsData.results);
          } else {
            setPosts([]);
          }
        } catch (error) {
          console.error("Failed to fetch posts from followed profiles:", error);
          setPosts([]);
        }
      }
    };

    fetchFollowedPosts();
  }, [currentUser]);

  return (
    <div>
      {posts.length > 0 ? (
        posts.map(post => <Post key={post.id} {...post} />)
      ) : (
        <p>No posts from followed profiles yet.</p>
      )}
    </div>
  );
};

export default FollowedProfiles;
