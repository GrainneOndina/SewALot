import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styles from "./App.module.css";
import "./api/axiosDefaults";
import NavBar from "./components/NavBar";
import Footer from "./components/Fotter";
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
import { PostsProvider } from './contexts/PostsContext';
import LandingPage from './pages/LandingPage';
import LikedPosts from './pages/posts/LikedPosts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * The App component sets up the routing for the entire application and includes global components like NavBar and Footer.
 * It defines the main layout and theming across the application and manages routes to different functionalities and pages.
 */
function App() {
  const currentUser = useCurrentUser();

  return (
    <Router>
       <div className={`${styles.appContainer} ${styles.App}`}>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
          <NavBar />
          <div className={`${styles.content} ${styles.Main}`}>
            <PostsProvider>
              <Switch>
                <Route exact path="/" component={PostsPage} />
                <Route exact path="/feed" component={PostsPage} />
                <Route exact path="/liked" component={LikedPosts} />
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
          </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
