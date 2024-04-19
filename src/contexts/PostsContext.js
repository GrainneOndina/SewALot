import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosReq } from '../api/axiosDefaults';

export const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [nextPage, setNextPage] = useState('/posts/');

    useEffect(() => {
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

    const loadMorePosts = () => {
        if (nextPage) {
            setNextPage(nextPage);
        }
    };

    const updatePost = updatedPost => {
        setPosts(prevPosts => prevPosts.map(post => post.id === updatedPost.id ? updatedPost : post));
    };

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

export const usePosts = () => useContext(PostsContext);
