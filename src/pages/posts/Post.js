import React from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";

/**
 * Component that represents a post.
 */
const Post = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    content,
    url,
    image,
    comments_count,
    likes_count,
    like_id,
    updated_at,
    postPage,
    setPosts,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  /**
   * Handles the edit action for the post.
   */
  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  /**
   * Handles the delete action for the post.
   */
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      history.goBack();
    } catch (err) {
      // console.log(err);
    }
  };

  /**
   * Handles the like action for the post.
   */
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

  /**
   * Handles the unlike action for the post.
   */
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

  /**
   * Handles the click event for the post content.
   */
  const handleClickContent = () => {
    history.push(`/posts/${id}`);
  };

  /**
   * Handles the click event for the post URL.
   */
  const handleClickUrl = (event) => {
    event.stopPropagation();
  };

  return (
    <Card className={styles.Post}>
      <Card.Body>
        <div className={styles.UserInfo}>
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            <span>{owner}</span>
            <br />
            <span className={styles.Date}>{updated_at}</span>
          </Link>
          {is_owner && postPage ? (
            <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete} />
          ) : !is_owner ? null : null}
        </div>
        {content && (
          <p className={styles.Content} onClick={handleClickContent}>
            {content}
          </p>
        )}
      </Card.Body>

      <Link to={`/posts/${id}`}>
        <Card.Img src={image} alt="" />
      </Link>
      {url && (
        <div className={styles.URLOverlay}>
          <a href={url} target="_blank" rel="noopener noreferrer" onClick={handleClickUrl}>
            <p className={styles.LinkText}>Check this link out</p>
          </a>
        </div>
      )}

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
    </Card>
  );
};

export default Post;
