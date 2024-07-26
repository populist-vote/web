import { GetServerSideProps } from "next";

const RedirectPage = () => {
  // This page will be redirected, so you can leave it empty
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { dashboardSlug, id } = params as { dashboardSlug: string; id: string };
  const destination = `/dashboard/${dashboardSlug}/embeds/candidate-guide/${id}/manage`;

  return {
    redirect: {
      destination,
      permanent: false, // Set this to true if the redirect is permanent
    },
  };
};

export default RedirectPage;
