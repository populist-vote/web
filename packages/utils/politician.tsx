import { PoliticianResult } from "../../generated";

const computeShortOfficeTitle = (politician: Partial<PoliticianResult>) => {
  const districtDisplay = (includePrefix: boolean, includeDash: boolean) => {
    const district = politician.votesmartCandidateBio?.office?.district;
    if (!district) return "";
    const districtWithPrefix =
      !district || isNaN(+district) || !includePrefix
        ? district
        : `D ${district}`;
    return (includeDash ? " - " : "") + districtWithPrefix;
  };

  const officeTitle =
    politician?.currentOffice?.title ||
    politician?.votesmartCandidateBio?.office?.title ||
    "";
  const officeType =
    politician?.currentOffice?.officeType ||
    politician?.votesmartCandidateBio?.office?.typeField ||
    "";
  const state = politician?.currentOffice?.state || politician?.homeState || "";

  switch (true) {
    case officeType === "State Legislative" &&
      (officeTitle === "Senator" || officeTitle === "State Senate"):
      return `${state} Sen.${districtDisplay(true, true)}`;
    case officeType === "State Legislative" &&
      (officeTitle === "Representative" || officeTitle === "State House"):
      return `${state} Rep.${districtDisplay(true, true)}`;
    case officeType === "Local Executive":
      return `${
        politician.currentOffice?.municipality ?? ""
      } ${officeTitle} - ${state} ${districtDisplay(true, true)}`;
    case officeTitle === "Senator":
      return `U.S. Sen. - ${state} ${districtDisplay(false, false)}`;
    case officeTitle === "Representative":
      return `U.S. Rep. - ${state} ${districtDisplay(false, false)}`;
    case officeType === "Congressional":
      return `${officeTitle
        .replace("House", "Rep.")
        .replace("Senate", "Sen.")} - ${state} ${districtDisplay(
        false,
        false
      )}`;
    default:
      return `${officeTitle} - ${state} ${districtDisplay(false, false)}`;
  }
};

export { computeShortOfficeTitle };
