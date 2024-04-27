import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Card, OverlayTrigger, Tooltip, Row, Col } from "react-bootstrap";
import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import axios from "axios";
import { usePosts } from "../../contexts/PostsContext";
import { MoreDropdown } from "../../components/MoreDropdown";
import { toast } from 'react-toastify';
import styles from "../../styles/Post.module.css";

/**
 * Component that represents a single post, displaying the owner's details,
 * the content, and options for editing and deleting the post if the user owns it.
 * It also allows liking and unliking the post.
 * @param {Object} props - Contains all properties passed to the component, including post details.
 */
const Post = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image: initialProfileImage,
    content,
    url,
    image,
    likes_count,
    like_id,
    updated_at,
  } = props;
  const history = useHistory();
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const { updatePost, removePost } = usePosts();
  
  // Use updated profile image from current user context if the post belongs to the current user
  const profile_image = currentUser?.profile_id === profile_id ? currentUser.profile_image : initialProfileImage;

  /**
   * Redirects the user to the post editing page.
   */
  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  /**
   * Deletes the post and provides feedback with a toast message.
   */
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/posts/${id}/`);
      if (response.status === 204) {  
        removePost(id);
        toast.success("Post deleted successfully!");
        if (window.location.pathname.includes(`/posts/`)) {
          history.goBack(); 
          } else {
             // Stay on page
          }
        }
    } catch (err) {
      toast.error("Failed to delete post.");
    }
  };

  /**
   * Handles liking the post and updates the context with the new state.
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
        updatePost(updatedPost); // Update global context
        if (props.handlePostUpdate) {
          props.handlePostUpdate(updatedPost); // Safely call if function is provided
        }
      }
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };
  

  /**
   * Handles unliking the post and updates the context with the new state.
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
        updatePost(updatedPost); // Update global context
        if (props.handlePostUpdate) {
          props.handlePostUpdate(updatedPost); // Safely call if function is provided
        }
      }
    } catch (err) {
      console.error("Failed to unlike post:", err);
    }
  };
  
  /**
   * Navigates to the detailed view of the post.
   */
  const handleClickContent = () => {
    history.push(`/posts/${id}`);
  };

  return (
      <Card className={styles.Post}>
        <Card.Body>
          <Row className="align-items-center">
            <Col xs="auto">
            <Link to={`/profiles/${profile_id}`} aria-label={`View ${owner}'s profile`}>
              <Avatar src={profile_image} alt={`Profile of ${owner}`} height={55} />
            </Link>
            </Col>
            <Col className={`text-left ${styles.Owner}`}>
              <Link to={`/profiles/${profile_id}`} className={styles.OwnerDate}>
                <span><strong>{owner}</strong></span>
                <br />
                <span className={styles.Date}>{updated_at}</span>
              </Link>
            </Col>
            <Col xs="auto" className="ml-auto">
              {is_owner && <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete} />}
            </Col>
          </Row>
          <Card.Text onClick={handleClickContent} role="button" tabIndex={0} aria-label="View full post">
            {content}
          </Card.Text>
        </Card.Body>
        <Link to={`/posts/${id}`}>
        {image && (
          <Card.Img src={image} alt="User uploaded post image" />
        )}
        </Link>
        {url && (
          <OverlayTrigger overlay={<Tooltip>{`Visit external link: ${url}`}</Tooltip>}>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => e.stopPropagation()} 
            aria-label={`Visit external site linked from the post`}
          >
            Check this link out
          </a>
        </OverlayTrigger>
        )}
      <Card.Footer>
        <div className={styles.PostBar}>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own post!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          ) : like_id && currentUser ? (
            <span id='true-heart' onClick={handleUnlike} aria-label="Unlike post">
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span id='false-heart' onClick={handleLike} aria-label="Like post">
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
          <span className={styles.farfa}>{likes_count}</span>
          <Link to={`/posts/${id}?focus=comments`} aria-label={`View comments on ${owner}'s post`}>
              <i className="far fa-comments" />
          </Link>
        </div>
        </Card.Footer>

      </Card>
  );
};

export default Post;
