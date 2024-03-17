const { buildSchema } = require("graphql");

module.exports = buildSchema(`

    type User {
        _id:ID!
        email:String!
        password:String
        role:String!
        borrowedBooks:[Book!]
    }
    input UserInput {
        email:String!
        password:String!
        role:String!
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
      }

    type Book {
        _id:ID!
        author:String!
        cost:Float!
        title:String!
        release_year:Int!
        borrowedBy:User!
    }

    input BookInput{
        author:String!
        cost:Float!
        title:String!
        publish_year:Int!
    }

    input FindBook{
        title:String
        author:String
    }

    input UpdateBook{
        author:String
        cost:Float
        title:String
        publish_year:Int
    }
    
    type AllQuery{
        allusers:[User!]!
        allbooks:[Book!]!
        login(email:String!, password:String!):AuthData!
        logout:String!
        allBooks(searchTerm: String):[Book!]!
    }
    
    type AllMutation{
        createUser(userInput:UserInput):User
        createBook(bookInput:BookInput):Book
        updateBook(bookId: ID!, updateBook: UpdateBook): Book
        deleteBook(bookId:ID!):String
        borrowBooks(bookId:String):String!
        BookBorrowRequest(notificationID:ID!):String!
    }
    schema{
        query:AllQuery
        mutation:AllMutation
    }
`)