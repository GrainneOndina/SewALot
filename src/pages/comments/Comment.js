import React, { useState } from "react";
import { Link } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import styles from "../../styles/Comment.module.css";

/**
 * Component for rendering a comment.
 */
function Comment(props) {
  const {
    id,
    content,
    owner,
    profile_id,
    profile_image,
    created_at,
    updated_at,
    setComments,
  } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  /**
   * Deletes the comment.
   */
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`);
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Handles the edit of the comment.
   */
  const handleEdit = async () => {
    try {
      const { data } = await axiosRes.patch(`/comments/${id}/`, {
        content: editedContent,
      });
      setEditedContent(data.content);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Handles the change of the edited content.
   */
  const handleChange = (event) => {
    setEditedContent(event.target.value);
  };

  /**
   * Toggles the editing state of the comment.
   */
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className={styles.Comment}>
      <div className={styles.CommentHeader}>
        <Link to={`/profiles/${owner.profile_id}`}>
          <img
            src={profile_image}
            alt={owner.username}
            className={styles.Avatar}
          />
        </Link>
        <Link to={`/profiles/${owner.profile_id}`} className={styles.Username}>
          {owner.username}
        </Link>
        <span className={styles.Timestamp}>{created_at}</span>
        {owner.is_owner ? (
          <div className={styles.CommentActions}>
            {isEditing ? (
              <>
                <textarea
                  className={styles.EditTextArea}
                  value={editedContent}
                  onChange={handleChange}
                />
                <button
                  className={styles.EditButton}
                  onClick={handleEdit}
                  disabled={!editedContent.trim()}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button className={styles.EditButton} onClick={toggleEdit}>
                  Edit
                </button>
                <button className={styles.DeleteButton} onClick={handleDelete}>
                  Delete
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
      <p className={styles.CommentContent}>{isEditing ? null : content}</p>
    </div>
  );
}

export default Comment;
