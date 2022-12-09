import { LegislationStatus } from "generated";

const getStatusInfo = (status: LegislationStatus) => {
  switch (status) {
    case LegislationStatus.BecameLaw:
      return { text: "Became Law", subText: "", color: "--green" };
    case LegislationStatus.FailedHouse:
      return { text: "Failed", subText: "", color: "--red" };
    case LegislationStatus.FailedSenate:
      return { text: "Failed", subText: "", color: "--red" };
    case LegislationStatus.Introduced:
      return { text: "Introduced", subText: "", color: "--purple" };
    case LegislationStatus.PassedHouse:
      return {
        text: "Passed House",
        subText: "In Consideration",
        color: "--orange",
      };
    case LegislationStatus.PassedSenate:
      return {
        text: "Passed Senate",
        subText: "In Consideration",
        color: "--orange",
      };
    case LegislationStatus.ResolvingDifferences:
      return {
        text: "Resolving Differences",
        subText: "",
        color: "--orange",
      };
    case LegislationStatus.SentToExecutive:
      return { text: "Sent To Executive", subText: "", color: "--orange" };
    case LegislationStatus.Unknown:
      return { text: "Unknown", subText: "", color: "--grey" };
    case LegislationStatus.Vetoed:
      return { text: "Vetoed", subText: "", color: "--red" };
  }
};

export { getStatusInfo };
