import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(()=>String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(()=>String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text", unique: true })
  username!: string;

  //no @Field decorator means this won't come up in graphql queries.
  @Property({ type: "text" })
  password!: string;
}
