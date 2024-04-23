import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Profile.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

/**
 * Component for rendering a profile.
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
