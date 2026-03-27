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
    const calculateVotes = (votes: Vote[]) => {
        const upvotes = votes.filter(v => v.voteType === 'Upvote').length;
        const downvotes = votes.filter(v => v.voteType === 'Downvote').length;
        return { upvotes, downvotes, total: upvotes - downvotes };
    };

    const handleUpvote = (postId: number) => {
        console.log('Upvote post:', postId);
        // TODO: Implement upvote API call
    };

    const handleDownvote = (postId: number) => {
        console.log('Downvote post:', postId);
        // TODO: Implement downvote API call
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-4 mt-6">Posts List</h2>
            <div className="flex flex-col gap-3">
                {posts.map(post => {
                    const voteStats = calculateVotes(post.votes);
                    return (
                        <div key={post.id} className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <div className="flex gap-3 items-start">
                                    <div className="flex flex-col items-center gap-1">
                                        <button
                                            className="btn btn-ghost btn-xs"
                                            onClick={() => handleUpvote(post.id)}
                                            aria-label="Upvote"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <span className="font-bold text-lg">{voteStats.total}</span>
                                        <button
                                            className="btn btn-ghost btn-xs"
                                            onClick={() => handleDownvote(post.id)}
                                            aria-label="Downvote"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="card-title">{post.title}</h3>
                                        <div className="flex gap-4 items-center text-sm text-gray-500 mt-2">
                                            <span>By {post.memberPostedBy.user.username}</span>
                                            <span>{post.dateCreated}</span>
                                            <span>{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}