import { Box, Card, Flex, Text, Heading } from "@radix-ui/themes";

export type Post = {
    id: string;
    title: string;
    author: string;
    date: string;
    commentCount: number;
};

export const PostsList = ({posts}: { posts: Post[] }) => {
    return (
        <Box>
            <Heading size="6" mb="4">Posts List</Heading>
            <Flex direction="column" gap="3">
                {posts.map(post => (
                    <Card key={post.id}>
                        <Flex direction="column" gap="2">
                            <Heading size="4">{post.title}</Heading>
                            <Flex gap="4" align="center">
                                <Text size="2" color="gray">
                                    By {post.author}
                                </Text>
                                <Text size="2" color="gray">
                                    {post.date}
                                </Text>
                                <Text size="2" color="gray">
                                    {post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}
                                </Text>
                            </Flex>
                        </Flex>
                    </Card>
                ))}
            </Flex>
        </Box>
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