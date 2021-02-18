import path from "path";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { MikroORM } from "@mikro-orm/core";

export default {
  entities: [Post, User],
  dbName: "lireddit",
  type: "postgresql",
  user: 'postgres',
  password: '1',
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
  },
  debug: !__prod__, //__prod__ = process.env.NODE_ENV === "production"
} as Parameters<typeof MikroORM.init>[0];
