import gql from 'graphql-tag';

const userSchema = gql`
  type UserResponse {
    success: Boolean!
    message: String!
    result: User
  }

  type UsersResponse {
    success: Boolean!
    message: String!
    result: [User]!
  }

  type Query {
    getUserById(id: String!): UserResponse
    getUsers(limit: Int, page: Int): UsersResponse
  }

  type UserWithToken {
    _id: String!
    email: String!
    fullname: String!
    jwtoken: String!
    createdAt: String
    updatedAt: String
  }

  type UserWithTokenResponse {
    success: Boolean!
    message: String!
    result: UserWithToken
  }

  input SignupInput {
    email: String!
    password: String!
    fullname: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Mutation {
    signup(input: SignupInput!): UserWithTokenResponse
    login(input: LoginInput!): UserWithTokenResponse
  }
`;

export default userSchema;
