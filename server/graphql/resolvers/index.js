import { cart } from './cartResolvers.js';
import { order } from './orderResolvers.js';
import { products } from './productResolvers.js';
import { users } from './userResolvers.js';
import { GraphQLScalarType, Kind } from 'graphql';

// Custom Date scalar implementation
const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    return value.getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(Number.parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});

export default {
  Date: DateScalar,
  Query: {
    ...users.Query,
    ...products.Query,
    ...cart.Query,
    ...order.Query,
  },
  Mutation: {
    ...users.Mutation,
    ...products.Mutation,
    ...cart.Mutation,
    ...order.Mutation,
  },
};
