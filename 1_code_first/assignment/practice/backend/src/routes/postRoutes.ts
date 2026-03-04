import {Hono} from "hono";
import {PostController} from "../controllers/postController";

const postRoutes = new Hono();

postRoutes.get('/', PostController.getPosts)

export default postRoutes;