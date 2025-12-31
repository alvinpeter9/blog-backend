import z from "zod";
import {
  getAllUsersSchema,
  updateUserRequestSchema,
  userUUIDSchema,
} from "../validators/user.validators.js";

export interface UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export type GetAllUsersRequestDto = z.infer<typeof getAllUsersSchema>;
export interface GetAllUsersResponseDto {
  users: UserResponseDto[];
  nextCursor: string | null;
}

export type UpdateUserRequestDto = z.infer<typeof updateUserRequestSchema>;
export type GetUserRequestDto = z.infer<typeof userUUIDSchema>;
export type DeleteUserRequestDto = z.infer<typeof userUUIDSchema>;
