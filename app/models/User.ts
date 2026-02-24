import mongoose, { Schema, models, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const UserSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
      default: () => `usr_${uuidv4()}`,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    role:{
      type:String,
      default:null,
    }
  },
  {
    timestamps: true, // createdAt & updatedAt auto
  }
);

// Prevent model overwrite during hot reload
const User = models.User || model("User", UserSchema);

export default User;
