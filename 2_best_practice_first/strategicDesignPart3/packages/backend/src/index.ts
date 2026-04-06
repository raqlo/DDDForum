import express, {Request, Response} from 'express';
import {prisma} from './database';
import {UserController} from "./controllers/userController";
import {Errors} from "./shared/errors";
import {MarketingController} from "./controllers/marketingController";

const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors())

const userController = new UserController();
const marketingController = new MarketingController();

app.post('/users/new', userController.createUserAccount);

app.post('/marketing/new', marketingController.addUserToMarketingList)

app.get('/users', userController.getUsers);

// Get posts
const getPostList = async (req: Request, res: Response) => {
  try {
    const { sort } = req.query;

    if (sort !== 'recent') {
      return res.status(400).json({ error: Errors.ClientError, data: undefined, success: false })
    }

    let postsWithVotes = await prisma.post.findMany({
      include: {
        votes: true, // Include associated votes for each post
        memberPostedBy: {
          include: {
            user: true
          }
        },
        comments: true
      },
      orderBy: {
        dateCreated: 'desc', // Sorts by dateCreated in descending order
      },
    });

    return res.json({ error: undefined, data: { posts: postsWithVotes }, success: true });
  } catch (error) {
    return res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
  }
};
app.get('/posts', getPostList);

// prisma.post.findMany({})
//   .then((posts) => console.log(posts))
//   .catch((err) => console.log(err));

export {app}