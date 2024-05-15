const { default: mongoose } = require("mongoose");

mongoose.connect("mongodb+srv://abhishekgh201ee202:h0bbchspNOXOSj6S@cluster0.10pkcyh.mongodb.net/PayTM")

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String
});

const accountSchema = mongoose.Schema({
	userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const User = mongoose.model("User",userSchema)
const  Account = mongoose.model("Accounts",accountSchema);

module.exports ={
    User,
    Account
};