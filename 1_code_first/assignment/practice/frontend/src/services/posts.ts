import {apiHandler} from "./apiHandler";

const postServices = {
    getPosts: () => apiHandler('/posts')
}

export { postServices}