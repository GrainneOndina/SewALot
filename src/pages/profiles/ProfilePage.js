import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Image, Button, Container } from "react-bootstrap";
import Asset from "../../components/Asset";
import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import { useProfileData, useSetProfileData } from "../../contexts/ProfileDataContext";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../posts/Post";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no-results.png";
import { ProfileEditDropdown } from "../../components/MoreDropdown";
import { usePosts } from "../../contexts/PostsContext"; // Make sure this import is correct

/**
 * Component for displaying a user profile page.
 */
function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  //const [profilePosts, setProfilePosts] = useState({ results: [] });
  const { posts, setPosts } = usePosts(); // Use global posts state
  const currentUser = useCurrentUser();
  const { id } = useParams();
  const history = useHistory();
  const { setProfileData, handleFollow, handleUnfollow } = useSetProfileData();
  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;
  const profilePosts = posts.filter(post => post.owner === profile?.owner);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: pageProfile } = await axiosReq.get(`/profiles/${id}/`);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] }
        }));
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id, setProfileData]);

  const mainProfile = (
    <>
      {/* Dropdown Menu or Follow Button */}
      <Row className="justify-content-end">
        <Col md={3} xs={12} className="text-right">
          {/* Profile Edit Dropdown */}
          {profile?.is_owner && (
            <ProfileEditDropdown
              id={profile?.id}
              handleEdit={() => history.push(`/profiles/${id}/edit`)}
            />
          )}
  
          {/* Follow/Unfollow Button */}
          {currentUser && !is_owner && (
            <Button
              className={`${btnStyles.Button} ${btnStyles.BlackOutline} mt-3`}
              onClick={() => (profile?.following_id ? handleUnfollow(profile) : handleFollow(profile))}
            >
              {profile?.following_id ? 'unfollow' : 'follow'}
            </Button>
          )}
        </Col>
      </Row>
  
      {/* Profile Details and Avatar */}
      <Row className="px-3">
        {/* Avatar Column (Left) */}
        <Col md={3} xs={12} className="text-center mb-3">
          <Container className="d-flex align-items-center justify-content-center">
            <Image
              className={styles.ProfileImage} 
              roundedCircle
              src={profile?.image}
              style={{ width: "150px" }}
            />
          </Container>
        </Col>
  
        {/* Profile Details */}
        <Col md={9} xs={12}>
          <Row>
            <Col>
              <h3 className="m-2">{profile?.owner}</h3>
              {profile?.description && <div className="p-3">{profile.description}</div>}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );

  // Adjust post filter and mapping for global posts context
  

  const mainProfilePosts = (
    <>
      <hr />
      <p className="text-center">{profile?.owner}'s posts</p>
      <hr />
      {profilePosts.length ? (
        <InfiniteScroll
          children={profilePosts.map((post) => (
            <Post key={post.id} {...post} setPosts={setPosts} />
          ))}
          dataLength={profilePosts.length}
          loader={<Asset spinner />}
          hasMore={false} // Adjust according to your pagination logic
        />
      ) : (
        <Asset
          src={NoResults}
          message={`No results found, ${profile?.owner} hasn't posted yet.`}
        />
      )}
    </>
  );

  return (
    <div className="container">
      <div className="d-flex flex-column align-items-center">
        <div className="col-lg-8">
          <div className={appStyles.MainContainer}>
            {hasLoaded && (
              <>
                {mainProfile}
                {mainProfilePosts}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
