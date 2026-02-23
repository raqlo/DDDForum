import {Layout} from "../components/layout";
import {mockPosts, PostsList} from "../components/postList";

export const MainPage = () => {
    return (
        <Layout>
            <PostsList
                posts={mockPosts}
            />
        </Layout>
    );
};