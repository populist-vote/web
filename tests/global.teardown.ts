import { test as teardown } from "@playwright/test";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);
const dumpFilePath = "playwright/.dumps/staging_database.sql";
const connectionUrl = process.env.STAGING_DATABASE_URL;

teardown.setTimeout(210000);
teardown("restore staging database", async ({}) => {
  try {
    // Run the psql command to restore the database
    const command = `pg_restore --verbose --clean --no-acl --no-owner ${connectionUrl} ${dumpFilePath}`;
    const { stdout, stderr } = await execAsync(command);
    console.log("Command output:", stdout);
    console.error("Command error:", stderr);

    console.log("Database restored successfully");
  } catch (error) {
    console.error("Error restoring database:", error);
  }
});
