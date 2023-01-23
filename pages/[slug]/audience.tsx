import { Layout } from "components";
import { dashboardNavItems } from "utils/nav";

export function getServerSideProps({ query }: { query: { slug: string } }) {
  return {
    props: {
      slug: query.slug,
    },
  };
}

function Audience({ slug }: { slug: string }) {
  return (
    <Layout navItems={dashboardNavItems(slug)}>
      <h1>Audience</h1>
    </Layout>
  );
}

export default Audience;
