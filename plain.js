const { PubSub, SubscriptionManager } = require('graphql-subscriptions');
const { makeExecutableSchema } = require('graphql-tools');

const messages = [];

const resolvers = {
  Query: { messages: () => messages },
  Subscription: { newMessage: (rootValue) => rootValue },
};

const typeDefs = `
type Query {
  messages: [String!]!
}
type Subscription {
  newMessage: String!
}
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const pubsub = new PubSub();
const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
});

subscriptionManager.subscribe({
  query: `
    subscription NewMessageSubscription {
      newMessage
    }
  `,
  callback: (err, result) =>
    console.log(`New message: ${result.data.newMessage}`),
});

const helloWorldMessage = 'Hello, world!';
messages.push(helloWorldMessage);

pubsub.publish('newMessage', helloWorldMessage);

// Prints "New message: Hello, world!" in the console via the subscription!
