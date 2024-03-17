const BookModel = require("../../models/bookModel");
const UserModel = require("../../models/userModel")


module.exports = {
    createBook: async (args, req) => {
        const { isAuth } = req;
        const { author, cost, title, publish_year } = args.bookInput;
        if (!isAuth || req?.user?.role === "user") {
            throw new Error("Unauthenticated!")
        }
        try {
            const newBook = new BookModel({
                author,
                cost,
                title,
                publish_year
            });
            const response = await newBook.save()
            return response
        } catch (error) {
            throw error
        }

    },
    updateBook: async ({ bookId, updateBookInput }, req) => {
        const { isAuth } = req;
        if (!isAuth || req?.user?.role === "user") {
            throw new Error("Unauthenticated!")
        }
        try {
            const updatedBook = await BookModel.findByIdAndUpdate(bookId, updateBookInput, { new: true });
            if (!updatedBook) {
                throw new Error('Book not found.');
            }
            return updatedBook;
        } catch (error) {
            throw error;
        }
    },
    deleteBook: async ({ bookId }, req) => {
        const { isAuth } = req;
        if (!isAuth || req?.user?.role === "user") {
            throw new Error("Unauthenticated!")
        }
        try {
            const deletedBook = await BookModel.findByIdAndDelete(bookId);
            if (!deletedBook) {
                throw new Error("Book not found!")
            }
        } catch (error) {
            throw error
        }
        return "Book Deleted successfully!"
    },
    allBooks: async ({ searchTerm }, req) => {
        const { isAuth } = req;
        if (!isAuth) {
            throw new Error("Unauthenticated!")
        }
        try {
            let query = {}
            if (searchTerm) {
                query.$or = [
                    { author: { $regex: searchTerm, $options: 'i' } },
                    { title: { $regex: searchTerm, $options: 'i' } }
                ]
            }
            const allBook = await BookModel.find(query);
            return allBook
        } catch (error) {
            throw new Error(error)
        }
    },
    borrowBooks: async ({ bookId }, req) => {
        if (!req.isAuth) {
            throw new Error("Unauthenticated!")
        }
        try {
            const book = await BookModel.findOne({ _id: bookId });
            if (!book) {
                throw new Error("The book is unavailable.")
            }
            if (book.bookBorrowedBy) {
                return "The book is currently on loan."
            }
            const bookupdatedFiled = {
                borrowedBy: req.user.userId
            }
            await BookModel.findByIdAndUpdate(bookId, bookupdatedFiled);
            const user = await UserModel.findOne({ _id: req.user.userId });
            user.borrowedBooks.push(bookId);
            await user.save()
            return "Book borrowed successfully."
        } catch (error) {

        }
    },
         
    BookBorrowRequest: async ({ notificationID }, req) => {
        if (!req.isAuth) {
            throw new Error("Unauthenticated!")
        }
        try {
            const currentUser = await UserModel.findOne({ _id: req.user.userId });
            const currentNotification = currentUser.notification.find(notification => notification._id.toString() === notificationID.toString())
            const renterUser = await UserModel.findOne({ _id: currentNotification.renterId });
            renterUser.borrowedBooks.push(currentNotification.bookId)
            await renterUser.save()

            await BookModel.findByIdAndUpdate({ _id: currentNotification.bookId }, { bookBorrowedBy: renterUser._id })

            await UserModel.findByIdAndUpdate(
                currentUser._id,
                { $pull: { borrowedBooks: currentNotification.bookId } }
            );
            await UserModel.findByIdAndUpdate(
                currentUser._id,
                { $pull: { notification: { _id: notificationID } } }
            );
            return `Accepting a book borrowing request`
        } catch (error) {
            throw error
        }
    }
}