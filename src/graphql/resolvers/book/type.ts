import { GenreService } from '../../../services';
import { BookResolvers } from '../../../types';
import { computeImageURIFromId } from '../../../utils';

export const bookTypeResolver: BookResolvers = {
  id: (parent) => parent._id.toString(),
  title: (parent) => parent.title,
  description: (parent) => parent.description ?? null,
  rating: (parent) => parent.rating ?? null,
  publish_date: (parent) => parent.publish_date ?? null,
  publisher: (parent) => parent.publisher ?? null,
  cover_image: (parent) =>
    parent.cover_image ? computeImageURIFromId(parent.cover_image) : null,
  genres: async (parent) => {
    if (!parent.genres) {
      return [];
    }
    const genres = await Promise.all(
      parent.genres?.map(async (genre) =>
        genre === null ? null : await GenreService.getOneById(genre._id),
      ),
    );
    return genres;
  },
  created_at: (parent) => parent.createdAt,
  updated_at: (parent) => parent.updatedAt,
};
