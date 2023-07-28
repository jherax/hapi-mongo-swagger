import mongoose from 'mongoose';

/**
 * @see https://mongoosejs.com/docs/typescript/statics-and-methods.html
 */
const PaintingSchema = new mongoose.Schema<IPainting, PaintingModel>(
  {
    name: String,
    url: String,
    techniques: [String],
  },
  {
    timestamps: true,
  },
);

const Painting = mongoose.model('Painting', PaintingSchema);

export default Painting;
