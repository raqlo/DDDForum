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
const userController = new UserController();
const marketingController = new MarketingController(errorHandler);
const postController = new PostController(errorHandler)

app.post('/users/new', userController.createUserAccount);

app.use('/marketing/new', marketingController.getRouter())

app.get('/users', userController.getUsers);

app.use('/posts', postController.getRouter());

// prisma.post.findMany({})
//   .then((posts) => console.log(posts))
//   .catch((err) => console.log(err));

export {app}