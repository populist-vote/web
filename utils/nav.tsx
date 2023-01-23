function dashboardNavItems(basePath: string) {
  return [
    {
      label: "Dashboard",
      href: `/${basePath}/dashboard`,
    },
    {
      label: "Embeds",
      href: `/${basePath}/embeds`,
    },
    {
      label: "Audience",
      href: `/${basePath}/audience`,
    },
  ];
}

export { dashboardNavItems };
