import express from 'express';
import {UserController} from "./controllers/userController";
import {MarketingController} from "./controllers/marketingController";
import {PostController} from "./controllers/postController";

const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors())

const userController = new UserController();
const marketingController = new MarketingController();
const postController = new PostController()

app.post('/users/new', userController.createUserAccount);

app.post('/marketing/new', marketingController.addUserToMarketingList)

app.get('/users', userController.getUsers);

app.get('/posts', postController.getPosts);

// prisma.post.findMany({})
//   .then((posts) => console.log(posts))
//   .catch((err) => console.log(err));

export {app}