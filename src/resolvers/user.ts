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
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    //validations
    if (options.username.length <= 2) {
      return {
        errors: [
          { field: "username", message: "length must be greater than 2" },
        ],
      };
    }
    if (!options.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
      return {
        errors: [
          {
            field: "password",
            message:
              "password must have at least 8 characters, 1 uppercase and 1 number",
          },
        ],
      };
    }

    //password hashing
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });

    //saving user to database
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if (error.code === "23505") {
        return {
          errors: [{ field: "username", message: "username already taken" }],
        };
      }
    } 

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    //() => UsernamePasswordInput is infered by graphql so is not needed.
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
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

    return { user };
  }
}