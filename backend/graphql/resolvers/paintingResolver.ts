import Painting from '../../models/Painting';

export type PaintingResponse = {
  success: boolean;
  message: string;
  result?: IPainting | IPainting[];
};

const paintingResolver = {
  Query: {
    getPaintingById: async (
      parent,
      {id},
      contextShared,
    ): Promise<PaintingResponse> => {
      const response = createSuccessResponse('Painting found');
      const painting = await Painting.findById(id);
      if (!painting) {
        response.success = false;
        response.message = 'Painting not found';
      }
      response.result = painting;
      return response;
    },

    getPaintings: async (
      parent,
      {limit, page},
      contextValue,
    ): Promise<PaintingResponse> => {
      page = +(page || 1);
      limit = +(limit || 10);
      const startIndex = (page - 1) * limit;

      const allPaintings = await Painting.find()
        .skip(startIndex)
        .limit(limit)
        .lean() // tells Mongoose to skip hydrating the result documents.
        .exec(); // execute the query.

      const total = allPaintings?.length || 0;
      const response = createSuccessResponse(`Listing ${total} Paintings`);
      response.result = allPaintings ?? [];
      return response;
    },
  },

  Mutation: {
    createPainting: async (
      parent,
      {paintingInput},
      contextShared,
    ): Promise<PaintingResponse> => {
      const {name, url, techniques} = paintingInput as IPainting;
      const painting = new Painting({name, url, techniques});
      const response = createSuccessResponse(`New Painting added`);
      response.result = await painting.save();
      if (!response.result) {
        response.success = false;
        response.message = 'Painting was not added';
      }
      return response;
    },

    deletePainting: async (
      parent,
      {id},
      contextShared,
    ): Promise<PaintingResponse> => {
      const response = createSuccessResponse('Painting deleted');
      const painting = await Painting.findById(id);
      if (!painting) {
        response.success = false;
        response.message = `Painting with id ${id} does not exists.`;
      } else {
        const deleted = (await Painting.deleteOne({_id: id})).deletedCount;
        if (deleted > 1) {
          response.message = `Deleted ${deleted} Paintings`;
        }
      }
      return response;
    },

    editPainting: async (
      parent,
      {id, paintingInput},
      contextShared,
    ): Promise<PaintingResponse> => {
      const response = createSuccessResponse('Painting edited');
      const painting = await Painting.findById(id);
      if (!painting) {
        response.success = false;
        response.message = `Painting with id ${id} does not exists.`;
      } else {
        const {name, url, techniques} = paintingInput;
        const result = await Painting.updateOne(
          {_id: id},
          {name, url, techniques},
        );
        if (result.acknowledged) {
          response.result = {...painting, ...paintingInput};
        }
        if (result.modifiedCount > 1) {
          response.message = `Edited ${result.modifiedCount} Paintings`;
        }
      }
      return response;
    },
  },
};

function createSuccessResponse(message: string): PaintingResponse {
  return {success: true, message, result: null};
}

export default paintingResolver;
