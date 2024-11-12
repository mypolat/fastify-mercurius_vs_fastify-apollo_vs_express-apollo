// Types
export interface User {
    id: string
    name: string
    email: string
}

export interface Post {
    id: string
    title: string
    content: string
    authorId: string
}

// Schema
export const schema = `
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    createPost(userId: ID!, title: String!, content: String!): Post!
  }
`

// Test Data
export const users: User[] = new Array(1000).fill(0).map((_, i) => ({
    id: `user-${i}`,
    name: `User ${i}`,
    email: `user${i}@example.com`
}))

export const posts: Post[] = new Array(5000).fill(0).map((_, i) => ({
    id: `post-${i}`,
    title: `Post ${i}`,
    content: `Content ${i}`,
    authorId: `user-${Math.floor(Math.random() * 1000)}`
}))

// Resolvers
export const resolvers = {
    Query: {
        users: () => users,
        user: (_, { id }) => users.find(u => u.id === id),
        posts: () => posts,
        post: (_, { id }) => posts.find(p => p.id === id)
    },
    User: {
        posts: (user) => posts.filter(p => p.authorId === user.id)
    },
    Post: {
        author: (post) => users.find(u => u.id === post.authorId)
    },
    Mutation: {
        createUser: (_, { name, email }) => {
            const user = { id: `user-${users.length + 1}`, name, email }
            users.push(user)
            return user
        },
        createPost: (_, { userId, title, content }) => {
            const post = {
                id: `post-${posts.length + 1}`,
                title,
                content,
                authorId: userId
            }
            posts.push(post)
            return post
        }
    }
}
