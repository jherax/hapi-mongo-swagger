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

  input CreatePaintingInput {
    name: String!
    author: String!
    year: String!
    url: String
  }

  input EditPaintingInput {
    name: String
    author: String
    year: String
    url: String
  }

  type Mutation {
    createPainting(paintingInput: CreatePaintingInput!): PaintingResponse
    deletePainting(id: String!): PaintingResponse
    editPainting(
      id: String!
      paintingInput: EditPaintingInput!
    ): PaintingResponse
  }
`;

export default paintingSchema;
