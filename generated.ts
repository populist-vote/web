import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  UseMutationOptions,
} from "react-query";
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
  /**
   * Implement the DateTime<Utc> scalar
   *
   * The input/output is a string in RFC3339 format.
   */
  DateTime: any;
  /** A scalar that can represent any JSON value. */
  JSON: any;
  /**
   * ISO 8601 calendar date without timezone.
   * Format: %Y-%m-%d
   *
   * # Examples
   *
   * * `1994-11-13`
   * * `2000-02-24`
   */
  NaiveDate: any;
  /**
   * A UUID is a unique 128-bit number, stored as 16 octets. UUIDs are parsed as Strings
   * within GraphQL. UUIDs are used to assign unique identifiers to entities without requiring a central
   * allocating authority.
   *
   * # References
   *
   * * [Wikipedia: Universally Unique Identifier](http://en.wikipedia.org/wiki/Universally_unique_identifier)
   * * [RFC4122: A Universally Unique IDentifier (UUID) URN Namespace](http://tools.ietf.org/html/rfc4122)
   */
  UUID: any;
  Upload: any;
};

export type AddressInput = {
  city: Scalars["String"];
  congressionalDistrict?: InputMaybe<Scalars["Int"]>;
  coordinates?: InputMaybe<Coordinates>;
  country: Scalars["String"];
  county?: InputMaybe<Scalars["String"]>;
  line1: Scalars["String"];
  line2?: InputMaybe<Scalars["String"]>;
  postalCode: Scalars["String"];
  state: State;
  stateHouseDistrict?: InputMaybe<Scalars["Int"]>;
  stateSenateDistrict?: InputMaybe<Scalars["Int"]>;
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
  createdAt: Scalars["DateTime"];
  id: Scalars["ID"];
  position: Scalars["String"];
  title: Scalars["String"];
  updatedAt: Scalars["DateTime"];
  votes: Scalars["Int"];
};

export type AuthTokenResult = {
  __typename?: "AuthTokenResult";
  email: Scalars["String"];
  id: Scalars["ID"];
  role: Role;
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
  createdAt: Scalars["DateTime"];
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
  updatedAt: Scalars["DateTime"];
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
  createdAt: Scalars["DateTime"];
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
  updatedAt: Scalars["DateTime"];
};

export type BillResultConnection = {
  __typename?: "BillResultConnection";
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<BillResultEdge>>>;
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

export type CreateElectionInput = {
  description?: InputMaybe<Scalars["String"]>;
  /** Must use format YYYY-MM-DD */
  electionDate: Scalars["NaiveDate"];
  slug?: InputMaybe<Scalars["String"]>;
  title: Scalars["String"];
};

export type CreateIssueTagInput = {
  category?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  name: Scalars["String"];
  slug?: InputMaybe<Scalars["String"]>;
};

export type CreateOfficeInput = {
  chamber?: InputMaybe<Chamber>;
  district?: InputMaybe<Scalars["String"]>;
  districtType?: InputMaybe<District>;
  electionScope: ElectionScope;
  incumbentId?: InputMaybe<Scalars["UUID"]>;
  municipality?: InputMaybe<Scalars["String"]>;
  officeType?: InputMaybe<Scalars["String"]>;
  politicalScope: PoliticalScope;
  slug?: InputMaybe<Scalars["String"]>;
  state?: InputMaybe<State>;
  termLength?: InputMaybe<Scalars["Int"]>;
  title: Scalars["String"];
};

export type CreateOrConnectIssueTagInput = {
  connect?: InputMaybe<Array<Scalars["String"]>>;
  create?: InputMaybe<Array<CreateIssueTagInput>>;
};

export type CreateOrConnectOrganizationInput = {
  connect?: InputMaybe<Array<Scalars["String"]>>;
  create?: InputMaybe<Array<CreateOrganizationInput>>;
};

export type CreateOrConnectPoliticianInput = {
  connect?: InputMaybe<Array<Scalars["String"]>>;
  create?: InputMaybe<Array<CreatePoliticianInput>>;
};

export type CreateOrganizationInput = {
  description?: InputMaybe<Scalars["String"]>;
  email?: InputMaybe<Scalars["String"]>;
  facebookUrl?: InputMaybe<Scalars["String"]>;
  headquartersAddressId?: InputMaybe<Scalars["UUID"]>;
  headquartersPhone?: InputMaybe<Scalars["String"]>;
  instagramUrl?: InputMaybe<Scalars["String"]>;
  issueTags?: InputMaybe<CreateOrConnectIssueTagInput>;
  name: Scalars["String"];
  slug?: InputMaybe<Scalars["String"]>;
  taxClassification?: InputMaybe<Scalars["String"]>;
  thumbnailImageUrl?: InputMaybe<Scalars["String"]>;
  twitterUrl?: InputMaybe<Scalars["String"]>;
  votesmartSigId?: InputMaybe<Scalars["Int"]>;
  websiteUrl?: InputMaybe<Scalars["String"]>;
};

export type CreatePoliticianInput = {
  ballotName?: InputMaybe<Scalars["String"]>;
  biography?: InputMaybe<Scalars["String"]>;
  biographySource?: InputMaybe<Scalars["String"]>;
  campaignWebsiteUrl?: InputMaybe<Scalars["String"]>;
  crpCandidateId?: InputMaybe<Scalars["String"]>;
  dateOfBirth?: InputMaybe<Scalars["NaiveDate"]>;
  email?: InputMaybe<Scalars["String"]>;
  facebookUrl?: InputMaybe<Scalars["String"]>;
  fecCandidateId?: InputMaybe<Scalars["String"]>;
  firstName: Scalars["String"];
  homeState?: InputMaybe<State>;
  instagramUrl?: InputMaybe<Scalars["String"]>;
  issueTags?: InputMaybe<CreateOrConnectIssueTagInput>;
  lastName: Scalars["String"];
  legiscanPeopleId?: InputMaybe<Scalars["Int"]>;
  linkedinUrl?: InputMaybe<Scalars["String"]>;
  middleName?: InputMaybe<Scalars["String"]>;
  nickname?: InputMaybe<Scalars["String"]>;
  officeId?: InputMaybe<Scalars["UUID"]>;
  organizationEndorsements?: InputMaybe<CreateOrConnectOrganizationInput>;
  party?: InputMaybe<PoliticalParty>;
  politicianEndorsements?: InputMaybe<CreateOrConnectPoliticianInput>;
  preferredName?: InputMaybe<Scalars["String"]>;
  slug: Scalars["String"];
  suffix?: InputMaybe<Scalars["String"]>;
  thumbnailImageUrl?: InputMaybe<Scalars["String"]>;
  tiktokUrl?: InputMaybe<Scalars["String"]>;
  twitterUrl?: InputMaybe<Scalars["String"]>;
  upcomingRaceId?: InputMaybe<Scalars["UUID"]>;
  votesmartCandidateBio?: InputMaybe<Scalars["JSON"]>;
  votesmartCandidateId?: InputMaybe<Scalars["Int"]>;
  votesmartCandidateRatings?: InputMaybe<Scalars["JSON"]>;
  websiteUrl?: InputMaybe<Scalars["String"]>;
  youtubeUrl?: InputMaybe<Scalars["String"]>;
};

export type CreateRaceInput = {
  ballotpediaLink?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  earlyVotingBeginsDate?: InputMaybe<Scalars["NaiveDate"]>;
  electionId?: InputMaybe<Scalars["UUID"]>;
  officeId: Scalars["UUID"];
  officialWebsite?: InputMaybe<Scalars["String"]>;
  party?: InputMaybe<PoliticalParty>;
  raceType: RaceType;
  slug?: InputMaybe<Scalars["String"]>;
  state?: InputMaybe<State>;
  title: Scalars["String"];
  winnerId?: InputMaybe<Scalars["UUID"]>;
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
  School = "SCHOOL",
  StateHouse = "STATE_HOUSE",
  StateSenate = "STATE_SENATE",
  UsCongressional = "US_CONGRESSIONAL",
}

export type ElectionResult = {
  __typename?: "ElectionResult";
  description?: Maybe<Scalars["String"]>;
  electionDate: Scalars["NaiveDate"];
  id: Scalars["ID"];
  races: Array<RaceResult>;
  /** Show races relevant to the user based on their address */
  racesByUserDistricts: Array<RaceResult>;
  slug: Scalars["String"];
  title: Scalars["String"];
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
  createdAt: Scalars["DateTime"];
  description?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  organizations: Array<OrganizationResult>;
  politicians: Array<PoliticianResult>;
  slug: Scalars["String"];
  updatedAt: Scalars["DateTime"];
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
  createElection: ElectionResult;
  createIssueTag: IssueTagResult;
  createOffice: OfficeResult;
  createOrganization: OrganizationResult;
  createPolitician: PoliticianResult;
  createRace: RaceResult;
  createUser: CreateUserResult;
  deleteArgument: DeleteArgumentResult;
  deleteBallotMeasure: DeleteBallotMeasureResult;
  deleteBill: DeleteBillResult;
  deleteElection: DeleteElectionResult;
  deleteIssueTag: DeleteIssueTagResult;
  deleteOffice: DeleteOfficeResult;
  deleteOrganization: DeleteOrganizationResult;
  deletePolitician: DeletePoliticianResult;
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
  updateElection: ElectionResult;
  updateEmail: UpdateEmailResult;
  updateFirstAndLastName: UpdateNameResult;
  updateIssueTag: IssueTagResult;
  updateOffice: OfficeResult;
  updateOrganization: OrganizationResult;
  updatePassword: Scalars["Boolean"];
  updatePolitician: PoliticianResult;
  updateRace: RaceResult;
  updateUsername: UpdateUsernameResult;
  uploadPoliticianThumbnail: Scalars["Int"];
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

export type MutationCreateElectionArgs = {
  input: CreateElectionInput;
};

export type MutationCreateIssueTagArgs = {
  input: CreateIssueTagInput;
};

export type MutationCreateOfficeArgs = {
  input: CreateOfficeInput;
};

export type MutationCreateOrganizationArgs = {
  input: CreateOrganizationInput;
};

export type MutationCreatePoliticianArgs = {
  input: CreatePoliticianInput;
};

export type MutationCreateRaceArgs = {
  input: CreateRaceInput;
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
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

export type MutationUpdateElectionArgs = {
  id: Scalars["String"];
  input: UpdateElectionInput;
};

export type MutationUpdateEmailArgs = {
  email: Scalars["String"];
};

export type MutationUpdateFirstAndLastNameArgs = {
  firstName: Scalars["String"];
  lastName: Scalars["String"];
};

export type MutationUpdateIssueTagArgs = {
  id: Scalars["String"];
  input: UpdateIssueTagInput;
};

export type MutationUpdateOfficeArgs = {
  id: Scalars["String"];
  input: UpdateOfficeInput;
};

export type MutationUpdateOrganizationArgs = {
  id: Scalars["String"];
  input: UpdateOrganizationInput;
};

export type MutationUpdatePasswordArgs = {
  input: UpdatePasswordInput;
};

export type MutationUpdatePoliticianArgs = {
  id: Scalars["String"];
  input: UpdatePoliticianInput;
};

export type MutationUpdateRaceArgs = {
  id: Scalars["String"];
  input: UpdateRaceInput;
};

export type MutationUpdateUsernameArgs = {
  username: Scalars["String"];
};

export type MutationUploadPoliticianThumbnailArgs = {
  file: Scalars["Upload"];
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
  createdAt: Scalars["DateTime"];
  district?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  incumbent?: Maybe<PoliticianResult>;
  municipality?: Maybe<Scalars["String"]>;
  officeType?: Maybe<Scalars["String"]>;
  politicalScope: PoliticalScope;
  slug: Scalars["String"];
  state?: Maybe<State>;
  title: Scalars["String"];
  updatedAt: Scalars["DateTime"];
};

export type OfficeSearch = {
  politicalScope?: InputMaybe<PoliticalScope>;
  query?: InputMaybe<Scalars["String"]>;
  state?: InputMaybe<State>;
};

export type OrganizationResult = {
  __typename?: "OrganizationResult";
  description?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  issueTags: Array<IssueTagResult>;
  name: Scalars["String"];
  slug: Scalars["String"];
  thumbnailImageUrl?: Maybe<Scalars["String"]>;
  websiteUrl?: Maybe<Scalars["String"]>;
};

export type OrganizationResultConnection = {
  __typename?: "OrganizationResultConnection";
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<OrganizationResultEdge>>>;
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
  Constitution = "CONSTITUTION",
  Democratic = "DEMOCRATIC",
  Green = "GREEN",
  Libertarian = "LIBERTARIAN",
  Republican = "REPUBLICAN",
  Unknown = "UNKNOWN",
}

export enum PoliticalScope {
  Federal = "FEDERAL",
  Local = "LOCAL",
  State = "STATE",
}

export type PoliticianFilter = {
  chambers?: InputMaybe<Chambers>;
  politicalScope?: InputMaybe<PoliticalScope>;
};

export type PoliticianResult = {
  __typename?: "PoliticianResult";
  age?: Maybe<Scalars["Int"]>;
  ballotName?: Maybe<Scalars["String"]>;
  biography?: Maybe<Scalars["String"]>;
  biographySource?: Maybe<Scalars["String"]>;
  campaignWebsiteUrl?: Maybe<Scalars["String"]>;
  createdAt: Scalars["DateTime"];
  currentOffice?: Maybe<OfficeResult>;
  dateOfBirth?: Maybe<Scalars["NaiveDate"]>;
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
  nickname?: Maybe<Scalars["String"]>;
  officeId?: Maybe<Scalars["ID"]>;
  party?: Maybe<PoliticalParty>;
  preferredName?: Maybe<Scalars["String"]>;
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
  updatedAt: Scalars["DateTime"];
  votesmartCandidateBio?: Maybe<GetCandidateBioResponse>;
  votesmartCandidateId?: Maybe<Scalars["Int"]>;
  votesmartCandidateRatings: Array<VsRating>;
  websiteUrl?: Maybe<Scalars["String"]>;
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

export type PoliticianResultConnection = {
  __typename?: "PoliticianResultConnection";
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<PoliticianResultEdge>>>;
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

export type PoliticianSearch = {
  homeState?: InputMaybe<State>;
  name?: InputMaybe<Scalars["String"]>;
  party?: InputMaybe<PoliticalParty>;
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
  health: Scalars["Boolean"];
  issueTagBySlug: IssueTagResult;
  issueTags: Array<IssueTagResult>;
  officeById: OfficeResult;
  officeBySlug: OfficeResult;
  offices: Array<OfficeResult>;
  organizationBySlug: OrganizationResult;
  organizations: OrganizationResultConnection;
  politicianById: PoliticianResult;
  politicianBySlug: PoliticianResult;
  politicians: PoliticianResultConnection;
  raceById: RaceResult;
  raceBySlug: RaceResult;
  races: Array<RaceResult>;
  upcomingElections: Array<ElectionResult>;
  userProfile: UserResult;
  /** Validate that a user does not already exist with this email */
  validateEmailAvailable: Scalars["Boolean"];
  validatePasswordEntropy: PasswordEntropyResult;
  votingGuideById: VotingGuideResult;
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
  id: Scalars["String"];
};

export type QueryElectionBySlugArgs = {
  slug: Scalars["String"];
};

export type QueryElectionVotingGuideByUserIdArgs = {
  electionId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type QueryElectionsArgs = {
  search: ElectionSearchInput;
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

export type QueryPoliticianByIdArgs = {
  id: Scalars["String"];
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
  search?: InputMaybe<PoliticianSearch>;
};

export type QueryRaceByIdArgs = {
  id: Scalars["String"];
};

export type QueryRaceBySlugArgs = {
  slug: Scalars["String"];
};

export type QueryRacesArgs = {
  search?: InputMaybe<RaceSearch>;
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

export type QueryVotingGuidesByUserIdArgs = {
  userId: Scalars["ID"];
};

export type RaceResult = {
  __typename?: "RaceResult";
  ballotpediaLink?: Maybe<Scalars["String"]>;
  candidates: Array<PoliticianResult>;
  createdAt: Scalars["DateTime"];
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
  slug: Scalars["String"];
  state?: Maybe<State>;
  title: Scalars["String"];
  updatedAt: Scalars["DateTime"];
  winnerId?: Maybe<Scalars["ID"]>;
};

export type RaceSearch = {
  query?: InputMaybe<Scalars["String"]>;
  state?: InputMaybe<State>;
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
  edges?: Maybe<Array<Maybe<RatingResultEdge>>>;
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

export type UpdateElectionInput = {
  description?: InputMaybe<Scalars["String"]>;
  /** Must use format YYYY-MM-DD */
  electionDate?: InputMaybe<Scalars["NaiveDate"]>;
  slug?: InputMaybe<Scalars["String"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type UpdateEmailResult = {
  __typename?: "UpdateEmailResult";
  email: Scalars["String"];
};

export type UpdateIssueTagInput = {
  category?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  slug?: InputMaybe<Scalars["String"]>;
};

export type UpdateNameResult = {
  __typename?: "UpdateNameResult";
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
};

export type UpdateOfficeInput = {
  chamber?: InputMaybe<Chamber>;
  district?: InputMaybe<Scalars["String"]>;
  districtType?: InputMaybe<District>;
  electionScope?: InputMaybe<ElectionScope>;
  incumbentId?: InputMaybe<Scalars["UUID"]>;
  municipality?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  officeType?: InputMaybe<Scalars["String"]>;
  politicalScope?: InputMaybe<PoliticalScope>;
  slug?: InputMaybe<Scalars["String"]>;
  state?: InputMaybe<State>;
  termLength?: InputMaybe<Scalars["Int"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type UpdateOrganizationInput = {
  description?: InputMaybe<Scalars["String"]>;
  email?: InputMaybe<Scalars["String"]>;
  facebookUrl?: InputMaybe<Scalars["String"]>;
  headquartersAddressId?: InputMaybe<Scalars["UUID"]>;
  headquartersPhone?: InputMaybe<Scalars["String"]>;
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

export type UpdatePasswordInput = {
  newPassword: Scalars["String"];
  oldPassword: Scalars["String"];
};

export type UpdatePoliticianInput = {
  ballotName?: InputMaybe<Scalars["String"]>;
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
  instagramUrl?: InputMaybe<Scalars["String"]>;
  issueTags?: InputMaybe<CreateOrConnectIssueTagInput>;
  lastName?: InputMaybe<Scalars["String"]>;
  legiscanPeopleId?: InputMaybe<Scalars["Int"]>;
  linkedinUrl?: InputMaybe<Scalars["String"]>;
  middleName?: InputMaybe<Scalars["String"]>;
  nickname?: InputMaybe<Scalars["String"]>;
  officeId?: InputMaybe<Scalars["UUID"]>;
  organizationEndorsements?: InputMaybe<CreateOrConnectOrganizationInput>;
  party?: InputMaybe<PoliticalParty>;
  politicianEndorsements?: InputMaybe<CreateOrConnectPoliticianInput>;
  preferredName?: InputMaybe<Scalars["String"]>;
  suffix?: InputMaybe<Scalars["String"]>;
  thumbnailImageUrl?: InputMaybe<Scalars["String"]>;
  tiktokUrl?: InputMaybe<Scalars["String"]>;
  twitterUrl?: InputMaybe<Scalars["String"]>;
  upcomingRaceId?: InputMaybe<Scalars["UUID"]>;
  votesmartCandidateBio?: InputMaybe<Scalars["JSON"]>;
  votesmartCandidateId?: InputMaybe<Scalars["Int"]>;
  votesmartCandidateRatings?: InputMaybe<Scalars["JSON"]>;
  websiteUrl?: InputMaybe<Scalars["String"]>;
  youtubeUrl?: InputMaybe<Scalars["String"]>;
};

export type UpdateRaceInput = {
  ballotpediaLink?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  earlyVotingBeginsDate?: InputMaybe<Scalars["NaiveDate"]>;
  electionId?: InputMaybe<Scalars["UUID"]>;
  officeId?: InputMaybe<Scalars["UUID"]>;
  officialWebsite?: InputMaybe<Scalars["String"]>;
  party?: InputMaybe<PoliticalParty>;
  raceType?: InputMaybe<RaceType>;
  slug?: InputMaybe<Scalars["String"]>;
  state?: InputMaybe<State>;
  title?: InputMaybe<Scalars["String"]>;
  winnerId?: InputMaybe<Scalars["UUID"]>;
};

export type UpdateUsernameResult = {
  __typename?: "UpdateUsernameResult";
  username: Scalars["String"];
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

export type UserResult = {
  __typename?: "UserResult";
  address?: Maybe<AddressResult>;
  email: Scalars["String"];
  firstName?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  lastName?: Maybe<Scalars["String"]>;
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
    politician: {
      __typename?: "PoliticianResult";
      fullName: string;
      party?: PoliticalParty | null;
      upcomingRace?: {
        __typename?: "RaceResult";
        title: string;
        candidates: Array<{
          __typename?: "PoliticianResult";
          fullName: string;
        }>;
      } | null;
    };
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

export type UpcomingElectionsQueryVariables = Exact<{ [key: string]: never }>;

export type UpcomingElectionsQuery = {
  __typename?: "Query";
  upcomingElections: Array<{
    __typename?: "ElectionResult";
    id: string;
    title: string;
    description?: string | null;
    electionDate: any;
    racesByUserDistricts: Array<{
      __typename?: "RaceResult";
      id: string;
      title: string;
      party?: PoliticalParty | null;
      office: {
        __typename?: "OfficeResult";
        id: string;
        title: string;
        district?: string | null;
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
    }>;
  }>;
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

export type OrganizationBySlugQueryVariables = Exact<{
  slug: Scalars["String"];
}>;

export type OrganizationBySlugQuery = {
  __typename?: "Query";
  organizationBySlug: {
    __typename?: "OrganizationResult";
    id: string;
    name: string;
    thumbnailImageUrl?: string | null;
  };
};

export type PoliticianIndexQueryVariables = Exact<{
  pageSize?: InputMaybe<Scalars["Int"]>;
  cursor?: InputMaybe<Scalars["String"]>;
  search?: InputMaybe<PoliticianSearch>;
  filter?: InputMaybe<PoliticianFilter>;
}>;

export type PoliticianIndexQuery = {
  __typename?: "Query";
  politicians: {
    __typename?: "PoliticianResultConnection";
    totalCount: number;
    edges?: Array<{
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
          municipality?: string | null;
          district?: string | null;
          state?: State | null;
          officeType?: string | null;
        } | null;
        votesmartCandidateBio?: {
          __typename?: "GetCandidateBioResponse";
          office?: {
            __typename?: "Office";
            title: string;
            district: string;
            typeField: string;
          } | null;
          candidate: { __typename?: "Candidate"; photo: string };
        } | null;
      };
    } | null> | null;
    pageInfo: {
      __typename?: "PageInfo";
      hasNextPage: boolean;
      endCursor?: string | null;
    };
  };
};

export type PoliticianBySlugQueryVariables = Exact<{
  slug: Scalars["String"];
}>;

export type PoliticianBySlugQuery = {
  __typename?: "Query";
  politicianBySlug: {
    __typename?: "PoliticianResult";
    id: string;
    fullName: string;
    nickname?: string | null;
    preferredName?: string | null;
    homeState?: State | null;
    party?: PoliticalParty | null;
    thumbnailImageUrl?: string | null;
    websiteUrl?: string | null;
    twitterUrl?: string | null;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    yearsInPublicOffice?: number | null;
    age?: number | null;
    upcomingRace?: {
      __typename?: "RaceResult";
      title: string;
      raceType: RaceType;
      state?: State | null;
      electionDate?: any | null;
      office: { __typename?: "OfficeResult"; title: string };
      candidates: Array<{
        __typename?: "PoliticianResult";
        id: string;
        slug: string;
        fullName: string;
        thumbnailImageUrl?: string | null;
        party?: PoliticalParty | null;
      }>;
    } | null;
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
    sponsoredBills: {
      __typename?: "BillResultConnection";
      edges?: Array<{
        __typename?: "BillResultEdge";
        node: {
          __typename?: "BillResult";
          slug: string;
          billNumber: string;
          title: string;
          legislationStatus: LegislationStatus;
        };
      } | null> | null;
    };
    endorsements: {
      __typename?: "Endorsements";
      organizations: Array<{
        __typename?: "OrganizationResult";
        id: string;
        slug: string;
        name: string;
        thumbnailImageUrl?: string | null;
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
    ratings: {
      __typename?: "RatingResultConnection";
      edges?: Array<{
        __typename?: "RatingResultEdge";
        node: {
          __typename?: "RatingResult";
          vsRating: { __typename?: "VsRating"; rating: any };
          organization?: {
            __typename?: "OrganizationResult";
            slug: string;
            name: string;
            thumbnailImageUrl?: string | null;
          } | null;
        };
      } | null> | null;
    };
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
    };
    election: {
      __typename?: "ElectionResult";
      slug: string;
      electionDate: any;
      title: string;
      description?: string | null;
    };
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
    candidates: Array<{
      __typename?: "VotingGuideCandidateResult";
      isEndorsement: boolean;
      note?: string | null;
      politician: { __typename?: "PoliticianResult"; id: string };
    }>;
  } | null;
};

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

useValidateEmailAvailableQuery.getKey = (
  variables: ValidateEmailAvailableQueryVariables
) => ["ValidateEmailAvailable", variables];

export const useInfiniteValidateEmailAvailableQuery = <
  TData = ValidateEmailAvailableQuery,
  TError = unknown
>(
  pageParamKey: keyof ValidateEmailAvailableQueryVariables,
  variables: ValidateEmailAvailableQueryVariables,
  options?: UseInfiniteQueryOptions<ValidateEmailAvailableQuery, TError, TData>
) =>
  useInfiniteQuery<ValidateEmailAvailableQuery, TError, TData>(
    ["ValidateEmailAvailable.infinite", variables],
    (metaData) =>
      fetcher<
        ValidateEmailAvailableQuery,
        ValidateEmailAvailableQueryVariables
      >(ValidateEmailAvailableDocument, {
        ...variables,
        ...(metaData.pageParam ?? {}),
      })(),
    options
  );

useInfiniteValidateEmailAvailableQuery.getKey = (
  variables: ValidateEmailAvailableQueryVariables
) => ["ValidateEmailAvailable.infinite", variables];

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

useValidatePasswordEntropyQuery.getKey = (
  variables: ValidatePasswordEntropyQueryVariables
) => ["ValidatePasswordEntropy", variables];

export const useInfiniteValidatePasswordEntropyQuery = <
  TData = ValidatePasswordEntropyQuery,
  TError = unknown
>(
  pageParamKey: keyof ValidatePasswordEntropyQueryVariables,
  variables: ValidatePasswordEntropyQueryVariables,
  options?: UseInfiniteQueryOptions<ValidatePasswordEntropyQuery, TError, TData>
) =>
  useInfiniteQuery<ValidatePasswordEntropyQuery, TError, TData>(
    ["ValidatePasswordEntropy.infinite", variables],
    (metaData) =>
      fetcher<
        ValidatePasswordEntropyQuery,
        ValidatePasswordEntropyQueryVariables
      >(ValidatePasswordEntropyDocument, {
        ...variables,
        ...(metaData.pageParam ?? {}),
      })(),
    options
  );

useInfiniteValidatePasswordEntropyQuery.getKey = (
  variables: ValidatePasswordEntropyQueryVariables
) => ["ValidatePasswordEntropy.infinite", variables];

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

useCurrentUserQuery.getKey = (variables?: CurrentUserQueryVariables) =>
  variables === undefined ? ["CurrentUser"] : ["CurrentUser", variables];

export const useInfiniteCurrentUserQuery = <
  TData = CurrentUserQuery,
  TError = unknown
>(
  pageParamKey: keyof CurrentUserQueryVariables,
  variables?: CurrentUserQueryVariables,
  options?: UseInfiniteQueryOptions<CurrentUserQuery, TError, TData>
) =>
  useInfiniteQuery<CurrentUserQuery, TError, TData>(
    variables === undefined
      ? ["CurrentUser.infinite"]
      : ["CurrentUser.infinite", variables],
    (metaData) =>
      fetcher<CurrentUserQuery, CurrentUserQueryVariables>(
        CurrentUserDocument,
        { ...variables, ...(metaData.pageParam ?? {}) }
      )(),
    options
  );

useInfiniteCurrentUserQuery.getKey = (variables?: CurrentUserQueryVariables) =>
  variables === undefined
    ? ["CurrentUser.infinite"]
    : ["CurrentUser.infinite", variables];

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
    politician {
      fullName
      party
      upcomingRace {
        title
        candidates {
          fullName
        }
      }
    }
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
export const UpcomingElectionsDocument = /*#__PURE__*/ `
    query UpcomingElections {
  upcomingElections {
    id
    title
    description
    electionDate
    racesByUserDistricts {
      id
      title
      party
      office {
        id
        title
        district
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
    }
  }
}
    `;
export const useUpcomingElectionsQuery = <
  TData = UpcomingElectionsQuery,
  TError = unknown
>(
  variables?: UpcomingElectionsQueryVariables,
  options?: UseQueryOptions<UpcomingElectionsQuery, TError, TData>
) =>
  useQuery<UpcomingElectionsQuery, TError, TData>(
    variables === undefined
      ? ["UpcomingElections"]
      : ["UpcomingElections", variables],
    fetcher<UpcomingElectionsQuery, UpcomingElectionsQueryVariables>(
      UpcomingElectionsDocument,
      variables
    ),
    options
  );

useUpcomingElectionsQuery.getKey = (
  variables?: UpcomingElectionsQueryVariables
) =>
  variables === undefined
    ? ["UpcomingElections"]
    : ["UpcomingElections", variables];

export const useInfiniteUpcomingElectionsQuery = <
  TData = UpcomingElectionsQuery,
  TError = unknown
>(
  pageParamKey: keyof UpcomingElectionsQueryVariables,
  variables?: UpcomingElectionsQueryVariables,
  options?: UseInfiniteQueryOptions<UpcomingElectionsQuery, TError, TData>
) =>
  useInfiniteQuery<UpcomingElectionsQuery, TError, TData>(
    variables === undefined
      ? ["UpcomingElections.infinite"]
      : ["UpcomingElections.infinite", variables],
    (metaData) =>
      fetcher<UpcomingElectionsQuery, UpcomingElectionsQueryVariables>(
        UpcomingElectionsDocument,
        { ...variables, ...(metaData.pageParam ?? {}) }
      )(),
    options
  );

useInfiniteUpcomingElectionsQuery.getKey = (
  variables?: UpcomingElectionsQueryVariables
) =>
  variables === undefined
    ? ["UpcomingElections.infinite"]
    : ["UpcomingElections.infinite", variables];

useUpcomingElectionsQuery.fetcher = (
  variables?: UpcomingElectionsQueryVariables
) =>
  fetcher<UpcomingElectionsQuery, UpcomingElectionsQueryVariables>(
    UpcomingElectionsDocument,
    variables
  );
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

useBillBySlugQuery.getKey = (variables: BillBySlugQueryVariables) => [
  "BillBySlug",
  variables,
];

export const useInfiniteBillBySlugQuery = <
  TData = BillBySlugQuery,
  TError = unknown
>(
  pageParamKey: keyof BillBySlugQueryVariables,
  variables: BillBySlugQueryVariables,
  options?: UseInfiniteQueryOptions<BillBySlugQuery, TError, TData>
) =>
  useInfiniteQuery<BillBySlugQuery, TError, TData>(
    ["BillBySlug.infinite", variables],
    (metaData) =>
      fetcher<BillBySlugQuery, BillBySlugQueryVariables>(BillBySlugDocument, {
        ...variables,
        ...(metaData.pageParam ?? {}),
      })(),
    options
  );

useInfiniteBillBySlugQuery.getKey = (variables: BillBySlugQueryVariables) => [
  "BillBySlug.infinite",
  variables,
];

useBillBySlugQuery.fetcher = (variables: BillBySlugQueryVariables) =>
  fetcher<BillBySlugQuery, BillBySlugQueryVariables>(
    BillBySlugDocument,
    variables
  );
export const OrganizationBySlugDocument = /*#__PURE__*/ `
    query OrganizationBySlug($slug: String!) {
  organizationBySlug(slug: $slug) {
    id
    name
    thumbnailImageUrl
  }
}
    `;
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

useOrganizationBySlugQuery.getKey = (
  variables: OrganizationBySlugQueryVariables
) => ["OrganizationBySlug", variables];

export const useInfiniteOrganizationBySlugQuery = <
  TData = OrganizationBySlugQuery,
  TError = unknown
>(
  pageParamKey: keyof OrganizationBySlugQueryVariables,
  variables: OrganizationBySlugQueryVariables,
  options?: UseInfiniteQueryOptions<OrganizationBySlugQuery, TError, TData>
) =>
  useInfiniteQuery<OrganizationBySlugQuery, TError, TData>(
    ["OrganizationBySlug.infinite", variables],
    (metaData) =>
      fetcher<OrganizationBySlugQuery, OrganizationBySlugQueryVariables>(
        OrganizationBySlugDocument,
        { ...variables, ...(metaData.pageParam ?? {}) }
      )(),
    options
  );

useInfiniteOrganizationBySlugQuery.getKey = (
  variables: OrganizationBySlugQueryVariables
) => ["OrganizationBySlug.infinite", variables];

useOrganizationBySlugQuery.fetcher = (
  variables: OrganizationBySlugQueryVariables
) =>
  fetcher<OrganizationBySlugQuery, OrganizationBySlugQueryVariables>(
    OrganizationBySlugDocument,
    variables
  );
export const PoliticianIndexDocument = /*#__PURE__*/ `
    query PoliticianIndex($pageSize: Int, $cursor: String, $search: PoliticianSearch, $filter: PoliticianFilter) {
  politicians(first: $pageSize, after: $cursor, search: $search, filter: $filter) {
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
          municipality
          district
          state
          officeType
        }
        votesmartCandidateBio {
          office {
            title
            district
            typeField
          }
          candidate {
            photo
          }
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

usePoliticianIndexQuery.getKey = (variables?: PoliticianIndexQueryVariables) =>
  variables === undefined
    ? ["PoliticianIndex"]
    : ["PoliticianIndex", variables];

export const useInfinitePoliticianIndexQuery = <
  TData = PoliticianIndexQuery,
  TError = unknown
>(
  pageParamKey: keyof PoliticianIndexQueryVariables,
  variables?: PoliticianIndexQueryVariables,
  options?: UseInfiniteQueryOptions<PoliticianIndexQuery, TError, TData>
) =>
  useInfiniteQuery<PoliticianIndexQuery, TError, TData>(
    variables === undefined
      ? ["PoliticianIndex.infinite"]
      : ["PoliticianIndex.infinite", variables],
    (metaData) =>
      fetcher<PoliticianIndexQuery, PoliticianIndexQueryVariables>(
        PoliticianIndexDocument,
        { ...variables, ...(metaData.pageParam ?? {}) }
      )(),
    options
  );

useInfinitePoliticianIndexQuery.getKey = (
  variables?: PoliticianIndexQueryVariables
) =>
  variables === undefined
    ? ["PoliticianIndex.infinite"]
    : ["PoliticianIndex.infinite", variables];

usePoliticianIndexQuery.fetcher = (variables?: PoliticianIndexQueryVariables) =>
  fetcher<PoliticianIndexQuery, PoliticianIndexQueryVariables>(
    PoliticianIndexDocument,
    variables
  );
export const PoliticianBySlugDocument = /*#__PURE__*/ `
    query PoliticianBySlug($slug: String!) {
  politicianBySlug(slug: $slug) {
    id
    fullName
    nickname
    preferredName
    homeState
    party
    thumbnailImageUrl
    websiteUrl
    twitterUrl
    facebookUrl
    instagramUrl
    yearsInPublicOffice
    age
    upcomingRace {
      title
      raceType
      state
      electionDate
      office {
        title
      }
      candidates {
        id
        slug
        fullName
        thumbnailImageUrl
        party
      }
    }
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
    endorsements {
      organizations {
        id
        slug
        name
        thumbnailImageUrl
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
    ratings {
      edges {
        node {
          vsRating {
            rating
          }
          organization {
            slug
            name
            thumbnailImageUrl
          }
        }
      }
    }
  }
}
    `;
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

usePoliticianBySlugQuery.getKey = (
  variables: PoliticianBySlugQueryVariables
) => ["PoliticianBySlug", variables];

export const useInfinitePoliticianBySlugQuery = <
  TData = PoliticianBySlugQuery,
  TError = unknown
>(
  pageParamKey: keyof PoliticianBySlugQueryVariables,
  variables: PoliticianBySlugQueryVariables,
  options?: UseInfiniteQueryOptions<PoliticianBySlugQuery, TError, TData>
) =>
  useInfiniteQuery<PoliticianBySlugQuery, TError, TData>(
    ["PoliticianBySlug.infinite", variables],
    (metaData) =>
      fetcher<PoliticianBySlugQuery, PoliticianBySlugQueryVariables>(
        PoliticianBySlugDocument,
        { ...variables, ...(metaData.pageParam ?? {}) }
      )(),
    options
  );

useInfinitePoliticianBySlugQuery.getKey = (
  variables: PoliticianBySlugQueryVariables
) => ["PoliticianBySlug.infinite", variables];

usePoliticianBySlugQuery.fetcher = (
  variables: PoliticianBySlugQueryVariables
) =>
  fetcher<PoliticianBySlugQuery, PoliticianBySlugQueryVariables>(
    PoliticianBySlugDocument,
    variables
  );
export const VotingGuidesByUserIdDocument = /*#__PURE__*/ `
    query votingGuidesByUserId($userId: ID!) {
  votingGuidesByUserId(userId: $userId) {
    id
    title
    description
    electionId
    user {
      id
      username
      lastName
      firstName
    }
    election {
      slug
      electionDate
      title
      description
    }
  }
}
    `;
export const useVotingGuidesByUserIdQuery = <
  TData = VotingGuidesByUserIdQuery,
  TError = unknown
>(
  variables: VotingGuidesByUserIdQueryVariables,
  options?: UseQueryOptions<VotingGuidesByUserIdQuery, TError, TData>
) =>
  useQuery<VotingGuidesByUserIdQuery, TError, TData>(
    ["votingGuidesByUserId", variables],
    fetcher<VotingGuidesByUserIdQuery, VotingGuidesByUserIdQueryVariables>(
      VotingGuidesByUserIdDocument,
      variables
    ),
    options
  );

useVotingGuidesByUserIdQuery.getKey = (
  variables: VotingGuidesByUserIdQueryVariables
) => ["votingGuidesByUserId", variables];

export const useInfiniteVotingGuidesByUserIdQuery = <
  TData = VotingGuidesByUserIdQuery,
  TError = unknown
>(
  pageParamKey: keyof VotingGuidesByUserIdQueryVariables,
  variables: VotingGuidesByUserIdQueryVariables,
  options?: UseInfiniteQueryOptions<VotingGuidesByUserIdQuery, TError, TData>
) =>
  useInfiniteQuery<VotingGuidesByUserIdQuery, TError, TData>(
    ["votingGuidesByUserId.infinite", variables],
    (metaData) =>
      fetcher<VotingGuidesByUserIdQuery, VotingGuidesByUserIdQueryVariables>(
        VotingGuidesByUserIdDocument,
        { ...variables, ...(metaData.pageParam ?? {}) }
      )(),
    options
  );

useInfiniteVotingGuidesByUserIdQuery.getKey = (
  variables: VotingGuidesByUserIdQueryVariables
) => ["votingGuidesByUserId.infinite", variables];

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
    candidates {
      politician {
        id
      }
      isEndorsement
      note
    }
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

useElectionVotingGuideByUserIdQuery.getKey = (
  variables: ElectionVotingGuideByUserIdQueryVariables
) => ["ElectionVotingGuideByUserId", variables];

export const useInfiniteElectionVotingGuideByUserIdQuery = <
  TData = ElectionVotingGuideByUserIdQuery,
  TError = unknown
>(
  pageParamKey: keyof ElectionVotingGuideByUserIdQueryVariables,
  variables: ElectionVotingGuideByUserIdQueryVariables,
  options?: UseInfiniteQueryOptions<
    ElectionVotingGuideByUserIdQuery,
    TError,
    TData
  >
) =>
  useInfiniteQuery<ElectionVotingGuideByUserIdQuery, TError, TData>(
    ["ElectionVotingGuideByUserId.infinite", variables],
    (metaData) =>
      fetcher<
        ElectionVotingGuideByUserIdQuery,
        ElectionVotingGuideByUserIdQueryVariables
      >(ElectionVotingGuideByUserIdDocument, {
        ...variables,
        ...(metaData.pageParam ?? {}),
      })(),
    options
  );

useInfiniteElectionVotingGuideByUserIdQuery.getKey = (
  variables: ElectionVotingGuideByUserIdQueryVariables
) => ["ElectionVotingGuideByUserId.infinite", variables];

useElectionVotingGuideByUserIdQuery.fetcher = (
  variables: ElectionVotingGuideByUserIdQueryVariables
) =>
  fetcher<
    ElectionVotingGuideByUserIdQuery,
    ElectionVotingGuideByUserIdQueryVariables
  >(ElectionVotingGuideByUserIdDocument, variables);
