import type { AuthenticatedUser } from "../modules/user/user.interface.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
