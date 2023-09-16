import { Schema } from 'mongoose';
import { MODEL_ALIAS } from '../../constants';
import { GenreBookRelData } from '../../types';

const GenreBookRelSchema = new Schema<GenreBookRelData>(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_ALIAS.Book,
      required: true,
    },
    genreId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_ALIAS.Genre,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

GenreBookRelSchema.index({ bookId: 1, genreId: 1 }, { unique: true });

export { GenreBookRelSchema };
