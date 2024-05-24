import {
  BillResult,
  PoliticalScope,
  ElectionScope,
  BillStatus,
} from "generated";

export const COMP_NAME = "LegislationVideo";

export type CompositionProps = {
  title: string;
  billTitle: string;
  billResult: BillResult;
  summaryScenesCount: number;
  summary: string;
};

export const defaultMyCompProps: CompositionProps = {
  title: "Default Title",
  billTitle: "Default Bill Title",
  billResult: {
    id: "f0065055-431c-420d-bd94-bc53ca0f51b0",
    slug: "mnhf9172023-2024",
    title:
      "Housing; discrimination based on participation in public assistance prohibited, pet declawing and devocalization prohibited, fees prohibited, inspections required, notice provided, penalties provided, right to counsel provided, lease covenants and repairs in residential tenancy provided, renewal and termination of lease provided, residential evictions provided, and expungements provided.",
    populistTitle: "Housing Rights and Tenant Protections Act",
    description: "Default Description",
    fullTextUrl:
      "https://www.revisor.mn.gov/bills/bill.php?b=House&f=HF0917&ssn=0&y=2023",
    history: {}, // Assuming history is a JSON object, provide a default value
    issueTags: [],
    politicalScope: "NATIONAL" as unknown as PoliticalScope, // Adjusting to valid PoliticalScope value
    publicVotes: {
      support: 0,
      neutral: 0,
      oppose: 0,
    },
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
          state: null, // Adjusting to valid Maybe<State> value
          district: "60B",
          electionScope: "STATE" as unknown as ElectionScope, // Adjusting to valid ElectionScope value
        },
      },
    ],
    status: "PROPOSED" as unknown as BillStatus, // Adjusting to valid BillStatus value
    updatedAt: "2023-01-01T00:00:00Z", // Default DateTime value
    arguments: [],
    session: {
      name: "2023 Regular Session",
      startDate: "2023-01-03",
      endDate: "2024-05-20",
      congressName: "118th Congress", // Added missing properties with default values
      description: "Regular session for the year 2023-2024",
    },
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
          chamberId: 0,
          nv: 0,
          passed: 0,
          rollCallId: 0, // Changed to a valid number
          stateLink: "hi",
          url: "null",
        },
      ],
      // Added missing properties with default values
      amendments: [],
      billId: 5,
      billNumber: "defaultBillNumber",
      billType: "defaultBillType",
    },
  },
  summaryScenesCount: 3,
  summary: "Default Summary",
};

export const DURATION_IN_FRAMES = 200;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 60;
export const SCENE_LENGTH_IN_FRAMES = 4 * VIDEO_FPS; // 4 seconds
export const SUMMARY_SCENE_LENGTH_IN_FRAMES = 5 * VIDEO_FPS; // 5 seconds, more comfortable reading length
