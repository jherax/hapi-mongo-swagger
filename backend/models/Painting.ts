import mongoose from 'mongoose';

/**
 * @see https://mongoosejs.com/docs/typescript/statics-and-methods.html
 */
const paintingSchema = new mongoose.Schema<IPainting, PaintingModel>(
  {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    url: String,
  },
  {
    timestamps: true,
  },
);

const Painting = mongoose.model('Painting', paintingSchema);

export default Painting;
