import { Hono } from 'hono'
import { UserController } from '../controllers/userController'

const userRoutes = new Hono();


userRoutes.post('/new', UserController.createUser)
userRoutes.post('/edit/:userId', UserController.editUser)
userRoutes.get('/', UserController.getUser)

export default userRoutes