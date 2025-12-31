import { prisma } from "../config/database.js";
import {
  DeleteUserRequestDto,
  GetAllUsersResponseDto,
  GetAllUsersRequestDto,
  GetUserRequestDto,
  UpdateUserRequestDto,
  UserResponseDto,
} from "../dto/user.dto.js";
import { AppError } from "../utils/app-error.js";

export class UserService {
  private static readonly DEFAULT_PAGE_SIZE = 10;
  private static readonly MAX_PAGE_SIZE = 50;

  async getAllUsers({
    cursor,
    pagesize,
  }: GetAllUsersRequestDto): Promise<GetAllUsersResponseDto> {
    const size = Math.min(
      Math.max(pagesize || UserService.DEFAULT_PAGE_SIZE, 1),
      UserService.MAX_PAGE_SIZE
    );

    const userData = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
      take: size + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: 0,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    if (!userData || userData.length === 0) {
      throw new AppError("No users found", 404);
    }

    const hasNextPage = userData.length > size;
    return {
      users: hasNextPage ? userData.slice(0, size) : userData,
      nextCursor: hasNextPage ? userData[size].id : null,
    };
  }

  async getUserById(userId: GetUserRequestDto): Promise<UserResponseDto> {
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async updateUser(userData: UpdateUserRequestDto): Promise<UserResponseDto> {
    const { userId, ...updateData } = userData;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updatedUser;
  }

  async deleteUser(userId: DeleteUserRequestDto): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await prisma.user.delete({
      where: { id: userId },
    });
  }
}
