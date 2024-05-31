import { QueryClient, dehydrate } from "@tanstack/react-query";
import type { GetServerSideProps, NextPage } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

import { Player } from "@remotion/player";
import type { BillResult } from "generated";
import { BillBySlugQuery, useBillBySlugQuery } from "generated";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { RenderControls } from "../../../components/Video/RenderControls";
import { calculateScenes } from "../../../utils/calculateScenes";
import { LegislationVideo } from "../../../video/legislationVideo/Video";

import { Layout } from "components";
import nextI18nextConfig from "next-i18next.config";
import { BsChevronLeft } from "react-icons/bs";

import { SupportedLocale } from "types/global";
import billBySlugStyles from "../BillBySlug.module.scss";
import styles from "./CreateVideo.module.scss";

import {
  SCENE_LENGTH_IN_FRAMES,
  SUMMARY_SCENE_LENGTH_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "types/constants";

interface Params extends NextParsedUrlQuery {
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.params as Params;
  const locale = ctx.locale as SupportedLocale;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: useBillBySlugQuery.getKey({ slug }),
    queryFn: useBillBySlugQuery.fetcher({ slug }),
  });
  const state = dehydrate(queryClient);

  const data = state.queries[0]?.state.data as BillBySlugQuery;

  return {
    notFound: state.queries.length === 0 || !data?.billBySlug,
    props: {
      dehydratedState: state,
      mobileNavTitle: data?.billBySlug?.billNumber,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
};

const CreateVideoPage: NextPage = ({
  mobileNavTitle,
}: {
  mobileNavTitle?: string;
}) => {
  const router = useRouter();
  const { slug } = router.query;
  const { data, isLoading, error } = useBillBySlugQuery({
    slug: slug as string,
  });

  const backAction = useCallback(() => {
    const { referrer } = document;
    if (
      referrer === "" ||
      new URL(referrer).origin !== window.location.origin
    ) {
      void router.push("/bills");
    } else {
      router.back();
    }
  }, [router]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;
  if (!data?.billBySlug) return null;

  const billResult = data.billBySlug as BillResult;

  const { totalInnerScenesCount, summaryScenesCount } =
    calculateScenes(billResult);

  const inputProps = {
    billResult: billResult || {},
  };

  return (
    <>
      <Layout mobileNavTitle={mobileNavTitle} showNavLogoOnMobile>
        <nav className={billBySlugStyles.pageHeader}>
          <button className={billBySlugStyles.backLink} onClick={backAction}>
            <BsChevronLeft size={"1.875rem"} />{" "}
            <span>{billResult.billNumber}</span>
          </button>
        </nav>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1>Generate Video Content</h1>

          <p>
            Generate a 9:16 video perfect for sharing on TikTok, Instagram, and
            other social media platforms. Customize your video to suit your
            needs and, when you're ready, click "Generate Video". After the
            video is processed, you can download it directly from the provided
            link.
          </p>

          <div className={styles.videoAndControlsContainer}>
            <div>
              <h3>Preview</h3>
              <div className={styles.playerContainer}>
                <Player
                  component={LegislationVideo}
                  inputProps={{
                    billResult: billResult,
                  }}
                  durationInFrames={
                    (totalInnerScenesCount - summaryScenesCount + 2) *
                      SCENE_LENGTH_IN_FRAMES +
                    summaryScenesCount * SUMMARY_SCENE_LENGTH_IN_FRAMES // Calculates total frames based on the number of innerScenes, summaryScenes, and their respective lengths
                  }
                  fps={VIDEO_FPS}
                  compositionHeight={VIDEO_HEIGHT}
                  compositionWidth={VIDEO_WIDTH}
                  controls
                  autoPlay
                  loop
                  // className={styles.player}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
            <div>
              <h3>Options</h3>
              <div className={styles.playerContainer}>
                <RenderControls inputProps={inputProps}></RenderControls>
              </div>
            </div>
          </div>
        </div>
      </Layout>
      <footer
        className={billBySlugStyles.supportOpposeMobileContainer}
      ></footer>
    </>
  );
};

export default CreateVideoPage;
