import {apiHandler} from "./apiHandler";
import type {Post} from "../components/postList";

const postServices = {
    getPosts: () => apiHandler<Post[], string>('/posts')
}

export { postServices}