import express, {Request, Response} from 'express';
import {prisma} from './database';
import {UserController} from "./controllers/userController";
import {isMissingKeys} from "./shared/utils";
import {Errors} from "./shared/errors";

const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors())

const userController = new UserController();

app.post('/users/new', userController.createUserAccount);

async function marketingController (req: Request, res: Response) {
  const keyIsMissing = isMissingKeys(req.body,
      ['userId', 'consent']
  );

  if (keyIsMissing) {
    return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false })
  }

  const { userId, consent } = req.body;

  // Find the user by email
  const user = await prisma.user.findFirst({where: {id: userId}});

  if (!user) {
    return res.status(404).json({ error: Errors.UserNotFound, data: undefined, success: false })
  }

  // Create marketing record with userId, not email
  const marketing = await prisma.marketing.create({
    data: {
      userId: userId,  // ✅ Use userId instead of email
      consent: consent
    }
  })
  return res.status(201).json({ error: undefined, data: marketing, success: true });
}

app.post('/marketing/new', marketingController)

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