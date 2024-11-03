import { BasicLayout, LoaderFlag } from "components";
import { Embed } from "../[id]";
import { useRouter } from "next/router";
import { getOriginHost } from "utils/messages";
import { useEmbedByIdQuery, useOrganizationByIdQuery } from "generated";
import Image from "next/image";
import { SupportedLocale } from "types/global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ["auth", "common", "embeds"],
        nextI18nextConfig
      )),
    },
  };
}

export default function EmbedPreview() {
  const { query } = useRouter();
  const { id } = query;
  const origin = window.origin;
  const { originHost } = getOriginHost((query.origin as string) || "");
  const { data } = useEmbedByIdQuery({ id: id as string });
  const organizationId = data?.embedById?.organizationId;
  const { data: organizationData, isLoading } = useOrganizationByIdQuery({
    id: organizationId as string,
  });
  const organization = organizationData?.organizationById;
  const organizationLogoUrl = organization?.assets.bannerImage;

  return (
    <BasicLayout hideHeader withBackdrop>
      {isLoading ? (
        <LoaderFlag />
      ) : (
        <div
          style={{
            maxWidth: "100vw",
            padding: "0.25rem",
            height: "auto",
            margin: "2.5rem auto",
          }}
        >
          {organizationLogoUrl && (
            <Image
              src={organizationLogoUrl as string}
              alt="Organization Logo"
              height={100}
              width={300}
            />
          )}
          <Embed
            embedId={id as string}
            origin={origin}
            originHost={originHost}
          />
        </div>
      )}
    </BasicLayout>
  );
}
