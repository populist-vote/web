import { Composition } from "remotion";
import { LegislationVideo } from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LegislationVideo"
        component={LegislationVideo}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          billResult: {
            id: "f0065055-431c-420d-bd94-bc53ca0f51b0",
            slug: "mnhf9172023-2024",
            title:
              "Housing; discrimination based on participation in public assistance prohibited, pet declawing and devocalization prohibited, fees prohibited, inspections required, notice provided, penalties provided, right to counsel provided, lease covenants and repairs in residential tenancy provided, renewal and termination of lease provided, residential evictions provided, and expungements provided.",
            populistTitle: "Housing Rights and Tenant Protections Act",
            description: null,
            billNumber: "HF917",
            status: "IN_CONSIDERATION",
            state: "MN",
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
                  state: "MN",
                  district: "60B",
                },
              },
              {
                id: "bd2a1b8c-f3b3-4151-a4fa-8435bdf7bd49",
                slug: "esther-agbaje",
                party: {
                  name: "Democratic-Farmer-Labor",
                },
                thumbnailImageUrl:
                  "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/politician-thumbnails/esther-agbaje-160.jpg",
                assets: {
                  thumbnailImage160:
                    "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/politician-thumbnails/esther-agbaje-160.jpg",
                },
                fullName: "Esther Agbaje",
                currentOffice: {
                  id: "f8c51607-eb84-4016-abce-3e5f1e41af3c",
                  officeType: null,
                  state: "MN",
                  district: "59B",
                },
              },
              {
                id: "d69a0bab-260f-49c7-9c49-dbd636ac9c20",
                slug: "aisha-gomez",
                party: {
                  name: "Democratic-Farmer-Labor",
                },
                thumbnailImageUrl:
                  "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/politician-thumbnails/aisha-gomez-160.jpg",
                assets: {
                  thumbnailImage160:
                    "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/politician-thumbnails/aisha-gomez-160.jpg",
                },
                fullName: "Aisha Gomez",
                currentOffice: {
                  id: "f2e07491-e514-46c5-b0b8-ad1b85c03656",
                  officeType: null,
                  state: "MN",
                  district: "62B",
                },
              },
              {
                id: "e6df17ba-5e31-4743-8076-9bd621cfe888",
                slug: "michael-howard",
                party: {
                  name: "Democratic-Farmer-Labor",
                },
                thumbnailImageUrl:
                  "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/politician-thumbnails/michael-howard-160.jpg",
                assets: {
                  thumbnailImage160:
                    "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/politician-thumbnails/michael-howard-160.jpg",
                },
                fullName: "Michael Howard",
                currentOffice: {
                  id: "9021ffba-3414-4c54-a6b6-1e89a2ed24f9",
                  officeType: null,
                  state: "MN",
                  district: "50A",
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
          },
          summaryScenesCount: 3,
          summary:
            "This bill in Minnesota expands housing protections by prohibiting discrimination based on various factors and banning landlords from requiring pet declawing or devocalization. It also mandates disclosure of all nonoptional fees in lease agreements, implements inspections to prevent security deposit disputes, and provides public housing tenants facing eviction with a right to court-appointed counsel. Additionally, the bill amends statutes concerning lease covenants, tenant removal processes, emergency relief petitions, and eviction procedures, with an effective date of January 1, 2024, for these provisions.",
        }}
      />
    </>
  );
};
