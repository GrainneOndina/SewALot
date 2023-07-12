import React from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, OverlayTrigger, Tooltip, Button, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import btnStyles from "../../styles/Button.module.css";

const Post = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    likes_count,
    like_id,
    content,
    image,
    updated_at,
    postPage,
    setPosts,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      history.goBack();
    } catch (err) {
      // console.log(err);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { post: id });
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : post;
        }),
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count - 1, like_id: null }
            : post;
        }),
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  const handleFollow = async (profile) => {
    try {
      // Implement the follow functionality here
      // You can use the `profile_id` or other profile details to send the request
      // Example: await axiosRes.post("/follow/", { profileId: profile.id });
      console.log("Follow profile:", profile);
    } catch (err) {
      // Handle follow error
      // console.log(err);
    }
  };

  const handleUnfollow = async (profile) => {
    try {
      // Implement the unfollow functionality here
      // You can use the `profile_id` or other profile details to send the request
      // Example: await axiosRes.delete(`/follow/${profile.id}/`);
      console.log("Unfollow profile:", profile);
    } catch (err) {
      // Handle unfollow error
      // console.log(err);
    }
  };

  return (
    <Card className={styles.Post}>
      <Card.Body>
        <div className={`d-flex align-items-center justify-content-between ${styles.Media}`}>
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {!is_owner && (
              <Col>
                {currentUser && (
                  <>
                    {profile?.following_id ? (
                      <Button
                        className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                        onClick={() => handleUnfollow(profile)}
                      >
                        unfollow
                      </Button>
                    ) : (
                      <Button
                        className={`${btnStyles.Button} ${btnStyles.Black}`}
                        onClick={() => handleFollow(profile)}
                      >
                        follow
                      </Button>
                    )}
                  </>
                )}
              </Col>
            )}
            {is_owner && postPage && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </Card.Body>
      <Link to={`/posts/${id}`}>
        <Card.Img src={image} alt={id} />
      </Link>
      <Card.Body>
        {content && <Card.Text>{content}</Card.Text>}
        <div className={styles.PostBar}>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own post!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          ) : like_id ? (
            <span onClick={handleUnlike}>
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike}>
              <i className={`far fa-heart ${styles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like posts!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          )}
          {likes_count}
          <Link to={`/posts/${id}`}>
            <i className="far fa-comments" />
          </Link>
          {comments_count}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Post;
