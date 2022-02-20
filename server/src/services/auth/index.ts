import * as jwt from "jsonwebtoken";
import { IJwtPayload } from "../../middlewares/auth";

const createToken = ({ id, nickname, profileURL }: IJwtPayload): string => {
  const token = jwt.sign(
    { id, nickname, profileURL },
    process.env.JWT_SECRET as string,
    {
      noTimestamp: true,
    }
  );
  return token;
};

export { createToken };
