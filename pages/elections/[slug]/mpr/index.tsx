import { NextPage } from "next";
import { useRouter } from "next/router";

const Election: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <div>
      <h1>MPR Test</h1>
      <h3>{slug}</h3>
    </div>
  );
};

export default Election;
