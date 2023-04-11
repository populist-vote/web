import { BallotMeasureStatus, BillStatus } from "generated";

interface StatusInfo {
  text: string;
  subText: string;
  color: "green-support" | "red" | "violet" | "orange" | "blue" | "grey";
  background?: string;
}

const getStatusInfo = (
  status: BillStatus | BallotMeasureStatus
): StatusInfo => {
  switch (status) {
    case BillStatus.BecameLaw:
      return {
        text: "Became Law",
        subText: "",
        color: "green-support",
        background: "green-alpha-1",
      };
    case BallotMeasureStatus.BecameLaw:
      return {
        text: "Became Law",
        subText: "",
        color: "green-support",
        background: "green-alpha-1",
      };
    case BillStatus.Failed:
      return {
        text: "Failed",
        subText: "",
        color: "red",
        background: "red-alpha-1",
      };
    case BallotMeasureStatus.Failed:
      return {
        text: "Failed",
        subText: "",
        color: "red",
        background: "red-alpha-1",
      };
    case BillStatus.Introduced:
      return {
        text: "Introduced",
        subText: "",
        color: "violet",
        background: "violet-alpha-2",
      };
    case BallotMeasureStatus.Introduced:
      return {
        text: "Introduced",
        subText: "",
        color: "violet",
        background: "violet-alpha-2",
      };
    case BillStatus.InConsideration:
      return {
        text: "In Consideration",
        subText: "",
        color: "orange",
        background: "orange-alpha-1",
      };
    case BallotMeasureStatus.InConsideration:
      return {
        text: "In Consideration",
        subText: "",
        color: "orange",
        background: "orange-alpha-1",
      };
    case BallotMeasureStatus.Proposed:
      return {
        text: "Proposed",
        subText: "",
        color: "blue",
        background: "blue-alpha-1",
      };
    case BallotMeasureStatus.GatheringSignatures:
      return {
        text: "Gathering Signatures",
        subText: "",
        color: "blue",
        background: "blue-alpha-1",
      };
    case BallotMeasureStatus.OnTheBallot:
      return {
        text: "On The Ballot",
        subText: "",
        color: "blue",
        background: "blue-alpha-1",
      };
    case BillStatus.Unknown:
      return {
        text: "Unknown",
        subText: "",
        color: "grey",
        background: "grey",
      };
    case BallotMeasureStatus.Unknown:
      return { text: "Unknown", subText: "", color: "grey" };
    case BillStatus.Vetoed:
      return {
        text: "Vetoed",
        subText: "",
        color: "red",
        background: "red-alpha-1",
      };
  }
};

export { getStatusInfo };
