import type { NextPage } from "next";
import { useRouter } from "next/router";
import { LoaderFlag } from "../../components/LoaderFlag";
import { usePoliticianBySlugQuery } from "../../generated";

const PoliticianPage: NextPage = () => {
    const { query } = useRouter()
    const slug = query.slug as string;
    const {data, isLoading, error} = usePoliticianBySlugQuery({ slug })
    
    if (isLoading) return <LoaderFlag />;

    return <pre>{JSON.stringify(data, null, 4)}</pre>;
}

export default PoliticianPage;