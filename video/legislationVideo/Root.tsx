import { Composition } from "remotion";
import { LegislationVideo } from "./Video";
import "../../styles/main.scss";
import { Bill, BillStatus, State } from "generated";

import { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS } from "../../types/constants";

type PartialBill = Partial<Bill> & {
  id: string;
  slug: string;
  title: string;
  billNumber: string;
  status: BillStatus;
  state: State;
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LegislationVideo"
        component={LegislationVideo}
        durationInFrames={2400}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={{
          billResult: {
            id: "f0065055-431c-420d-bd94-bc53ca0f51b0",
            slug: "mnhf9172023-2024",
            title:
              "Housing; discrimination based on participation in public assistance prohibited, pet declawing and devocalization prohibited, fees prohibited, inspections required, notice provided, penalties provided, right to counsel provided, lease covenants and repairs in residential tenancy provided, renewal and termination of lease provided, residential evictions provided, and expungements provided.",
            populistTitle: "Housing Rights and Tenant Protections Act",
            description: null,
            billNumber: "HF917",
            status: BillStatus.InConsideration,
            state: State.Mn,
            officialSummary: null,
            populistSummary:
              "This bill in Minnesota expands housing protections by prohibiting discrimination based on various factors and banning landlords from requiring pet declawing or devocalization. It also mandates disclosure of all nonoptional fees in lease agreements, implements inspections to prevent security deposit disputes, and provides public housing tenants facing eviction with a right to court-appointed counsel. Additionally, the bill amends statutes concerning lease covenants, tenant removal processes, emergency relief petitions, and eviction procedures, with an effective date of January 1, 2024, for these provisions.",
            fullTextUrl:
              "https://www.revisor.mn.gov/bills/bill.php?b=House&f=HF0917&ssn=0&y=2023",
            legiscanData: {
              votes: [
                {
                  yea: 70,
                  absent: 0,
                  nay: 57,
                  total: 127,
                  date: "2023-04-19",
                  chamber: "H",
                  desc: "House: Passage, as amended",
                  chamberId: 0, // Add appropriate value
                  nv: 0, // Add appropriate value
                  passed: 0, // Add appropriate value
                  rollCallId: 0, // Add appropriate value
                  stateLink: "hi",
                  url: "null",
                },
              ],
            },
            legiscanCommitteeName: null,
            issueTags: [],
            sponsors: [
              {
                id: "55e96d90-d741-4244-9405-7c901bb1828a",
                slug: "mohamud-noor",
                party: {
                  name: "Democratic-Farmer-Labor",
                  id: "party",
                },
                thumbnailImageUrl:
                  "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/politician-thumbnails/mohamud-noor-160.jpg",
                assets: {
                  thumbnailImage160:
                    "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/politician-thumbnails/mohamud-noor-160.jpg",
                },
                fullName: "Mohamud Noor",
                currentOffice: {
                  id: "9bf3d35d-32e4-441a-9d47-992e0dcf7832",
                  officeType: null,
                  state: State.Mn,
                  district: "60B",
                  electionScope: "STATE",
                },
              },
            ],
            session: {
              name: "2023 Regular Session",
              startDate: "2023-01-03",
              endDate: "2024-05-20",
            },
            publicVotes: {
              support: null,
              neutral: null,
              oppose: null,
            },
            usersVote: null,
          } as PartialBill,
          summaryScenesCount: 3,
          summary:
            "This bill in Minnesota expands housing protections by prohibiting discrimination based on various factors and banning landlords from requiring pet declawing or devocalization. It also mandates disclosure of all nonoptional fees in lease agreements, implements inspections to prevent security deposit disputes, and provides public housing tenants facing eviction with a right to court-appointed counsel. Additionally, the bill amends statutes concerning lease covenants, tenant removal processes, emergency relief petitions, and eviction procedures, with an effective date of January 1, 2024, for these provisions.",
        }}
      />
    </>
  );
};
