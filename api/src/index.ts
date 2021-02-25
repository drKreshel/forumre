import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
//ANCHOR if app continues to have problems install and import "reflect-metadata"
//and yarn add -D @types/connect-redis
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";

const main = async () => {
  //connects to database
  const orm = await MikroORM.init(mikroOrmConfig);

  //runs the migrations
  await orm.getMigrator().up();

  const app = express();

  //#region REDIS CONFIG //STUB
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();
  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        disableTouch: true, // manually added. Disables refresh of session cookie time upon user activity.
      }),
      secret: "ultraDog & superfluosCat",
      resave: false,
      name: "qid", // manually added
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true, // disallows front end js access to the cookie
        secure: __prod__, // cookie will only work in https
        sameSite: "lax", //https://actix.rs/actix-redis/actix_redis/enum.SameSite.html
      },
      saveUninitialized: false,
    })
  );
  //#endregion

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false, //NOTE buildSchema uses a custom validator
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: { origin: "http://localhost:3000", credentials: true },
  });
  //NOTE in case problems with cors arise or want to use global cors middleware, put above redis
  /*
  yarn ad -D types/cors cors
  import cors from 'cors'
  app.use(cors({
    { origin: "http://localhost:3000", credentials: true }
  }))
  */

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
