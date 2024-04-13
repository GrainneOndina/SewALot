import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";
import Comment from "../comments/Comment";
import appStyles from "../../App.module.css";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postResponse = await axiosReq.get(`/posts/${id}`);
        setPost(postResponse.data);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };

    fetchPost();
  }, [id]);

  return (
    <div className="container">
      <div className={appStyles.Content}>
        <Row className="justify-content-center">
          <Col lg={8}>
            {post && <Post {...post} />}
            <hr />
            <h3>Comments</h3>
            <Comment postId={id} />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default PostPage;
