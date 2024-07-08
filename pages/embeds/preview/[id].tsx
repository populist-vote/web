import { BasicLayout, LoaderFlag } from "components";
import EmbedPage from "../[id]";
import { useRouter } from "next/router";
import { getOriginHost } from "utils/messages";
import { useEmbedByIdQuery, useOrganizationByIdQuery } from "generated";
import Image from "next/image";

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
  const organizationLogoUrl =
    organizationData?.organizationById?.assets.thumbnailImage160;

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
          <Image
            src={organizationLogoUrl as string}
            alt="Organization Logo"
            height={80}
            width={80}
          />
        )}
        <EmbedPage
          embedId={id as string}
          origin={origin}
          originHost={originHost}
        />
      </div>
    </BasicLayout>
  );
}
