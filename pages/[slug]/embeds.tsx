import { Layout } from "components";
import { useRouter } from "next/router";
import { dashboardNavItems } from "utils/nav";

function Embeds() {
  const router = useRouter();
  const navItems = dashboardNavItems(router);
  return (
    <Layout navItems={navItems}>
      <h1>Embeds</h1>
    </Layout>
  );
}

export default Embeds;
