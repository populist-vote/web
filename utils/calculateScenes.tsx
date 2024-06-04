/**
 * Calculates the number of scenes required for a video
 * based on the provided bill summary, bill result data, and sponsors.
 *
 * The function performs the following:
 * 1. Splits the summary into sentences and then into parts where each part
 *    contains no more than 30 words. Each part is considered a scene.
 * 2. Adds an additional scene if there are votes in the bill result.
 * 3. Adds another scene if there are sponsors.
 *
 * The function returns an object containing:
 * - totalInnerScenesCount: Total number of scenes including summary, votes, and sponsors.
 * - summaryScenesCount: Number of scenes derived from the summary.
 */

import type { BillResult, PoliticianResult } from "generated";

export function calculateScenes(billResult: BillResult) {
  const summary =
    billResult?.populistSummary ||
    billResult?.description ||
    billResult?.officialSummary ||
    null;

  const sponsors = billResult?.sponsors as PoliticianResult[];

  let totalInnerScenes = 0;
  let summaryScenes = 0;

  if (summary) {
    const sentences = summary.match(/[^\.!\?]+[\.!\?]+/g) || [];
    const parts = [];
    let currentPart = "";

    sentences.forEach((sentence) => {
      if ((currentPart + sentence).split(" ").length > 30) {
        parts.push(currentPart.trim());
        currentPart = sentence;
      } else {
        currentPart += " " + sentence;
      }
    });

    if (currentPart) {
      parts.push(currentPart.trim());
    }

    summaryScenes = parts.length;
    totalInnerScenes += summaryScenes;
  }

  if (
    billResult?.legiscanData?.votes &&
    billResult.legiscanData?.votes.length > 0
  )
    totalInnerScenes += 1;
  if (sponsors && sponsors.length > 0) totalInnerScenes += 1;

  return {
    totalInnerScenesCount: totalInnerScenes,
    summaryScenesCount: summaryScenes,
  };
}
