import { eq } from "drizzle-orm";
import { db } from "..";
import { feed_follows, feeds, users } from "../schema";
import { firstOrUndefined } from "./utils";
import { getUser, getUsers } from "./users";
import { readConfig } from "src/config";

export async function addFeed(name: string, url: string, id: string) {
    const result = await db.insert(feeds).values({name: name, url: url, user_id: id}).returning();
    return firstOrUndefined(result);
}

export async function listFeeds() {
    const result = await db.select().from(feeds);
    return result;
}

export async function getFeedByUrl(url: string) {
    const result = await db.select().from(feeds).where(eq(feeds.url, url));
	return firstOrUndefined(result);
}

export async function createFeedFollow(user_id: string, feed_id:string) {

    try {
        const [newFeedFollow] = await db
            .insert(feed_follows)
            .values({
                user_id: user_id,
                feed_id: feed_id
            })
            .returning();

            const more = await db.select().from(feed_follows)
                .innerJoin(users, eq(feed_follows.user_id, users.id))
                .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
                .where(eq(feed_follows.id, newFeedFollow.id))
        
            return more

    } catch (e) {
        throw new Error("There was a problem")
    }

}

export async function getFeedFollowsForUser() {
    const config = readConfig();
    const user = await getUser(config.currentUserName);

    if(!user) {
        throw new Error("user not found")
    }

    try {
        const userfeeds = await db.select().from(feed_follows)
            .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
            .where(
                eq(feed_follows.user_id, user.id)
            )
            return userfeeds;
    } catch (err) {
        console.log(err)
    }

}