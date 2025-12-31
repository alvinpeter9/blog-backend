import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service.js";

export class UserController {
  constructor(private userService: UserService) {}

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cursor, pagesize } = req.validatedQuery;
      const result = await this.userService.getAllUsers({
        cursor: cursor as string,
        pagesize: Number(pagesize),
      });
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const result = await this.userService.getUserById(userId);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const updateData = req.body;
      const result = await this.userService.updateUser({
        ...updateData,
        userId,
      });
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      await this.userService.deleteUser(userId);
      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
