import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Row, Col, Image, Container } from "react-bootstrap";
import Asset from "../../components/Asset";
import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq } from "../../api/axiosDefaults";
import { useProfileData, useSetProfileData } from "../../contexts/ProfileDataContext";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../posts/Post";
import NoResults from "../../assets/no-results.png";
import { ProfileEditDropdown } from "../../components/MoreDropdown";
import { usePosts } from "../../contexts/PostsContext";
import { toast } from 'react-toastify';

/**
 * Component for displaying a user profile page.
 */
function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const { posts, setPosts } = usePosts(); // Use global posts state
  const currentUser = useCurrentUser();
  const { id } = useParams();
  const history = useHistory();
  const { setProfileData } = useSetProfileData();
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
      {/* Dropdown Menu*/}
      <Row className="justify-content-end">
        <Col md={1} xs={1} className="text-right">
          {/* Profile Edit Dropdown */}
          {profile?.is_owner && (
            <ProfileEditDropdown
              id={profile?.id}
              handleEdit={() => history.push(`/profiles/${id}/edit`)}
              aria-label="Edit profile options"
            />
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
              alt={`Profile image of ${profile?.owner}`}
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
          hasMore={false}
          aria-label={`${profile?.owner}'s posts`}
        />
      ) : (
        <Asset
          src={NoResults}
          message={`No results found, ${profile?.owner} hasn't posted yet.`}
          alt="No results found"
        />
      )}
    </>
  );

  return (
    <Container>
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
    </Container>
  );
}

export default ProfilePage;
