import { readConfig } from "src/config";
import { addFeed } from "src/lib/db/queries/feeds";
import { fetchFeed, RSSFeed } from "src/rss";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml")
    const feedDataStr = JSON.stringify(feed, null, 2);
    // console.log(feedDataStr);
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length == 0) {
        throw new Error(`usage: ${cmdName} <name> <url>`);
    }

    const current_username = readConfig().currentUserName;
    const [name, url] = args;

    const newfeed = await addFeed(name, url, current_username);

   printFeed(newfeed, current_username);
}

function printFeed(feed: object, user:string) {
    console.log("feed", feed);
    console.log("user", user)
}