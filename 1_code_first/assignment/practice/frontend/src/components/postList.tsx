export type Post = {
    id: string;
    title: string;
    author: string;
    date: string;
    commentCount: number;
};

export const PostsList = ({posts}: { posts: Post[] }) => {
    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-4 mt-6">Posts List</h2>
            <div className="flex flex-col gap-3">
                {posts.map(post => (
                    <div key={post.id} className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <h3 className="card-title">{post.title}</h3>
                            <div className="flex gap-4 items-center text-sm text-gray-500">
                                <span>By {post.author}</span>
                                <span>{post.date}</span>
                                <span>{post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Mock data with 5 posts
export const mockPosts: Post[] = [
    {
        id: "1",
        title: "Introduction to Domain-Driven Design",
        author: "Eric Evans",
        date: "2024-01-15",
        commentCount: 12
    },
    {
        id: "2",
        title: "Understanding Bounded Contexts",
        author: "Vaughn Vernon",
        date: "2024-01-18",
        commentCount: 8
    },
    {
        id: "3",
        title: "Implementing Aggregates in TypeScript",
        author: "Martin Fowler",
        date: "2024-01-20",
        commentCount: 15
    },
    {
        id: "4",
        title: "Event Sourcing Best Practices",
        author: "Greg Young",
        date: "2024-01-22",
        commentCount: 23
    },
    {
        id: "5",
        title: "CQRS Pattern Explained",
        author: "Udi Dahan",
        date: "2024-01-25",
        commentCount: 19
    }
];