import { addFeed, createFeedFollow, deleteFeedFollow, getFeedByUrl, getFeedFollowsForUser, listFeeds } from "src/lib/db/queries/feeds";
import { getUserById } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";
import { fetchFeed } from "src/rss";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml")
    const feedDataStr = JSON.stringify(feed, null, 2);
}

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <name> <url>`);
    }

    const [name, url] = args;

    const newfeed = await addFeed(name, url, user.id);
    if (!newfeed) {
        throw new Error(`Failed to create feed`);
    }

    const follow = await createFeedFollow(user.id, newfeed.id);

    if(follow) {
        console.log(`${follow[0].users.name} is now following ${follow[0].feeds.name}`)
    } 

    console.log("Feed created successfully");
    printFeed(newfeed, user);
}

function printFeed(feed: Feed, user: User) {
    console.log(`* ID:            ${feed.id}`);
    console.log(`* Created:       ${feed.createdAt}`);
    console.log(`* Updated:       ${feed.updatedAt}`);
    console.log(`* name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* User:          ${user.name}`);
}

export async function handlerFeeds() {
    const feeds = await listFeeds();
    await Promise.all(feeds.map(async (feed) => {
        const user = await getUserById(feed.user_id);
        console.log(`${feed.name}, ${feed.url} added by ${user?.name}`)
    }))
}

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const [url] = args;
    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`Feed not found`);
    }

    const follow = await createFeedFollow(user.id, feed.id);

    if(follow) {
        console.log(`${follow[0].users.name} is now following ${follow[0].feeds.name}`)
    } 

}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
    const feeds = await getFeedFollowsForUser(user);

    if (!feeds) {
        throw new Error("You aren't following any feeds");
    }

    console.log("You are following:")
    feeds.forEach((feed) => {
        console.log(feed.feeds.name)
    })

}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const [url] = args;

    let feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`Feed not found for url: ${url}`);
    }

    const result = await deleteFeedFollow(feed.id, user.id);
    if (!result) {
        throw new Error(`Failed to unfollow feed: ${url}`);
    }

    console.log(`%s unfollowed successfully!`, feed.name);
}