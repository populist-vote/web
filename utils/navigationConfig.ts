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
    { id: "conversations", label: "Conversations", color: "orange" },
    { id: "api", label: "API Reference", color: "violet" },
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
          { label: "Legislation", href: "/docs/content/legislation" },
          {
            label: "Legislation Tracker",
            href: "/docs/content/legislation-tracker",
          },
          { label: "Politician", href: "/docs/content/politician" },
          { label: "Candidate Guide", href: "/docs/content/candidate-guide" },
          { label: "Race", href: "/docs/content/race" },
          { label: "Question", href: "/docs/content/question" },
          { label: "Poll", href: "/docs/content/poll" },
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
      {
        title: "Core Resources",
        items: [
          { label: "Elections", href: "/docs/api/resources/elections" },
          { label: "Politicians", href: "/docs/api/resources/politicians" },
          { label: "Bills", href: "/docs/api/resources/bills" },
        ],
      },
    ],
  },
};
