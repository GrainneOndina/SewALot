import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Profile.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

/**
 * Profile - Component for displaying a simple profile view with a link to the profile's page.
 * It displays the profile owner's username and provides a link to the detailed profile page.
 *
 * @param {Object} profile - The profile object containing details like id and owner's username.
 * @returns {JSX.Element} - A rendered view of a profile snippet.
 */
const Profile = ({ profile }) => {
  const { id, owner } = profile;
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm">
          <div className={styles.Profile}>
          </div>
        </div>
        <div className="col-sm">
          <Link className={styles.OwnerLink} to={`/profiles/${id}`} aria-label={`View profile of ${owner}`}>
            <strong>{owner}</strong>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;