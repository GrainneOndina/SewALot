import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosReq } from '../api/axiosDefaults';

/**
 * Context for managing posts.
 */
export const PostsContext = createContext();

/**
 * Provider component that supplies post-related functionalities to its children.
 */
export const PostsProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [nextPage, setNextPage] = useState('/posts/');

    useEffect(() => {
        /**
         * Fetches posts from the server and updates the context state.
         */
        const fetchPosts = async () => {
            if (!nextPage) return;
            try {
                const { data } = await axiosReq.get(nextPage);
                setPosts(prev => [...prev, ...data.results]);
                setHasMore(data.next != null);
                setNextPage(data.next);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };
        fetchPosts();
    }, [nextPage]);

    /**
     * Loads more posts if there are more to load.
     */
    const loadMorePosts = () => {
        if (nextPage) {
            setNextPage(nextPage);
        }
    };

    /**
     * Updates a post within the posts state.
     * @param {Object} updatedPost - The updated post to be merged into the posts state.
     */
    const updatePost = updatedPost => {
        setPosts(prevPosts => prevPosts.map(post => post.id === updatedPost.id ? updatedPost : post));
    };

    /**
     * Removes a post from the posts state.
     * @param {number} id - The ID of the post to remove.
     */
    const removePost = (id) => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
    };
      
    return (
        <PostsContext.Provider value={{ 
            posts, 
            setPosts, 
            hasMore, 
            loadMorePosts, 
            updatePost,
            removePost
        }}>
            {children}
        </PostsContext.Provider>
    );
};

/**
 * Custom hook to use the PostsContext.
 */
export const usePosts = () => useContext(PostsContext);
