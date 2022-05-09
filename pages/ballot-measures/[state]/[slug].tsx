import type { NextPage } from "next";
import { useRouter } from "next/router";

const BallotMeasurePage: NextPage = () => {
  const { query } = useRouter();
  const slug = query.slug as string;

  // if (isLoading) return <LoaderFlag />;

  return <div>Ballot Measure: {slug}</div>;
};

export default BallotMeasurePage;
