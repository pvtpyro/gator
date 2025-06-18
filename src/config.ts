import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

// Export a setUser function that writes a Config object to the JSON file after setting the current_user_name field
export function setUser(userName: string) {
  const config = readConfig();
  config.currentUserName = userName;
  writeConfig(config);
}

// Export a readConfig function that reads the JSON file found at ~/.gatorconfig.json and returns a Config object. 
// It should read the file from the HOME directory, then decode the JSON string into a new Config object.
export function readConfig() {
  const fullPath = getConfigFilePath();

  const data = fs.readFileSync(fullPath, "utf-8");
  const rawConfig = JSON.parse(data);

  // console.log('read config', rawConfig)

  // return rawConfig;
  return validateConfig(rawConfig);
}

function writeConfig(config: Config) {
  const fullPath = getConfigFilePath();

  const rawConfig = {
    db_url: "postgres://example",
    current_user_name: config.currentUserName,
  };

  const data = JSON.stringify(rawConfig, null, 2);
  fs.writeFileSync(fullPath, data, { encoding: "utf-8" });
}

function getConfigFilePath() {
  const configFileName = ".gatorconfig.json";
  const homeDir = os.homedir();
  return path.join(homeDir, configFileName);
}

function validateConfig(rawConfig: any) {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config file");
  }
  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("current_user_name is required in config file");
  }

  const config: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };

  return config;
}
