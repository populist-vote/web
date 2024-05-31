import { QueryClient, dehydrate } from "@tanstack/react-query";
import type { GetServerSideProps, NextPage } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { useRouter } from "next/router";
import React, { useCallback, useState, useMemo } from "react";

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

  const [isSummaryChecked, setIsSummaryChecked] = useState(true);
  const [isVotesChecked, setIsVotesChecked] = useState(true);
  const [isSponsorsChecked, setIsSponsorsChecked] = useState(true);

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

  const billResult = data?.billBySlug as BillResult;

  const inputProps = useMemo(() => {
    if (!billResult) return null;

    const updatedBillResult: BillResult = { ...billResult };

    if (!isSummaryChecked) {
      updatedBillResult.populistSummary = undefined;
      updatedBillResult.description = undefined;
      updatedBillResult.officialSummary = undefined;
    }

    if (!isVotesChecked && updatedBillResult.legiscanData) {
      updatedBillResult.legiscanData = {
        ...updatedBillResult.legiscanData,
        votes: [],
      };
    }

    if (!isSponsorsChecked) {
      updatedBillResult.sponsors = [];
    }

    return {
      billResult: updatedBillResult,
    };
  }, [billResult, isSummaryChecked, isVotesChecked, isSponsorsChecked]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;
  if (!data?.billBySlug) return null;

  if (!inputProps) {
    return <div>Loading...</div>;
  }

  const { totalInnerScenesCount, summaryScenesCount } = calculateScenes(
    inputProps?.billResult
  );
  console.log(JSON.stringify(inputProps, null, 2));
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
            needs and, when you're ready, click "Download Video". After the
            video is processed, you can download it directly from the provided
            link.
          </p>

          <div className={styles.videoAndControlsContainer}>
            <div>
              <h3>Preview</h3>
              <div className={styles.playerContainer}>
                <Player
                  key={JSON.stringify({
                    billResult: inputProps.billResult,
                    isSummaryChecked,
                    isVotesChecked,
                    isSponsorsChecked,
                  })}
                  component={LegislationVideo}
                  inputProps={inputProps}
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
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#111",
                  }}
                />
              </div>
            </div>
            <div>
              <h3>Options</h3>
              <div className={styles.optionsContainer}>
                <ul>
                  <li>
                    <input
                      type="checkbox"
                      checked={isSummaryChecked}
                      onChange={(e) => setIsSummaryChecked(e.target.checked)}
                      disabled={
                        !billResult.populistSummary &&
                        !billResult.description &&
                        !billResult.officialSummary
                      }
                    />
                    Summary
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={isVotesChecked}
                      onChange={(e) => setIsVotesChecked(e.target.checked)}
                      disabled={
                        !billResult.legiscanData?.votes ||
                        billResult.legiscanData.votes.length === 0
                      }
                    />
                    Last Votes
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={isSponsorsChecked}
                      onChange={(e) => setIsSponsorsChecked(e.target.checked)}
                      disabled={
                        !billResult.sponsors || billResult.sponsors.length === 0
                      }
                    />
                    Sponsors
                  </li>
                </ul>
              </div>
              <RenderControls inputProps={inputProps}></RenderControls>
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
