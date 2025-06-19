import { fetchFeed } from "src/rss";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml")
    const feedDataStr = JSON.stringify(feed, null, 2);
    // console.log(feedDataStr);
}

