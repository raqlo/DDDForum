
// api.tsx
import axios from 'axios'

export const api = {
  posts: {
    getPosts: () => {
      return axios.get('http://localhost:3000/posts?sort=recent')
    }
  },
  register: (input: any) => {
    return axios.post('http://localhost:3000/users/new', {
      ...input
    })
  }
}

