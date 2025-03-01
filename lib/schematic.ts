import { SchematicClient } from "@schematichq/schematic-typescript-node";

const apiKey = process.env.SCHEMATIC_SECRET_KEY;
if (!apiKey) throw new Error("Missing secret key SCHEMATIC_SECRET_KEY");

export const client = new SchematicClient({
  apiKey,
  cacheProviders: {
    flagChecks: [],
  },
});
