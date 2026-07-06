import type { Request, Response } from "express";
import { ProviderService } from "./provider.service.js";
import type { AuthenticatedUser } from "../user/user.interface.js";

export class ProviderController {
  // POST /api/v1/providers/register
  static async registerProvider(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const data = req.body;
    const result = await ProviderService.registerProvider(userId, {
      userId,
      ...data,
    });
    res.status(201).json(result);
  }

  // GET /api/v1/providers/me
  static async getMyProfile(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const result = await ProviderService.getProviderByUserId(userId);
    res.status(200).json(result);
  }

  // GET /api/v1/providers/:providerId
  static async getProviderById(req: Request, res: Response) {
    const { providerId } = req.params;
    const result = await ProviderService.getProviderById(providerId);
    res.status(200).json(result);
  }

  // PATCH /api/v1/providers/me
  static async updateProfile(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const data = req.body;
    const result = await ProviderService.updateProvider(userId, data);
    res.status(200).json(result);
  }

  // PATCH /api/v1/providers/me/location
  static async updateLocation(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const { longitude, latitude } = req.body;
    const result = await ProviderService.updateLocation(userId, {
      longitude,
      latitude,
    });
    res.status(200).json(result);
  }

  // PATCH /api/v1/providers/me/status
  static async updateStatus(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const { status } = req.body;
    const result = await ProviderService.updateStatus(userId, status);
    res.status(200).json(result);
  }

  // GET /api/v1/providers/nearby
  static async getNearbyProviders(req: Request, res: Response) {
    const { longitude, latitude, serviceType, radius } = req.query as any;
    const result = await ProviderService.getNearbyProviders(
      parseFloat(longitude),
      parseFloat(latitude),
      serviceType,
      radius ? parseFloat(radius) : 5000
    );
    res.status(200).json(result);
  }
}
