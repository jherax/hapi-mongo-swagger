import gql from 'graphql-tag';

const paintingTypeDef = gql`
  type Painting {
    _id: String
    name: String
    url: String
    techniques: [String]
    createdAt: String
    updatedAt: String
  }
`;

export default paintingTypeDef;
