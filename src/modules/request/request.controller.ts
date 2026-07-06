// import type { Request, Response } from "express";
// import { RequestService } from "./request.service.js";
// import type { AuthenticatedUser } from "../user/user.interface.js";

// export class RequestController {
//   // POST /api/v1/requests
//   static async createRequest(req: Request, res: Response) {
//     const { userId } = req.user as AuthenticatedUser;
//     const data = req.body;
//     const result = await RequestService.createRequest(userId, data);
//     res.status(201).json(result);
//   }

//   // GET /api/v1/requests/my-requests (user)
//   static async getMyRequests(req: Request, res: Response) {
//     const { userId } = req.user as AuthenticatedUser;
//     const result = await RequestService.getUserRequests(userId);
//     res.status(200).json(result);
//   }

//   // GET /api/v1/requests/provider-requests (provider)
//   static async getProviderRequests(req: Request, res: Response) {
//     const { userId } = req.user as AuthenticatedUser;
//     const result = await RequestService.getProviderRequests(userId);
//     res.status(200).json(result);
//   }

//   // GET /api/v1/requests/:requestId
//   static async getRequestById(req: Request, res: Response) {
//     const { userId } = req.user as AuthenticatedUser;
//     const { requestId } = req.params;
//     const result = await RequestService.getRequestById(requestId, userId);
//     res.status(200).json(result);
//   }

//   // PATCH /api/v1/requests/:requestId/accept
//   static async acceptRequest(req: Request, res: Response) {
//     const { userId } = req.user as AuthenticatedUser;
//     const { requestId } = req.params;
//     const result = await RequestService.acceptRequest(requestId, userId);
//     res.status(200).json(result);
//   }

//   // PATCH /api/v1/requests/:requestId/decline
//   static async declineRequest(req: Request, res: Response) {
//     const { userId } = req.user as AuthenticatedUser;
//     const { requestId } = req.params;
//     const result = await RequestService.declineRequest(requestId, userId);
//     res.status(200).json(result);
//   }

//   // PATCH /api/v1/requests/:requestId/en-route
//   static async markEnRoute(req: Request, res: Response) {
//     const { userId } = req.user as AuthenticatedUser;
//     const { requestId } = req.params;
//     const result = await RequestService.markEnRoute(requestId, userId);
//     res.status(200).json(result);
//   }

//   // PATCH /api/v1/requests/:requestId/arrived
//   static async markArrived(req: Request, res: Response) {
//     const { userId } = req.user as AuthenticatedUser;
//     const { requestId } = req.params;
//     const result = await RequestService.markArrived(requestId, userId);
//     res.status(200).json(result);
//   }

//   // PATCH /api/v1/requests/:requestId/complete
//   static async completeRequest(req: Request, res: Response) {
//     const { userId } = req.user as AuthenticatedUser;
//     const { requestId } = req.params;
//     const result = await RequestService.completeRequest(
//       requestId,
//       userId,
//       req.body
//     );
//     res.status(200).json(result);
//   }

//   // PATCH /api/v1/requests/:requestId/cancel
//   static async cancelRequest(req: Request, res: Response) {
//     const { userId } = req.user as AuthenticatedUser;
//     const { requestId } = req.params;
//     const result = await RequestService.cancelRequest(
//       requestId,
//       userId,
//       req.body
//     );
//     res.status(200).json(result);
//   }
// }


import type { Request, Response } from "express";
import { RequestService } from "./request.service.js";
import type { AuthenticatedUser } from "../user/user.interface.js";

export class RequestController {
  // POST /api/v1/requests
  static async createRequest(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const result = await RequestService.createRequest(userId, req.body);
    res.status(201).json(result);
  }

  // GET /api/v1/requests/my-requests
  static async getMyRequests(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const result = await RequestService.getUserRequests(userId);
    res.status(200).json(result);
  }

  // GET /api/v1/requests/provider-requests
  static async getProviderRequests(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const result = await RequestService.getProviderRequests(userId);
    res.status(200).json(result);
  }

  // GET /api/v1/requests/available  ← NEW
  static async getAvailableRequests(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const result = await RequestService.getNearbyRequests(userId);
    res.status(200).json(result);
  }

  // GET /api/v1/requests/:requestId
  static async getRequestById(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const { requestId } = req.params;
    const result = await RequestService.getRequestById(requestId, userId);
    res.status(200).json(result);
  }

  // PATCH /api/v1/requests/:requestId/accept
  static async acceptRequest(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const { requestId } = req.params;
    const result = await RequestService.acceptRequest(requestId, userId);
    res.status(200).json(result);
  }

  // PATCH /api/v1/requests/:requestId/decline
  static async declineRequest(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const { requestId } = req.params;
    const result = await RequestService.declineRequest(requestId, userId);
    res.status(200).json(result);
  }

  // PATCH /api/v1/requests/:requestId/en-route
  static async markEnRoute(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const { requestId } = req.params;
    const result = await RequestService.markEnRoute(requestId, userId);
    res.status(200).json(result);
  }

  // PATCH /api/v1/requests/:requestId/arrived
  static async markArrived(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const { requestId } = req.params;
    const result = await RequestService.markArrived(requestId, userId);
    res.status(200).json(result);
  }

  // PATCH /api/v1/requests/:requestId/complete
  static async completeRequest(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const { requestId } = req.params;
    const result = await RequestService.completeRequest(requestId, userId, req.body);
    res.status(200).json(result);
  }

  // PATCH /api/v1/requests/:requestId/cancel
  static async cancelRequest(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const { requestId } = req.params;
    const result = await RequestService.cancelRequest(requestId, userId, req.body);
    res.status(200).json(result);
  }
}