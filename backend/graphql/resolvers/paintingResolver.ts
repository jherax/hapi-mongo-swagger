import Painting from '../../models/Painting';
import trimObjectProps from '../../utils/trimObjectProps';

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
        // .sort({ createdAt: -1 })
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
      const {name, author, year, url} = paintingInput as IPainting;
      const painting = new Painting(trimObjectProps({name, author, year, url}));
      const response = createSuccessResponse('New Painting added');
      response.result = await painting.save();
      if (!response.result) {
        response.success = false;
        response.message = 'Unable to add painting';
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
        response.message = `Painting with id ${id} does not exist`;
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
        response.message = `Painting with id ${id} does not exist`;
      } else {
        const {name, author, year, url} = paintingInput as Partial<IPainting>;
        const edited = trimObjectProps({
          name: name ?? painting.name,
          author: author ?? painting.author,
          year: year ?? painting.year,
          url: url ?? painting.url,
        });
        const result = await Painting.updateOne({_id: id}, edited);
        if (result.acknowledged) {
          edited['_id'] = id;
          response.result = edited;
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
