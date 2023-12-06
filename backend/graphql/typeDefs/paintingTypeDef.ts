import gql from 'graphql-tag';

const paintingTypeDef = gql`
  type Painting {
    _id: String
    name: String!
    author: String!
    year: String!
    url: String
    createdAt: String
    updatedAt: String
  }
`;

export default paintingTypeDef;
