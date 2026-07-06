import type { Request, Response } from "express";
import { RatingService } from "./rating.service.js";
import type { AuthenticatedUser } from "../user/user.interface.js";

export class RatingController {
  // POST /api/v1/ratings
  static async createRating(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const data = req.body;
    const result = await RatingService.createRating(userId, data);
    res.status(201).json(result);
  }

  // GET /api/v1/ratings/provider/:providerId
  static async getProviderRatings(req: Request, res: Response) {
    const { providerId } = req.params;
    const result = await RatingService.getProviderRatings(providerId);
    res.status(200).json(result);
  }

  // GET /api/v1/ratings/request/:requestId
  static async getRatingByRequest(req: Request, res: Response) {
    const { requestId } = req.params;
    const result = await RatingService.getRatingByRequest(requestId);
    res.status(200).json(result);
  }
}
