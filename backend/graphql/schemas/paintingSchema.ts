import gql from 'graphql-tag';

const paintingSchema = gql`
  type PaintingResponse {
    success: Boolean!
    message: String!
    result: Painting
  }

  type PaintingsResponse {
    success: Boolean!
    message: String!
    result: [Painting]!
  }

  type Query {
    getPaintingById(id: String!): PaintingResponse
    getPaintings(limit: Int, page: Int): PaintingsResponse
  }

  input PaintingInput {
    name: String!
    url: String!
    techniques: [String!]!
  }

  type Mutation {
    createPainting(paintingInput: PaintingInput!): PaintingResponse
    deletePainting(id: String!): PaintingResponse
    editPainting(id: String!, paintingInput: PaintingInput!): PaintingResponse
  }
`;

export default paintingSchema;
