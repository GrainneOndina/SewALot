import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

/**
 * Custom hook that handles redirecting based on user authentication status.
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

        // if user is logged in, the code below will run
        if (userAuthStatus === "loggedIn") {
          history.push("/");
        }
      } catch (err) {
        // if user is not logged in, the code below will run
        if (userAuthStatus === "loggedOut") {
          history.push("/");
        }
      }
    };

    handleMount();
  }, [history, userAuthStatus]);
};
