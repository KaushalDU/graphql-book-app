const bookResolver = require("../resolver/book");
const authResolver = require("../resolver/userAuth");

module.exports={
    ...authResolver,
    ...bookResolver
}