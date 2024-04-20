import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "./CurrentUserContext";
import { followHelper, unfollowHelper } from "../utils/utils";

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

  /**
   * Handles the follow action on a profile.
   */
  const handleFollow = async (clickedProfile) => {
    console.log("Attempting to follow:", clickedProfile.id);
    try {
      const { data } = await axiosRes.post("/followers/", { followed: clickedProfile.id });
      console.log("Follow successful:", data);
      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        }
      }));
    } catch (err) {
      console.error("Failed to follow:", err);
    }
  };

  /**
   * Handles the unfollow action on a profile.
   */
  const handleUnfollow = async (clickedProfile) => {
    console.log("Attempting to unfollow:", clickedProfile.following_id);
    try {
      const response = await axiosRes.delete(`/followers/${clickedProfile.following_id}/`);
      console.log("Unfollow successful:", response);
      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        }
      }));
    } catch (err) {
      console.error("Failed to unfollow:", err);
    }
  };

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider
        value={{ setProfileData, handleFollow, handleUnfollow }}
      >
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
