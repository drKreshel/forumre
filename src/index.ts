import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
//ANCHOR if app continues to have problems install and import "reflect-metadata"

const main = async () => {
  //connects to database
  const orm = await MikroORM.init(mikroOrmConfig);

  //runs the migrations
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver],
      validate: false, //NOTE Ben: buildSchema uses a custom validator, I don't like it.
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server running on PORT 4000");
  });

  /*#REGION Mikro orm basic commands*/
  //const post = orm.em.create(Post, { title: "my first post" }); //equivalent to sequelize Post.build()
  //await orm.em.nativeInsert(Post, {title:"my first post"}) //equivalent to await sequelize.query("INSERT ...");
  //const posts = await orm.em.find(Post, {}); // equivalent to sequelize Post.findAll({})
  //posts[posts.length - 1].id = -5; //changes the last post id to -5
  //await orm.em.persistAndFlush(post); //equivalent to sequelize Post.save());
  /*#endregion*/
};

main().catch((e) => console.log("", e));
