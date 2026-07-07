declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        roles:  string[];
        email?: string;
      };
      params: Record<string, string>;
    }
  }
}

export {};