const mongoose = require('mongoose');
const { type } = require('os');
const Schema = mongoose.Schema

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    trim: true,
    require: true,
  },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  city: { type: String, trim: true },
  address: { type: String, trim: true },
  mobileNumber: { type: String, trim: true },
  country: { type: String, trim: true },
  profilePicture: {
    url: { type: String },
    public_id: { type: String }
  },
  password: {
    type: String,
    trim: true,
    require: true,
  },
  email: {
    type: String,
    trim: true,
    require: true,
    unique :true
  },
  role: {
    type: String,
    enum : ['user','owner','admin'],
    default:'user'
  },
  isActive: {
    type: Boolean,
    default: true,
  },
})
const UserModel = mongoose.model('Users',UserSchema)
module.exports = UserModel
