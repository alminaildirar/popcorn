import * as jwt from "jsonwebtoken";

export const createToken = (userID: number, browserInfo: string): string =>
  jwt.sign({ userID, browserInfo }, process.env.TOKEN_SECRET, {
    expiresIn: 200000,
  });
