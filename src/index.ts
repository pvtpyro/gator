import { readConfig, setUser } from "./config";
function main() {
    setUser("Brandi");
    const cfg = readConfig();
    console.log(cfg);
}

main();
