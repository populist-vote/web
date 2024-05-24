import { z } from "zod";

export const COMP_NAME = "LegislationVideo";

export const CompositionProps = z.object({
  title: z.string(),
  billTitle: z.string(),
  billResult: z.object({
    arguments: z.array(z.any()),
    billNumber: z.string(),
    billType: z.any(),
    chamber: z.any().optional(),
    description: z.string().optional(),
    fullTextUrl: z.string().optional(),
    history: z.any(),
    id: z.string(),
    issueTags: z.array(z.any()),
    legiscanBillId: z.number().optional(),
    legiscanCommitteeName: z.string().optional(),
    legiscanData: z.any().optional(),
    legiscanLastAction: z.string().optional(),
    legiscanLastActionDate: z.any().optional(),
    officialSummary: z.string().optional(),
    politicalScope: z.any(),
    populistSummary: z.string().optional(),
    populistTitle: z.string().optional(),
    publicVotes: z.any(),
    session: z.any().optional(),
    sessionId: z.string().optional(),
    slug: z.string(),
    sponsors: z.array(z.any()),
    state: z.any().optional(),
    status: z.any(),
    title: z.string(),
    updatedAt: z.any(),
    usersVote: z.any().optional(),
    votesmartBillId: z.number().optional(),
  }),
  summaryScenesCount: z.number(),
  summary: z.string(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  // title: "Default Title",
  // billTitle: "Default Bill Title",
  billResult: {
    id: "f0065055-431c-420d-bd94-bc53ca0f51b0",
    slug: "mnhf9172023-2024",
    title:
      "Housing; discrimination based on participation in public assistance prohibited, pet declawing and devocalization prohibited, fees prohibited, inspections required, notice provided, penalties provided, right to counsel provided, lease covenants and repairs in residential tenancy provided, renewal and termination of lease provided, residential evictions provided, and expungements provided.",
    populistTitle: "Housing Rights and Tenant Protections Act",
    description: "Default Description",
    billNumber: "HF917",
    billType: "NONE",
    status: "In Consideration",
    state: "CA",
    officialSummary: "Default Official Summary",
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
          chamberId: 0,
          nv: 0,
          passed: 0,
          rollCallId: 0,
          stateLink: "hi",
          url: "null",
        },
      ],
    },
    legiscanCommitteeName: "Hello",
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
          state: "CA",
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
    arguments: [],
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
