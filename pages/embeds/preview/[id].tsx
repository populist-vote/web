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
    <BasicLayout hideHeader hideFooter withBackdrop>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center ",
          height: "calc(100vh - 3rem)",
          flexDirection: "column",
          gap: "3rem",
        }}
      >
        {isLoading ? (
          <LoaderFlag />
        ) : (
          <div style={{ width: "100%", justifyContent: "flex-start" }}>
            {organizationLogoUrl && (
              <Image
                src={organizationLogoUrl as string}
                alt="Organization Logo"
                height={100}
                width={300}
              />
            )}
          </div>
        )}
        <div style={{ width: "720px" }}>
          <Embed
            embedId={id as string}
            origin={origin}
            originHost={originHost}
          />
        </div>
      </div>
    </BasicLayout>
  );
}
