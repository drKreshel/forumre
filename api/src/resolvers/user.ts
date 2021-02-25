import {
  Resolver,
  Query,
  Ctx,
  Arg,
  Int,
  Mutation,
  InputType,
  Field,
  ObjectType,
} from "type-graphql";
import argon2 from "argon2";
import { MyContext } from "./../types";
import { Post } from "./../entities/Post";
import { User } from "./../entities/User";
import { EntityManager } from "@mikro-orm/postgresql";

//@Arg can be replaced with:
@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@Resolver()
export class UserResolver {
  //REGISTER 👱
  @Mutation(() => UserResponse) //ObjectTypes
  async register(
    //() => UsernamePasswordInput is infered by graphql so is not needed.
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput, //InputTypes
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    //validations
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Username length must be greater than 2",
          },
        ],
      };
    }
    if (!options.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
      return {
        errors: [
          {
            field: "password",
            message:
              "Password must have at least eight characters, one uppercase and one number",
          },
        ],
      };
    }

    //password hashing
    const hashedPassword = await argon2.hash(options.password);

    //saving user to database
    /* #REGION saving user with mikro Orm*/
    // const user = em.create(User, {
    //   username: options.username,
    //   password: hashedPassword,
    // });
    // console.log("🚀 ~ file: user.ts ~ line 87 ~ UserResolver ~ user", user)
    // try {
    //   await em.persistAndFlush(user);
    //   console.log("🚀 ~ file: user.ts ~ line 91 ~ UserResolver ~ user", user)
    // } catch (error) {
    //   if (error.code === "23505") {
    //     return {
    //       errors: [{ field: "username", message: "Username is already taken" }],
    //     };
    //   }
    // }
    /* #endregion */

    /* #REGION saving user with raw queries using Knex query builder */
    let user;
    const rawUser = {
      username: options.username,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    };
    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert(rawUser)
        .returning("*"); //returns all the fields
      const {id, username, password, created_at, updated_at} = result[0]
  
      //renaming created_at and updated_at fields to how entity expects them
      user = { id, username, password, createdAt: created_at, updatedAt: updated_at }
    } catch (error) {
      if (error.code === "23505") {
        return {
          errors: [{ field: "username", message: "Username is already taken" }],
        };
      }
    }
    /* #endregion */

    //auto login after register
    req.session.userId = user?.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    //() => UsernamePasswordInput is infered by graphql so is not needed.
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });

    //validations
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "that username doesn't exists",
          },
        ],
      };
    }
    const validPassword = await argon2.verify(user.password, options.password);
    if (!validPassword) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    //stores user id on session cookie to keep the user logged in
    req.session.userId = user.id;

    return { user };
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    //if user not logged in
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }
}
