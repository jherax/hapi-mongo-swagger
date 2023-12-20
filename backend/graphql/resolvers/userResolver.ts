import User from '../../models/User';
import createToken from '../../utils/createToken';
import trimObjectProps from '../../utils/trimObjectProps';

export type UserWithToken = Exclude<IUser, 'password'> & {jwtoken: string};
export type UserResponse = {
  success: boolean;
  message: string;
  result?: IUser | IUser[] | UserWithToken;
};

const userResolver = {
  Query: {
    getUserById: async (
      parent,
      {id}: {id: string},
      contextShared: ApolloServerContext,
    ): Promise<UserResponse> => {
      const response = createSuccessResponse('User found');
      const user = await User.findById(id);
      if (!user) {
        response.success = false;
        response.message = 'User not found';
      }
      response.result = user;
      return response;
    },

    getUsers: async (
      parent,
      params: {limit: number; page: number},
      contextValue: ApolloServerContext,
    ): Promise<UserResponse> => {
      const page = +(params.page || 1);
      const limit = +(params.limit || 10);
      const startIndex = (page - 1) * limit;

      const allUsers = await User.find()
        .skip(startIndex)
        .limit(limit)
        // .sort({ createdAt: -1 })
        .lean() // tells Mongoose to skip hydrating the result documents.
        .exec(); // execute the query.

      const total = allUsers?.length || 0;
      const response = createSuccessResponse(`Listing ${total} Users`);
      response.result = allUsers ?? [];
      return response;
    },
  },

  Mutation: {
    signup: async (
      parent,
      {input}: {input: IUser},
      contextShared: ApolloServerContext,
    ): Promise<UserResponse> => {
      const {email, password, fullname} = trimObjectProps(input);
      const response = createSuccessResponse('New user created');
      const emailAlreadyExist = await User.findOne({email});
      if (emailAlreadyExist) {
        response.success = false;
        response.message = `User with email '${email}' already exists`;
        return response;
      }
      const userToCreate = new User({email, password, fullname});
      const user = await userToCreate.save();
      if (!user) {
        response.success = false;
        response.message = `Unable to create user`;
        return response;
      }
      response.result = {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        jwtoken: createToken(user),
      } as UserWithToken;

      return response;
    },

    login: async (
      parent,
      {input}: {input: IUser},
      contextShared: ApolloServerContext,
    ): Promise<UserResponse> => {
      const response = createSuccessResponse('Successfully logged in');
      const {email, password} = trimObjectProps(input);
      const user = await User.findOne({
        $and: [{email}, {password}],
      });

      if (!user) {
        response.success = false;
        response.message = `Email and password don't match`;
        return response;
      }

      response.result = {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        jwtoken: createToken(user),
      } as UserWithToken;

      return response;
    },
  },
};

function createSuccessResponse(message: string): UserResponse {
  return {success: true, message, result: null};
}

export default userResolver;
