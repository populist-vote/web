import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { LoaderFlag } from '../../components/LoaderFlag';

const BillPage: NextPage = () => {
  const { query } = useRouter();
  const slug = query.slug as string;

  // if (isLoading) return <LoaderFlag />;

  return <div>Bill: {slug}</div>;
};

export default BillPage;
