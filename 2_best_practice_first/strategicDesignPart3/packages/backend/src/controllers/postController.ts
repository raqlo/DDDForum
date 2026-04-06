// Get posts
import {Request, Response} from "express";
import {Errors} from "../shared/errors/constants";
import {prisma} from "../database";

export class PostController {
    async getPosts(req: Request, res: Response) {
        try {
            const {sort} = req.query;

            if (sort !== 'recent') {
                return res.status(400).json({error: Errors.ClientError, data: undefined, success: false})
            }

            let postsWithVotes = await prisma.post.findMany({
                include: {
                    votes: true, // Include associated votes for each post
                    memberPostedBy: {
                        include: {
                            user: true
                        }
                    },
                    comments: true
                },
                orderBy: {
                    dateCreated: 'desc', // Sorts by dateCreated in descending order
                },
            });

            return res.json({error: undefined, data: {posts: postsWithVotes}, success: true});
        } catch (error) {
            return res.status(500).json({error: Errors.ServerError, data: undefined, success: false});
        }
    }
}