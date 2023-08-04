import { Application, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getApolloMiddleware } from './graphql';
import mongoose from 'mongoose';
import { BookModel, GenreModel, GenreBookRelModel } from 'src/models';
import { bookRouter } from './book/router';

export async function applyRoutes(app: Application) {
  const apolloMidleware = await getApolloMiddleware(app);

  app.use('/book', bookRouter);
  app.use('/graphql', apolloMidleware);

  app.use('/', indexPageHanlder);

  app.all('*', (_, res) => {
    res.status(StatusCodes.NOT_FOUND).send('This route does not exist');
  });
}

//eslint-disable-next-line
const indexPageHanlder: RequestHandler = async (_, res) => {
  try {
    const session = await BookModel.startSession();
    const book = await BookModel.aggregate(
      [
        {
          $match: {
            _id: new mongoose.Types.ObjectId('64cd2de2cb11cbb152b66ebf'),
            // _id: {
            //   $eq: {
            //     $toObjectId: '64cd2de2cb11cbb152b66ebf',
            //   },
            // },

            // title: {
            //   $in: [new RegExp(`${'gone with the wind'}`, 'i')],
            // },
          },
        },
        {
          $lookup: {
            from: GenreBookRelModel.collection.name,
            let: { idFromFoundBook: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$$idFromFoundBook', '$bookId'] },
                },
              },
              {
                $lookup: {
                  from: GenreModel.collection.name,
                  let: { genreIdFromGBL: '$genreId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$genreIdFromGBL'] },
                      },
                    },
                    {
                      $project: {
                        _id: 1,
                        name: 1,
                      },
                    },
                  ],
                  as: 'genreNodeFromGenre',
                },
              },
              { $unwind: '$genreNodeFromGenre' },
              {
                $replaceRoot: {
                  newRoot: '$genreNodeFromGenre',
                },
              },
            ],
            as: 'genres',
          },
        },
        {
          $project: {
            _id: 1,
            __v: 0,
          },
        },
      ],
      { session: session },
    );

    res.status(StatusCodes.OK).send(book);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(err);
  }
};
