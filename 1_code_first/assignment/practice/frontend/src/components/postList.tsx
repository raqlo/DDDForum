interface User {
    id: number;
    email: string;
    name: string | null;
    lastName: string | null;
    username: string;
    password: string;
}

interface Member {
    id: number;
    userId: number;
    user: User;
}

interface Vote {
    id: number;
    postId: number;
    memberId: number;
    voteType: string; // 'Upvote' or 'Downvote'
}

interface Comment {
    id: number;
    postId: number;
    text: string;
    memberId: number;
    parentCommentId: number | null;
}

export interface Post {
    id: number;
    memberId: number;
    postType: string;
    title: string;
    content: string;
    dateCreated: string; // ISO date string
    votes: Vote[];
    memberPostedBy: Member;
    comments: Comment[];
}

export const PostsList = ({posts}: { posts: Post[] }) => {
    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-4 mt-6">Posts List</h2>
            <div className="flex flex-col gap-3">
                {posts.map(post => (
                    <div key={post.id} className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <div className={"flex gap-2 items-center"}>
                                <div className="badge badge-primary">{post.votes.length}</div>
                                <h3 className="card-title">{post.title}</h3>
                            </div>
                            <div className="flex gap-4 items-center text-sm text-gray-500">
                                <span>By {post.memberPostedBy.user.username}</span>
                                <span>{post.dateCreated}</span>
                                <span>{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}