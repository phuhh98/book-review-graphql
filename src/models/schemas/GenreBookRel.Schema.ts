import { Schema } from 'mongoose';
import { MODEL_ALIAS } from 'src/constants';
import { GenreBookRel } from 'src/types/constant';

const GenreBookRelSchema = new Schema<GenreBookRel>(
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
    toJSON: {
      transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

GenreBookRelSchema.index({ bookId: 1, genreId: 1 }, { unique: true });

export { GenreBookRelSchema };
