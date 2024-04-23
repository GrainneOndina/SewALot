import { createContext, useContext, useEffect, useState } from "react";
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
 */
export const useProfileData = () => useContext(ProfileDataContext);

/**
 * Hook to access the function for setting the profile data context.
 */
export const useSetProfileData = () => useContext(SetProfileDataContext);

/**
 * Provider component for the profile data context.
 */
export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
  });

  

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider
        value={{ setProfileData }}
      >
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
