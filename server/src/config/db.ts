import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDb() {
  await mongoose.connect(env.MONGODB_URI);
  // Without a database name in the URI the driver silently uses "test", which
  // on a shared cluster may belong to another project (that happened: its
  // unique indexes broke sign-ups). Refuse to run there.
  if (mongoose.connection.name === "test") {
    await mongoose.disconnect();
    throw new Error(
      'MONGODB_URI has no database name, so MongoDB would use "test". Add one before the "?", e.g. ...mongodb.net/fehlerfreund?retryWrites=true',
    );
  }
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
