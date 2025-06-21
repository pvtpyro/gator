import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feed_follows, feeds, User, users } from "../schema";
import { firstOrUndefined } from "./utils";

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

export async function getFeedFollowsForUser(user: User) {
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

export async function deleteFeedFollow(feedId: string, userId: string) {
  const [result] = await db
    .delete(feed_follows)
    .where(and(eq(feed_follows.feed_id, feedId), eq(feed_follows.user_id, userId)))
    .returning();

  return result;
}