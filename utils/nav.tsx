import { NextRouter } from "next/router";

function dashboardNavItems(router: NextRouter) {
  return [
    {
      label: "Dashboard",
      href: `${router.asPath}/dashboard`,
    },
    {
      label: "Embeds",
      href: `${router.asPath}/embeds`,
    },
    {
      label: "Polls",
      href: `${router.asPath}/polls`,
    },
    {
      label: "Audience",
      href: `${router.asPath}/audience`,
    },
  ];
}

export { dashboardNavItems };
