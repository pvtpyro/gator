import { config } from "process";
import { readConfig } from "src/config";
import { addFeed, createFeedFollow, getFeedByUrl, getFeedFollowsForUser, listFeeds } from "src/lib/db/queries/feeds";
import { getUser, getUserById } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";
import { fetchFeed, RSSFeed } from "src/rss";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml")
    const feedDataStr = JSON.stringify(feed, null, 2);
    // console.log(feedDataStr);
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <name> <url>`);
    }

    const config = readConfig();
    const user = await getUser(config.currentUserName);
    const [name, url] = args;

    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

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
        // console.log("user", user)
        console.log(`${feed.name}, ${feed.url} added by ${user?.name}`)
    }))
}

export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
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

export async function handlerFollowing() {
    const feeds = await getFeedFollowsForUser();

    if (!feeds) {
        throw new Error("You aren't following any feeds");
    }

    console.log("You are following:")
    feeds.forEach((feed) => {
        console.log(feed.feeds.name)
    })

}