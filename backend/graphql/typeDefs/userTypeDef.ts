import gql from 'graphql-tag';

const userTypeDef = gql`
  type User {
    _id: String
    email: String!
    password: String!
    fullname: String!
    createdAt: String
    updatedAt: String
  }
`;

export default userTypeDef;
