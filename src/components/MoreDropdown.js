import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../styles/MoreDropdown.module.css";
import { useHistory } from "react-router";

/**
 * ThreeDots - A forwardRef component that renders an ellipsis icon for dropdown toggle.
 * @param {Object} props - Component props
 * @param {function} ref - Ref forwarded for the component
 * @returns {JSX.Element} - Rendered component
 */
const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <i
    className={`fas fa-ellipsis-v ${styles.ThreeDots}`} 
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    aria-label="Menu for edit and delete options"
  />
));

/**
 * MoreDropdown - Component to render a dropdown with options to edit and delete.
 * @param {function} handleEdit - Function to call when edit option is selected
 * @param {function} handleDelete - Function to call when delete option is selected
 * @returns {JSX.Element} - Rendered Dropdown component
 */
export const MoreDropdown = ({ handleEdit, handleDelete }) => {
  return (
    <Dropdown className="ml-auto" drop="left">
      <Dropdown.Toggle as={ThreeDots} />

      <Dropdown.Menu className="text-center">
        <Dropdown.Item
          className={styles.DropdownItem}
          onClick={handleEdit}
          aria-label="Edit"
        >
          <i className="fas fa-edit" />
        </Dropdown.Item>
        <Dropdown.Item
          className={styles.DropdownItem}
          onClick={handleDelete}
          aria-label="Delete"
        >
          <i className="fas fa-trash-alt" />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

/**
 * ProfileEditDropdown - Component to render a dropdown with options for profile editing.
 * @param {string} id - ID of the profile to edit
 * @returns {JSX.Element} - Rendered Dropdown component for profile edit options
 */
export const ProfileEditDropdown = ({ id }) => {
  const history = useHistory();
  return (
    <Dropdown className="ml-auto">
      <Dropdown.Toggle as={ThreeDots} />
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit`)}
          aria-label="Edit profile"
        >
          <i className="fas fa-edit" /> Edit profile
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/username`)}
          aria-label="Edit username"
        >
          <i className="far fa-id-card" />
          Change username
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/password`)}
          aria-label="Edit password"
        >
          <i className="fas fa-key" />
          Change password
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
