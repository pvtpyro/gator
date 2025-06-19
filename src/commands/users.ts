import { readConfig, setUser } from "../config";
import { createUser, deleteUsers, getUsers } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const userName = args[0];
    setUser(userName);

    console.log("User switched successfully!");
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length != 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const userName = args[0];
    const user = await createUser(userName);
    if (!user) {
        throw new Error(`User ${userName} not found`);
    }

    setUser(user.name);
    console.log("User created successfully!");
}


export async function handlerResetUsers() {
    await deleteUsers();
    console.log("Database reset successfully!");
}


export async function handlerUsers() {
    const users = await getUsers();
    const config = readConfig();
    const current_username = config.currentUserName;
    console.log("Users:")
    users.forEach((user) => {
        if (user.name == current_username) {
            console.log(`${user.name} (current)`)
        } else {
            console.log(user.name)
        }
    });
}
