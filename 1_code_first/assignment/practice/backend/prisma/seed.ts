import { prisma } from "./prisma-client";

const initialUsers = [
    { email: "bobvance@gmail.com", name: "Bob", lastName: "Vance", username: "bobvance", password: '12345678' },
    { email: "tonysoprano@gmail.com", name: "Tony", lastName: "Soprano", username: "tonysoprano", password: '12345678' },
    { email: "billburr@gmail.com", name: "Bill", lastName: "Burr", username: "billburr", password: '12345678' },
];

async function seed() {
    // Create users + members, capture real IDs
    const members: { index: number, memberId: number }[] = [];

    for (const [i, user] of initialUsers.entries()) {
        const newUser = await prisma.user.create({ data: user });
        const newMember = await prisma.member.create({
            data: { user: { connect: { id: newUser.id } } },
        });
        members.push({ index: i + 1, memberId: newMember.id });
    }

    const getMemberId = (index: number) => members.find(m => m.index === index)!.memberId;

    // Posts — replace memberId: 1 with the real member ID at that index
    const posts = [
        { title: 'First post!', content: "This is bob vances first post", postType: "Text", dateCreated: new Date(), memberId: getMemberId(1) },
        { title: 'Second post!', content: "This is bobs second post", postType: "Text", dateCreated: new Date(), memberId: getMemberId(1) },
        { title: 'another post', content: "This is tonys first post", postType: "Text", dateCreated: new Date(), memberId: getMemberId(2) },
        { title: 'Links', content: "This is a link post", postType: "https://khalilstemmler.com", dateCreated: new Date(), memberId: getMemberId(2) },
    ];

    const createdPosts: { index: number, postId: number }[] = [];

    for (const [i, post] of posts.entries()) {
        const newPost = await prisma.post.create({ data: post });
        createdPosts.push({ index: i + 1, postId: newPost.id });
    }

    const getPostId = (index: number) => createdPosts.find(p => p.index === index)!.postId;

    // Votes
    const votes = [
        { postId: getPostId(1), voteType: 'Upvote', memberId: getMemberId(1) },
        { postId: getPostId(2), voteType: 'Upvote', memberId: getMemberId(1) },
        { postId: getPostId(3), voteType: 'Upvote', memberId: getMemberId(2) },
        { postId: getPostId(4), voteType: 'Upvote', memberId: getMemberId(2) },
        { postId: getPostId(3), voteType: 'Upvote', memberId: getMemberId(1) },
        { postId: getPostId(2), voteType: 'Downvote', memberId: getMemberId(3) },
    ];

    for (const vote of votes) {
        await prisma.vote.create({ data: vote });
    }

    // Comments
    const comments = [
        { text: 'I posted this!', memberId: getMemberId(1), postId: getPostId(1), parentCommentId: null },
        { text: 'Nice', memberId: getMemberId(2), postId: getPostId(2), parentCommentId: null },
    ];

    for (const comment of comments) {
        await prisma.comment.create({ data: comment });
    }

    console.log('Seed complete');
}

seed();