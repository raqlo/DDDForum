import express from 'express';
import {UserController} from "./controllers/userController";
import {MarketingController} from "./controllers/marketingController";
import {PostController} from "./controllers/postController";
import {ErrorExceptionHandler} from "./shared/errors/errorHandler";
import {MarketingService} from "./services/marketingService";
import {ContactListAPI} from "./services/contactListApi";
import {prisma} from "./database";
import {UserService} from "./services/userService";
import {PostService} from "./services/postService";
import {UserRepository} from "./repository/userRepo";
import {MarketingRepository} from "./repository/marketingRepository";

const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors())

// Repo
const userRepo = new UserRepository(prisma)
const marketingRepo = new MarketingRepository(prisma)

// External service instances
const contactListAPI = new ContactListAPI();

// Business service instances
const marketingService = new MarketingService(contactListAPI, marketingRepo);
const userService = new UserService(userRepo);
const postService = new PostService(prisma);

const errorHandler = new ErrorExceptionHandler();

const userController = new UserController(errorHandler, userService);
const marketingController = new MarketingController(errorHandler, marketingService);
const postController = new PostController(errorHandler, postService);


app.use('/users', userController.getRouter());

app.use('/marketing', marketingController.getRouter())

app.use('/posts', postController.getRouter());

// prisma.post.findMany({})
//   .then((posts) => console.log(posts))
//   .catch((err) => console.log(err));

export {app}