import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import {
  BookData,
  GenreData,
  AuthorDataAfterPopulated,
  UserDataAfterPopulated,
} from './data';
import { GraphqlContext } from './context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** Date in ISO */
  Date: { input: any; output: any };
  /** URI for assets */
  URI: { input: any; output: any };
  /** Upload represents file data in multipart/form-data */
  Upload: { input: any; output: any };
};

/** Book data representation */
export type Book = {
  __typename?: 'Book';
  cover_image?: Maybe<Scalars['URI']['output']>;
  created_at: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  genres?: Maybe<Array<Maybe<Genre>>>;
  id: Scalars['ID']['output'];
  publish_date?: Maybe<Scalars['Date']['output']>;
  publisher?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Scalars['Float']['output']>;
  title: Scalars['String']['output'];
  updated_at: Scalars['Date']['output'];
};

/** Genre data representation */
export type Genre = {
  __typename?: 'Genre';
  alias?: Maybe<Scalars['String']['output']>;
  books?: Maybe<Array<Maybe<Book>>>;
  created_at: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updated_at: Scalars['Date']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create Genre - Book relation */
  addBookToGenre: Genre;
  /** Create a new Book record */
  createBook: Book;
  /** Create a new Genre record */
  createGenre: Genre;
  /** Remove Genre - Book relation */
  removeBookFromGenre: Genre;
  /**
   * Upload a book's cover_image which contain in a multipart/form-data
   * need to provide a non-empty value for one of the following headers: x-apollo-operation-name, apollo-require-preflight
   */
  uploadBookCoverImage?: Maybe<UploadResult>;
};

export type MutationAddBookToGenreArgs = {
  bookId: Scalars['ID']['input'];
  genreId: Scalars['ID']['input'];
};

export type MutationCreateBookArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  publish_date?: InputMaybe<Scalars['Date']['input']>;
  publisher?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type MutationCreateGenreArgs = {
  alias?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type MutationRemoveBookFromGenreArgs = {
  bookId: Scalars['ID']['input'];
  genreId: Scalars['ID']['input'];
};

export type MutationUploadBookCoverImageArgs = {
  bookId: Scalars['ID']['input'];
  cover_image: Scalars['Upload']['input'];
};

export type Query = {
  __typename?: 'Query';
  /** Get a book's detail by its id */
  bookById: Book;
  /** Get a list of books by search with its title which contains the provided string */
  booksByTitle: Array<Maybe<Book>>;
  /** Get the most recent published book with an optional offset. Default maxItems is 10 and default offet is 0 */
  booksPublishedLatest: Array<Book>;
  /** Get a genre's details by its id */
  genreById: Genre;
  /** Get a list of genres by search with its name which contains the provied string */
  genresByName: Array<Maybe<Genre>>;
};

export type QueryBookByIdArgs = {
  id: Scalars['ID']['input'];
};

export type QueryBooksByTitleArgs = {
  title: Scalars['String']['input'];
};

export type QueryBooksPublishedLatestArgs = {
  maxItems?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryGenreByIdArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGenresByNameArgs = {
  name: Scalars['String']['input'];
};

export type UploadResult = {
  __typename?: 'UploadResult';
  book?: Maybe<Book>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Book: ResolverTypeWrapper<BookData>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Genre: ResolverTypeWrapper<GenreData>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  URI: ResolverTypeWrapper<Scalars['URI']['output']>;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  UploadResult: ResolverTypeWrapper<
    Omit<UploadResult, 'book'> & { book?: Maybe<ResolversTypes['Book']> }
  >;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Book: BookData;
  Boolean: Scalars['Boolean']['output'];
  Date: Scalars['Date']['output'];
  Float: Scalars['Float']['output'];
  Genre: GenreData;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  URI: Scalars['URI']['output'];
  Upload: Scalars['Upload']['output'];
  UploadResult: Omit<UploadResult, 'book'> & {
    book?: Maybe<ResolversParentTypes['Book']>;
  };
}>;

export type BookResolvers<
  ContextType = GraphqlContext,
  ParentType extends ResolversParentTypes['Book'] = ResolversParentTypes['Book'],
> = ResolversObject<{
  cover_image?: Resolver<Maybe<ResolversTypes['URI']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  genres?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Genre']>>>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  publish_date?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  publisher?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type GenreResolvers<
  ContextType = GraphqlContext,
  ParentType extends ResolversParentTypes['Genre'] = ResolversParentTypes['Genre'],
> = ResolversObject<{
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  books?: Resolver<Maybe<Array<Maybe<ResolversTypes['Book']>>>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = GraphqlContext,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = ResolversObject<{
  addBookToGenre?: Resolver<
    ResolversTypes['Genre'],
    ParentType,
    ContextType,
    RequireFields<MutationAddBookToGenreArgs, 'bookId' | 'genreId'>
  >;
  createBook?: Resolver<
    ResolversTypes['Book'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateBookArgs, 'title'>
  >;
  createGenre?: Resolver<
    ResolversTypes['Genre'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateGenreArgs, 'name'>
  >;
  removeBookFromGenre?: Resolver<
    ResolversTypes['Genre'],
    ParentType,
    ContextType,
    RequireFields<MutationRemoveBookFromGenreArgs, 'bookId' | 'genreId'>
  >;
  uploadBookCoverImage?: Resolver<
    Maybe<ResolversTypes['UploadResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationUploadBookCoverImageArgs, 'bookId' | 'cover_image'>
  >;
}>;

export type QueryResolvers<
  ContextType = GraphqlContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = ResolversObject<{
  bookById?: Resolver<
    ResolversTypes['Book'],
    ParentType,
    ContextType,
    RequireFields<QueryBookByIdArgs, 'id'>
  >;
  booksByTitle?: Resolver<
    Array<Maybe<ResolversTypes['Book']>>,
    ParentType,
    ContextType,
    RequireFields<QueryBooksByTitleArgs, 'title'>
  >;
  booksPublishedLatest?: Resolver<
    Array<ResolversTypes['Book']>,
    ParentType,
    ContextType,
    Partial<QueryBooksPublishedLatestArgs>
  >;
  genreById?: Resolver<
    ResolversTypes['Genre'],
    ParentType,
    ContextType,
    RequireFields<QueryGenreByIdArgs, 'id'>
  >;
  genresByName?: Resolver<
    Array<Maybe<ResolversTypes['Genre']>>,
    ParentType,
    ContextType,
    RequireFields<QueryGenresByNameArgs, 'name'>
  >;
}>;

export interface UriScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['URI'], any> {
  name: 'URI';
}

export interface UploadScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UploadResultResolvers<
  ContextType = GraphqlContext,
  ParentType extends
    ResolversParentTypes['UploadResult'] = ResolversParentTypes['UploadResult'],
> = ResolversObject<{
  book?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphqlContext> = ResolversObject<{
  Book?: BookResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Genre?: GenreResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  URI?: GraphQLScalarType;
  Upload?: GraphQLScalarType;
  UploadResult?: UploadResultResolvers<ContextType>;
}>;
