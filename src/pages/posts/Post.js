import React from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, OverlayTrigger, Tooltip, Row, Col } from "react-bootstrap";
import { Link, useHistory, useParams } from "react-router-dom";
import Avatar from "../../components/Avatar";
//import { axiosRes } from "../../api/axiosDefaults";
import axios from "axios";
import { MoreDropdown } from "../../components/MoreDropdown";
import { useEffect } from 'react';
import Comment from "../comments/Comment";
import CommentCreateForm from "../comments/CommentCreateForm";
import { usePosts } from "../../contexts/PostsContext";

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
    setPost,
    setPosts,
    handleUpdate
  } = props;
  const { updatePost } = usePosts();  // Fetching the updatePost from context
  const history = useHistory();
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const { removePost } = usePosts();

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
        const response = await axios.delete(`/posts/${id}/`);
        if (response.status === 204) {  // Check if the delete was successful
            removePost(id);  // Remove the post from the global state
            history.push('/');  // Navigate away after deletion
        }
    } catch (err) {
        console.error("Failed to delete the post:", err);
        alert("Failed to delete the post, please try again.");
    }
};

  /**
   * Handles the like action for the post.
   */
  const handleLike = async () => {
    try {
      const response = await axios.post("/likes/", { post: id });
      if (response.status === 201) {
        const { data } = response;
        const updatedPost = {
          ...props,
          likes_count: likes_count + 1,
          like_id: data.id
        };
        updatePost(updatedPost);
      }
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  /**
   * Handles the unlike action for the post.
   */
  const handleUnlike = async () => {
    try {
      const response = await axios.delete(`/likes/${like_id}`);
      if (response.status === 204) {
        const updatedPost = {
          ...props,
          likes_count: likes_count - 1,
          like_id: null
        };
        updatePost(updatedPost);
      }
    } catch (err) {
      console.error("Failed to unlike post:", err);
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
  
  const handlePostUpdate = (updatedData) => {
    updatePost(updatedData);
    setPost(updatedData);
};

  return (
    <div className="container">
      <Card className={styles.Post}>
        <Card.Body>
          <Row className="align-items-center">
            <Col xs="auto">
              <Link to={`/profiles/${profile_id}`}>
                <Avatar src={profile_image} height={55} />
              </Link>
            </Col>
            <Col className={`text-left ${styles.Owner}`}>
              <Link to={`/profiles/${profile_id}`} className={styles.OwnerDate}>
                <span>{owner}</span>
                <br />
                <span className={styles.Date}>{updated_at}</span>
              </Link>
            </Col>
            <Col xs="auto" className="ml-auto">
              {is_owner && <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete} />}
            </Col>
          </Row>
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
          ) : like_id && currentUser ? (
            <span id='true-heart' onClick={handleUnlike}>
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span id='false-heart' onClick={handleLike}>
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
    </div>
  );
};

export default Post;