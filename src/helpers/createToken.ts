import * as jwt from "jsonwebtoken";

export const createToken = (userID: number, browserInfo: string): string =>
  jwt.sign({ userID, browserInfo }, 'hush-hush', {
    expiresIn: 200000,
  });
