import { Resolver, Query, Ctx, Arg, Int, Mutation, } from "type-graphql";
import { MyContext } from "./../types";
import { Post } from "./../entities/Post";

/***************
 * GET POSTS 🧮 
 *************/
@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() ctx: MyContext): Promise<Post[]> {
    return ctx.em.find(Post, {});
  }

/***************
 * GET POST 🧮 
 *************/
  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> {
    return ctx.em.findOne(Post, { id });
  }

  /***************
 * CREATE 🧮 
 *************/
  @Mutation(() => Post)
  async createPost(
    /*You might remove "()=>String", as it might infer it */
    @Arg("title", () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  /***************
 * UPDATE 🧮 
 *************/
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    /*Here we removed the "()=>Int" for id, and expresselly called the "()=>String" to be able to add the "{nullable: true}"" part*/
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof title !== undefined) {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }

/***************
 * DELETE 🧮 
 *************/
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    try{
      await em.nativeDelete(Post, { id });
      return true 
    } catch {
      return false
    }
  }
}
