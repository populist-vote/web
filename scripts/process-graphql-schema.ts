/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  buildSchema,
  introspectionFromSchema,
  GraphQLSchema,
  IntrospectionQuery,
} from "graphql";
import { promises as fs } from "fs";
import path from "path";

// Core type definitions
type TypeKind =
  | "SCALAR"
  | "OBJECT"
  | "INTERFACE"
  | "UNION"
  | "ENUM"
  | "INPUT_OBJECT"
  | "LIST"
  | "NON_NULL";

interface TypeRef {
  kind: TypeKind;
  name?: string;
  ofType?: TypeRef;
}

interface ProcessedSchema {
  types: Array<{
    name: string;
    description?: string;
    kind: TypeKind;
    fields?: Array<{
      name: string;
      description?: string;
      args: Array<{
        name: string;
        description?: string;
        type: TypeRef;
        defaultValue?: string;
      }>;
      type: TypeRef;
      deprecationReason?: string;
    }>;
    inputFields?: Array<{
      name: string;
      description?: string;
      type: TypeRef;
      defaultValue?: string;
    }>;
    interfaces?: string[];
    enumValues?: Array<{
      name: string;
      description?: string;
      deprecationReason?: string;
    }>;
    possibleTypes?: string[];
  }>;
  queries: Array<{
    name: string;
    description?: string;
    args: Array<{
      name: string;
      type: TypeRef;
      description?: string;
    }>;
    type: TypeRef;
  }>;
  mutations: Array<{
    name: string;
    description?: string;
    args: Array<{
      name: string;
      type: TypeRef;
      description?: string;
    }>;
    type: TypeRef;
  }>;
  subscriptions: Array<{
    name: string;
    description?: string;
    args: Array<{
      name: string;
      type: TypeRef;
      description?: string;
    }>;
    type: TypeRef;
  }>;
  directives: Array<{
    name: string;
    description?: string;
    locations: string[];
    args: Array<{
      name: string;
      type: TypeRef;
      description?: string;
    }>;
  }>;
}

// Process type references
const processTypeRef = (type: any): TypeRef => {
  if (type.kind === "NON_NULL" || type.kind === "LIST") {
    return { kind: type.kind, ofType: processTypeRef(type.ofType) };
  }
  return { kind: type.kind, name: type.name };
};

// Process a category of fields (queries, mutations, subscriptions)
const processFields = (fields?: readonly any[]) =>
  fields?.map(({ name, description, args, type }) => ({
    name,
    ...(description && { description }),
    args:
      args?.map(({ name, type, description }: any) => ({
        name,
        type: processTypeRef(type),
        ...(description && { description }),
      })) ?? [],
    type: processTypeRef(type),
  })) ?? [];

// Process a single type
const processType = (type: any) => ({
  name: type.name,
  ...(type.description && { description: type.description }),
  kind: type.kind,
  ...(type.fields && {
    fields: type.fields.map(
      ({ name, description, args, type, deprecationReason }: any) => ({
        name,
        ...(description && { description }),
        args:
          args?.map(({ name, type, description, defaultValue }: any) => ({
            name,
            type: processTypeRef(type),
            ...(description && { description }),
            ...(defaultValue !== undefined && { defaultValue }),
          })) ?? [],
        type: processTypeRef(type),
        ...(deprecationReason && { deprecationReason }),
      })
    ),
  }),
  ...(type.inputFields && {
    inputFields: type.inputFields.map(
      ({ name, description, type, defaultValue }: any) => ({
        name,
        type: processTypeRef(type),
        ...(description && { description }),
        ...(defaultValue !== undefined && { defaultValue }),
      })
    ),
  }),
  ...(type.interfaces && {
    interfaces: type.interfaces.map((i: any) => i.name),
  }),
  ...(type.enumValues && {
    enumValues: type.enumValues.map(
      ({ name, description, deprecationReason }: any) => ({
        name,
        ...(description && { description }),
        ...(deprecationReason && { deprecationReason }),
      })
    ),
  }),
  ...(type.possibleTypes && {
    possibleTypes: type.possibleTypes.map((t: any) => t.name),
  }),
});

const processAndSaveSchema = async () => {
  const SCHEMA_PATH = path.join(
    process.cwd(),
    "graphql",
    "schema-public.graphql"
  );
  const OUTPUT_DIR = path.join(process.cwd(), "generated", "schema");

  try {
    // Read and parse schema
    console.log(`Reading schema from ${SCHEMA_PATH}`);
    const schemaString = await fs.readFile(SCHEMA_PATH, "utf-8");
    const schema: GraphQLSchema = buildSchema(schemaString);
    const introspection = introspectionFromSchema(schema) as IntrospectionQuery;
    const types = introspection.__schema.types;

    // Process schema
    console.log("Processing schema...");
    const processedSchema: ProcessedSchema = {
      // Process regular types
      types: types
        .filter(
          (type) =>
            !type.name.startsWith("__") &&
            !["Query", "Mutation", "Subscription"].includes(type.name)
        )
        .map(processType),

      // Process root types
      queries: processFields(
        (types.find((t) => t.name === "Query") as any)?.fields
      ),
      mutations: processFields(
        (types.find((t) => t.name === "Mutation") as any)?.fields
      ),
      subscriptions: processFields(
        (types.find((t) => t.name === "Subscription") as any)?.fields
      ),

      // Process directives
      directives: introspection.__schema.directives.map(
        ({ name, description, locations, args }) => ({
          name,
          ...(description && { description }),
          locations: [...locations],
          args:
            args?.map(({ name, type, description }) => ({
              name,
              type: processTypeRef(type),
              ...(description && { description }),
            })) ?? [],
        })
      ),
    };

    // Ensure output directory exists
    console.log(`Creating output directory: ${OUTPUT_DIR}`);
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Save files
    console.log("Saving processed schema files...");
    await Promise.all([
      ...Object.entries(processedSchema).map(([category, data]) => {
        const filePath = path.join(OUTPUT_DIR, `${category}.json`);
        console.log(`Writing ${filePath}`);
        return fs.writeFile(filePath, JSON.stringify(data, null, 2));
      }),
      fs.writeFile(
        path.join(OUTPUT_DIR, "manifest.json"),
        JSON.stringify(
          {
            version: "1.0",
            generated: new Date().toISOString(),
            categories: Object.keys(processedSchema),
          },
          null,
          2
        )
      ),
    ]);

    console.log("Schema processing complete!");
    return processedSchema;
  } catch (error) {
    console.error("Error processing schema:", error);
    throw error;
  }
};

export { processAndSaveSchema };

// Execute if this is run directly
if (require.main === module) {
  processAndSaveSchema()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Schema processing failed:", error);
      process.exit(1);
    });
}
