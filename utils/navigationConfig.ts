/* eslint-disable @typescript-eslint/no-explicit-any */

import types from "generated/schema/types.json";
import queries from "generated/schema/queries.json";
import mutations from "generated/schema/mutations.json";

// Helper function to group types by their general category
export function groupTypes(types: any[]) {
  return types.reduce((acc, type) => {
    // Common patterns for categorizing types
    let category = "Models";

    if (type.name.endsWith("Input")) {
      category = "Input Types";
    } else if (type.name.endsWith("Payload")) {
      category = "Payloads";
    } else if (type.name.endsWith("Connection") || type.name.endsWith("Edge")) {
      category = "Connections";
    } else if (type.kind === "ENUM") {
      category = "Enums";
    } else if (type.kind === "SCALAR") {
      category = "Scalars";
    }

    acc[category] = acc[category] || [];
    acc[category].push(type);
    return acc;
  }, {});
}

// Generate schema-based navigation sections
export function generateSchemaNavigation() {
  const schemaBasedSections: NavigationSection[] = [];

  // Add Query section if there are queries
  if (queries.length > 0) {
    schemaBasedSections.push({
      title: "Queries",
      items: queries.map((query) => ({
        label: query.name,
        href: `/docs/api/queries#${query.name}`,
      })),
    });
  }

  // Add Mutation section if there are mutations
  if (mutations.length > 0) {
    schemaBasedSections.push({
      title: "Mutations",
      items: mutations.map((mutation) => ({
        label: mutation.name,
        href: `/docs/api/mutations#${mutation.name}`,
      })),
    });
  }

  // Add grouped type sections
  const groupedTypes = groupTypes(types);
  Object.entries(groupedTypes).forEach(([category, typesList]) => {
    schemaBasedSections.push({
      title: category,
      items: (typesList as any).map((type: { name: string }) => ({
        label: type.name,
        href: `/docs/api/types#${type.name}`,
      })),
    });
  });

  return schemaBasedSections;
}

// Type for valid navigation sections
export type NavigationSectionKey = "home" | "content" | "conversations" | "api";

export interface NavigationItem {
  label: string;
  href: string;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export interface NavigationTab {
  id: string;
  label: string;
  color: string;
}

export interface NavigationConfig {
  tabs: NavigationTab[];
  home: {
    sections: NavigationSection[];
  };
  content: {
    sections: NavigationSection[];
  };
  conversations: {
    sections: NavigationSection[];
  };
  api: {
    sections: NavigationSection[];
  };
}

export const navigationConfig: NavigationConfig = {
  tabs: [
    { id: "content", label: "Embed Content", color: "aqua" },
    { id: "conversations", label: "Conversations", color: "aqua" },
    { id: "api", label: "API Reference", color: "aqua" },
  ],
  home: {
    sections: [],
  },
  content: {
    sections: [
      {
        title: "Overview",
        items: [{ label: "What is Populist?", href: "/docs/content/overview" }],
      },
      {
        title: "Content Types",
        items: [
          { label: "Candidate Guides", href: "/docs/content/candidate-guides" },
          { label: "Ballots", href: "/docs/content/ballots" },
          { label: "Legislation", href: "/docs/content/legislation" },
          {
            label: "Legislation Trackers",
            href: "/docs/content/legislation-trackers",
          },
          { label: "Politicians", href: "/docs/content/politicians" },
          { label: "Races", href: "/docs/content/races" },
          { label: "Questions & Polls", href: "/docs/content/questions" },
        ],
      },
    ],
  },
  conversations: {
    sections: [
      {
        title: "Overview",
        items: [
          {
            label: "What is a conversation?",
            href: "/docs/conversations/overview",
          },
          {
            label: "Quickstart",
            href: "/docs/conversations/quickstart",
          },
        ],
      },
      {
        title: "Usage",
        items: [
          {
            label: "Configuration",
            href: "/docs/conversations/configuration",
          },
          {
            label: "Distribution",
            href: "/docs/conversations/distribution",
          },
          {
            label: "Moderation",
            href: "/docs/conversations/moderation",
          },
          {
            label: "Monitoring",
            href: "/docs/conversations/monitoring",
          },
        ],
      },
    ],
  },
  api: {
    sections: [
      {
        title: "Overview",
        items: [
          { label: "Introduction", href: "/docs/api/introduction" },
          { label: "Quickstart", href: "/docs/api/quickstart" },
          { label: "Authentication", href: "/docs/api/auth" },
        ],
      },
      ...generateSchemaNavigation(),
    ],
  },
};
