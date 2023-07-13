import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Asset from "../../components/Asset";
import Image from "react-bootstrap/Image";
import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";
import { Button } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../posts/Post";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no-results.png";
import { ProfileEditDropdown } from "../../components/MoreDropdown";

function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profilePosts, setProfilePosts] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const { id } = useParams();
  const history = useHistory();

  const { setProfileData, handleFollow, handleUnfollow } = useSetProfileData();
  const { pageProfile } = useProfileData();

  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageProfile }, { data: profilePosts }] =
          await Promise.all([
            axiosReq.get(`/profiles/${id}/`),
            axiosReq.get(`/posts/?owner__profile=${id}`),
          ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setProfilePosts(profilePosts);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id, setProfileData]);

  const mainProfile = (
    <>
      {profile?.is_owner && (
        <ProfileEditDropdown
          id={profile?.id}
          className="dropdown-menu-right"
          handleEdit={() => history.push(`/profiles/${id}/edit`)}
        />
      )}

      <Row className="px-3 text-center">
        <Col>
          <Container className="d-flex align-items-center justify-content-center">
            <Image
              className={styles.ProfileImage}
              roundedCircle
              src={profile?.image}
              style={{ width: "150px" }}
            />
          </Container>
        </Col>
        <Col>
          <h3 className="m-2">{currentUser?.username}</h3>
          {profile?.content && <Col className="p-3">{profile.content}</Col>}
        </Col>
        {currentUser && !is_owner && (
          <Col>
            {profile?.following_id ? (
              <Button
                className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                onClick={() => handleUnfollow(profile)}
              >
                unfollow
              </Button>
            ) : (
              <Button
                className={`${btnStyles.Button} ${btnStyles.Black}`}
                onClick={() => handleFollow(profile)}
              >
                follow
              </Button>
            )}
          </Col>
        )}
      </Row>
    </>
  );

  const mainProfilePosts = (
    <>
      <hr />
      <p className="text-center">{currentUser?.username}'s posts</p>
      <hr />
      {profilePosts.results.length ? (
        <InfiniteScroll
          children={profilePosts.results
            .filter((post) => post.owner === profile?.owner) // Filter posts by owner
            .map((post) => (
              <Post key={post.id} {...post} setPosts={setProfilePosts} />
            ))}
          dataLength={profilePosts.results.length}
          loader={<Asset spinner />}
          hasMore={!!profilePosts.next}
          next={() => fetchMoreData(profilePosts, setProfilePosts)}
        />
      ) : (
        <Asset
          src={NoResults}
          message={`No results found, ${currentUser?.username} hasn't posted yet.`}
        />
      )}
    </>
  );

  return (
    <Container fluid className={appStyles.MainContainer}>
      {hasLoaded && (
        <>
          {mainProfile}
          {mainProfilePosts}
        </>
      )}
    </Container>
  );
}

export default ProfilePage;
