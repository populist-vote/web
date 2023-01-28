import { Layout } from "components";

export function getServerSideProps({ query }: { query: { slug: string } }) {
  return {
    props: {
      slug: query.slug,
    },
  };
}

function Audience() {
  return (
    <Layout>
      <h1>Audience</h1>
    </Layout>
  );
}

export default Audience;
