import {PostPersistence, PostRepository} from "../repository/postRepository";

export class PostService {

    constructor(private postRepository: PostPersistence) {
    }

    getPostsWithVotes = async () => this.postRepository.findMany();
}