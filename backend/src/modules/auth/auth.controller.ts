import type { Response, Request } from "express";
import { ApiError, ApiResponse } from "../../utils";
import { userRegisterSchema, userLoginSchema } from "./auth.schema";

import { registerUserService} from "./auth.service";

export async function registerUser(req: Request, res: Response) {
  const result = userRegisterSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(400, "Invalid registration data", result.error.issues);
  }

  const user = await registerUserService(result.data);

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registred successfully"));
}
