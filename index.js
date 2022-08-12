import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type SkiResorts {
    name: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    resorts: [SkiResorts]
  }

  type Mutation {
    addResort(name: String): SkiResorts
  }
`;

const resorts = [
  { name: "Vail" },
  { name: "Breckenridge" },
  { name: "Keystone" },
  { name: "Aspen" },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    resorts: () => resorts,
  },
  Mutation: {
    addResort: (root, args) => {
      console.log("root: ", root);
      console.log("args", args);
      const newResort = { name: args.name };
      resorts.push(newResort);
      return newResort;
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  /**
   * What's up with this embed: true option?
   * These are our recommended settings for using AS;
   * they aren't the defaults in AS3 for backwards-compatibility reasons but
   * will be the defaults in AS4. For production environments, use
   * ApolloServerPluginLandingPageProductionDefault instead.
   **/
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
