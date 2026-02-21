export type Post = {
    title: string;
};

export const PostsList = ({posts}: { posts: Post[] }) => {
    return (
        <div>
            <h2>Posts</h2>
            {posts.map(post => <div>{post.title}</div>)}
        </div>
    )
}