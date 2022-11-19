/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch("https://api.staging.populist.us", {
      method: "POST",
      ...{
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip",
        },
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  };
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  JSON: any;
  NaiveDate: any;
  UUID: any;
  Upload: any;
};

export type AddressExtendedMnResult = {
  __typename?: "AddressExtendedMNResult";
  countyCode?: Maybe<Scalars["String"]>;
  countyCommissionerDistrict?: Maybe<Scalars["String"]>;
  countyName?: Maybe<Scalars["String"]>;
  judicialDistrict?: Maybe<Scalars["String"]>;
  precinctCode?: Maybe<Scalars["String"]>;
  precinctName?: Maybe<Scalars["String"]>;
  schoolDistrictName?: Maybe<Scalars["String"]>;
  schoolDistrictNumber?: Maybe<Scalars["String"]>;
  schoolSubdistrictCode?: Maybe<Scalars["String"]>;
  schoolSubdistrictName?: Maybe<Scalars["String"]>;
  votingTabulationDistrictId?: Maybe<Scalars["String"]>;
};

export type AddressInput = {
  city: Scalars["String"];
  congressionalDistrict?: InputMaybe<Scalars["String"]>;
  coordinates?: InputMaybe<Coordinates>;
  country: Scalars["String"];
  county?: InputMaybe<Scalars["String"]>;
  line1: Scalars["String"];
  line2?: InputMaybe<Scalars["String"]>;
  postalCode: Scalars["String"];
  state: State;
  stateHouseDistrict?: InputMaybe<Scalars["String"]>;
  stateSenateDistrict?: InputMaybe<Scalars["String"]>;
};

export type AddressResult = {
  __typename?: "AddressResult";
  city: Scalars["String"];
  country: Scalars["String"];
  line1: Scalars["String"];
  line2?: Maybe<Scalars["String"]>;
  postalCode: Scalars["String"];
  state: State;
};

export type Amendment = {
  __typename?: "Amendment";
  adopted: Scalars["Int"];
  amendmentId: Scalars["Int"];
  chamber: Scalars["String"];
  chamberId: Scalars["Int"];
  date: Scalars["String"];
  description: Scalars["String"];
  mime: Scalars["String"];
  mimeId: Scalars["Int"];
  stateLink: Scalars["String"];
  title: Scalars["String"];
  url: Scalars["String"];
};

export enum ArgumentPosition {
  Neutral = "NEUTRAL",
  Oppose = "OPPOSE",
  Support = "SUPPORT",
}

export type ArgumentResult = {
  __typename?: "ArgumentResult";
  author: AuthorResult;
  authorId: Scalars["ID"];
  authorType: AuthorType;
  body?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  position: Scalars["String"];
  title: Scalars["String"];
  votes: Scalars["Int"];
};

export type AuthTokenResult = {
  __typename?: "AuthTokenResult";
  email: Scalars["String"];
  id: Scalars["ID"];
  role: Role;
  userProfile: UserResult;
  username: Scalars["String"];
};

export type AuthorResult = OrganizationResult | PoliticianResult;

export enum AuthorType {
  Organization = "ORGANIZATION",
  Politician = "POLITICIAN",
}

export type BallotMeasureResult = {
  __typename?: "BallotMeasureResult";
  arguments: Array<BallotMeasureResult>;
  ballotMeasureCode: Scalars["String"];
  ballotState: State;
  definitions: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  electionId: Scalars["ID"];
  fullTextUrl?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  legislationStatus: LegislationStatus;
  measureType: Scalars["String"];
  officialSummary?: Maybe<Scalars["String"]>;
  populistSummary?: Maybe<Scalars["String"]>;
  slug: Scalars["String"];
  title: Scalars["String"];
};

export type BallotMeasureSearch = {
  ballotState?: InputMaybe<State>;
  legislationStatus?: InputMaybe<LegislationStatus>;
  slug?: InputMaybe<Scalars["String"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type BeginUserRegistrationInput = {
  address: AddressInput;
  email: Scalars["String"];
  password: Scalars["String"];
};

export type Bill = {
  __typename?: "Bill";
  amendments: Array<Amendment>;
  billId: Scalars["Int"];
  billNumber: Scalars["String"];
  billType: Scalars["String"];
  billTypeId: Scalars["String"];
  body: Scalars["String"];
  bodyId: Scalars["Int"];
  calendar: Array<Calendar>;
  changeHash: Scalars["String"];
  committee: Scalars["JSON"];
  completed: Scalars["Int"];
  currentBody: Scalars["String"];
  currentBodyId: Scalars["Int"];
  history: Array<History>;
  pendingCommitteeId: Scalars["Int"];
  progress: Array<Progress>;
  referrals?: Maybe<Array<Referral>>;
  sasts: Array<Sast>;
  session: Session;
  sessionId: Scalars["Int"];
  sponsors: Array<Sponsor>;
  state: Scalars["String"];
  stateId: Scalars["Int"];
  stateLink: Scalars["String"];
  status: Scalars["Int"];
  statusDate?: Maybe<Scalars["String"]>;
  statusType: Scalars["String"];
  subjects: Array<Subject>;
  supplements: Array<Supplement>;
  texts: Array<Text>;
  title: Scalars["String"];
  url: Scalars["String"];
  votes: Array<Vote>;
};

export type BillResult = {
  __typename?: "BillResult";
  arguments: Array<ArgumentResult>;
  billNumber: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  fullTextUrl?: Maybe<Scalars["String"]>;
  history: Scalars["JSON"];
  id: Scalars["ID"];
  legiscanBillId?: Maybe<Scalars["Int"]>;
  legiscanData: Bill;
  legislationStatus: LegislationStatus;
  officialSummary?: Maybe<Scalars["String"]>;
  populistSummary?: Maybe<Scalars["String"]>;
  slug: Scalars["String"];
  title: Scalars["String"];
};

export type BillResultConnection = {
  __typename?: "BillResultConnection";
  /** A list of edges. */
  edges: Array<BillResultEdge>;
  /** A list of nodes. */
  nodes: Array<BillResult>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Total result set count */
  totalCount: Scalars["Int"];
};

/** An edge in a connection. */
export type BillResultEdge = {
  __typename?: "BillResultEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node: BillResult;
};

export type BillSearch = {
  billNumber?: InputMaybe<Scalars["String"]>;
  legislationStatus?: InputMaybe<LegislationStatus>;
  slug?: InputMaybe<Scalars["String"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type Calendar = {
  __typename?: "Calendar";
  date: Scalars["String"];
  description: Scalars["String"];
  location: Scalars["String"];
  time: Scalars["String"];
  typeField: Scalars["String"];
  typeId: Scalars["Int"];
};

export type Candidate = {
  __typename?: "Candidate";
  birthDate: Scalars["String"];
  birthPlace: Scalars["String"];
  candidateId: Scalars["String"];
  congMembership: Scalars["JSON"];
  crpId: Scalars["String"];
  education: Scalars["JSON"];
  family: Scalars["String"];
  firstName: Scalars["String"];
  gender: Scalars["String"];
  homeCity: Scalars["String"];
  homeState: Scalars["String"];
  lastName: Scalars["String"];
  middleName: Scalars["String"];
  nickName: Scalars["String"];
  orgMembership: Scalars["JSON"];
  photo: Scalars["String"];
  political: Scalars["JSON"];
  preferredName: Scalars["String"];
  profession: Scalars["JSON"];
  pronunciation: Scalars["String"];
  religion: Scalars["String"];
  specialMsg: Scalars["String"];
  suffix: Scalars["String"];
};

export enum Chamber {
  House = "HOUSE",
  Senate = "SENATE",
}

export enum Chambers {
  All = "ALL",
  House = "HOUSE",
  Senate = "SENATE",
}

export type Coordinates = {
  latitude: Scalars["Float"];
  longitude: Scalars["Float"];
};

export type CreateArgumentInput = {
  authorId: Scalars["String"];
  body?: InputMaybe<Scalars["String"]>;
  position: ArgumentPosition;
  title: Scalars["String"];
};

export type CreateBallotMeasureInput = {
  ballotMeasureCode: Scalars["String"];
  ballotState: State;
  definitions: Scalars["String"];
  description?: InputMaybe<Scalars["String"]>;
  fullTextUrl?: InputMaybe<Scalars["String"]>;
  legislationStatus: LegislationStatus;
  measureType: Scalars["String"];
  officialSummary?: InputMaybe<Scalars["String"]>;
  populistSummary?: InputMaybe<Scalars["String"]>;
  slug?: InputMaybe<Scalars["String"]>;
  title: Scalars["String"];
};

export type CreateBillInput = {
  arguments?: InputMaybe<Array<CreateArgumentInput>>;
  billNumber: Scalars["String"];
  description?: InputMaybe<Scalars["String"]>;
  fullTextUrl?: InputMaybe<Scalars["String"]>;
  legiscanBillId?: InputMaybe<Scalars["Int"]>;
  legiscanData?: InputMaybe<Scalars["JSON"]>;
  legislationStatus: LegislationStatus;
  officialSummary?: InputMaybe<Scalars["String"]>;
  populistSummary?: InputMaybe<Scalars["String"]>;
  slug?: InputMaybe<Scalars["String"]>;
  title: Scalars["String"];
  votesmartBillId?: InputMaybe<Scalars["Int"]>;
};

export type CreateOrConnectIssueTagInput = {
  connect?: InputMaybe<Array<Scalars["String"]>>;
  create?: InputMaybe<Array<UpsertIssueTagInput>>;
};

export type CreateOrConnectOrganizationInput = {
  connect?: InputMaybe<Array<Scalars["String"]>>;
  create?: InputMaybe<Array<UpsertOrganizationInput>>;
};

export type CreateOrConnectPoliticianInput = {
  connect?: InputMaybe<Array<Scalars["String"]>>;
  create?: InputMaybe<Array<UpsertPoliticianInput>>;
};

export type CreateUserInput = {
  email: Scalars["String"];
  password: Scalars["String"];
  role?: InputMaybe<Role>;
  username: Scalars["String"];
};

export type CreateUserResult = {
  __typename?: "CreateUserResult";
  id: Scalars["ID"];
};

export type DeleteArgumentResult = {
  __typename?: "DeleteArgumentResult";
  id: Scalars["String"];
};

export type DeleteBallotMeasureResult = {
  __typename?: "DeleteBallotMeasureResult";
  id: Scalars["String"];
};

export type DeleteBillResult = {
  __typename?: "DeleteBillResult";
  id: Scalars["String"];
};

export type DeleteElectionResult = {
  __typename?: "DeleteElectionResult";
  id: Scalars["String"];
};

export type DeleteIssueTagResult = {
  __typename?: "DeleteIssueTagResult";
  id: Scalars["String"];
};

export type DeleteOfficeResult = {
  __typename?: "DeleteOfficeResult";
  id: Scalars["String"];
};

export type DeleteOrganizationResult = {
  __typename?: "DeleteOrganizationResult";
  id: Scalars["String"];
};

export type DeletePoliticianResult = {
  __typename?: "DeletePoliticianResult";
  id: Scalars["String"];
};

export type DeleteRaceResult = {
  __typename?: "DeleteRaceResult";
  id: Scalars["String"];
};

export type DeleteVotingGuideResult = {
  __typename?: "DeleteVotingGuideResult";
  id: Scalars["ID"];
};

export enum District {
  City = "CITY",
  County = "COUNTY",
  Hospital = "HOSPITAL",
  Judicial = "JUDICIAL",
  School = "SCHOOL",
  SoilAndWater = "SOIL_AND_WATER",
  StateHouse = "STATE_HOUSE",
  StateSenate = "STATE_SENATE",
  UsCongressional = "US_CONGRESSIONAL",
}

export type DonationsByIndustry = {
  __typename?: "DonationsByIndustry";
  cycle: Scalars["Int"];
  lastUpdated: Scalars["NaiveDate"];
  sectors: Array<Sector>;
  source: Scalars["String"];
};

export type DonationsSummary = {
  __typename?: "DonationsSummary";
  cashOnHand: Scalars["Float"];
  debt: Scalars["Float"];
  lastUpdated: Scalars["NaiveDate"];
  source: Scalars["String"];
  spent: Scalars["Float"];
  totalRaised: Scalars["Float"];
};

export type ElectionResult = {
  __typename?: "ElectionResult";
  description?: Maybe<Scalars["String"]>;
  electionDate: Scalars["NaiveDate"];
  id: Scalars["ID"];
  races: Array<RaceResult>;
  /** Show races relevant to the user based on their address */
  racesByUserDistricts: Array<RaceResult>;
  racesByVotingGuide: Array<RaceResult>;
  slug: Scalars["String"];
  state?: Maybe<State>;
  title: Scalars["String"];
};

export type ElectionResultRacesByVotingGuideArgs = {
  votingGuideId: Scalars["ID"];
};

export enum ElectionScope {
  City = "CITY",
  County = "COUNTY",
  District = "DISTRICT",
  National = "NATIONAL",
  State = "STATE",
}

export type ElectionSearchInput = {
  slug?: InputMaybe<Scalars["String"]>;
  state?: InputMaybe<State>;
  title?: InputMaybe<Scalars["String"]>;
};

export type Endorsements = {
  __typename?: "Endorsements";
  organizations: Array<OrganizationResult>;
  politicians: Array<PoliticianResult>;
};

export type GeneralInfo = {
  __typename?: "GeneralInfo";
  linkBack: Scalars["String"];
  title: Scalars["String"];
};

export type GetCandidateBioResponse = {
  __typename?: "GetCandidateBioResponse";
  candidate: Candidate;
  generalInfo: GeneralInfo;
  office?: Maybe<Office>;
};

export type Heartbeat = {
  __typename?: "Heartbeat";
  utc: Scalars["DateTime"];
};

export type History = {
  __typename?: "History";
  action: Scalars["String"];
  chamber: Scalars["String"];
  chamberId: Scalars["Int"];
  date: Scalars["String"];
  importance: Scalars["Int"];
};

export type IssueTagResult = {
  __typename?: "IssueTagResult";
  ballotMeasures: Array<BallotMeasureResult>;
  bills: Array<BillResult>;
  description?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  organizations: Array<OrganizationResult>;
  politicians: Array<PoliticianResult>;
  slug: Scalars["String"];
};

export type IssueTagSearch = {
  name?: InputMaybe<Scalars["String"]>;
};

export enum LegislationStatus {
  BecameLaw = "BECAME_LAW",
  FailedHouse = "FAILED_HOUSE",
  FailedSenate = "FAILED_SENATE",
  Introduced = "INTRODUCED",
  PassedHouse = "PASSED_HOUSE",
  PassedSenate = "PASSED_SENATE",
  ResolvingDifferences = "RESOLVING_DIFFERENCES",
  SentToExecutive = "SENT_TO_EXECUTIVE",
  Unknown = "UNKNOWN",
  Vetoed = "VETOED",
}

export type LoginInput = {
  emailOrUsername: Scalars["String"];
  password: Scalars["String"];
};

export type LoginResult = {
  __typename?: "LoginResult";
  userId: Scalars["ID"];
};

export type Mutation = {
  __typename?: "Mutation";
  beginUserRegistration: LoginResult;
  confirmUserEmail: Scalars["Boolean"];
  createBallotMeasure: BallotMeasureResult;
  createBill: BillResult;
  createUser: CreateUserResult;
  deleteAccount: Scalars["ID"];
  deleteAccountByEmail: Scalars["ID"];
  deleteArgument: DeleteArgumentResult;
  deleteBallotMeasure: DeleteBallotMeasureResult;
  deleteBill: DeleteBillResult;
  deleteElection: DeleteElectionResult;
  deleteIssueTag: DeleteIssueTagResult;
  deleteOffice: DeleteOfficeResult;
  deleteOrganization: DeleteOrganizationResult;
  deletePolitician: DeletePoliticianResult;
  deleteProfilePicture: Scalars["Boolean"];
  deleteRace: DeleteRaceResult;
  deleteVotingGuide: DeleteVotingGuideResult;
  deleteVotingGuideCandidateNote: VotingGuideCandidateResult;
  downvoteArgument: Scalars["Boolean"];
  login: LoginResult;
  logout: Scalars["Boolean"];
  requestPasswordReset: Scalars["Boolean"];
  resetPassword: Scalars["Boolean"];
  updateAddress: AddressResult;
  updateArgument: ArgumentResult;
  updateBallotMeasure: BallotMeasureResult;
  updateBill: BillResult;
  updateEmail: UpdateEmailResult;
  updateFirstAndLastName: UpdateNameResult;
  updatePassword: Scalars["Boolean"];
  updateUsername: UpdateUsernameResult;
  uploadProfilePicture: Scalars["String"];
  upsertElection: ElectionResult;
  upsertIssueTag: IssueTagResult;
  upsertOffice: OfficeResult;
  upsertOrganization: OrganizationResult;
  upsertPolitician: PoliticianResult;
  upsertRace: RaceResult;
  upsertVotingGuide: VotingGuideResult;
  upsertVotingGuideCandidate: VotingGuideCandidateResult;
  upvoteArgument: Scalars["Boolean"];
};

export type MutationBeginUserRegistrationArgs = {
  input: BeginUserRegistrationInput;
};

export type MutationConfirmUserEmailArgs = {
  confirmationToken: Scalars["String"];
};

export type MutationCreateBallotMeasureArgs = {
  electionId: Scalars["UUID"];
  input: CreateBallotMeasureInput;
};

export type MutationCreateBillArgs = {
  input: CreateBillInput;
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationDeleteAccountByEmailArgs = {
  email: Scalars["String"];
};

export type MutationDeleteArgumentArgs = {
  id: Scalars["String"];
};

export type MutationDeleteBallotMeasureArgs = {
  id: Scalars["String"];
};

export type MutationDeleteBillArgs = {
  id: Scalars["String"];
};

export type MutationDeleteElectionArgs = {
  id: Scalars["String"];
};

export type MutationDeleteIssueTagArgs = {
  id: Scalars["String"];
};

export type MutationDeleteOfficeArgs = {
  id: Scalars["String"];
};

export type MutationDeleteOrganizationArgs = {
  id: Scalars["String"];
};

export type MutationDeletePoliticianArgs = {
  id: Scalars["String"];
};

export type MutationDeleteRaceArgs = {
  id: Scalars["String"];
};

export type MutationDeleteVotingGuideArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteVotingGuideCandidateNoteArgs = {
  candidateId: Scalars["ID"];
  votingGuideId: Scalars["ID"];
};

export type MutationDownvoteArgumentArgs = {
  argumentId: Scalars["ID"];
  populistUserId: Scalars["ID"];
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type MutationRequestPasswordResetArgs = {
  email: Scalars["String"];
};

export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};

export type MutationUpdateAddressArgs = {
  address: AddressInput;
};

export type MutationUpdateArgumentArgs = {
  id: Scalars["ID"];
  input: UpdateArgumentInput;
};

export type MutationUpdateBallotMeasureArgs = {
  id: Scalars["String"];
  input: UpdateBallotMeasureInput;
};

export type MutationUpdateBillArgs = {
  id?: InputMaybe<Scalars["String"]>;
  input: UpdateBillInput;
  legiscanBillId?: InputMaybe<Scalars["Int"]>;
};

export type MutationUpdateEmailArgs = {
  email: Scalars["String"];
};

export type MutationUpdateFirstAndLastNameArgs = {
  firstName: Scalars["String"];
  lastName: Scalars["String"];
};

export type MutationUpdatePasswordArgs = {
  input: UpdatePasswordInput;
};

export type MutationUpdateUsernameArgs = {
  username: Scalars["String"];
};

export type MutationUploadProfilePictureArgs = {
  file: Scalars["Upload"];
};

export type MutationUpsertElectionArgs = {
  input: UpsertElectionInput;
};

export type MutationUpsertIssueTagArgs = {
  input: UpsertIssueTagInput;
};

export type MutationUpsertOfficeArgs = {
  input: UpsertOfficeInput;
};

export type MutationUpsertOrganizationArgs = {
  input: UpsertOrganizationInput;
};

export type MutationUpsertPoliticianArgs = {
  input: UpsertPoliticianInput;
};

export type MutationUpsertRaceArgs = {
  input: UpsertRaceInput;
};

export type MutationUpsertVotingGuideArgs = {
  input: UpsertVotingGuideInput;
};

export type MutationUpsertVotingGuideCandidateArgs = {
  input: UpsertVotingGuideCandidateInput;
};

export type MutationUpvoteArgumentArgs = {
  argumentId: Scalars["ID"];
  populistUserId: Scalars["ID"];
};

export type Office = {
  __typename?: "Office";
  district: Scalars["String"];
  districtId: Scalars["String"];
  firstElect: Scalars["String"];
  lastElect: Scalars["String"];
  name: Array<Scalars["String"]>;
  nextElect: Scalars["String"];
  parties: Scalars["String"];
  shortTitle: Scalars["String"];
  stateId: Scalars["String"];
  status: Scalars["String"];
  termEnd: Scalars["String"];
  termStart: Scalars["String"];
  title: Scalars["String"];
  typeField: Scalars["String"];
};

export type OfficeResult = {
  __typename?: "OfficeResult";
  chamber?: Maybe<Chamber>;
  county?: Maybe<Scalars["String"]>;
  district?: Maybe<Scalars["String"]>;
  districtType?: Maybe<District>;
  electionScope: ElectionScope;
  hospitalDistrict?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  incumbent?: Maybe<PoliticianResult>;
  municipality?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  officeType?: Maybe<Scalars["String"]>;
  politicalScope: PoliticalScope;
  priority?: Maybe<Scalars["Int"]>;
  schoolDistrict?: Maybe<Scalars["String"]>;
  seat?: Maybe<Scalars["String"]>;
  slug: Scalars["String"];
  state?: Maybe<State>;
  subtitle?: Maybe<Scalars["String"]>;
  subtitleShort?: Maybe<Scalars["String"]>;
  termLength?: Maybe<Scalars["Int"]>;
  title: Scalars["String"];
};

export type OfficeSearch = {
  politicalScope?: InputMaybe<PoliticalScope>;
  query?: InputMaybe<Scalars["String"]>;
  state?: InputMaybe<State>;
};

export type OrganizationAssets = {
  __typename?: "OrganizationAssets";
  thumbnailImage160?: Maybe<Scalars["String"]>;
  thumbnailImage400?: Maybe<Scalars["String"]>;
};

export type OrganizationPoliticianNoteResult = {
  __typename?: "OrganizationPoliticianNoteResult";
  createdAt: Scalars["DateTime"];
  electionId: Scalars["ID"];
  id: Scalars["ID"];
  issueTagIds: Array<Scalars["ID"]>;
  issueTags: Array<IssueTagResult>;
  notes: Scalars["JSON"];
  organization: OrganizationResult;
  organizationId: Scalars["ID"];
  politician: PoliticianResult;
  politicianId: Scalars["ID"];
  updatedAt: Scalars["DateTime"];
};

export type OrganizationResult = {
  __typename?: "OrganizationResult";
  assets: OrganizationAssets;
  description?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  facebookUrl?: Maybe<Scalars["String"]>;
  headquartersAddressId?: Maybe<Scalars["ID"]>;
  headquartersPhone?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  instagramUrl?: Maybe<Scalars["String"]>;
  issueTags: Array<IssueTagResult>;
  name: Scalars["String"];
  politicianNotes: Array<OrganizationPoliticianNoteResult>;
  slug: Scalars["String"];
  taxClassification?: Maybe<Scalars["String"]>;
  thumbnailImageUrl?: Maybe<Scalars["String"]>;
  twitterUrl?: Maybe<Scalars["String"]>;
  votesmartSigId?: Maybe<Scalars["Int"]>;
  websiteUrl?: Maybe<Scalars["String"]>;
};

export type OrganizationResultPoliticianNotesArgs = {
  electionId: Scalars["ID"];
};

export type OrganizationResultConnection = {
  __typename?: "OrganizationResultConnection";
  /** A list of edges. */
  edges: Array<OrganizationResultEdge>;
  /** A list of nodes. */
  nodes: Array<OrganizationResult>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Total result set count */
  totalCount: Scalars["Int"];
};

/** An edge in a connection. */
export type OrganizationResultEdge = {
  __typename?: "OrganizationResultEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node: OrganizationResult;
};

export type OrganizationSearch = {
  name?: InputMaybe<Scalars["String"]>;
};

/** Information about pagination in a connection */
export type PageInfo = {
  __typename?: "PageInfo";
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars["String"]>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars["Boolean"];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars["Boolean"];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars["String"]>;
};

export type PasswordEntropyResult = {
  __typename?: "PasswordEntropyResult";
  message?: Maybe<Scalars["String"]>;
  score: Scalars["Int"];
  valid: Scalars["Boolean"];
};

export enum PoliticalParty {
  AmericanConstitution = "AMERICAN_CONSTITUTION",
  ApprovalVoting = "APPROVAL_VOTING",
  ColoradoCenter = "COLORADO_CENTER",
  Constitution = "CONSTITUTION",
  Democratic = "DEMOCRATIC",
  DemocraticFarmerLabor = "DEMOCRATIC_FARMER_LABOR",
  Freedom = "FREEDOM",
  GrassrootsLegalizeCannabis = "GRASSROOTS_LEGALIZE_CANNABIS",
  Green = "GREEN",
  Independent = "INDEPENDENT",
  LegalMarijuanaNow = "LEGAL_MARIJUANA_NOW",
  Libertarian = "LIBERTARIAN",
  Republican = "REPUBLICAN",
  SocialistWorkers = "SOCIALIST_WORKERS",
  Unaffiliated = "UNAFFILIATED",
  Unity = "UNITY",
  Unknown = "UNKNOWN",
}

export enum PoliticalScope {
  Federal = "FEDERAL",
  Local = "LOCAL",
  State = "STATE",
}

export type PoliticianAssets = {
  __typename?: "PoliticianAssets";
  thumbnailImage160?: Maybe<Scalars["String"]>;
  thumbnailImage400?: Maybe<Scalars["String"]>;
};

export type PoliticianFilter = {
  chambers?: InputMaybe<Chambers>;
  homeState?: InputMaybe<State>;
  party?: InputMaybe<PoliticalParty>;
  politicalScope?: InputMaybe<PoliticalScope>;
  query?: InputMaybe<Scalars["String"]>;
};

export type PoliticianResult = {
  __typename?: "PoliticianResult";
  age?: Maybe<Scalars["Int"]>;
  assets: PoliticianAssets;
  biography?: Maybe<Scalars["String"]>;
  biographySource?: Maybe<Scalars["String"]>;
  campaignWebsiteUrl?: Maybe<Scalars["String"]>;
  crpCandidateId?: Maybe<Scalars["String"]>;
  currentOffice?: Maybe<OfficeResult>;
  dateOfBirth?: Maybe<Scalars["NaiveDate"]>;
  donationsByIndustry?: Maybe<DonationsByIndustry>;
  donationsSummary?: Maybe<DonationsSummary>;
  email?: Maybe<Scalars["String"]>;
  endorsements: Endorsements;
  facebookUrl?: Maybe<Scalars["String"]>;
  firstName: Scalars["String"];
  fullName: Scalars["String"];
  homeState?: Maybe<State>;
  id: Scalars["ID"];
  instagramUrl?: Maybe<Scalars["String"]>;
  issueTags: Array<IssueTagResult>;
  lastName: Scalars["String"];
  linkedinUrl?: Maybe<Scalars["String"]>;
  middleName?: Maybe<Scalars["String"]>;
  officeId?: Maybe<Scalars["ID"]>;
  officialWebsiteUrl?: Maybe<Scalars["String"]>;
  party?: Maybe<PoliticalParty>;
  phone?: Maybe<Scalars["String"]>;
  preferredName?: Maybe<Scalars["String"]>;
  raceLosses?: Maybe<Scalars["Int"]>;
  raceWins?: Maybe<Scalars["Int"]>;
  /** Leverages Votesmart ratings data for the time being */
  ratings: RatingResultConnection;
  slug: Scalars["String"];
  sponsoredBills: BillResultConnection;
  suffix?: Maybe<Scalars["String"]>;
  thumbnailImageUrl?: Maybe<Scalars["String"]>;
  tiktokUrl?: Maybe<Scalars["String"]>;
  twitterUrl?: Maybe<Scalars["String"]>;
  upcomingRace?: Maybe<RaceResult>;
  upcomingRaceId?: Maybe<Scalars["ID"]>;
  votes?: Maybe<Scalars["Int"]>;
  votesmartCandidateBio?: Maybe<GetCandidateBioResponse>;
  votesmartCandidateId?: Maybe<Scalars["Int"]>;
  votesmartCandidateRatings: Array<VsRating>;
  /**
   * Calculates the total years a politician has been in office using
   * the votesmart politicial experience array.  Does not take into account
   * objects where the politician is considered a 'candidate'
   */
  yearsInPublicOffice?: Maybe<Scalars["Int"]>;
  youtubeUrl?: Maybe<Scalars["String"]>;
};

export type PoliticianResultRatingsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type PoliticianResultSponsoredBillsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type PoliticianResultVotesArgs = {
  raceId: Scalars["UUID"];
};

export type PoliticianResultConnection = {
  __typename?: "PoliticianResultConnection";
  /** A list of edges. */
  edges: Array<PoliticianResultEdge>;
  /** A list of nodes. */
  nodes: Array<PoliticianResult>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Total result set count */
  totalCount: Scalars["Int"];
};

/** An edge in a connection. */
export type PoliticianResultEdge = {
  __typename?: "PoliticianResultEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node: PoliticianResult;
};

export type Progress = {
  __typename?: "Progress";
  date: Scalars["String"];
  event: Scalars["Int"];
};

export type Query = {
  __typename?: "Query";
  allBallotMeasures: Array<BallotMeasureResult>;
  allIssueTags: Array<IssueTagResult>;
  ballotMeasures: Array<BallotMeasureResult>;
  billBySlug?: Maybe<BillResult>;
  bills: BillResultConnection;
  /** Provides current user based on JWT found in client's access_token cookie */
  currentUser?: Maybe<AuthTokenResult>;
  electionById: ElectionResult;
  electionBySlug: ElectionResult;
  /** Returns a single voting guide for the given election and user */
  electionVotingGuideByUserId?: Maybe<VotingGuideResult>;
  elections: Array<ElectionResult>;
  electionsByUserState: Array<ElectionResult>;
  /** Returns `true` to indicate the GraphQL server is reachable */
  health: Scalars["Boolean"];
  issueTagBySlug: IssueTagResult;
  issueTags: Array<IssueTagResult>;
  nextElection: ElectionResult;
  officeById: OfficeResult;
  officeBySlug: OfficeResult;
  offices: Array<OfficeResult>;
  organizationBySlug: OrganizationResult;
  organizations: OrganizationResultConnection;
  politicianBySlug?: Maybe<PoliticianResult>;
  politicians: PoliticianResultConnection;
  raceById: RaceResult;
  raceBySlug: RaceResult;
  races: Array<RaceResult>;
  /** Get all users */
  userCount?: Maybe<Scalars["Int"]>;
  /** Publicly accessible user information */
  userProfile: UserResult;
  /** Validate that a user does not already exist with this email */
  validateEmailAvailable: Scalars["Boolean"];
  validatePasswordEntropy: PasswordEntropyResult;
  votingGuideById: VotingGuideResult;
  votingGuidesByIds: Array<VotingGuideResult>;
  votingGuidesByUserId: Array<VotingGuideResult>;
};

export type QueryBallotMeasuresArgs = {
  search: BallotMeasureSearch;
};

export type QueryBillBySlugArgs = {
  slug: Scalars["String"];
};

export type QueryBillsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  search?: BillSearch;
};

export type QueryElectionByIdArgs = {
  id: Scalars["ID"];
};

export type QueryElectionBySlugArgs = {
  slug: Scalars["String"];
};

export type QueryElectionVotingGuideByUserIdArgs = {
  electionId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type QueryElectionsArgs = {
  search?: InputMaybe<ElectionSearchInput>;
};

export type QueryIssueTagBySlugArgs = {
  slug: Scalars["String"];
};

export type QueryIssueTagsArgs = {
  search: IssueTagSearch;
};

export type QueryOfficeByIdArgs = {
  id: Scalars["String"];
};

export type QueryOfficeBySlugArgs = {
  slug: Scalars["String"];
};

export type QueryOfficesArgs = {
  search?: InputMaybe<OfficeSearch>;
};

export type QueryOrganizationBySlugArgs = {
  slug: Scalars["String"];
};

export type QueryOrganizationsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  search?: InputMaybe<OrganizationSearch>;
};

export type QueryPoliticianBySlugArgs = {
  slug: Scalars["String"];
};

export type QueryPoliticiansArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  filter?: InputMaybe<PoliticianFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type QueryRaceByIdArgs = {
  id: Scalars["String"];
};

export type QueryRaceBySlugArgs = {
  slug: Scalars["String"];
};

export type QueryRacesArgs = {
  filter?: InputMaybe<RaceFilter>;
};

export type QueryUserCountArgs = {
  filter?: InputMaybe<UserCountFilter>;
};

export type QueryUserProfileArgs = {
  userId: Scalars["ID"];
};

export type QueryValidateEmailAvailableArgs = {
  email: Scalars["String"];
};

export type QueryValidatePasswordEntropyArgs = {
  password: Scalars["String"];
};

export type QueryVotingGuideByIdArgs = {
  id: Scalars["ID"];
};

export type QueryVotingGuidesByIdsArgs = {
  ids: Array<Scalars["ID"]>;
};

export type QueryVotingGuidesByUserIdArgs = {
  userId: Scalars["ID"];
};

export type RaceCandidateResult = {
  __typename?: "RaceCandidateResult";
  candidateId: Scalars["ID"];
  votePercentage?: Maybe<Scalars["Float"]>;
  votes?: Maybe<Scalars["Int"]>;
};

export type RaceFilter = {
  electionScope?: InputMaybe<ElectionScope>;
  officeTitles?: InputMaybe<Array<Scalars["String"]>>;
  politicalScope?: InputMaybe<PoliticalScope>;
  state?: InputMaybe<State>;
};

export type RaceResult = {
  __typename?: "RaceResult";
  ballotpediaLink?: Maybe<Scalars["String"]>;
  candidates: Array<PoliticianResult>;
  description?: Maybe<Scalars["String"]>;
  earlyVotingBeginsDate?: Maybe<Scalars["NaiveDate"]>;
  electionDate?: Maybe<Scalars["NaiveDate"]>;
  electionId?: Maybe<Scalars["ID"]>;
  id: Scalars["ID"];
  office: OfficeResult;
  officeId: Scalars["ID"];
  officialWebsite?: Maybe<Scalars["String"]>;
  party?: Maybe<PoliticalParty>;
  raceType: RaceType;
  results: RaceResultsResult;
  slug: Scalars["String"];
  state?: Maybe<State>;
  title: Scalars["String"];
};

export type RaceResultsResult = {
  __typename?: "RaceResultsResult";
  totalVotes?: Maybe<Scalars["Int"]>;
  votesByCandidate: Array<RaceCandidateResult>;
  winners?: Maybe<Array<PoliticianResult>>;
};

export enum RaceType {
  General = "GENERAL",
  Primary = "PRIMARY",
}

export type RatingResult = {
  __typename?: "RatingResult";
  organization?: Maybe<OrganizationResult>;
  vsRating: VsRating;
};

export type RatingResultConnection = {
  __typename?: "RatingResultConnection";
  /** A list of edges. */
  edges: Array<RatingResultEdge>;
  /** A list of nodes. */
  nodes: Array<RatingResult>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Total result set count */
  totalCount: Scalars["Int"];
};

/** An edge in a connection. */
export type RatingResultEdge = {
  __typename?: "RatingResultEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node: RatingResult;
};

export type Referral = {
  __typename?: "Referral";
  chamber: Scalars["String"];
  chamberId: Scalars["Int"];
  committeeId: Scalars["Int"];
  date: Scalars["String"];
  name: Scalars["String"];
};

export type ResetPasswordInput = {
  newPassword: Scalars["String"];
  resetToken: Scalars["String"];
};

export enum Role {
  Basic = "BASIC",
  Premium = "PREMIUM",
  Staff = "STAFF",
  Superuser = "SUPERUSER",
}

export type RollCall = {
  __typename?: "RollCall";
  absent: Scalars["Int"];
  billId: Scalars["Int"];
  chamber: Scalars["String"];
  chamberId: Scalars["Int"];
  date: Scalars["String"];
  desc: Scalars["String"];
  nay: Scalars["Int"];
  nv: Scalars["Int"];
  passed: Scalars["Int"];
  rollCallId: Scalars["Int"];
  total: Scalars["Int"];
  votes: Array<Vote>;
  yea: Scalars["Int"];
};

export type Sast = {
  __typename?: "Sast";
  sastBillId: Scalars["Int"];
  sastBillNumber: Scalars["String"];
  typeField: Scalars["String"];
  typeId: Scalars["Int"];
};

export type Sector = {
  __typename?: "Sector";
  id: Scalars["String"];
  individuals: Scalars["Int"];
  name: Scalars["String"];
  pacs: Scalars["Int"];
  total: Scalars["Int"];
};

export type Session = {
  __typename?: "Session";
  sessionId: Scalars["Int"];
  sessionName: Scalars["String"];
  sessionTitle: Scalars["String"];
  special: Scalars["Int"];
  yearEnd: Scalars["Int"];
  yearStart: Scalars["Int"];
};

export type Sponsor = {
  __typename?: "Sponsor";
  ballotpedia: Scalars["String"];
  committeeId: Scalars["JSON"];
  committeeSponsor: Scalars["Int"];
  district: Scalars["String"];
  firstName: Scalars["String"];
  ftmEid: Scalars["Int"];
  lastName: Scalars["String"];
  middleName: Scalars["String"];
  name: Scalars["String"];
  nickname: Scalars["String"];
  opensecretsId: Scalars["String"];
  party: Scalars["String"];
  partyId: Scalars["JSON"];
  peopleId: Scalars["Int"];
  personHash: Scalars["String"];
  role: Scalars["String"];
  roleId: Scalars["Int"];
  sponsorOrder: Scalars["Int"];
  sponsorTypeId: Scalars["Int"];
  suffix: Scalars["String"];
  votesmartId: Scalars["Int"];
};

export enum State {
  Ak = "AK",
  Al = "AL",
  Ar = "AR",
  As = "AS",
  Az = "AZ",
  Ca = "CA",
  Co = "CO",
  Ct = "CT",
  Dc = "DC",
  De = "DE",
  Fl = "FL",
  Fm = "FM",
  Ga = "GA",
  Gu = "GU",
  Hi = "HI",
  Ia = "IA",
  Id = "ID",
  Il = "IL",
  In = "IN",
  Ks = "KS",
  Ky = "KY",
  La = "LA",
  Ma = "MA",
  Md = "MD",
  Me = "ME",
  Mh = "MH",
  Mi = "MI",
  Mn = "MN",
  Mo = "MO",
  Mp = "MP",
  Ms = "MS",
  Mt = "MT",
  Nc = "NC",
  Nd = "ND",
  Ne = "NE",
  Nh = "NH",
  Nj = "NJ",
  Nm = "NM",
  Nv = "NV",
  Ny = "NY",
  Oh = "OH",
  Ok = "OK",
  Or = "OR",
  Pa = "PA",
  Pr = "PR",
  Pw = "PW",
  Ri = "RI",
  Sc = "SC",
  Sd = "SD",
  Tn = "TN",
  Tx = "TX",
  Ut = "UT",
  Va = "VA",
  Vi = "VI",
  Vt = "VT",
  Wa = "WA",
  Wi = "WI",
  Wv = "WV",
  Wy = "WY",
}

export type Subject = {
  __typename?: "Subject";
  subjectId: Scalars["Int"];
  subjectName: Scalars["String"];
};

export type Subscription = {
  __typename?: "Subscription";
  /** Heartbeat, containing the UTC timestamp of the last server-sent payload */
  heartbeat: Heartbeat;
};

export type SubscriptionHeartbeatArgs = {
  interval?: Scalars["Int"];
};

export type Supplement = {
  __typename?: "Supplement";
  date: Scalars["String"];
  description: Scalars["String"];
  mime: Scalars["String"];
  mimeId: Scalars["Int"];
  stateLink: Scalars["String"];
  supplementId: Scalars["Int"];
  title: Scalars["String"];
  typeField: Scalars["String"];
  typeId: Scalars["Int"];
  url: Scalars["String"];
};

export type Text = {
  __typename?: "Text";
  date: Scalars["String"];
  docId: Scalars["Int"];
  mime: Scalars["String"];
  mimeId: Scalars["Int"];
  stateLink: Scalars["String"];
  textSize: Scalars["Int"];
  typeField: Scalars["String"];
  typeId: Scalars["Int"];
  url: Scalars["String"];
};

export type UpdateArgumentInput = {
  body?: InputMaybe<Scalars["String"]>;
  position: ArgumentPosition;
  title?: InputMaybe<Scalars["String"]>;
};

export type UpdateBallotMeasureInput = {
  ballotMeasureCode?: InputMaybe<Scalars["String"]>;
  ballotState?: InputMaybe<State>;
  definitions?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  fullTextUrl?: InputMaybe<Scalars["String"]>;
  legislationStatus?: InputMaybe<LegislationStatus>;
  measureType?: InputMaybe<Scalars["String"]>;
  officialSummary?: InputMaybe<Scalars["String"]>;
  populistSummary?: InputMaybe<Scalars["String"]>;
  slug?: InputMaybe<Scalars["String"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type UpdateBillInput = {
  arguments?: InputMaybe<Array<CreateArgumentInput>>;
  billNumber: Scalars["String"];
  description?: InputMaybe<Scalars["String"]>;
  fullTextUrl?: InputMaybe<Scalars["String"]>;
  legiscanBillId?: InputMaybe<Scalars["Int"]>;
  legiscanData?: InputMaybe<Scalars["JSON"]>;
  legislationStatus?: InputMaybe<LegislationStatus>;
  officialSummary?: InputMaybe<Scalars["String"]>;
  populistSummary?: InputMaybe<Scalars["String"]>;
  slug?: InputMaybe<Scalars["String"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type UpdateEmailResult = {
  __typename?: "UpdateEmailResult";
  email: Scalars["String"];
};

export type UpdateNameResult = {
  __typename?: "UpdateNameResult";
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
};

export type UpdatePasswordInput = {
  newPassword: Scalars["String"];
  oldPassword: Scalars["String"];
};

export type UpdateUsernameResult = {
  __typename?: "UpdateUsernameResult";
  username: Scalars["String"];
};

export type UpsertElectionInput = {
  description?: InputMaybe<Scalars["String"]>;
  /** Must use format YYYY-MM-DD */
  electionDate?: InputMaybe<Scalars["NaiveDate"]>;
  id?: InputMaybe<Scalars["UUID"]>;
  slug?: InputMaybe<Scalars["String"]>;
  state?: InputMaybe<State>;
  title?: InputMaybe<Scalars["String"]>;
};

export type UpsertIssueTagInput = {
  category?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["UUID"]>;
  name?: InputMaybe<Scalars["String"]>;
  slug?: InputMaybe<Scalars["String"]>;
};

export type UpsertOfficeInput = {
  chamber?: InputMaybe<Chamber>;
  county?: InputMaybe<Scalars["String"]>;
  district?: InputMaybe<Scalars["String"]>;
  districtType?: InputMaybe<District>;
  electionScope?: InputMaybe<ElectionScope>;
  hospitalDistrict?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["UUID"]>;
  municipality?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  officeType?: InputMaybe<Scalars["String"]>;
  politicalScope?: InputMaybe<PoliticalScope>;
  priority?: InputMaybe<Scalars["Int"]>;
  schoolDistrict?: InputMaybe<Scalars["String"]>;
  seat?: InputMaybe<Scalars["String"]>;
  slug?: InputMaybe<Scalars["String"]>;
  state?: InputMaybe<State>;
  subtitle?: InputMaybe<Scalars["String"]>;
  subtitleShort?: InputMaybe<Scalars["String"]>;
  termLength?: InputMaybe<Scalars["Int"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type UpsertOrganizationInput = {
  assets?: InputMaybe<Scalars["JSON"]>;
  description?: InputMaybe<Scalars["String"]>;
  email?: InputMaybe<Scalars["String"]>;
  facebookUrl?: InputMaybe<Scalars["String"]>;
  headquartersAddressId?: InputMaybe<Scalars["UUID"]>;
  headquartersPhone?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["UUID"]>;
  instagramUrl?: InputMaybe<Scalars["String"]>;
  issueTags?: InputMaybe<CreateOrConnectIssueTagInput>;
  name?: InputMaybe<Scalars["String"]>;
  slug?: InputMaybe<Scalars["String"]>;
  taxClassification?: InputMaybe<Scalars["String"]>;
  thumbnailImageUrl?: InputMaybe<Scalars["String"]>;
  twitterUrl?: InputMaybe<Scalars["String"]>;
  votesmartSigId?: InputMaybe<Scalars["Int"]>;
  websiteUrl?: InputMaybe<Scalars["String"]>;
};

export type UpsertPoliticianInput = {
  assets?: InputMaybe<Scalars["JSON"]>;
  biography?: InputMaybe<Scalars["String"]>;
  biographySource?: InputMaybe<Scalars["String"]>;
  campaignWebsiteUrl?: InputMaybe<Scalars["String"]>;
  crpCandidateId?: InputMaybe<Scalars["String"]>;
  dateOfBirth?: InputMaybe<Scalars["NaiveDate"]>;
  email?: InputMaybe<Scalars["String"]>;
  facebookUrl?: InputMaybe<Scalars["String"]>;
  fecCandidateId?: InputMaybe<Scalars["String"]>;
  firstName?: InputMaybe<Scalars["String"]>;
  homeState?: InputMaybe<State>;
  id?: InputMaybe<Scalars["UUID"]>;
  instagramUrl?: InputMaybe<Scalars["String"]>;
  issueTags?: InputMaybe<CreateOrConnectIssueTagInput>;
  lastName?: InputMaybe<Scalars["String"]>;
  legiscanPeopleId?: InputMaybe<Scalars["Int"]>;
  linkedinUrl?: InputMaybe<Scalars["String"]>;
  middleName?: InputMaybe<Scalars["String"]>;
  officeId?: InputMaybe<Scalars["UUID"]>;
  officialWebsiteUrl?: InputMaybe<Scalars["String"]>;
  organizationEndorsements?: InputMaybe<CreateOrConnectOrganizationInput>;
  party?: InputMaybe<PoliticalParty>;
  phone?: InputMaybe<Scalars["String"]>;
  politicianEndorsements?: InputMaybe<CreateOrConnectPoliticianInput>;
  preferredName?: InputMaybe<Scalars["String"]>;
  raceLosses?: InputMaybe<Scalars["Int"]>;
  raceWins?: InputMaybe<Scalars["Int"]>;
  slug?: InputMaybe<Scalars["String"]>;
  suffix?: InputMaybe<Scalars["String"]>;
  thumbnailImageUrl?: InputMaybe<Scalars["String"]>;
  tiktokUrl?: InputMaybe<Scalars["String"]>;
  twitterUrl?: InputMaybe<Scalars["String"]>;
  upcomingRaceId?: InputMaybe<Scalars["UUID"]>;
  votesmartCandidateBio?: InputMaybe<Scalars["JSON"]>;
  votesmartCandidateId?: InputMaybe<Scalars["Int"]>;
  votesmartCandidateRatings?: InputMaybe<Scalars["JSON"]>;
  youtubeUrl?: InputMaybe<Scalars["String"]>;
};

export type UpsertRaceInput = {
  ballotpediaLink?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  earlyVotingBeginsDate?: InputMaybe<Scalars["NaiveDate"]>;
  electionId?: InputMaybe<Scalars["UUID"]>;
  id?: InputMaybe<Scalars["UUID"]>;
  isSpecialElection: Scalars["Boolean"];
  numElect?: InputMaybe<Scalars["Int"]>;
  officeId?: InputMaybe<Scalars["UUID"]>;
  officialWebsite?: InputMaybe<Scalars["String"]>;
  party?: InputMaybe<PoliticalParty>;
  raceType?: InputMaybe<RaceType>;
  slug?: InputMaybe<Scalars["String"]>;
  state?: InputMaybe<State>;
  title?: InputMaybe<Scalars["String"]>;
  totalVotes?: InputMaybe<Scalars["Int"]>;
  winnerIds?: InputMaybe<Array<Scalars["UUID"]>>;
};

export type UpsertVotingGuideCandidateInput = {
  candidateId: Scalars["ID"];
  isEndorsement?: InputMaybe<Scalars["Boolean"]>;
  note?: InputMaybe<Scalars["String"]>;
  votingGuideId: Scalars["ID"];
};

export type UpsertVotingGuideInput = {
  description?: InputMaybe<Scalars["String"]>;
  electionId: Scalars["ID"];
  id?: InputMaybe<Scalars["ID"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type UserCountFilter = {
  state?: InputMaybe<State>;
};

export type UserResult = {
  __typename?: "UserResult";
  address?: Maybe<AddressResult>;
  addressExtendedMn?: Maybe<AddressExtendedMnResult>;
  email: Scalars["String"];
  firstName?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  lastName?: Maybe<Scalars["String"]>;
  profilePictureUrl?: Maybe<Scalars["String"]>;
  username: Scalars["String"];
};

export type Vote = {
  __typename?: "Vote";
  absent: Scalars["Int"];
  chamber: Scalars["String"];
  chamberId: Scalars["Int"];
  date: Scalars["String"];
  desc: Scalars["String"];
  nay: Scalars["Int"];
  nv: Scalars["Int"];
  passed: Scalars["Int"];
  /** This field is not returned from get_bill, but can be populated with a subsequent call to `get_roll_call` */
  rollCallData?: Maybe<RollCall>;
  rollCallId: Scalars["Int"];
  stateLink: Scalars["String"];
  total: Scalars["Int"];
  url: Scalars["String"];
  yea: Scalars["Int"];
};

export type VotingGuideCandidateResult = {
  __typename?: "VotingGuideCandidateResult";
  candidateId: Scalars["ID"];
  isEndorsement: Scalars["Boolean"];
  note?: Maybe<Scalars["String"]>;
  politician: PoliticianResult;
};

export type VotingGuideResult = {
  __typename?: "VotingGuideResult";
  candidates: Array<VotingGuideCandidateResult>;
  description?: Maybe<Scalars["String"]>;
  election: ElectionResult;
  electionId: Scalars["ID"];
  id: Scalars["ID"];
  title?: Maybe<Scalars["String"]>;
  user: UserResult;
  userId: Scalars["ID"];
};

export type VsRating = {
  __typename?: "VsRating";
  categories: Scalars["JSON"];
  rating: Scalars["JSON"];
  ratingId?: Maybe<Scalars["JSON"]>;
  ratingName: Scalars["String"];
  ratingText: Scalars["String"];
  sigId: Scalars["JSON"];
  timespan: Scalars["JSON"];
};

export type ValidateEmailAvailableQueryVariables = Exact<{
  email: Scalars["String"];
}>;

export type ValidateEmailAvailableQuery = {
  __typename?: "Query";
  validateEmailAvailable: boolean;
};

export type ValidatePasswordEntropyQueryVariables = Exact<{
  password: Scalars["String"];
}>;

export type ValidatePasswordEntropyQuery = {
  __typename?: "Query";
  validatePasswordEntropy: {
    __typename?: "PasswordEntropyResult";
    valid: boolean;
    score: number;
    message?: string | null;
  };
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = {
  __typename?: "Query";
  currentUser?: {
    __typename?: "AuthTokenResult";
    id: string;
    email: string;
    username: string;
    role: Role;
    userProfile: {
      __typename?: "UserResult";
      profilePictureUrl?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      address?: {
        __typename?: "AddressResult";
        city: string;
        country: string;
        line1: string;
        line2?: string | null;
        postalCode: string;
        state: State;
      } | null;
    };
  } | null;
};

export type BeginUserRegistrationMutationVariables = Exact<{
  email: Scalars["String"];
  password: Scalars["String"];
  address: AddressInput;
}>;

export type BeginUserRegistrationMutation = {
  __typename?: "Mutation";
  beginUserRegistration: { __typename?: "LoginResult"; userId: string };
};

export type ConfirmUserEmailMutationVariables = Exact<{
  token: Scalars["String"];
}>;

export type ConfirmUserEmailMutation = {
  __typename?: "Mutation";
  confirmUserEmail: boolean;
};

export type LogInMutationVariables = Exact<{
  emailOrUsername: Scalars["String"];
  password: Scalars["String"];
}>;

export type LogInMutation = {
  __typename?: "Mutation";
  login: { __typename?: "LoginResult"; userId: string };
};

export type RequestPasswordResetMutationVariables = Exact<{
  email: Scalars["String"];
}>;

export type RequestPasswordResetMutation = {
  __typename?: "Mutation";
  requestPasswordReset: boolean;
};

export type ResetPasswordMutationVariables = Exact<{
  newPassword: Scalars["String"];
  resetToken: Scalars["String"];
}>;

export type ResetPasswordMutation = {
  __typename?: "Mutation";
  resetPassword: boolean;
};

export type DeleteAccountByEmailMutationVariables = Exact<{
  email: Scalars["String"];
}>;

export type DeleteAccountByEmailMutation = {
  __typename?: "Mutation";
  deleteAccountByEmail: string;
};

export type UserProfileQueryVariables = Exact<{
  userId: Scalars["ID"];
}>;

export type UserProfileQuery = {
  __typename?: "Query";
  userProfile: {
    __typename?: "UserResult";
    id: string;
    email: string;
    username: string;
    firstName?: string | null;
    lastName?: string | null;
    profilePictureUrl?: string | null;
    address?: {
      __typename?: "AddressResult";
      city: string;
      country: string;
      line1: string;
      line2?: string | null;
      postalCode: string;
      state: State;
    } | null;
  };
};

export type UploadProfilePictureMutationVariables = Exact<{
  file: Scalars["Upload"];
}>;

export type UploadProfilePictureMutation = {
  __typename?: "Mutation";
  uploadProfilePicture: string;
};

export type DeleteProfilePictureMutationVariables = Exact<{
  [key: string]: never;
}>;

export type DeleteProfilePictureMutation = {
  __typename?: "Mutation";
  deleteProfilePicture: boolean;
};

export type UpdateFirstAndLastNameMutationVariables = Exact<{
  firstName: Scalars["String"];
  lastName: Scalars["String"];
}>;

export type UpdateFirstAndLastNameMutation = {
  __typename?: "Mutation";
  updateFirstAndLastName: {
    __typename?: "UpdateNameResult";
    firstName?: string | null;
    lastName?: string | null;
  };
};

export type UpdateUsernameMutationVariables = Exact<{
  username: Scalars["String"];
}>;

export type UpdateUsernameMutation = {
  __typename?: "Mutation";
  updateUsername: { __typename?: "UpdateUsernameResult"; username: string };
};

export type UpdateAddressMutationVariables = Exact<{
  address: AddressInput;
}>;

export type UpdateAddressMutation = {
  __typename?: "Mutation";
  updateAddress: {
    __typename?: "AddressResult";
    city: string;
    country: string;
    state: State;
    line1: string;
    line2?: string | null;
    postalCode: string;
  };
};

export type UpdateEmailMutationVariables = Exact<{
  email: Scalars["String"];
}>;

export type UpdateEmailMutation = {
  __typename?: "Mutation";
  updateEmail: { __typename?: "UpdateEmailResult"; email: string };
};

export type UpdatePasswordMutationVariables = Exact<{
  oldPassword: Scalars["String"];
  newPassword: Scalars["String"];
}>;

export type UpdatePasswordMutation = {
  __typename?: "Mutation";
  updatePassword: boolean;
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation"; logout: boolean };

export type DeleteAccountMutationVariables = Exact<{ [key: string]: never }>;

export type DeleteAccountMutation = {
  __typename?: "Mutation";
  deleteAccount: string;
};

export type UpsertVotingGuideMutationVariables = Exact<{
  id?: InputMaybe<Scalars["ID"]>;
  electionId: Scalars["ID"];
  title?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
}>;

export type UpsertVotingGuideMutation = {
  __typename?: "Mutation";
  upsertVotingGuide: {
    __typename?: "VotingGuideResult";
    id: string;
    electionId: string;
    title?: string | null;
    description?: string | null;
  };
};

export type UpsertVotingGuideCandidateMutationVariables = Exact<{
  votingGuideId: Scalars["ID"];
  candidateId: Scalars["ID"];
  isEndorsement?: InputMaybe<Scalars["Boolean"]>;
  note?: InputMaybe<Scalars["String"]>;
}>;

export type UpsertVotingGuideCandidateMutation = {
  __typename?: "Mutation";
  upsertVotingGuideCandidate: {
    __typename?: "VotingGuideCandidateResult";
    note?: string | null;
    isEndorsement: boolean;
  };
};

export type DeleteVotingGuideCandidateNoteMutationVariables = Exact<{
  votingGuideId: Scalars["ID"];
  candidateId: Scalars["ID"];
}>;

export type DeleteVotingGuideCandidateNoteMutation = {
  __typename?: "Mutation";
  deleteVotingGuideCandidateNote: {
    __typename?: "VotingGuideCandidateResult";
    isEndorsement: boolean;
    note?: string | null;
  };
};

export type UserCountByStateQueryVariables = Exact<{
  state?: InputMaybe<State>;
}>;

export type UserCountByStateQuery = {
  __typename?: "Query";
  userCount?: number | null;
};

export type RaceFieldsFragment = {
  __typename?: "RaceResult";
  id: string;
  raceType: RaceType;
  title: string;
  party?: PoliticalParty | null;
  office: {
    __typename?: "OfficeResult";
    id: string;
    name?: string | null;
    title: string;
    subtitle?: string | null;
    state?: State | null;
    county?: string | null;
    municipality?: string | null;
    district?: string | null;
    electionScope: ElectionScope;
    districtType?: District | null;
    politicalScope: PoliticalScope;
    incumbent?: {
      __typename?: "PoliticianResult";
      id: string;
      fullName: string;
      party?: PoliticalParty | null;
      thumbnailImageUrl?: string | null;
    } | null;
  };
  candidates: Array<{
    __typename?: "PoliticianResult";
    id: string;
    slug: string;
    fullName: string;
    party?: PoliticalParty | null;
    thumbnailImageUrl?: string | null;
  }>;
  results: {
    __typename?: "RaceResultsResult";
    totalVotes?: number | null;
    votesByCandidate: Array<{
      __typename?: "RaceCandidateResult";
      candidateId: string;
      votes?: number | null;
      votePercentage?: number | null;
    }>;
    winners?: Array<{ __typename?: "PoliticianResult"; id: string }> | null;
  };
};

export type ElectionFieldsFragment = {
  __typename?: "ElectionResult";
  id: string;
  title: string;
  description?: string | null;
  electionDate: any;
};

export type ElectionsQueryVariables = Exact<{ [key: string]: never }>;

export type ElectionsQuery = {
  __typename?: "Query";
  electionsByUserState: Array<{
    __typename?: "ElectionResult";
    id: string;
    electionDate: any;
  }>;
};

export type ElectionByIdQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type ElectionByIdQuery = {
  __typename?: "Query";
  electionById: {
    __typename?: "ElectionResult";
    id: string;
    title: string;
    description?: string | null;
    electionDate: any;
    racesByUserDistricts: Array<{
      __typename?: "RaceResult";
      id: string;
      raceType: RaceType;
      title: string;
      party?: PoliticalParty | null;
      office: {
        __typename?: "OfficeResult";
        id: string;
        name?: string | null;
        title: string;
        subtitle?: string | null;
        state?: State | null;
        county?: string | null;
        municipality?: string | null;
        district?: string | null;
        electionScope: ElectionScope;
        districtType?: District | null;
        politicalScope: PoliticalScope;
        incumbent?: {
          __typename?: "PoliticianResult";
          id: string;
          fullName: string;
          party?: PoliticalParty | null;
          thumbnailImageUrl?: string | null;
        } | null;
      };
      candidates: Array<{
        __typename?: "PoliticianResult";
        id: string;
        slug: string;
        fullName: string;
        party?: PoliticalParty | null;
        thumbnailImageUrl?: string | null;
      }>;
      results: {
        __typename?: "RaceResultsResult";
        totalVotes?: number | null;
        votesByCandidate: Array<{
          __typename?: "RaceCandidateResult";
          candidateId: string;
          votes?: number | null;
          votePercentage?: number | null;
        }>;
        winners?: Array<{ __typename?: "PoliticianResult"; id: string }> | null;
      };
    }>;
  };
};

export type ElectionVotingGuideRacesQueryVariables = Exact<{
  electionId: Scalars["ID"];
  votingGuideId: Scalars["ID"];
}>;

export type ElectionVotingGuideRacesQuery = {
  __typename?: "Query";
  electionById: {
    __typename?: "ElectionResult";
    id: string;
    title: string;
    description?: string | null;
    electionDate: any;
    racesByVotingGuide: Array<{
      __typename?: "RaceResult";
      id: string;
      raceType: RaceType;
      title: string;
      party?: PoliticalParty | null;
      office: {
        __typename?: "OfficeResult";
        id: string;
        name?: string | null;
        title: string;
        subtitle?: string | null;
        state?: State | null;
        county?: string | null;
        municipality?: string | null;
        district?: string | null;
        electionScope: ElectionScope;
        districtType?: District | null;
        politicalScope: PoliticalScope;
        incumbent?: {
          __typename?: "PoliticianResult";
          id: string;
          fullName: string;
          party?: PoliticalParty | null;
          thumbnailImageUrl?: string | null;
        } | null;
      };
      candidates: Array<{
        __typename?: "PoliticianResult";
        id: string;
        slug: string;
        fullName: string;
        party?: PoliticalParty | null;
        thumbnailImageUrl?: string | null;
      }>;
      results: {
        __typename?: "RaceResultsResult";
        totalVotes?: number | null;
        votesByCandidate: Array<{
          __typename?: "RaceCandidateResult";
          candidateId: string;
          votes?: number | null;
          votePercentage?: number | null;
        }>;
        winners?: Array<{ __typename?: "PoliticianResult"; id: string }> | null;
      };
    }>;
  };
};

export type BillBySlugQueryVariables = Exact<{
  slug: Scalars["String"];
}>;

export type BillBySlugQuery = {
  __typename?: "Query";
  billBySlug?: {
    __typename?: "BillResult";
    title: string;
    description?: string | null;
    billNumber: string;
    legislationStatus: LegislationStatus;
    officialSummary?: string | null;
    populistSummary?: string | null;
    fullTextUrl?: string | null;
  } | null;
};

export type MprFeaturedRacesQueryVariables = Exact<{ [key: string]: never }>;

export type MprFeaturedRacesQuery = {
  __typename?: "Query";
  races: Array<{
    __typename?: "RaceResult";
    id: string;
    raceType: RaceType;
    title: string;
    party?: PoliticalParty | null;
    office: {
      __typename?: "OfficeResult";
      id: string;
      name?: string | null;
      title: string;
      subtitle?: string | null;
      state?: State | null;
      county?: string | null;
      municipality?: string | null;
      district?: string | null;
      electionScope: ElectionScope;
      districtType?: District | null;
      politicalScope: PoliticalScope;
      incumbent?: {
        __typename?: "PoliticianResult";
        id: string;
        fullName: string;
        party?: PoliticalParty | null;
        thumbnailImageUrl?: string | null;
      } | null;
    };
    candidates: Array<{
      __typename?: "PoliticianResult";
      id: string;
      slug: string;
      fullName: string;
      party?: PoliticalParty | null;
      thumbnailImageUrl?: string | null;
    }>;
    results: {
      __typename?: "RaceResultsResult";
      totalVotes?: number | null;
      votesByCandidate: Array<{
        __typename?: "RaceCandidateResult";
        candidateId: string;
        votes?: number | null;
        votePercentage?: number | null;
      }>;
      winners?: Array<{ __typename?: "PoliticianResult"; id: string }> | null;
    };
  }>;
};

export type ElectionBySlugQueryVariables = Exact<{
  slug: Scalars["String"];
}>;

export type ElectionBySlugQuery = {
  __typename?: "Query";
  electionBySlug: {
    __typename?: "ElectionResult";
    id: string;
    slug: string;
    description?: string | null;
  };
};

export type OrganizationFieldsFragment = {
  __typename?: "OrganizationResult";
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  thumbnailImageUrl?: string | null;
  websiteUrl?: string | null;
  twitterUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  assets: {
    __typename?: "OrganizationAssets";
    thumbnailImage160?: string | null;
    thumbnailImage400?: string | null;
  };
  issueTags: Array<{
    __typename?: "IssueTagResult";
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  }>;
};

export type OrganizationBySlugQueryVariables = Exact<{
  slug: Scalars["String"];
}>;

export type OrganizationBySlugQuery = {
  __typename?: "Query";
  organizationBySlug: {
    __typename?: "OrganizationResult";
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    thumbnailImageUrl?: string | null;
    websiteUrl?: string | null;
    twitterUrl?: string | null;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    assets: {
      __typename?: "OrganizationAssets";
      thumbnailImage160?: string | null;
      thumbnailImage400?: string | null;
    };
    issueTags: Array<{
      __typename?: "IssueTagResult";
      id: string;
      name: string;
      slug: string;
      description?: string | null;
    }>;
  };
};

export type OrganizationPoliticianNotesQueryVariables = Exact<{
  slug: Scalars["String"];
  electionId: Scalars["ID"];
}>;

export type OrganizationPoliticianNotesQuery = {
  __typename?: "Query";
  organizationBySlug: {
    __typename?: "OrganizationResult";
    politicianNotes: Array<{
      __typename?: "OrganizationPoliticianNoteResult";
      id: string;
      notes: any;
      politician: {
        __typename?: "PoliticianResult";
        id: string;
        slug: string;
        fullName: string;
        party?: PoliticalParty | null;
        assets: {
          __typename?: "PoliticianAssets";
          thumbnailImage160?: string | null;
          thumbnailImage400?: string | null;
        };
        upcomingRace?: {
          __typename?: "RaceResult";
          office: {
            __typename?: "OfficeResult";
            slug: string;
            name?: string | null;
            title: string;
            subtitleShort?: string | null;
            priority?: number | null;
            incumbent?: { __typename?: "PoliticianResult"; id: string } | null;
          };
        } | null;
      };
      issueTags: Array<{
        __typename?: "IssueTagResult";
        name: string;
        slug: string;
        id: string;
      }>;
    }>;
  };
};

export type PoliticianIndexQueryVariables = Exact<{
  pageSize?: InputMaybe<Scalars["Int"]>;
  cursor?: InputMaybe<Scalars["String"]>;
  filter?: InputMaybe<PoliticianFilter>;
}>;

export type PoliticianIndexQuery = {
  __typename?: "Query";
  politicians: {
    __typename?: "PoliticianResultConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "PoliticianResultEdge";
      node: {
        __typename?: "PoliticianResult";
        id: string;
        slug: string;
        fullName: string;
        homeState?: State | null;
        party?: PoliticalParty | null;
        thumbnailImageUrl?: string | null;
        currentOffice?: {
          __typename?: "OfficeResult";
          id: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          subtitleShort?: string | null;
          municipality?: string | null;
          district?: string | null;
          state?: State | null;
          officeType?: string | null;
        } | null;
      };
    }>;
    pageInfo: {
      __typename?: "PageInfo";
      hasNextPage: boolean;
      endCursor?: string | null;
    };
  };
};

export type BasicInfoFragment = {
  __typename?: "PoliticianResult";
  id: string;
  fullName: string;
  preferredName?: string | null;
  homeState?: State | null;
  party?: PoliticalParty | null;
  yearsInPublicOffice?: number | null;
  raceWins?: number | null;
  raceLosses?: number | null;
  age?: number | null;
  officialWebsiteUrl?: string | null;
  campaignWebsiteUrl?: string | null;
  twitterUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  youtubeUrl?: string | null;
  linkedinUrl?: string | null;
  thumbnailImageUrl?: string | null;
  votesmartCandidateBio?: {
    __typename?: "GetCandidateBioResponse";
    office?: {
      __typename?: "Office";
      name: Array<string>;
      termStart: string;
      termEnd: string;
    } | null;
    candidate: { __typename?: "Candidate"; photo: string; congMembership: any };
  } | null;
  assets: {
    __typename?: "PoliticianAssets";
    thumbnailImage400?: string | null;
  };
};

export type BioFragment = {
  __typename?: "PoliticianResult";
  biography?: string | null;
  biographySource?: string | null;
};

export type CurrentOfficeFragment = {
  __typename?: "PoliticianResult";
  officeId?: string | null;
  currentOffice?: {
    __typename?: "OfficeResult";
    title: string;
    subtitle?: string | null;
    state?: State | null;
    electionScope: ElectionScope;
    district?: string | null;
    districtType?: District | null;
    municipality?: string | null;
  } | null;
};

export type ElectionInfoFragment = {
  __typename?: "PoliticianResult";
  id: string;
  upcomingRace?: {
    __typename?: "RaceResult";
    title: string;
    raceType: RaceType;
    state?: State | null;
    electionDate?: any | null;
    office: {
      __typename?: "OfficeResult";
      title: string;
      subtitle?: string | null;
      name?: string | null;
      state?: State | null;
      county?: string | null;
      municipality?: string | null;
      district?: string | null;
      schoolDistrict?: string | null;
      districtType?: District | null;
      electionScope: ElectionScope;
    };
    candidates: Array<{
      __typename?: "PoliticianResult";
      id: string;
      slug: string;
      fullName: string;
      thumbnailImageUrl?: string | null;
      party?: PoliticalParty | null;
    }>;
  } | null;
};

export type EndorsementsFragment = {
  __typename?: "PoliticianResult";
  endorsements: {
    __typename?: "Endorsements";
    organizations: Array<{
      __typename?: "OrganizationResult";
      id: string;
      slug: string;
      name: string;
      thumbnailImageUrl?: string | null;
      assets: {
        __typename?: "OrganizationAssets";
        thumbnailImage160?: string | null;
      };
    }>;
    politicians: Array<{
      __typename?: "PoliticianResult";
      id: string;
      slug: string;
      fullName: string;
      homeState?: State | null;
      party?: PoliticalParty | null;
      thumbnailImageUrl?: string | null;
      currentOffice?: {
        __typename?: "OfficeResult";
        id: string;
        slug: string;
        title: string;
        municipality?: string | null;
        district?: string | null;
        state?: State | null;
        officeType?: string | null;
      } | null;
      votesmartCandidateBio?: {
        __typename?: "GetCandidateBioResponse";
        office?: {
          __typename?: "Office";
          name: Array<string>;
          district: string;
          typeField: string;
        } | null;
        candidate: { __typename?: "Candidate"; photo: string };
      } | null;
    }>;
  };
};

export type SponsoredBillsFragment = {
  __typename?: "PoliticianResult";
  sponsoredBills: {
    __typename?: "BillResultConnection";
    edges: Array<{
      __typename?: "BillResultEdge";
      node: {
        __typename?: "BillResult";
        slug: string;
        billNumber: string;
        title: string;
        legislationStatus: LegislationStatus;
      };
    }>;
  };
};

export type RatingsFragment = {
  __typename?: "PoliticianResult";
  ratings: {
    __typename?: "RatingResultConnection";
    edges: Array<{
      __typename?: "RatingResultEdge";
      node: {
        __typename?: "RatingResult";
        vsRating: { __typename?: "VsRating"; rating: any; timespan: any };
        organization?: {
          __typename?: "OrganizationResult";
          slug: string;
          name: string;
          thumbnailImageUrl?: string | null;
          assets: {
            __typename?: "OrganizationAssets";
            thumbnailImage160?: string | null;
          };
        } | null;
      };
    }>;
  };
};

export type FinancialsFragment = {
  __typename?: "PoliticianResult";
  donationsByIndustry?: {
    __typename?: "DonationsByIndustry";
    cycle: number;
    lastUpdated: any;
    source: string;
    sectors: Array<{
      __typename?: "Sector";
      name: string;
      id: string;
      individuals: number;
      pacs: number;
      total: number;
    }>;
  } | null;
  donationsSummary?: {
    __typename?: "DonationsSummary";
    totalRaised: number;
    spent: number;
    cashOnHand: number;
    debt: number;
    source: string;
    lastUpdated: any;
  } | null;
};

export type PoliticianBasicInfoQueryVariables = Exact<{
  slug: Scalars["String"];
}>;

export type PoliticianBasicInfoQuery = {
  __typename?: "Query";
  politicianBySlug?: {
    __typename?: "PoliticianResult";
    id: string;
    fullName: string;
    preferredName?: string | null;
    homeState?: State | null;
    party?: PoliticalParty | null;
    yearsInPublicOffice?: number | null;
    raceWins?: number | null;
    raceLosses?: number | null;
    age?: number | null;
    officialWebsiteUrl?: string | null;
    campaignWebsiteUrl?: string | null;
    twitterUrl?: string | null;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    tiktokUrl?: string | null;
    youtubeUrl?: string | null;
    linkedinUrl?: string | null;
    thumbnailImageUrl?: string | null;
    votesmartCandidateBio?: {
      __typename?: "GetCandidateBioResponse";
      office?: {
        __typename?: "Office";
        name: Array<string>;
        termStart: string;
        termEnd: string;
      } | null;
      candidate: {
        __typename?: "Candidate";
        photo: string;
        congMembership: any;
      };
    } | null;
    assets: {
      __typename?: "PoliticianAssets";
      thumbnailImage400?: string | null;
    };
  } | null;
};

export type PoliticianBioQueryVariables = Exact<{
  slug: Scalars["String"];
}>;

export type PoliticianBioQuery = {
  __typename?: "Query";
  politicianBySlug?: {
    __typename?: "PoliticianResult";
    biography?: string | null;
    biographySource?: string | null;
  } | null;
};

export type PoliticianCurrentOfficeQueryVariables = Exact<{
  slug: Scalars["String"];
}>;

export type PoliticianCurrentOfficeQuery = {
  __typename?: "Query";
  politicianBySlug?: {
    __typename?: "PoliticianResult";
    officeId?: string | null;
    currentOffice?: {
      __typename?: "OfficeResult";
      title: string;
      subtitle?: string | null;
      state?: State | null;
      electionScope: ElectionScope;
      district?: string | null;
      districtType?: District | null;
      municipality?: string | null;
    } | null;
  } | null;
};

export type PoliticianElectionInfoQueryVariables = Exact<{
  slug: Scalars["String"];
}>;

export type PoliticianElectionInfoQuery = {
  __typename?: "Query";
  politicianBySlug?: {
    __typename?: "PoliticianResult";
    id: string;
    upcomingRace?: {
      __typename?: "RaceResult";
      title: string;
      raceType: RaceType;
      state?: State | null;
      electionDate?: any | null;
      office: {
        __typename?: "OfficeResult";
        title: string;
        subtitle?: string | null;
        name?: string | null;
        state?: State | null;
        county?: string | null;
        municipality?: string | null;
        district?: string | null;
        schoolDistrict?: string | null;
        districtType?: District | null;
        electionScope: ElectionScope;
      };
      candidates: Array<{
        __typename?: "PoliticianResult";
        id: string;
        slug: string;
        fullName: string;
        thumbnailImageUrl?: string | null;
        party?: PoliticalParty | null;
      }>;
    } | null;
  } | null;
};

export type PoliticianEndorsementsQueryVariables = Exact<{
  slug: Scalars["String"];
}>;

export type PoliticianEndorsementsQuery = {
  __typename?: "Query";
  politicianBySlug?: {
    __typename?: "PoliticianResult";
    endorsements: {
      __typename?: "Endorsements";
      organizations: Array<{
        __typename?: "OrganizationResult";
        id: string;
        slug: string;
        name: string;
        thumbnailImageUrl?: string | null;
        assets: {
          __typename?: "OrganizationAssets";
          thumbnailImage160?: string | null;
        };
      }>;
      politicians: Array<{
        __typename?: "PoliticianResult";
        id: string;
        slug: string;
        fullName: string;
        homeState?: State | null;
        party?: PoliticalParty | null;
        thumbnailImageUrl?: string | null;
        currentOffice?: {
          __typename?: "OfficeResult";
          id: string;
          slug: string;
          title: string;
          municipality?: string | null;
          district?: string | null;
          state?: State | null;
          officeType?: string | null;
        } | null;
        votesmartCandidateBio?: {
          __typename?: "GetCandidateBioResponse";
          office?: {
            __typename?: "Office";
            name: Array<string>;
            district: string;
            typeField: string;
          } | null;
          candidate: { __typename?: "Candidate"; photo: string };
        } | null;
      }>;
    };
  } | null;
};

export type PoliticianSponsoredBillsQueryVariables = Exact<{
  slug: Scalars["String"];
}>;

export type PoliticianSponsoredBillsQuery = {
  __typename?: "Query";
  politicianBySlug?: {
    __typename?: "PoliticianResult";
    sponsoredBills: {
      __typename?: "BillResultConnection";
      edges: Array<{
        __typename?: "BillResultEdge";
        node: {
          __typename?: "BillResult";
          slug: string;
          billNumber: string;
          title: string;
          legislationStatus: LegislationStatus;
        };
      }>;
    };
  } | null;
};

export type PoliticianRatingsQueryVariables = Exact<{
  slug: Scalars["String"];
}>;

export type PoliticianRatingsQuery = {
  __typename?: "Query";
  politicianBySlug?: {
    __typename?: "PoliticianResult";
    ratings: {
      __typename?: "RatingResultConnection";
      edges: Array<{
        __typename?: "RatingResultEdge";
        node: {
          __typename?: "RatingResult";
          vsRating: { __typename?: "VsRating"; rating: any; timespan: any };
          organization?: {
            __typename?: "OrganizationResult";
            slug: string;
            name: string;
            thumbnailImageUrl?: string | null;
            assets: {
              __typename?: "OrganizationAssets";
              thumbnailImage160?: string | null;
            };
          } | null;
        };
      }>;
    };
  } | null;
};

export type PoliticianFinancialsQueryVariables = Exact<{
  slug: Scalars["String"];
}>;

export type PoliticianFinancialsQuery = {
  __typename?: "Query";
  politicianBySlug?: {
    __typename?: "PoliticianResult";
    donationsByIndustry?: {
      __typename?: "DonationsByIndustry";
      cycle: number;
      lastUpdated: any;
      source: string;
      sectors: Array<{
        __typename?: "Sector";
        name: string;
        id: string;
        individuals: number;
        pacs: number;
        total: number;
      }>;
    } | null;
    donationsSummary?: {
      __typename?: "DonationsSummary";
      totalRaised: number;
      spent: number;
      cashOnHand: number;
      debt: number;
      source: string;
      lastUpdated: any;
    } | null;
  } | null;
};

export type PoliticianBySlugQueryVariables = Exact<{
  slug: Scalars["String"];
}>;

export type PoliticianBySlugQuery = {
  __typename?: "Query";
  politicianBySlug?: {
    __typename?: "PoliticianResult";
    id: string;
    fullName: string;
    preferredName?: string | null;
    homeState?: State | null;
    party?: PoliticalParty | null;
    yearsInPublicOffice?: number | null;
    raceWins?: number | null;
    raceLosses?: number | null;
    age?: number | null;
    officialWebsiteUrl?: string | null;
    campaignWebsiteUrl?: string | null;
    twitterUrl?: string | null;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    tiktokUrl?: string | null;
    youtubeUrl?: string | null;
    linkedinUrl?: string | null;
    thumbnailImageUrl?: string | null;
    biography?: string | null;
    biographySource?: string | null;
    officeId?: string | null;
    votesmartCandidateBio?: {
      __typename?: "GetCandidateBioResponse";
      office?: {
        __typename?: "Office";
        name: Array<string>;
        termStart: string;
        termEnd: string;
      } | null;
      candidate: {
        __typename?: "Candidate";
        photo: string;
        congMembership: any;
      };
    } | null;
    assets: {
      __typename?: "PoliticianAssets";
      thumbnailImage400?: string | null;
    };
    currentOffice?: {
      __typename?: "OfficeResult";
      title: string;
      subtitle?: string | null;
      state?: State | null;
      electionScope: ElectionScope;
      district?: string | null;
      districtType?: District | null;
      municipality?: string | null;
    } | null;
    upcomingRace?: {
      __typename?: "RaceResult";
      title: string;
      raceType: RaceType;
      state?: State | null;
      electionDate?: any | null;
      office: {
        __typename?: "OfficeResult";
        title: string;
        subtitle?: string | null;
        name?: string | null;
        state?: State | null;
        county?: string | null;
        municipality?: string | null;
        district?: string | null;
        schoolDistrict?: string | null;
        districtType?: District | null;
        electionScope: ElectionScope;
      };
      candidates: Array<{
        __typename?: "PoliticianResult";
        id: string;
        slug: string;
        fullName: string;
        thumbnailImageUrl?: string | null;
        party?: PoliticalParty | null;
      }>;
    } | null;
    endorsements: {
      __typename?: "Endorsements";
      organizations: Array<{
        __typename?: "OrganizationResult";
        id: string;
        slug: string;
        name: string;
        thumbnailImageUrl?: string | null;
        assets: {
          __typename?: "OrganizationAssets";
          thumbnailImage160?: string | null;
        };
      }>;
      politicians: Array<{
        __typename?: "PoliticianResult";
        id: string;
        slug: string;
        fullName: string;
        homeState?: State | null;
        party?: PoliticalParty | null;
        thumbnailImageUrl?: string | null;
        currentOffice?: {
          __typename?: "OfficeResult";
          id: string;
          slug: string;
          title: string;
          municipality?: string | null;
          district?: string | null;
          state?: State | null;
          officeType?: string | null;
        } | null;
        votesmartCandidateBio?: {
          __typename?: "GetCandidateBioResponse";
          office?: {
            __typename?: "Office";
            name: Array<string>;
            district: string;
            typeField: string;
          } | null;
          candidate: { __typename?: "Candidate"; photo: string };
        } | null;
      }>;
    };
    sponsoredBills: {
      __typename?: "BillResultConnection";
      edges: Array<{
        __typename?: "BillResultEdge";
        node: {
          __typename?: "BillResult";
          slug: string;
          billNumber: string;
          title: string;
          legislationStatus: LegislationStatus;
        };
      }>;
    };
    ratings: {
      __typename?: "RatingResultConnection";
      edges: Array<{
        __typename?: "RatingResultEdge";
        node: {
          __typename?: "RatingResult";
          vsRating: { __typename?: "VsRating"; rating: any; timespan: any };
          organization?: {
            __typename?: "OrganizationResult";
            slug: string;
            name: string;
            thumbnailImageUrl?: string | null;
            assets: {
              __typename?: "OrganizationAssets";
              thumbnailImage160?: string | null;
            };
          } | null;
        };
      }>;
    };
  } | null;
};

export type GuideFieldsFragment = {
  __typename?: "VotingGuideResult";
  id: string;
  title?: string | null;
  description?: string | null;
  electionId: string;
  user: {
    __typename?: "UserResult";
    id: string;
    username: string;
    lastName?: string | null;
    firstName?: string | null;
    profilePictureUrl?: string | null;
  };
  election: {
    __typename?: "ElectionResult";
    id: string;
    title: string;
    description?: string | null;
    electionDate: any;
  };
  candidates: Array<{
    __typename?: "VotingGuideCandidateResult";
    isEndorsement: boolean;
    note?: string | null;
    politician: { __typename?: "PoliticianResult"; id: string };
  }>;
};

export type VotingGuideByIdQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type VotingGuideByIdQuery = {
  __typename?: "Query";
  votingGuideById: {
    __typename?: "VotingGuideResult";
    id: string;
    title?: string | null;
    description?: string | null;
    electionId: string;
    user: {
      __typename?: "UserResult";
      id: string;
      username: string;
      lastName?: string | null;
      firstName?: string | null;
      profilePictureUrl?: string | null;
    };
    election: {
      __typename?: "ElectionResult";
      id: string;
      title: string;
      description?: string | null;
      electionDate: any;
    };
    candidates: Array<{
      __typename?: "VotingGuideCandidateResult";
      isEndorsement: boolean;
      note?: string | null;
      politician: { __typename?: "PoliticianResult"; id: string };
    }>;
  };
};

export type VotingGuidesByUserIdQueryVariables = Exact<{
  userId: Scalars["ID"];
}>;

export type VotingGuidesByUserIdQuery = {
  __typename?: "Query";
  votingGuidesByUserId: Array<{
    __typename?: "VotingGuideResult";
    id: string;
    title?: string | null;
    description?: string | null;
    electionId: string;
    user: {
      __typename?: "UserResult";
      id: string;
      username: string;
      lastName?: string | null;
      firstName?: string | null;
      profilePictureUrl?: string | null;
    };
    election: {
      __typename?: "ElectionResult";
      id: string;
      title: string;
      description?: string | null;
      electionDate: any;
    };
    candidates: Array<{
      __typename?: "VotingGuideCandidateResult";
      isEndorsement: boolean;
      note?: string | null;
      politician: { __typename?: "PoliticianResult"; id: string };
    }>;
  }>;
};

export type ElectionVotingGuideByUserIdQueryVariables = Exact<{
  electionId: Scalars["ID"];
  userId: Scalars["ID"];
}>;

export type ElectionVotingGuideByUserIdQuery = {
  __typename?: "Query";
  electionVotingGuideByUserId?: {
    __typename?: "VotingGuideResult";
    id: string;
  } | null;
};

export type VotingGuidesByIdsQueryVariables = Exact<{
  ids: Array<Scalars["ID"]> | Scalars["ID"];
}>;

export type VotingGuidesByIdsQuery = {
  __typename?: "Query";
  votingGuidesByIds: Array<{
    __typename?: "VotingGuideResult";
    id: string;
    title?: string | null;
    description?: string | null;
    electionId: string;
    user: {
      __typename?: "UserResult";
      id: string;
      username: string;
      lastName?: string | null;
      firstName?: string | null;
      profilePictureUrl?: string | null;
    };
    election: {
      __typename?: "ElectionResult";
      id: string;
      title: string;
      description?: string | null;
      electionDate: any;
    };
    candidates: Array<{
      __typename?: "VotingGuideCandidateResult";
      isEndorsement: boolean;
      note?: string | null;
      politician: { __typename?: "PoliticianResult"; id: string };
    }>;
  }>;
};

export const RaceFieldsFragmentDoc = /*#__PURE__*/ `
    fragment raceFields on RaceResult {
  id
  raceType
  title
  party
  office {
    id
    name
    title
    subtitle
    state
    county
    municipality
    district
    electionScope
    districtType
    politicalScope
    incumbent {
      id
      fullName
      party
      thumbnailImageUrl
    }
  }
  candidates {
    id
    slug
    fullName
    party
    thumbnailImageUrl
  }
  results {
    votesByCandidate {
      candidateId
      votes
      votePercentage
    }
    totalVotes
    winners {
      id
    }
  }
}
    `;
export const OrganizationFieldsFragmentDoc = /*#__PURE__*/ `
    fragment organizationFields on OrganizationResult {
  id
  name
  slug
  description
  thumbnailImageUrl
  assets {
    thumbnailImage160
    thumbnailImage400
  }
  websiteUrl
  twitterUrl
  facebookUrl
  instagramUrl
  issueTags {
    id
    name
    slug
    description
  }
}
    `;
export const BasicInfoFragmentDoc = /*#__PURE__*/ `
    fragment BasicInfo on PoliticianResult {
  id
  fullName
  preferredName
  homeState
  party
  yearsInPublicOffice
  raceWins
  raceLosses
  age
  officialWebsiteUrl
  campaignWebsiteUrl
  twitterUrl
  facebookUrl
  instagramUrl
  tiktokUrl
  youtubeUrl
  linkedinUrl
  votesmartCandidateBio {
    office {
      name
      termStart
      termEnd
    }
    candidate {
      photo
      congMembership
    }
  }
  thumbnailImageUrl
  assets {
    thumbnailImage400
  }
}
    `;
export const BioFragmentDoc = /*#__PURE__*/ `
    fragment Bio on PoliticianResult {
  biography
  biographySource
}
    `;
export const CurrentOfficeFragmentDoc = /*#__PURE__*/ `
    fragment CurrentOffice on PoliticianResult {
  officeId
  currentOffice {
    title
    subtitle
    state
    electionScope
    district
    districtType
    municipality
  }
}
    `;
export const ElectionInfoFragmentDoc = /*#__PURE__*/ `
    fragment ElectionInfo on PoliticianResult {
  id
  upcomingRace {
    title
    raceType
    state
    electionDate
    office {
      title
      subtitle
      name
      state
      county
      municipality
      district
      schoolDistrict
      districtType
      electionScope
    }
    candidates {
      id
      slug
      fullName
      thumbnailImageUrl
      party
    }
  }
}
    `;
export const EndorsementsFragmentDoc = /*#__PURE__*/ `
    fragment Endorsements on PoliticianResult {
  endorsements {
    organizations {
      id
      slug
      name
      thumbnailImageUrl
      assets {
        thumbnailImage160
      }
    }
    politicians {
      id
      slug
      fullName
      homeState
      party
      thumbnailImageUrl
      currentOffice {
        id
        slug
        title
        municipality
        district
        state
        officeType
      }
      votesmartCandidateBio {
        office {
          name
          district
          typeField
        }
        candidate {
          photo
        }
      }
    }
  }
}
    `;
export const SponsoredBillsFragmentDoc = /*#__PURE__*/ `
    fragment SponsoredBills on PoliticianResult {
  sponsoredBills {
    edges {
      node {
        slug
        billNumber
        title
        legislationStatus
      }
    }
  }
}
    `;
export const RatingsFragmentDoc = /*#__PURE__*/ `
    fragment Ratings on PoliticianResult {
  ratings {
    edges {
      node {
        vsRating {
          rating
          timespan
        }
        organization {
          slug
          name
          thumbnailImageUrl
          assets {
            thumbnailImage160
          }
        }
      }
    }
  }
}
    `;
export const FinancialsFragmentDoc = /*#__PURE__*/ `
    fragment Financials on PoliticianResult {
  donationsByIndustry {
    cycle
    lastUpdated
    sectors {
      name
      id
      individuals
      pacs
      total
    }
    source
  }
  donationsSummary {
    totalRaised
    spent
    cashOnHand
    debt
    source
    lastUpdated
  }
}
    `;
export const ElectionFieldsFragmentDoc = /*#__PURE__*/ `
    fragment electionFields on ElectionResult {
  id
  title
  description
  electionDate
}
    `;
export const GuideFieldsFragmentDoc = /*#__PURE__*/ `
    fragment guideFields on VotingGuideResult {
  id
  title
  description
  electionId
  user {
    id
    username
    lastName
    firstName
    profilePictureUrl
  }
  election {
    ...electionFields
  }
  candidates {
    politician {
      id
    }
    isEndorsement
    note
  }
}
    ${ElectionFieldsFragmentDoc}`;
export const ValidateEmailAvailableDocument = /*#__PURE__*/ `
    query ValidateEmailAvailable($email: String!) {
  validateEmailAvailable(email: $email)
}
    `;
export const useValidateEmailAvailableQuery = <
  TData = ValidateEmailAvailableQuery,
  TError = unknown
>(
  variables: ValidateEmailAvailableQueryVariables,
  options?: UseQueryOptions<ValidateEmailAvailableQuery, TError, TData>
) =>
  useQuery<ValidateEmailAvailableQuery, TError, TData>(
    ["ValidateEmailAvailable", variables],
    fetcher<ValidateEmailAvailableQuery, ValidateEmailAvailableQueryVariables>(
      ValidateEmailAvailableDocument,
      variables
    ),
    options
  );
useValidateEmailAvailableQuery.document = ValidateEmailAvailableDocument;

useValidateEmailAvailableQuery.getKey = (
  variables: ValidateEmailAvailableQueryVariables
) => ["ValidateEmailAvailable", variables];
useValidateEmailAvailableQuery.fetcher = (
  variables: ValidateEmailAvailableQueryVariables
) =>
  fetcher<ValidateEmailAvailableQuery, ValidateEmailAvailableQueryVariables>(
    ValidateEmailAvailableDocument,
    variables
  );
export const ValidatePasswordEntropyDocument = /*#__PURE__*/ `
    query ValidatePasswordEntropy($password: String!) {
  validatePasswordEntropy(password: $password) {
    valid
    score
    message
  }
}
    `;
export const useValidatePasswordEntropyQuery = <
  TData = ValidatePasswordEntropyQuery,
  TError = unknown
>(
  variables: ValidatePasswordEntropyQueryVariables,
  options?: UseQueryOptions<ValidatePasswordEntropyQuery, TError, TData>
) =>
  useQuery<ValidatePasswordEntropyQuery, TError, TData>(
    ["ValidatePasswordEntropy", variables],
    fetcher<
      ValidatePasswordEntropyQuery,
      ValidatePasswordEntropyQueryVariables
    >(ValidatePasswordEntropyDocument, variables),
    options
  );
useValidatePasswordEntropyQuery.document = ValidatePasswordEntropyDocument;

useValidatePasswordEntropyQuery.getKey = (
  variables: ValidatePasswordEntropyQueryVariables
) => ["ValidatePasswordEntropy", variables];
useValidatePasswordEntropyQuery.fetcher = (
  variables: ValidatePasswordEntropyQueryVariables
) =>
  fetcher<ValidatePasswordEntropyQuery, ValidatePasswordEntropyQueryVariables>(
    ValidatePasswordEntropyDocument,
    variables
  );
export const CurrentUserDocument = /*#__PURE__*/ `
    query CurrentUser {
  currentUser {
    id
    email
    username
    userProfile {
      profilePictureUrl
      firstName
      lastName
      address {
        city
        country
        line1
        line2
        postalCode
        state
      }
    }
    role
  }
}
    `;
export const useCurrentUserQuery = <TData = CurrentUserQuery, TError = unknown>(
  variables?: CurrentUserQueryVariables,
  options?: UseQueryOptions<CurrentUserQuery, TError, TData>
) =>
  useQuery<CurrentUserQuery, TError, TData>(
    variables === undefined ? ["CurrentUser"] : ["CurrentUser", variables],
    fetcher<CurrentUserQuery, CurrentUserQueryVariables>(
      CurrentUserDocument,
      variables
    ),
    options
  );
useCurrentUserQuery.document = CurrentUserDocument;

useCurrentUserQuery.getKey = (variables?: CurrentUserQueryVariables) =>
  variables === undefined ? ["CurrentUser"] : ["CurrentUser", variables];
useCurrentUserQuery.fetcher = (variables?: CurrentUserQueryVariables) =>
  fetcher<CurrentUserQuery, CurrentUserQueryVariables>(
    CurrentUserDocument,
    variables
  );
export const BeginUserRegistrationDocument = /*#__PURE__*/ `
    mutation BeginUserRegistration($email: String!, $password: String!, $address: AddressInput!) {
  beginUserRegistration(
    input: {email: $email, password: $password, address: $address}
  ) {
    userId
  }
}
    `;
export const useBeginUserRegistrationMutation = <
  TError = unknown,
  TContext = unknown
>(
  options?: UseMutationOptions<
    BeginUserRegistrationMutation,
    TError,
    BeginUserRegistrationMutationVariables,
    TContext
  >
) =>
  useMutation<
    BeginUserRegistrationMutation,
    TError,
    BeginUserRegistrationMutationVariables,
    TContext
  >(
    ["BeginUserRegistration"],
    (variables?: BeginUserRegistrationMutationVariables) =>
      fetcher<
        BeginUserRegistrationMutation,
        BeginUserRegistrationMutationVariables
      >(BeginUserRegistrationDocument, variables)(),
    options
  );
useBeginUserRegistrationMutation.fetcher = (
  variables: BeginUserRegistrationMutationVariables
) =>
  fetcher<
    BeginUserRegistrationMutation,
    BeginUserRegistrationMutationVariables
  >(BeginUserRegistrationDocument, variables);
export const ConfirmUserEmailDocument = /*#__PURE__*/ `
    mutation ConfirmUserEmail($token: String!) {
  confirmUserEmail(confirmationToken: $token)
}
    `;
export const useConfirmUserEmailMutation = <
  TError = unknown,
  TContext = unknown
>(
  options?: UseMutationOptions<
    ConfirmUserEmailMutation,
    TError,
    ConfirmUserEmailMutationVariables,
    TContext
  >
) =>
  useMutation<
    ConfirmUserEmailMutation,
    TError,
    ConfirmUserEmailMutationVariables,
    TContext
  >(
    ["ConfirmUserEmail"],
    (variables?: ConfirmUserEmailMutationVariables) =>
      fetcher<ConfirmUserEmailMutation, ConfirmUserEmailMutationVariables>(
        ConfirmUserEmailDocument,
        variables
      )(),
    options
  );
useConfirmUserEmailMutation.fetcher = (
  variables: ConfirmUserEmailMutationVariables
) =>
  fetcher<ConfirmUserEmailMutation, ConfirmUserEmailMutationVariables>(
    ConfirmUserEmailDocument,
    variables
  );
export const LogInDocument = /*#__PURE__*/ `
    mutation LogIn($emailOrUsername: String!, $password: String!) {
  login(input: {emailOrUsername: $emailOrUsername, password: $password}) {
    userId
  }
}
    `;
export const useLogInMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    LogInMutation,
    TError,
    LogInMutationVariables,
    TContext
  >
) =>
  useMutation<LogInMutation, TError, LogInMutationVariables, TContext>(
    ["LogIn"],
    (variables?: LogInMutationVariables) =>
      fetcher<LogInMutation, LogInMutationVariables>(
        LogInDocument,
        variables
      )(),
    options
  );
useLogInMutation.fetcher = (variables: LogInMutationVariables) =>
  fetcher<LogInMutation, LogInMutationVariables>(LogInDocument, variables);
export const RequestPasswordResetDocument = /*#__PURE__*/ `
    mutation RequestPasswordReset($email: String!) {
  requestPasswordReset(email: $email)
}
    `;
export const useRequestPasswordResetMutation = <
  TError = unknown,
  TContext = unknown
>(
  options?: UseMutationOptions<
    RequestPasswordResetMutation,
    TError,
    RequestPasswordResetMutationVariables,
    TContext
  >
) =>
  useMutation<
    RequestPasswordResetMutation,
    TError,
    RequestPasswordResetMutationVariables,
    TContext
  >(
    ["RequestPasswordReset"],
    (variables?: RequestPasswordResetMutationVariables) =>
      fetcher<
        RequestPasswordResetMutation,
        RequestPasswordResetMutationVariables
      >(RequestPasswordResetDocument, variables)(),
    options
  );
useRequestPasswordResetMutation.fetcher = (
  variables: RequestPasswordResetMutationVariables
) =>
  fetcher<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>(
    RequestPasswordResetDocument,
    variables
  );
export const ResetPasswordDocument = /*#__PURE__*/ `
    mutation ResetPassword($newPassword: String!, $resetToken: String!) {
  resetPassword(input: {newPassword: $newPassword, resetToken: $resetToken})
}
    `;
export const useResetPasswordMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    ResetPasswordMutation,
    TError,
    ResetPasswordMutationVariables,
    TContext
  >
) =>
  useMutation<
    ResetPasswordMutation,
    TError,
    ResetPasswordMutationVariables,
    TContext
  >(
    ["ResetPassword"],
    (variables?: ResetPasswordMutationVariables) =>
      fetcher<ResetPasswordMutation, ResetPasswordMutationVariables>(
        ResetPasswordDocument,
        variables
      )(),
    options
  );
useResetPasswordMutation.fetcher = (
  variables: ResetPasswordMutationVariables
) =>
  fetcher<ResetPasswordMutation, ResetPasswordMutationVariables>(
    ResetPasswordDocument,
    variables
  );
export const DeleteAccountByEmailDocument = /*#__PURE__*/ `
    mutation DeleteAccountByEmail($email: String!) {
  deleteAccountByEmail(email: $email)
}
    `;
export const useDeleteAccountByEmailMutation = <
  TError = unknown,
  TContext = unknown
>(
  options?: UseMutationOptions<
    DeleteAccountByEmailMutation,
    TError,
    DeleteAccountByEmailMutationVariables,
    TContext
  >
) =>
  useMutation<
    DeleteAccountByEmailMutation,
    TError,
    DeleteAccountByEmailMutationVariables,
    TContext
  >(
    ["DeleteAccountByEmail"],
    (variables?: DeleteAccountByEmailMutationVariables) =>
      fetcher<
        DeleteAccountByEmailMutation,
        DeleteAccountByEmailMutationVariables
      >(DeleteAccountByEmailDocument, variables)(),
    options
  );
useDeleteAccountByEmailMutation.fetcher = (
  variables: DeleteAccountByEmailMutationVariables
) =>
  fetcher<DeleteAccountByEmailMutation, DeleteAccountByEmailMutationVariables>(
    DeleteAccountByEmailDocument,
    variables
  );
export const UserProfileDocument = /*#__PURE__*/ `
    query UserProfile($userId: ID!) {
  userProfile(userId: $userId) {
    id
    email
    username
    firstName
    lastName
    profilePictureUrl
    address {
      city
      country
      line1
      line2
      postalCode
      state
    }
  }
}
    `;
export const useUserProfileQuery = <TData = UserProfileQuery, TError = unknown>(
  variables: UserProfileQueryVariables,
  options?: UseQueryOptions<UserProfileQuery, TError, TData>
) =>
  useQuery<UserProfileQuery, TError, TData>(
    ["UserProfile", variables],
    fetcher<UserProfileQuery, UserProfileQueryVariables>(
      UserProfileDocument,
      variables
    ),
    options
  );
useUserProfileQuery.document = UserProfileDocument;

useUserProfileQuery.getKey = (variables: UserProfileQueryVariables) => [
  "UserProfile",
  variables,
];
useUserProfileQuery.fetcher = (variables: UserProfileQueryVariables) =>
  fetcher<UserProfileQuery, UserProfileQueryVariables>(
    UserProfileDocument,
    variables
  );
export const UploadProfilePictureDocument = /*#__PURE__*/ `
    mutation UploadProfilePicture($file: Upload!) {
  uploadProfilePicture(file: $file)
}
    `;
export const useUploadProfilePictureMutation = <
  TError = unknown,
  TContext = unknown
>(
  options?: UseMutationOptions<
    UploadProfilePictureMutation,
    TError,
    UploadProfilePictureMutationVariables,
    TContext
  >
) =>
  useMutation<
    UploadProfilePictureMutation,
    TError,
    UploadProfilePictureMutationVariables,
    TContext
  >(
    ["UploadProfilePicture"],
    (variables?: UploadProfilePictureMutationVariables) =>
      fetcher<
        UploadProfilePictureMutation,
        UploadProfilePictureMutationVariables
      >(UploadProfilePictureDocument, variables)(),
    options
  );
useUploadProfilePictureMutation.fetcher = (
  variables: UploadProfilePictureMutationVariables
) =>
  fetcher<UploadProfilePictureMutation, UploadProfilePictureMutationVariables>(
    UploadProfilePictureDocument,
    variables
  );
export const DeleteProfilePictureDocument = /*#__PURE__*/ `
    mutation DeleteProfilePicture {
  deleteProfilePicture
}
    `;
export const useDeleteProfilePictureMutation = <
  TError = unknown,
  TContext = unknown
>(
  options?: UseMutationOptions<
    DeleteProfilePictureMutation,
    TError,
    DeleteProfilePictureMutationVariables,
    TContext
  >
) =>
  useMutation<
    DeleteProfilePictureMutation,
    TError,
    DeleteProfilePictureMutationVariables,
    TContext
  >(
    ["DeleteProfilePicture"],
    (variables?: DeleteProfilePictureMutationVariables) =>
      fetcher<
        DeleteProfilePictureMutation,
        DeleteProfilePictureMutationVariables
      >(DeleteProfilePictureDocument, variables)(),
    options
  );
useDeleteProfilePictureMutation.fetcher = (
  variables?: DeleteProfilePictureMutationVariables
) =>
  fetcher<DeleteProfilePictureMutation, DeleteProfilePictureMutationVariables>(
    DeleteProfilePictureDocument,
    variables
  );
export const UpdateFirstAndLastNameDocument = /*#__PURE__*/ `
    mutation UpdateFirstAndLastName($firstName: String!, $lastName: String!) {
  updateFirstAndLastName(firstName: $firstName, lastName: $lastName) {
    firstName
    lastName
  }
}
    `;
export const useUpdateFirstAndLastNameMutation = <
  TError = unknown,
  TContext = unknown
>(
  options?: UseMutationOptions<
    UpdateFirstAndLastNameMutation,
    TError,
    UpdateFirstAndLastNameMutationVariables,
    TContext
  >
) =>
  useMutation<
    UpdateFirstAndLastNameMutation,
    TError,
    UpdateFirstAndLastNameMutationVariables,
    TContext
  >(
    ["UpdateFirstAndLastName"],
    (variables?: UpdateFirstAndLastNameMutationVariables) =>
      fetcher<
        UpdateFirstAndLastNameMutation,
        UpdateFirstAndLastNameMutationVariables
      >(UpdateFirstAndLastNameDocument, variables)(),
    options
  );
useUpdateFirstAndLastNameMutation.fetcher = (
  variables: UpdateFirstAndLastNameMutationVariables
) =>
  fetcher<
    UpdateFirstAndLastNameMutation,
    UpdateFirstAndLastNameMutationVariables
  >(UpdateFirstAndLastNameDocument, variables);
export const UpdateUsernameDocument = /*#__PURE__*/ `
    mutation UpdateUsername($username: String!) {
  updateUsername(username: $username) {
    username
  }
}
    `;
export const useUpdateUsernameMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateUsernameMutation,
    TError,
    UpdateUsernameMutationVariables,
    TContext
  >
) =>
  useMutation<
    UpdateUsernameMutation,
    TError,
    UpdateUsernameMutationVariables,
    TContext
  >(
    ["UpdateUsername"],
    (variables?: UpdateUsernameMutationVariables) =>
      fetcher<UpdateUsernameMutation, UpdateUsernameMutationVariables>(
        UpdateUsernameDocument,
        variables
      )(),
    options
  );
useUpdateUsernameMutation.fetcher = (
  variables: UpdateUsernameMutationVariables
) =>
  fetcher<UpdateUsernameMutation, UpdateUsernameMutationVariables>(
    UpdateUsernameDocument,
    variables
  );
export const UpdateAddressDocument = /*#__PURE__*/ `
    mutation UpdateAddress($address: AddressInput!) {
  updateAddress(address: $address) {
    city
    country
    state
    line1
    line2
    postalCode
  }
}
    `;
export const useUpdateAddressMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateAddressMutation,
    TError,
    UpdateAddressMutationVariables,
    TContext
  >
) =>
  useMutation<
    UpdateAddressMutation,
    TError,
    UpdateAddressMutationVariables,
    TContext
  >(
    ["UpdateAddress"],
    (variables?: UpdateAddressMutationVariables) =>
      fetcher<UpdateAddressMutation, UpdateAddressMutationVariables>(
        UpdateAddressDocument,
        variables
      )(),
    options
  );
useUpdateAddressMutation.fetcher = (
  variables: UpdateAddressMutationVariables
) =>
  fetcher<UpdateAddressMutation, UpdateAddressMutationVariables>(
    UpdateAddressDocument,
    variables
  );
export const UpdateEmailDocument = /*#__PURE__*/ `
    mutation UpdateEmail($email: String!) {
  updateEmail(email: $email) {
    email
  }
}
    `;
export const useUpdateEmailMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateEmailMutation,
    TError,
    UpdateEmailMutationVariables,
    TContext
  >
) =>
  useMutation<
    UpdateEmailMutation,
    TError,
    UpdateEmailMutationVariables,
    TContext
  >(
    ["UpdateEmail"],
    (variables?: UpdateEmailMutationVariables) =>
      fetcher<UpdateEmailMutation, UpdateEmailMutationVariables>(
        UpdateEmailDocument,
        variables
      )(),
    options
  );
useUpdateEmailMutation.fetcher = (variables: UpdateEmailMutationVariables) =>
  fetcher<UpdateEmailMutation, UpdateEmailMutationVariables>(
    UpdateEmailDocument,
    variables
  );
export const UpdatePasswordDocument = /*#__PURE__*/ `
    mutation UpdatePassword($oldPassword: String!, $newPassword: String!) {
  updatePassword(input: {oldPassword: $oldPassword, newPassword: $newPassword})
}
    `;
export const useUpdatePasswordMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdatePasswordMutation,
    TError,
    UpdatePasswordMutationVariables,
    TContext
  >
) =>
  useMutation<
    UpdatePasswordMutation,
    TError,
    UpdatePasswordMutationVariables,
    TContext
  >(
    ["UpdatePassword"],
    (variables?: UpdatePasswordMutationVariables) =>
      fetcher<UpdatePasswordMutation, UpdatePasswordMutationVariables>(
        UpdatePasswordDocument,
        variables
      )(),
    options
  );
useUpdatePasswordMutation.fetcher = (
  variables: UpdatePasswordMutationVariables
) =>
  fetcher<UpdatePasswordMutation, UpdatePasswordMutationVariables>(
    UpdatePasswordDocument,
    variables
  );
export const LogoutDocument = /*#__PURE__*/ `
    mutation Logout {
  logout
}
    `;
export const useLogoutMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    LogoutMutation,
    TError,
    LogoutMutationVariables,
    TContext
  >
) =>
  useMutation<LogoutMutation, TError, LogoutMutationVariables, TContext>(
    ["Logout"],
    (variables?: LogoutMutationVariables) =>
      fetcher<LogoutMutation, LogoutMutationVariables>(
        LogoutDocument,
        variables
      )(),
    options
  );
useLogoutMutation.fetcher = (variables?: LogoutMutationVariables) =>
  fetcher<LogoutMutation, LogoutMutationVariables>(LogoutDocument, variables);
export const DeleteAccountDocument = /*#__PURE__*/ `
    mutation DeleteAccount {
  deleteAccount
}
    `;
export const useDeleteAccountMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    DeleteAccountMutation,
    TError,
    DeleteAccountMutationVariables,
    TContext
  >
) =>
  useMutation<
    DeleteAccountMutation,
    TError,
    DeleteAccountMutationVariables,
    TContext
  >(
    ["DeleteAccount"],
    (variables?: DeleteAccountMutationVariables) =>
      fetcher<DeleteAccountMutation, DeleteAccountMutationVariables>(
        DeleteAccountDocument,
        variables
      )(),
    options
  );
useDeleteAccountMutation.fetcher = (
  variables?: DeleteAccountMutationVariables
) =>
  fetcher<DeleteAccountMutation, DeleteAccountMutationVariables>(
    DeleteAccountDocument,
    variables
  );
export const UpsertVotingGuideDocument = /*#__PURE__*/ `
    mutation UpsertVotingGuide($id: ID, $electionId: ID!, $title: String, $description: String) {
  upsertVotingGuide(
    input: {id: $id, electionId: $electionId, title: $title, description: $description}
  ) {
    id
    electionId
    title
    description
  }
}
    `;
export const useUpsertVotingGuideMutation = <
  TError = unknown,
  TContext = unknown
>(
  options?: UseMutationOptions<
    UpsertVotingGuideMutation,
    TError,
    UpsertVotingGuideMutationVariables,
    TContext
  >
) =>
  useMutation<
    UpsertVotingGuideMutation,
    TError,
    UpsertVotingGuideMutationVariables,
    TContext
  >(
    ["UpsertVotingGuide"],
    (variables?: UpsertVotingGuideMutationVariables) =>
      fetcher<UpsertVotingGuideMutation, UpsertVotingGuideMutationVariables>(
        UpsertVotingGuideDocument,
        variables
      )(),
    options
  );
useUpsertVotingGuideMutation.fetcher = (
  variables: UpsertVotingGuideMutationVariables
) =>
  fetcher<UpsertVotingGuideMutation, UpsertVotingGuideMutationVariables>(
    UpsertVotingGuideDocument,
    variables
  );
export const UpsertVotingGuideCandidateDocument = /*#__PURE__*/ `
    mutation UpsertVotingGuideCandidate($votingGuideId: ID!, $candidateId: ID!, $isEndorsement: Boolean, $note: String) {
  upsertVotingGuideCandidate(
    input: {votingGuideId: $votingGuideId, candidateId: $candidateId, isEndorsement: $isEndorsement, note: $note}
  ) {
    note
    isEndorsement
  }
}
    `;
export const useUpsertVotingGuideCandidateMutation = <
  TError = unknown,
  TContext = unknown
>(
  options?: UseMutationOptions<
    UpsertVotingGuideCandidateMutation,
    TError,
    UpsertVotingGuideCandidateMutationVariables,
    TContext
  >
) =>
  useMutation<
    UpsertVotingGuideCandidateMutation,
    TError,
    UpsertVotingGuideCandidateMutationVariables,
    TContext
  >(
    ["UpsertVotingGuideCandidate"],
    (variables?: UpsertVotingGuideCandidateMutationVariables) =>
      fetcher<
        UpsertVotingGuideCandidateMutation,
        UpsertVotingGuideCandidateMutationVariables
      >(UpsertVotingGuideCandidateDocument, variables)(),
    options
  );
useUpsertVotingGuideCandidateMutation.fetcher = (
  variables: UpsertVotingGuideCandidateMutationVariables
) =>
  fetcher<
    UpsertVotingGuideCandidateMutation,
    UpsertVotingGuideCandidateMutationVariables
  >(UpsertVotingGuideCandidateDocument, variables);
export const DeleteVotingGuideCandidateNoteDocument = /*#__PURE__*/ `
    mutation DeleteVotingGuideCandidateNote($votingGuideId: ID!, $candidateId: ID!) {
  deleteVotingGuideCandidateNote(
    votingGuideId: $votingGuideId
    candidateId: $candidateId
  ) {
    isEndorsement
    note
  }
}
    `;
export const useDeleteVotingGuideCandidateNoteMutation = <
  TError = unknown,
  TContext = unknown
>(
  options?: UseMutationOptions<
    DeleteVotingGuideCandidateNoteMutation,
    TError,
    DeleteVotingGuideCandidateNoteMutationVariables,
    TContext
  >
) =>
  useMutation<
    DeleteVotingGuideCandidateNoteMutation,
    TError,
    DeleteVotingGuideCandidateNoteMutationVariables,
    TContext
  >(
    ["DeleteVotingGuideCandidateNote"],
    (variables?: DeleteVotingGuideCandidateNoteMutationVariables) =>
      fetcher<
        DeleteVotingGuideCandidateNoteMutation,
        DeleteVotingGuideCandidateNoteMutationVariables
      >(DeleteVotingGuideCandidateNoteDocument, variables)(),
    options
  );
useDeleteVotingGuideCandidateNoteMutation.fetcher = (
  variables: DeleteVotingGuideCandidateNoteMutationVariables
) =>
  fetcher<
    DeleteVotingGuideCandidateNoteMutation,
    DeleteVotingGuideCandidateNoteMutationVariables
  >(DeleteVotingGuideCandidateNoteDocument, variables);
export const UserCountByStateDocument = /*#__PURE__*/ `
    query UserCountByState($state: State) {
  userCount(filter: {state: $state})
}
    `;
export const useUserCountByStateQuery = <
  TData = UserCountByStateQuery,
  TError = unknown
>(
  variables?: UserCountByStateQueryVariables,
  options?: UseQueryOptions<UserCountByStateQuery, TError, TData>
) =>
  useQuery<UserCountByStateQuery, TError, TData>(
    variables === undefined
      ? ["UserCountByState"]
      : ["UserCountByState", variables],
    fetcher<UserCountByStateQuery, UserCountByStateQueryVariables>(
      UserCountByStateDocument,
      variables
    ),
    options
  );
useUserCountByStateQuery.document = UserCountByStateDocument;

useUserCountByStateQuery.getKey = (
  variables?: UserCountByStateQueryVariables
) =>
  variables === undefined
    ? ["UserCountByState"]
    : ["UserCountByState", variables];
useUserCountByStateQuery.fetcher = (
  variables?: UserCountByStateQueryVariables
) =>
  fetcher<UserCountByStateQuery, UserCountByStateQueryVariables>(
    UserCountByStateDocument,
    variables
  );
export const ElectionsDocument = /*#__PURE__*/ `
    query Elections {
  electionsByUserState {
    id
    electionDate
  }
}
    `;
export const useElectionsQuery = <TData = ElectionsQuery, TError = unknown>(
  variables?: ElectionsQueryVariables,
  options?: UseQueryOptions<ElectionsQuery, TError, TData>
) =>
  useQuery<ElectionsQuery, TError, TData>(
    variables === undefined ? ["Elections"] : ["Elections", variables],
    fetcher<ElectionsQuery, ElectionsQueryVariables>(
      ElectionsDocument,
      variables
    ),
    options
  );
useElectionsQuery.document = ElectionsDocument;

useElectionsQuery.getKey = (variables?: ElectionsQueryVariables) =>
  variables === undefined ? ["Elections"] : ["Elections", variables];
useElectionsQuery.fetcher = (variables?: ElectionsQueryVariables) =>
  fetcher<ElectionsQuery, ElectionsQueryVariables>(
    ElectionsDocument,
    variables
  );
export const ElectionByIdDocument = /*#__PURE__*/ `
    query ElectionById($id: ID!) {
  electionById(id: $id) {
    ...electionFields
    racesByUserDistricts {
      ...raceFields
    }
  }
}
    ${ElectionFieldsFragmentDoc}
${RaceFieldsFragmentDoc}`;
export const useElectionByIdQuery = <
  TData = ElectionByIdQuery,
  TError = unknown
>(
  variables: ElectionByIdQueryVariables,
  options?: UseQueryOptions<ElectionByIdQuery, TError, TData>
) =>
  useQuery<ElectionByIdQuery, TError, TData>(
    ["ElectionById", variables],
    fetcher<ElectionByIdQuery, ElectionByIdQueryVariables>(
      ElectionByIdDocument,
      variables
    ),
    options
  );
useElectionByIdQuery.document = ElectionByIdDocument;

useElectionByIdQuery.getKey = (variables: ElectionByIdQueryVariables) => [
  "ElectionById",
  variables,
];
useElectionByIdQuery.fetcher = (variables: ElectionByIdQueryVariables) =>
  fetcher<ElectionByIdQuery, ElectionByIdQueryVariables>(
    ElectionByIdDocument,
    variables
  );
export const ElectionVotingGuideRacesDocument = /*#__PURE__*/ `
    query ElectionVotingGuideRaces($electionId: ID!, $votingGuideId: ID!) {
  electionById(id: $electionId) {
    ...electionFields
    racesByVotingGuide(votingGuideId: $votingGuideId) {
      ...raceFields
    }
  }
}
    ${ElectionFieldsFragmentDoc}
${RaceFieldsFragmentDoc}`;
export const useElectionVotingGuideRacesQuery = <
  TData = ElectionVotingGuideRacesQuery,
  TError = unknown
>(
  variables: ElectionVotingGuideRacesQueryVariables,
  options?: UseQueryOptions<ElectionVotingGuideRacesQuery, TError, TData>
) =>
  useQuery<ElectionVotingGuideRacesQuery, TError, TData>(
    ["ElectionVotingGuideRaces", variables],
    fetcher<
      ElectionVotingGuideRacesQuery,
      ElectionVotingGuideRacesQueryVariables
    >(ElectionVotingGuideRacesDocument, variables),
    options
  );
useElectionVotingGuideRacesQuery.document = ElectionVotingGuideRacesDocument;

useElectionVotingGuideRacesQuery.getKey = (
  variables: ElectionVotingGuideRacesQueryVariables
) => ["ElectionVotingGuideRaces", variables];
useElectionVotingGuideRacesQuery.fetcher = (
  variables: ElectionVotingGuideRacesQueryVariables
) =>
  fetcher<
    ElectionVotingGuideRacesQuery,
    ElectionVotingGuideRacesQueryVariables
  >(ElectionVotingGuideRacesDocument, variables);
export const BillBySlugDocument = /*#__PURE__*/ `
    query BillBySlug($slug: String!) {
  billBySlug(slug: $slug) {
    title
    description
    billNumber
    legislationStatus
    officialSummary
    populistSummary
    fullTextUrl
  }
}
    `;
export const useBillBySlugQuery = <TData = BillBySlugQuery, TError = unknown>(
  variables: BillBySlugQueryVariables,
  options?: UseQueryOptions<BillBySlugQuery, TError, TData>
) =>
  useQuery<BillBySlugQuery, TError, TData>(
    ["BillBySlug", variables],
    fetcher<BillBySlugQuery, BillBySlugQueryVariables>(
      BillBySlugDocument,
      variables
    ),
    options
  );
useBillBySlugQuery.document = BillBySlugDocument;

useBillBySlugQuery.getKey = (variables: BillBySlugQueryVariables) => [
  "BillBySlug",
  variables,
];
useBillBySlugQuery.fetcher = (variables: BillBySlugQueryVariables) =>
  fetcher<BillBySlugQuery, BillBySlugQueryVariables>(
    BillBySlugDocument,
    variables
  );
export const MprFeaturedRacesDocument = /*#__PURE__*/ `
    query MPRFeaturedRaces {
  races(
    filter: {state: MN, officeTitles: ["U.S. Representative", "Governor", "Lieutenant Governor", "Attorney General", "Secretary of State", "State Auditor"]}
  ) {
    ...raceFields
  }
}
    ${RaceFieldsFragmentDoc}`;
export const useMprFeaturedRacesQuery = <
  TData = MprFeaturedRacesQuery,
  TError = unknown
>(
  variables?: MprFeaturedRacesQueryVariables,
  options?: UseQueryOptions<MprFeaturedRacesQuery, TError, TData>
) =>
  useQuery<MprFeaturedRacesQuery, TError, TData>(
    variables === undefined
      ? ["MPRFeaturedRaces"]
      : ["MPRFeaturedRaces", variables],
    fetcher<MprFeaturedRacesQuery, MprFeaturedRacesQueryVariables>(
      MprFeaturedRacesDocument,
      variables
    ),
    options
  );
useMprFeaturedRacesQuery.document = MprFeaturedRacesDocument;

useMprFeaturedRacesQuery.getKey = (
  variables?: MprFeaturedRacesQueryVariables
) =>
  variables === undefined
    ? ["MPRFeaturedRaces"]
    : ["MPRFeaturedRaces", variables];
useMprFeaturedRacesQuery.fetcher = (
  variables?: MprFeaturedRacesQueryVariables
) =>
  fetcher<MprFeaturedRacesQuery, MprFeaturedRacesQueryVariables>(
    MprFeaturedRacesDocument,
    variables
  );
export const ElectionBySlugDocument = /*#__PURE__*/ `
    query ElectionBySlug($slug: String!) {
  electionBySlug(slug: $slug) {
    id
    slug
    description
  }
}
    `;
export const useElectionBySlugQuery = <
  TData = ElectionBySlugQuery,
  TError = unknown
>(
  variables: ElectionBySlugQueryVariables,
  options?: UseQueryOptions<ElectionBySlugQuery, TError, TData>
) =>
  useQuery<ElectionBySlugQuery, TError, TData>(
    ["ElectionBySlug", variables],
    fetcher<ElectionBySlugQuery, ElectionBySlugQueryVariables>(
      ElectionBySlugDocument,
      variables
    ),
    options
  );
useElectionBySlugQuery.document = ElectionBySlugDocument;

useElectionBySlugQuery.getKey = (variables: ElectionBySlugQueryVariables) => [
  "ElectionBySlug",
  variables,
];
useElectionBySlugQuery.fetcher = (variables: ElectionBySlugQueryVariables) =>
  fetcher<ElectionBySlugQuery, ElectionBySlugQueryVariables>(
    ElectionBySlugDocument,
    variables
  );
export const OrganizationBySlugDocument = /*#__PURE__*/ `
    query OrganizationBySlug($slug: String!) {
  organizationBySlug(slug: $slug) {
    ...organizationFields
  }
}
    ${OrganizationFieldsFragmentDoc}`;
export const useOrganizationBySlugQuery = <
  TData = OrganizationBySlugQuery,
  TError = unknown
>(
  variables: OrganizationBySlugQueryVariables,
  options?: UseQueryOptions<OrganizationBySlugQuery, TError, TData>
) =>
  useQuery<OrganizationBySlugQuery, TError, TData>(
    ["OrganizationBySlug", variables],
    fetcher<OrganizationBySlugQuery, OrganizationBySlugQueryVariables>(
      OrganizationBySlugDocument,
      variables
    ),
    options
  );
useOrganizationBySlugQuery.document = OrganizationBySlugDocument;

useOrganizationBySlugQuery.getKey = (
  variables: OrganizationBySlugQueryVariables
) => ["OrganizationBySlug", variables];
useOrganizationBySlugQuery.fetcher = (
  variables: OrganizationBySlugQueryVariables
) =>
  fetcher<OrganizationBySlugQuery, OrganizationBySlugQueryVariables>(
    OrganizationBySlugDocument,
    variables
  );
export const OrganizationPoliticianNotesDocument = /*#__PURE__*/ `
    query OrganizationPoliticianNotes($slug: String!, $electionId: ID!) {
  organizationBySlug(slug: $slug) {
    politicianNotes(electionId: $electionId) {
      id
      notes
      politician {
        id
        slug
        fullName
        party
        assets {
          thumbnailImage160
          thumbnailImage400
        }
        upcomingRace {
          office {
            slug
            name
            title
            subtitleShort
            priority
            incumbent {
              id
            }
          }
        }
      }
      issueTags {
        name
        slug
        id
      }
    }
  }
}
    `;
export const useOrganizationPoliticianNotesQuery = <
  TData = OrganizationPoliticianNotesQuery,
  TError = unknown
>(
  variables: OrganizationPoliticianNotesQueryVariables,
  options?: UseQueryOptions<OrganizationPoliticianNotesQuery, TError, TData>
) =>
  useQuery<OrganizationPoliticianNotesQuery, TError, TData>(
    ["OrganizationPoliticianNotes", variables],
    fetcher<
      OrganizationPoliticianNotesQuery,
      OrganizationPoliticianNotesQueryVariables
    >(OrganizationPoliticianNotesDocument, variables),
    options
  );
useOrganizationPoliticianNotesQuery.document =
  OrganizationPoliticianNotesDocument;

useOrganizationPoliticianNotesQuery.getKey = (
  variables: OrganizationPoliticianNotesQueryVariables
) => ["OrganizationPoliticianNotes", variables];
useOrganizationPoliticianNotesQuery.fetcher = (
  variables: OrganizationPoliticianNotesQueryVariables
) =>
  fetcher<
    OrganizationPoliticianNotesQuery,
    OrganizationPoliticianNotesQueryVariables
  >(OrganizationPoliticianNotesDocument, variables);
export const PoliticianIndexDocument = /*#__PURE__*/ `
    query PoliticianIndex($pageSize: Int, $cursor: String, $filter: PoliticianFilter) {
  politicians(first: $pageSize, after: $cursor, filter: $filter) {
    edges {
      node {
        id
        slug
        fullName
        homeState
        party
        thumbnailImageUrl
        currentOffice {
          id
          slug
          title
          subtitle
          subtitleShort
          municipality
          district
          state
          officeType
        }
      }
    }
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
    `;
export const usePoliticianIndexQuery = <
  TData = PoliticianIndexQuery,
  TError = unknown
>(
  variables?: PoliticianIndexQueryVariables,
  options?: UseQueryOptions<PoliticianIndexQuery, TError, TData>
) =>
  useQuery<PoliticianIndexQuery, TError, TData>(
    variables === undefined
      ? ["PoliticianIndex"]
      : ["PoliticianIndex", variables],
    fetcher<PoliticianIndexQuery, PoliticianIndexQueryVariables>(
      PoliticianIndexDocument,
      variables
    ),
    options
  );
usePoliticianIndexQuery.document = PoliticianIndexDocument;

usePoliticianIndexQuery.getKey = (variables?: PoliticianIndexQueryVariables) =>
  variables === undefined
    ? ["PoliticianIndex"]
    : ["PoliticianIndex", variables];
usePoliticianIndexQuery.fetcher = (variables?: PoliticianIndexQueryVariables) =>
  fetcher<PoliticianIndexQuery, PoliticianIndexQueryVariables>(
    PoliticianIndexDocument,
    variables
  );
export const PoliticianBasicInfoDocument = /*#__PURE__*/ `
    query PoliticianBasicInfo($slug: String!) {
  politicianBySlug(slug: $slug) {
    ...BasicInfo
  }
}
    ${BasicInfoFragmentDoc}`;
export const usePoliticianBasicInfoQuery = <
  TData = PoliticianBasicInfoQuery,
  TError = unknown
>(
  variables: PoliticianBasicInfoQueryVariables,
  options?: UseQueryOptions<PoliticianBasicInfoQuery, TError, TData>
) =>
  useQuery<PoliticianBasicInfoQuery, TError, TData>(
    ["PoliticianBasicInfo", variables],
    fetcher<PoliticianBasicInfoQuery, PoliticianBasicInfoQueryVariables>(
      PoliticianBasicInfoDocument,
      variables
    ),
    options
  );
usePoliticianBasicInfoQuery.document = PoliticianBasicInfoDocument;

usePoliticianBasicInfoQuery.getKey = (
  variables: PoliticianBasicInfoQueryVariables
) => ["PoliticianBasicInfo", variables];
usePoliticianBasicInfoQuery.fetcher = (
  variables: PoliticianBasicInfoQueryVariables
) =>
  fetcher<PoliticianBasicInfoQuery, PoliticianBasicInfoQueryVariables>(
    PoliticianBasicInfoDocument,
    variables
  );
export const PoliticianBioDocument = /*#__PURE__*/ `
    query PoliticianBio($slug: String!) {
  politicianBySlug(slug: $slug) {
    ...Bio
  }
}
    ${BioFragmentDoc}`;
export const usePoliticianBioQuery = <
  TData = PoliticianBioQuery,
  TError = unknown
>(
  variables: PoliticianBioQueryVariables,
  options?: UseQueryOptions<PoliticianBioQuery, TError, TData>
) =>
  useQuery<PoliticianBioQuery, TError, TData>(
    ["PoliticianBio", variables],
    fetcher<PoliticianBioQuery, PoliticianBioQueryVariables>(
      PoliticianBioDocument,
      variables
    ),
    options
  );
usePoliticianBioQuery.document = PoliticianBioDocument;

usePoliticianBioQuery.getKey = (variables: PoliticianBioQueryVariables) => [
  "PoliticianBio",
  variables,
];
usePoliticianBioQuery.fetcher = (variables: PoliticianBioQueryVariables) =>
  fetcher<PoliticianBioQuery, PoliticianBioQueryVariables>(
    PoliticianBioDocument,
    variables
  );
export const PoliticianCurrentOfficeDocument = /*#__PURE__*/ `
    query PoliticianCurrentOffice($slug: String!) {
  politicianBySlug(slug: $slug) {
    ...CurrentOffice
  }
}
    ${CurrentOfficeFragmentDoc}`;
export const usePoliticianCurrentOfficeQuery = <
  TData = PoliticianCurrentOfficeQuery,
  TError = unknown
>(
  variables: PoliticianCurrentOfficeQueryVariables,
  options?: UseQueryOptions<PoliticianCurrentOfficeQuery, TError, TData>
) =>
  useQuery<PoliticianCurrentOfficeQuery, TError, TData>(
    ["PoliticianCurrentOffice", variables],
    fetcher<
      PoliticianCurrentOfficeQuery,
      PoliticianCurrentOfficeQueryVariables
    >(PoliticianCurrentOfficeDocument, variables),
    options
  );
usePoliticianCurrentOfficeQuery.document = PoliticianCurrentOfficeDocument;

usePoliticianCurrentOfficeQuery.getKey = (
  variables: PoliticianCurrentOfficeQueryVariables
) => ["PoliticianCurrentOffice", variables];
usePoliticianCurrentOfficeQuery.fetcher = (
  variables: PoliticianCurrentOfficeQueryVariables
) =>
  fetcher<PoliticianCurrentOfficeQuery, PoliticianCurrentOfficeQueryVariables>(
    PoliticianCurrentOfficeDocument,
    variables
  );
export const PoliticianElectionInfoDocument = /*#__PURE__*/ `
    query PoliticianElectionInfo($slug: String!) {
  politicianBySlug(slug: $slug) {
    ...ElectionInfo
  }
}
    ${ElectionInfoFragmentDoc}`;
export const usePoliticianElectionInfoQuery = <
  TData = PoliticianElectionInfoQuery,
  TError = unknown
>(
  variables: PoliticianElectionInfoQueryVariables,
  options?: UseQueryOptions<PoliticianElectionInfoQuery, TError, TData>
) =>
  useQuery<PoliticianElectionInfoQuery, TError, TData>(
    ["PoliticianElectionInfo", variables],
    fetcher<PoliticianElectionInfoQuery, PoliticianElectionInfoQueryVariables>(
      PoliticianElectionInfoDocument,
      variables
    ),
    options
  );
usePoliticianElectionInfoQuery.document = PoliticianElectionInfoDocument;

usePoliticianElectionInfoQuery.getKey = (
  variables: PoliticianElectionInfoQueryVariables
) => ["PoliticianElectionInfo", variables];
usePoliticianElectionInfoQuery.fetcher = (
  variables: PoliticianElectionInfoQueryVariables
) =>
  fetcher<PoliticianElectionInfoQuery, PoliticianElectionInfoQueryVariables>(
    PoliticianElectionInfoDocument,
    variables
  );
export const PoliticianEndorsementsDocument = /*#__PURE__*/ `
    query PoliticianEndorsements($slug: String!) {
  politicianBySlug(slug: $slug) {
    ...Endorsements
  }
}
    ${EndorsementsFragmentDoc}`;
export const usePoliticianEndorsementsQuery = <
  TData = PoliticianEndorsementsQuery,
  TError = unknown
>(
  variables: PoliticianEndorsementsQueryVariables,
  options?: UseQueryOptions<PoliticianEndorsementsQuery, TError, TData>
) =>
  useQuery<PoliticianEndorsementsQuery, TError, TData>(
    ["PoliticianEndorsements", variables],
    fetcher<PoliticianEndorsementsQuery, PoliticianEndorsementsQueryVariables>(
      PoliticianEndorsementsDocument,
      variables
    ),
    options
  );
usePoliticianEndorsementsQuery.document = PoliticianEndorsementsDocument;

usePoliticianEndorsementsQuery.getKey = (
  variables: PoliticianEndorsementsQueryVariables
) => ["PoliticianEndorsements", variables];
usePoliticianEndorsementsQuery.fetcher = (
  variables: PoliticianEndorsementsQueryVariables
) =>
  fetcher<PoliticianEndorsementsQuery, PoliticianEndorsementsQueryVariables>(
    PoliticianEndorsementsDocument,
    variables
  );
export const PoliticianSponsoredBillsDocument = /*#__PURE__*/ `
    query PoliticianSponsoredBills($slug: String!) {
  politicianBySlug(slug: $slug) {
    ...SponsoredBills
  }
}
    ${SponsoredBillsFragmentDoc}`;
export const usePoliticianSponsoredBillsQuery = <
  TData = PoliticianSponsoredBillsQuery,
  TError = unknown
>(
  variables: PoliticianSponsoredBillsQueryVariables,
  options?: UseQueryOptions<PoliticianSponsoredBillsQuery, TError, TData>
) =>
  useQuery<PoliticianSponsoredBillsQuery, TError, TData>(
    ["PoliticianSponsoredBills", variables],
    fetcher<
      PoliticianSponsoredBillsQuery,
      PoliticianSponsoredBillsQueryVariables
    >(PoliticianSponsoredBillsDocument, variables),
    options
  );
usePoliticianSponsoredBillsQuery.document = PoliticianSponsoredBillsDocument;

usePoliticianSponsoredBillsQuery.getKey = (
  variables: PoliticianSponsoredBillsQueryVariables
) => ["PoliticianSponsoredBills", variables];
usePoliticianSponsoredBillsQuery.fetcher = (
  variables: PoliticianSponsoredBillsQueryVariables
) =>
  fetcher<
    PoliticianSponsoredBillsQuery,
    PoliticianSponsoredBillsQueryVariables
  >(PoliticianSponsoredBillsDocument, variables);
export const PoliticianRatingsDocument = /*#__PURE__*/ `
    query PoliticianRatings($slug: String!) {
  politicianBySlug(slug: $slug) {
    ...Ratings
  }
}
    ${RatingsFragmentDoc}`;
export const usePoliticianRatingsQuery = <
  TData = PoliticianRatingsQuery,
  TError = unknown
>(
  variables: PoliticianRatingsQueryVariables,
  options?: UseQueryOptions<PoliticianRatingsQuery, TError, TData>
) =>
  useQuery<PoliticianRatingsQuery, TError, TData>(
    ["PoliticianRatings", variables],
    fetcher<PoliticianRatingsQuery, PoliticianRatingsQueryVariables>(
      PoliticianRatingsDocument,
      variables
    ),
    options
  );
usePoliticianRatingsQuery.document = PoliticianRatingsDocument;

usePoliticianRatingsQuery.getKey = (
  variables: PoliticianRatingsQueryVariables
) => ["PoliticianRatings", variables];
usePoliticianRatingsQuery.fetcher = (
  variables: PoliticianRatingsQueryVariables
) =>
  fetcher<PoliticianRatingsQuery, PoliticianRatingsQueryVariables>(
    PoliticianRatingsDocument,
    variables
  );
export const PoliticianFinancialsDocument = /*#__PURE__*/ `
    query PoliticianFinancials($slug: String!) {
  politicianBySlug(slug: $slug) {
    ...Financials
  }
}
    ${FinancialsFragmentDoc}`;
export const usePoliticianFinancialsQuery = <
  TData = PoliticianFinancialsQuery,
  TError = unknown
>(
  variables: PoliticianFinancialsQueryVariables,
  options?: UseQueryOptions<PoliticianFinancialsQuery, TError, TData>
) =>
  useQuery<PoliticianFinancialsQuery, TError, TData>(
    ["PoliticianFinancials", variables],
    fetcher<PoliticianFinancialsQuery, PoliticianFinancialsQueryVariables>(
      PoliticianFinancialsDocument,
      variables
    ),
    options
  );
usePoliticianFinancialsQuery.document = PoliticianFinancialsDocument;

usePoliticianFinancialsQuery.getKey = (
  variables: PoliticianFinancialsQueryVariables
) => ["PoliticianFinancials", variables];
usePoliticianFinancialsQuery.fetcher = (
  variables: PoliticianFinancialsQueryVariables
) =>
  fetcher<PoliticianFinancialsQuery, PoliticianFinancialsQueryVariables>(
    PoliticianFinancialsDocument,
    variables
  );
export const PoliticianBySlugDocument = /*#__PURE__*/ `
    query PoliticianBySlug($slug: String!) {
  politicianBySlug(slug: $slug) {
    ...BasicInfo
    ...Bio
    ...CurrentOffice
    ...ElectionInfo
    ...Endorsements
    ...SponsoredBills
    ...Ratings
  }
}
    ${BasicInfoFragmentDoc}
${BioFragmentDoc}
${CurrentOfficeFragmentDoc}
${ElectionInfoFragmentDoc}
${EndorsementsFragmentDoc}
${SponsoredBillsFragmentDoc}
${RatingsFragmentDoc}`;
export const usePoliticianBySlugQuery = <
  TData = PoliticianBySlugQuery,
  TError = unknown
>(
  variables: PoliticianBySlugQueryVariables,
  options?: UseQueryOptions<PoliticianBySlugQuery, TError, TData>
) =>
  useQuery<PoliticianBySlugQuery, TError, TData>(
    ["PoliticianBySlug", variables],
    fetcher<PoliticianBySlugQuery, PoliticianBySlugQueryVariables>(
      PoliticianBySlugDocument,
      variables
    ),
    options
  );
usePoliticianBySlugQuery.document = PoliticianBySlugDocument;

usePoliticianBySlugQuery.getKey = (
  variables: PoliticianBySlugQueryVariables
) => ["PoliticianBySlug", variables];
usePoliticianBySlugQuery.fetcher = (
  variables: PoliticianBySlugQueryVariables
) =>
  fetcher<PoliticianBySlugQuery, PoliticianBySlugQueryVariables>(
    PoliticianBySlugDocument,
    variables
  );
export const VotingGuideByIdDocument = /*#__PURE__*/ `
    query VotingGuideById($id: ID!) {
  votingGuideById(id: $id) {
    ...guideFields
  }
}
    ${GuideFieldsFragmentDoc}`;
export const useVotingGuideByIdQuery = <
  TData = VotingGuideByIdQuery,
  TError = unknown
>(
  variables: VotingGuideByIdQueryVariables,
  options?: UseQueryOptions<VotingGuideByIdQuery, TError, TData>
) =>
  useQuery<VotingGuideByIdQuery, TError, TData>(
    ["VotingGuideById", variables],
    fetcher<VotingGuideByIdQuery, VotingGuideByIdQueryVariables>(
      VotingGuideByIdDocument,
      variables
    ),
    options
  );
useVotingGuideByIdQuery.document = VotingGuideByIdDocument;

useVotingGuideByIdQuery.getKey = (variables: VotingGuideByIdQueryVariables) => [
  "VotingGuideById",
  variables,
];
useVotingGuideByIdQuery.fetcher = (variables: VotingGuideByIdQueryVariables) =>
  fetcher<VotingGuideByIdQuery, VotingGuideByIdQueryVariables>(
    VotingGuideByIdDocument,
    variables
  );
export const VotingGuidesByUserIdDocument = /*#__PURE__*/ `
    query VotingGuidesByUserId($userId: ID!) {
  votingGuidesByUserId(userId: $userId) {
    ...guideFields
  }
}
    ${GuideFieldsFragmentDoc}`;
export const useVotingGuidesByUserIdQuery = <
  TData = VotingGuidesByUserIdQuery,
  TError = unknown
>(
  variables: VotingGuidesByUserIdQueryVariables,
  options?: UseQueryOptions<VotingGuidesByUserIdQuery, TError, TData>
) =>
  useQuery<VotingGuidesByUserIdQuery, TError, TData>(
    ["VotingGuidesByUserId", variables],
    fetcher<VotingGuidesByUserIdQuery, VotingGuidesByUserIdQueryVariables>(
      VotingGuidesByUserIdDocument,
      variables
    ),
    options
  );
useVotingGuidesByUserIdQuery.document = VotingGuidesByUserIdDocument;

useVotingGuidesByUserIdQuery.getKey = (
  variables: VotingGuidesByUserIdQueryVariables
) => ["VotingGuidesByUserId", variables];
useVotingGuidesByUserIdQuery.fetcher = (
  variables: VotingGuidesByUserIdQueryVariables
) =>
  fetcher<VotingGuidesByUserIdQuery, VotingGuidesByUserIdQueryVariables>(
    VotingGuidesByUserIdDocument,
    variables
  );
export const ElectionVotingGuideByUserIdDocument = /*#__PURE__*/ `
    query ElectionVotingGuideByUserId($electionId: ID!, $userId: ID!) {
  electionVotingGuideByUserId(electionId: $electionId, userId: $userId) {
    id
  }
}
    `;
export const useElectionVotingGuideByUserIdQuery = <
  TData = ElectionVotingGuideByUserIdQuery,
  TError = unknown
>(
  variables: ElectionVotingGuideByUserIdQueryVariables,
  options?: UseQueryOptions<ElectionVotingGuideByUserIdQuery, TError, TData>
) =>
  useQuery<ElectionVotingGuideByUserIdQuery, TError, TData>(
    ["ElectionVotingGuideByUserId", variables],
    fetcher<
      ElectionVotingGuideByUserIdQuery,
      ElectionVotingGuideByUserIdQueryVariables
    >(ElectionVotingGuideByUserIdDocument, variables),
    options
  );
useElectionVotingGuideByUserIdQuery.document =
  ElectionVotingGuideByUserIdDocument;

useElectionVotingGuideByUserIdQuery.getKey = (
  variables: ElectionVotingGuideByUserIdQueryVariables
) => ["ElectionVotingGuideByUserId", variables];
useElectionVotingGuideByUserIdQuery.fetcher = (
  variables: ElectionVotingGuideByUserIdQueryVariables
) =>
  fetcher<
    ElectionVotingGuideByUserIdQuery,
    ElectionVotingGuideByUserIdQueryVariables
  >(ElectionVotingGuideByUserIdDocument, variables);
export const VotingGuidesByIdsDocument = /*#__PURE__*/ `
    query VotingGuidesByIds($ids: [ID!]!) {
  votingGuidesByIds(ids: $ids) {
    ...guideFields
  }
}
    ${GuideFieldsFragmentDoc}`;
export const useVotingGuidesByIdsQuery = <
  TData = VotingGuidesByIdsQuery,
  TError = unknown
>(
  variables: VotingGuidesByIdsQueryVariables,
  options?: UseQueryOptions<VotingGuidesByIdsQuery, TError, TData>
) =>
  useQuery<VotingGuidesByIdsQuery, TError, TData>(
    ["VotingGuidesByIds", variables],
    fetcher<VotingGuidesByIdsQuery, VotingGuidesByIdsQueryVariables>(
      VotingGuidesByIdsDocument,
      variables
    ),
    options
  );
useVotingGuidesByIdsQuery.document = VotingGuidesByIdsDocument;

useVotingGuidesByIdsQuery.getKey = (
  variables: VotingGuidesByIdsQueryVariables
) => ["VotingGuidesByIds", variables];
useVotingGuidesByIdsQuery.fetcher = (
  variables: VotingGuidesByIdsQueryVariables
) =>
  fetcher<VotingGuidesByIdsQuery, VotingGuidesByIdsQueryVariables>(
    VotingGuidesByIdsDocument,
    variables
  );
