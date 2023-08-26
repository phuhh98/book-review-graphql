import { GraphQLError } from 'graphql';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { ImageGridFsBucket } from '../../../models';
import { BookService } from '../../../services';
import { BookData, MutationResolvers } from '../../../types';
import { createMongoObjectIdFromString } from '../../../utils';
import { FileUpload } from 'graphql-upload/Upload.js';
import { ALLOW_IMAGE_EXT } from '../../../constants';
import path from 'path';

export const bookMutationResolvers: Pick<
  MutationResolvers,
  'createBook' | 'uploadBookCoverImage'
> = {
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
    } catch (error) {
      console.error(error);
    }

    // pipe readStream from request of a file to image writeStream of GridFs to write directly to mongodb
    const { createReadStream, filename } = (await cover_image) as FileUpload;

    if (!ALLOW_IMAGE_EXT.includes(path.extname(filename))) {
      console.error('fileType', path.extname(filename));
      throw new GraphQLError(
        `Only ${ALLOW_IMAGE_EXT.join(' and ')} file(s) are allowed`,
        {
          extensions: {
            code: getReasonPhrase(StatusCodes.BAD_REQUEST),
          },
        },
      );
    }

    const imageWriteStream = ImageGridFsBucket.openUploadStream(filename);
    createReadStream().pipe(imageWriteStream);

    const newCoverImageId = imageWriteStream.id;
    try {
      await BookService.updateOneById(book._id, {
        ...book,
        cover_image: newCoverImageId,
      });
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }

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
  },
};
