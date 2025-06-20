import { config } from "process";
import { readConfig } from "src/config";
import { addFeed } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";
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