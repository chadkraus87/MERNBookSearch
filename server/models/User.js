const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const bookSchema = require('./Book'); // Import schema from Book.js

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    // Set savedBooks to be an array of data that adheres to the bookSchema
    savedBooks: [bookSchema],
  },
  // Set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Hash user password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// Custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// When querying a user, we'll also get another field called `bookCount` with the number of saved books
userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

const User = model('User', userSchema);

module.exports = User;
