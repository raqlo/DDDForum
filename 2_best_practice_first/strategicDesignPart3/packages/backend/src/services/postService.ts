import {PostRepository} from "../repository/postRepository";

export class PostService {

    constructor(private postRepository: PostRepository) {
    }

    getPostsWithVotes = async () => this.postRepository.findMany();
}