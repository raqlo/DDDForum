import { Hono } from 'hono'
import { cors } from 'hono/cors'
import userRoutes from './routes/userRoutes'
import postRoutes from "./routes/postRoutes";

const app = new Hono()

app.use('*', cors())
app.route('/users', userRoutes)
app.route('/posts', postRoutes)

export default {
    port: process.env.PORT || 3000,
    fetch: app.fetch,
}