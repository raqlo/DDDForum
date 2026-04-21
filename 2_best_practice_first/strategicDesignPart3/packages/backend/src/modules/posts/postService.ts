import {PostPersistence, PostRepository} from "./postRepository";

export class PostService {

    constructor(private postRepository: PostPersistence) {
    }

    getPostsWithVotes = async () => this.postRepository.findMany();
}