import { setUser } from "../config";

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error(`A username is required.`);
    }

    setUser(args[0]);
    console.log(`User ${args[0]} has been set`);
}