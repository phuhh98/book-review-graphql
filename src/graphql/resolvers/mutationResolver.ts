import { GraphQLError } from 'graphql';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { ImageGridFsBucket } from 'src/models';
import BookService from 'src/services/Book.Service';
import GenreBookRelService from 'src/services/GenreBookRel.Service';
import { BookData, GenreBookRelData, GenreData, MutationResolvers } from 'src/types';
import { createMongoObjectIdFromString } from 'src/utils';
import { FileUpload } from 'graphql-upload/Upload.js';
import GenreService from 'src/services/Genre.Service';

export const mutationResolver: Required<MutationResolvers> = {
  createBook: async (_, args) => {
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
  },

  addBookToGenre: async (_, args) => {
    try {
      await GenreBookRelService.addOne(args.bookId, args.genreId);
    } catch (err) {
      throw new GraphQLError((err as Error).message, {
        extensions: {
          code: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        },
      });
    }

    const genre = await GenreService.getOneById(args.genreId);

    if (genre === null)
      throw new GraphQLError(
        `Can not add book "${args.bookId}" to genre "${args.genreId}". Genre not found`,
        {
          extensions: {
            code: getReasonPhrase(StatusCodes.BAD_REQUEST),
          },
        },
      );
    return genre;
  },

  removeBookFromGenre: async (_, args) => {
    try {
      await GenreBookRelService.deleteGenreBookRel(args.bookId, args.genreId);
    } catch (err) {
      throw new GraphQLError((err as Error).message, {
        extensions: {
          code: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        },
      });
    }

    const genre = await GenreService.getOneById(args.genreId);

    if (genre === null)
      throw new GraphQLError(
        `Can not add book "${args.bookId}" to genre "${args.genreId}". Genre not found`,
        {
          extensions: {
            code: getReasonPhrase(StatusCodes.BAD_REQUEST),
          },
        },
      );
    return genre;
  },

  createGenre: async (_, args) => {
    let newGenre: GenreData | null;
    try {
      newGenre = await GenreService.addOne(args as GenreData);
      if (newGenre === null) throw new Error('Can not create genre');
    } catch (error) {
      throw new GraphQLError((error as Error).message, {
        extensions: {
          code: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        },
      });
    }
    return newGenre;
  },

  uploadBookCoverImage: async (_, { cover_image, bookId }) => {
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
  },
};
