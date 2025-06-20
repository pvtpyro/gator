import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds, users } from "../schema";
import { firstOrUndefined } from "./utils";

export async function addFeed(name: string, url: string, id: string) {
    const result = await db.insert(feeds).values({name: name, url: url, user_id: id}).returning();
    return firstOrUndefined(result);
}