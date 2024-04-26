import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

/**
 * Custom hook that handles redirecting based on user authentication status.
 * @param {string} userAuthStatus - Status of user authentication ('loggedIn' or 'loggedOut').
 */
export const useRedirect = (userAuthStatus) => {
  const history = useHistory();

  useEffect(() => {
    /**
     * Handles the initial mount of the component.
     * Checks the user authentication status and redirects accordingly.
     */
    const handleMount = async () => {
      try {
        await axios.post("/dj-rest-auth/token/refresh/");

        // Redirect if user is logged in and 'loggedIn' status is used
        if (userAuthStatus === "loggedIn") {
          history.push("/");
        }
      } catch (err) {
        // Redirect if user is not logged in and 'loggedOut' status is used
        if (userAuthStatus === "loggedOut") {
          history.push("/");
        }
      }
    };

    handleMount();
  }, [history, userAuthStatus]);
};
