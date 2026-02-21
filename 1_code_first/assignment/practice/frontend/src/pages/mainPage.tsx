import { Layout } from "../components/layout";
import {type Post, PostsList} from "../components/postList";

export const MainPage = () => {
    const posts: Post[] = [{title: 'Post 1'}, {title: 'Post 2'}];

    return (
        <Layout>
            <PostsList
                posts={posts}
            />
        </Layout>
    );
};