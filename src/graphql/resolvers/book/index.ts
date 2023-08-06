import { GraphQLError } from 'graphql';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { BookData, GenreBookRelData } from 'src/types/models';
import BookService from 'src/services/Book.Service';
import GenreService from 'src/services/Genre.Service';
import { BookResolvers, MutationResolvers, QueryResolvers } from 'src/types';
import GenreBookRelService from 'src/services/GenreBookRel.Service';
import { ImageGridFsBucket } from 'src/models';
import { computeImageURIFromId, createMongoObjectIdFromString } from 'src/utils';

import { FileUpload } from 'graphql-upload/Upload.js';

// Book type field resovlers
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

// Queries
export const booksByTitleResolver: QueryResolvers['booksByTitle'] = async (_, args) => {
  const book = await BookService.getBooksWithTitle(args.title as string);

  if (book.length === 0) {
    throw new GraphQLError(`Book includes title "${args.title}" not found`, {
      extensions: {
        code: getReasonPhrase(StatusCodes.NOT_FOUND),
      },
    });
  }

  return book;
};

export const bookByIdResolver: QueryResolvers['bookById'] = async (_, args) => {
  const book = await BookService.getOneById(args.id);

  if (book === null)
    throw new GraphQLError(`Book with id "${args.id}" does not exist`, {
      extensions: {
        code: getReasonPhrase(StatusCodes.NOT_FOUND),
      },
    });

  return book;
};

// Mutations
export const createBookResolver: MutationResolvers['createBook'] = async (_, args) => {
  let newBook: BookData | null;
  try {
    newBook = await BookService.addOne(args as BookData);
    if (newBook === null) throw new Error('Can not create book');
  } catch (error) {
    throw new GraphQLError((error as Error).message, {
      extensions: {
        code: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      },
    });
  }
  return newBook;
};

export const addGenreToBookResolver: MutationResolvers['addGenreToBook'] = async (
  _,
  args,
) => {
  let newGBL: GenreBookRelData;
  try {
    newGBL = await GenreBookRelService.addOne(args.bookId, args.genreId);
  } catch (err) {
    throw new GraphQLError((err as Error).message, {
      extensions: {
        code: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      },
    });
  }

  const book = await BookService.getOneById(args.bookId);

  if (book === null)
    throw new GraphQLError(
      `Can not add genre "${args.genreId}" to book "${args.bookId}". Book not found`,
      {
        extensions: {
          code: getReasonPhrase(StatusCodes.BAD_REQUEST),
        },
      },
    );

  return book;
};

export const uploadImageResolver: MutationResolvers['uploadBookCoverImage'] = async (
  _,
  { cover_image, bookId },
) => {
  const book = await BookService.getOneById(bookId);
  if (book == null) {
    throw new GraphQLError(
      `File upload failed. Book with id "${bookId}" does not exist`,
      {
        extensions: {
          code: getReasonPhrase(StatusCodes.BAD_REQUEST),
        },
      },
    );
  }

  try {
    if (book.cover_image) {
      await ImageGridFsBucket.delete(
        createMongoObjectIdFromString(book.cover_image.toString()),
      );
    }

    // pipe readStream from request of a file to image writeStream of GridFs to write directly to mongodb
    const { createReadStream, filename } = (await cover_image) as FileUpload;
    const imageWriteStream = ImageGridFsBucket.openUploadStream(filename);
    createReadStream().pipe(imageWriteStream);

    const newCoverImageId = imageWriteStream.id;

    await BookService.updateOneById(book._id, {
      ...book,
      cover_image: newCoverImageId,
    });

    imageWriteStream.on('error', (err) => {
      throw new GraphQLError(`Error while uploading image. \n${err.message}`, {
        extensions: {
          code: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        },
      });
    });

    return {
      success: true,
      message: 'File add to book cover',
      book: { ...book, cover_image: newCoverImageId },
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
