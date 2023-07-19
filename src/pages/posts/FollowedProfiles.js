import React, { useEffect, useState } from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";
import Post from "./Post";

/**
 * Component that displays posts from followed profiles.
 */
const FollowedProfiles = () => {
  const currentUser = useCurrentUser();
  const [followedPosts, setFollowedPosts] = useState([]);

  useEffect(() => {
    /**
     * Fetches the posts from followed profiles.
     */
    const fetchFollowedPosts = async () => {
      try {
        const response = await axiosRes.get(
          `/profiles/${currentUser?.profile_id}/followed-posts/`
        );
        setFollowedPosts(response.data);
      } catch (error) {
        // console.log(error);
      }
    };

    if (currentUser) {
      fetchFollowedPosts();
    }
  }, [currentUser]);

  return (
    <>
      {followedPosts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          owner={post.owner}
          profile_id={post.profile_id}
          profile_image={post.profile_image}
          content={post.content}
          url={post.url}
          image={post.image}
          comments_count={post.comments_count}
          likes_count={post.likes_count}
          like_id={post.like_id}
          updated_at={post.updated_at}
          postPage={false}
          setPosts={() => {}}
        />
      ))}
    </>
  );
};

export default FollowedProfiles;
