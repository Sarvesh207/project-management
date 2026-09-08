import { Prisma } from "../generated/prisma/client";
import { ApiError } from "./api-error";

export function handlePrismaError(error: unknown): ApiError | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return null;
  }

  switch (error.code) {
    // Unique constraint violation
    case "P2002":
      return new ApiError(409, "A record with this value already exists.", [
        error.meta,
      ]);

    // Foreign key constraint violation
    case "P2003":
      return new ApiError(
        409,
        "Operation failed because related records exist.",
        [error.meta],
      );

    // Record not found
    case "P2025":
      return new ApiError(404, "Record not found.", [error.meta]);

    default:
      return null;
  }
}
