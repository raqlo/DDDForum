import express from 'express';
import {UserController} from "./controllers/userController";
import {MarketingController} from "./controllers/marketingController";
import {PostController} from "./controllers/postController";
import {ErrorExceptionHandler} from "./shared/errors/errorHandler";

const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors())

const errorHandler = new ErrorExceptionHandler();
const userController = new UserController(errorHandler);
const marketingController = new MarketingController(errorHandler);
const postController = new PostController(errorHandler)

app.use('/users', userController.getRouter());

app.use('/marketing', marketingController.getRouter())

app.use('/posts', postController.getRouter());

// prisma.post.findMany({})
//   .then((posts) => console.log(posts))
//   .catch((err) => console.log(err));

export {app}