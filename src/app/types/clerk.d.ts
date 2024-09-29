import "dotenv/config";
import { LooseAuthProp } from "@clerk/clerk-sdk-node";
declare global {
  namespace Express {
    interface Request extends LooseAuthProp {}
  }
}
