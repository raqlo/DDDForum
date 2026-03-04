import {Layout} from "../components/layout";
import {type Post, PostsList} from "../components/postList";
import {useEffect, useState} from "react";
import {postServices} from "../services/posts";

export const MainPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postList = await postServices.getPosts();
                setPosts(postList.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <Layout showAuth={true}>
            <PostsList
                posts={posts}
            />
        </Layout>
    );
};