import "dotenv/config";
import { test as setup } from "@playwright/test";
import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import util from "util";

const execAsync = util.promisify(exec);
const dumpFilePath = "playwright/.dumps/staging_database.sql";
const connectionUrl = process.env.STAGING_DATABASE_URL;

setup.setTimeout(720000);

setup("snapshot staging database", async ({}) => {
  try {
    // Check if the dump file already exists
    const fileExists = await fs
      .access(dumpFilePath)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      console.log(`Using existing database dump at ${dumpFilePath}`);
      return;
    }

    // Ensure the directory exists
    await fs.mkdir(path.dirname(dumpFilePath), { recursive: true });

    // Run the pg_dump command
    const command = `pg_dump -Fp --no-acl --no-owner ${connectionUrl} --file ${dumpFilePath}`;

    await execAsync(command);

    console.log(`Database dump created at ${dumpFilePath}`);
  } catch (error) {
    console.error("Error creating database dump:", error);
  }
});
