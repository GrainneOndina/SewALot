import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Container from "react-bootstrap/Container";
import styles from "./App.module.css";
import "./api/axiosDefaults";
import NavBar from "./components/NavBar";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import PostPage from "./pages/posts/PostPage";
import PostsPage from "./pages/posts/PostsPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import PostEditForm from "./pages/posts/PostEditForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import NotFound from "./components/NotFound";
import { PostsProvider } from './contexts/PostsContext'; // Correct import of PostsProvider
import LandingPage from './pages/LandingPage';

function App() {
  const currentUser = useCurrentUser();

  return (
    <Router>
      <div className={styles.App}>
        <NavBar />
        <Container className={styles.Main}>
          <PostsProvider>
            <Switch>
              <Route exact path="/" component={PostsPage} />
              <Route exact path="/feed" component={PostsPage} />
              <Route exact path="/liked" component={PostsPage} />
              <Route exact path="/landing" component={LandingPage} />
              <Route exact path="/signin" component={SignInForm} />
              <Route exact path="/signup" component={SignUpForm} />
              <Route exact path="/posts/:id" component={PostPage} />
              <Route exact path="/posts/:id/edit" component={PostEditForm} />
              <Route exact path="/profiles/:id" component={ProfilePage} />
              <Route exact path="/profiles/:id/edit/username" component={UsernameForm} />
              <Route exact path="/profiles/:id/edit/password" component={UserPasswordForm} />
              <Route exact path="/profiles/:id/edit" component={ProfileEditForm} />
              <Route component={NotFound} />
            </Switch>
          </PostsProvider>
        </Container>
      </div>
    </Router>
  );
}

export default App;
