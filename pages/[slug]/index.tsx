import { Layout } from "components";
import { useRouter } from "next/router";
import { dashboardNavItems } from "utils/nav";

export function getServerSideProps({ query }: { query: { slug: string } }) {
  return {
    props: {
      slug: query.slug,
    },
  };
}

function Dashboard({ slug }: { slug: string }) {
  const router = useRouter();
  const navItems = dashboardNavItems(router);

  return (
    <Layout navItems={navItems}>
      <h1>Dashboard</h1>
      <p>Slug: {slug}</p>
    </Layout>
  );
}

export default Dashboard;
