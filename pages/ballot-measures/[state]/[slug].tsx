import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { LoaderFlag } from 'components';

const BallotMeasurePage: NextPage = () => {
  const { query } = useRouter();
  console.log(query);
  const slug = query.slug as string;

  // if (isLoading) return <LoaderFlag />;

  return <div>Ballot Measure: {slug}</div>;
};

export default BallotMeasurePage;
