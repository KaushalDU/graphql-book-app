const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const connection = require("./connection");
const graphSchema = require("./graphQl/schema");

const graphResolver = require("./graphQl/resolver/index")
const auth = require("./middlewares/auth.middleware");

const app = express();

app.use(express.json());
app.use(auth)

app.use("/graphql", graphqlHTTP({
    schema: graphSchema,
    rootValue:graphResolver,
    graphiql: true
}))

app.listen(8000, async() => {
    try {
        await connection;
        console.log("http://localhost:8000")
    } catch (error) {
        throw new Error(error)
    }
})