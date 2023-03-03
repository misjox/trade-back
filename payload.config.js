import { buildConfig } from "payload/config";
import Coins from "./collections/Coins";
import Media from "./collections/Media";
import Reserve from "./collections/Reserve";
import Users from "./collections/Users";

export default buildConfig({
  serverURL: process.env.SERVER_URL,
  admin: {
    user: Users.slug,
  },
  collections: [Users, Coins, Media, Reserve],
});
