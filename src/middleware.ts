import { CommandHandler } from "./commands/commands";
import { readConfig } from "./config";
import { getUser } from "./lib/db/queries/users";
import { User } from "./lib/db/schema";

type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (command: string, ...args) => {
        const user = await getUser(readConfig().currentUserName);
        if (!user) {
            throw new Error(`You must be logged in to perform the command ${command}`);
        }
        return await handler(command, user, ...args);
    };
}