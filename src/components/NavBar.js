import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink, useHistory, Redirect } from "react-router-dom";
import { useCurrentUser, useSetCurrentUser } from "../contexts/CurrentUserContext";
import axios from "axios";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import { removeTokenTimestamp } from "../utils/utils";
import { Row } from "react-bootstrap";

/**
 * NavBar component that provides navigation links and user authentication options.
 * Handles user sign-out and redirects to the sign-in page on logout.
 */
const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const history = useHistory();
  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  /**
   * handleSignOut - Signs out the user, clears session storage, and redirects to the landing page.
   */
  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
      removeTokenTimestamp();
      history.push("/signin");
    } catch (err) {
      
    }
  };

  
  // Redirect unauthenticated users to the landing page
  if (!currentUser) {
    return <Redirect to="/landing" />;
  }

  // Icons displayed when a user is logged in
  const loggedInIcons = (
    <>
      <NavLink className={styles.NavLink} 
        to="/" 
        onClick={handleSignOut}
        aria-label="Sign Out"
      >
        <i className="fas fa-sign-out-alt"></i>   Sign out
      </NavLink>
      <NavLink
        className={`${styles.NavLink} ${styles.AvatarLink}`}
        activeClassName={styles.activeAvatar}
        to={`/profiles/${currentUser?.profile_id}`}
        aria-label="Profile page"
      >
        <img
          className={styles.AvatarImage}
          src={currentUser?.profile_image}
          alt="Profile"
        />
      </NavLink>
    </>
  );

  // Icons displayed when no user is logged in
  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
        aria-label="Sign In"
      >
        <i className="fas fa-sign-in-alt"></i>   Sign in
      </NavLink>
      <NavLink
        to="/signup"
        className={styles.NavLink}
        activeClassName={styles.Active}
        aria-label="Sign Up"
      >
        <i className="fas fa-user-plus"></i>   Sign up
      </NavLink>
    </>
  );

    return (
    <div className="col-lg-8">
        <Navbar
          key={currentUser ? currentUser.id : "guest"}
          expanded={expanded}
          className={styles.NavBar}
          expand="md"
          fixed="top"
          style={{ justifyContent: "space-between" }}
        >
        <div className="d-flex align-items-center">  {/* Added flex container for logo and h6 */}
          <NavLink to="/">
            <img src={logo} 
            alt="logo" 
            className={styles.Logo} 
            aria-label="Logo / Home"
            />
          </NavLink>
          <NavLink to="/" className={styles.NavLinkNoUnderline}>
        <h5 className={`${styles.brandTitle} d-none d-md-block`}>SewLot</h5> {/* Hide on xs to sm, show on md and larger */}
          </NavLink>
        </div>
         <div>
          <NavLink
            className={styles.NavLink}
            activeClassName={styles.Active}
            exact
            to="/"
            aria-label="Home"
          >
            <i className="fas fa-home"></i>   Home
          </NavLink>
        </div>
        <div>
          <NavLink
            className={styles.NavLink}
            activeClassName={styles.Active}
            to="/liked"
            aria-label="Liked"
          >
            <i className="fas fa-heart"></i>   Liked
          </NavLink>
        </div>

        <div>
          <Navbar.Toggle
            ref={ref}
            onClick={() => setExpanded(!expanded)}
            aria-controls="basic-navbar-nav"
            aria-label="Menu navigation"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto text-left">
              {currentUser ? loggedInIcons : loggedOutIcons}
            </Nav>
          </Navbar.Collapse>
        </div>

      </Navbar>
    </div>
  );
};

export default NavBar;