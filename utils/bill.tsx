import { BallotMeasureStatus, BillStatus } from "generated";

const getStatusInfo = (status: BillStatus | BallotMeasureStatus) => {
  switch (status) {
    case BillStatus.BecameLaw:
      return { text: "Became Law", subText: "", color: "--green" };
    case BallotMeasureStatus.BecameLaw:
      return { text: "Became Law", subText: "", color: "--green" };
    case BillStatus.Failed:
      return { text: "Failed", subText: "", color: "--red" };
    case BallotMeasureStatus.Failed:
      return { text: "Failed", subText: "", color: "--red" };
    case BillStatus.Introduced:
      return { text: "Introduced", subText: "", color: "--purple" };
    case BallotMeasureStatus.Introduced:
      return { text: "Introduced", subText: "", color: "--purple" };
    case BillStatus.InConsideration:
      return { text: "In Consideration", subText: "", color: "--orange" };
    case BallotMeasureStatus.InConsideration:
      return { text: "In Consideration", subText: "", color: "--orange" };
    case BallotMeasureStatus.Proposed:
      return { text: "Proposed", subText: "", color: "--blue" };
    case BallotMeasureStatus.GatheringSignatures:
      return { text: "Gathering Signatures", subText: "", color: "--blue" };
    case BallotMeasureStatus.OnTheBallot:
      return { text: "On The Ballot", subText: "", color: "--blue" };
    case BillStatus.Unknown:
      return { text: "Unknown", subText: "", color: "--grey" };
    case BallotMeasureStatus.Unknown:
      return { text: "Unknown", subText: "", color: "--grey" };
    case BillStatus.Vetoed:
      return { text: "Vetoed", subText: "", color: "--red" };
  }
};

export { getStatusInfo };
