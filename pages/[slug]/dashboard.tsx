import { Layout } from "components";
import { dashboardNavItems } from "utils/nav";

export function getServerSideProps({ query }: { query: { slug: string } }) {
  return {
    props: {
      slug: query.slug,
    },
  };
}

function Dashboard({ slug }: { slug: string }) {
  return (
    <Layout navItems={dashboardNavItems(slug)}>
      <h1>Dashboard</h1>
    </Layout>
  );
}

export default Dashboard;
