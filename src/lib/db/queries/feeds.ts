import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds, users } from "../schema";

export async function addFeed(name: string, url: string, username: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.name, username),
        columns: {
            id: true,
        },
    })

    if (!user) {
        throw new Error('User not found');
    }

    const [result] = await db.insert(feeds).values({name: name, url: url, user_id: user.id}).returning();
    return result;
}