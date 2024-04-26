import { createContext, useContext, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "./CurrentUserContext";

/**
 * Context for the profile data.
 */
const ProfileDataContext = createContext();

/**
 * Context for setting the profile data.
 */
const SetProfileDataContext = createContext();

/**
 * Hook to access the profile data context.
 * @returns {Object} The profile data.
 */
export const useProfileData = () => useContext(ProfileDataContext);

/**
 * Hook to access the function for setting the profile data context.
 * @returns {Function} The function to set profile data.
 */
export const useSetProfileData = () => useContext(SetProfileDataContext);

/**
 * Provider component for the profile data context.
 * Wraps its children with ProfileDataContext and SetProfileDataContext providers.
 * @param {Object} props - React component props.
 */
export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
  });

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider value={{ setProfileData }}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
