// import type { AuthenticatedUser } from "../modules/user/user.interface.js";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: AuthenticatedUser;
//     }
//   }
// }



declare namespace Express {
  interface Request {
    params: Record<string, string>;
  }
}