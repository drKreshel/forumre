import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";

const main = async () => {
  //connects to database
  const orm = await MikroORM.init(mikroOrmConfig);

  //run migrations
  await orm.getMigrator().up();

  //creates post instance
  const post = orm.em.create(Post, { title: "my first post" });

  await orm.em.persistAndFlush(post); //equivalent to : const post = new Post("my first post");

  const posts = await orm.em.find(Post, {});
  console.log("🚀 ~ file: index.ts ~ line 19 ~ main ~ posts", posts)
};

main().catch((e) => console.log(e));
