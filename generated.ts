import { useQuery, UseQueryOptions, useInfiniteQuery, UseInfiniteQueryOptions, QueryFunctionContext } from 'react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch("https://api.staging.populist.us/", {
    method: "POST",
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
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

export type Amendment = {
  __typename?: 'Amendment';
  adopted: Scalars['Int'];
  amendmentId: Scalars['Int'];
  chamber: Scalars['String'];
  chamberId: Scalars['Int'];
  date: Scalars['String'];
  description: Scalars['String'];
  mime: Scalars['String'];
  mimeId: Scalars['Int'];
  stateLink: Scalars['String'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export enum ArgumentPosition {
  Neutral = 'NEUTRAL',
  Oppose = 'OPPOSE',
  Support = 'SUPPORT'
}

export type ArgumentResult = {
  __typename?: 'ArgumentResult';
  author: AuthorResult;
  authorId: Scalars['ID'];
  authorType: AuthorType;
  body?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  position: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  votes: Scalars['Int'];
};

export type AuthorResult = OrganizationResult | PoliticianResult;

export enum AuthorType {
  Organization = 'ORGANIZATION',
  Politician = 'POLITICIAN'
}

export type BallotMeasureResult = {
  __typename?: 'BallotMeasureResult';
  arguments: Array<BallotMeasureResult>;
  ballotMeasureCode: Scalars['String'];
  ballotState: State;
  createdAt: Scalars['DateTime'];
  definitions: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  electionId: Scalars['ID'];
  fullTextUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  legislationStatus: LegislationStatus;
  measureType: Scalars['String'];
  officialSummary?: Maybe<Scalars['String']>;
  populistSummary?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type BallotMeasureSearch = {
  ballotState?: InputMaybe<State>;
  legislationStatus?: InputMaybe<LegislationStatus>;
  slug?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type Bill = {
  __typename?: 'Bill';
  amendments: Array<Amendment>;
  billId: Scalars['Int'];
  billNumber: Scalars['String'];
  billType: Scalars['String'];
  billTypeId: Scalars['String'];
  body: Scalars['String'];
  bodyId: Scalars['Int'];
  calendar: Array<Calendar>;
  changeHash: Scalars['String'];
  committee: Scalars['JSON'];
  completed: Scalars['Int'];
  currentBody: Scalars['String'];
  currentBodyId: Scalars['Int'];
  history: Array<History>;
  pendingCommitteeId: Scalars['Int'];
  progress: Array<Progress>;
  referrals?: Maybe<Array<Referral>>;
  sasts: Array<Sast>;
  session: Session;
  sessionId: Scalars['Int'];
  sponsors: Array<Sponsor>;
  state: Scalars['String'];
  stateId: Scalars['Int'];
  stateLink: Scalars['String'];
  status: Scalars['Int'];
  statusDate?: Maybe<Scalars['String']>;
  statusType: Scalars['String'];
  subjects: Array<Subject>;
  supplements: Array<Supplement>;
  texts: Array<Text>;
  title: Scalars['String'];
  url: Scalars['String'];
  votes: Array<Vote>;
};

export type BillResult = {
  __typename?: 'BillResult';
  arguments: Array<ArgumentResult>;
  billNumber: Scalars['String'];
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  fullTextUrl?: Maybe<Scalars['String']>;
  history: Scalars['JSON'];
  id: Scalars['ID'];
  legiscanBillId?: Maybe<Scalars['Int']>;
  legiscanData: Bill;
  legislationStatus: LegislationStatus;
  officialSummary?: Maybe<Scalars['String']>;
  populistSummary?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type BillResultConnection = {
  __typename?: 'BillResultConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<BillResultEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Total result set count */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type BillResultEdge = {
  __typename?: 'BillResultEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: BillResult;
};

export type BillSearch = {
  billNumber?: InputMaybe<Scalars['String']>;
  legislationStatus?: InputMaybe<LegislationStatus>;
  slug?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type Calendar = {
  __typename?: 'Calendar';
  date: Scalars['String'];
  description: Scalars['String'];
  location: Scalars['String'];
  time: Scalars['String'];
  typeField: Scalars['String'];
  typeId: Scalars['Int'];
};

export type Candidate = {
  __typename?: 'Candidate';
  birthDate: Scalars['String'];
  birthPlace: Scalars['String'];
  candidateId: Scalars['String'];
  congMembership: Scalars['JSON'];
  crpId: Scalars['String'];
  education: Scalars['JSON'];
  family: Scalars['String'];
  firstName: Scalars['String'];
  gender: Scalars['String'];
  homeCity: Scalars['String'];
  homeState: Scalars['String'];
  lastName: Scalars['String'];
  middleName: Scalars['String'];
  nickName: Scalars['String'];
  orgMembership: Scalars['JSON'];
  photo: Scalars['String'];
  political: Scalars['JSON'];
  preferredName: Scalars['String'];
  profession: Scalars['JSON'];
  pronunciation: Scalars['String'];
  religion: Scalars['String'];
  specialMsg: Scalars['String'];
  suffix: Scalars['String'];
};

export type CreateArgumentInput = {
  authorId: Scalars['String'];
  body?: InputMaybe<Scalars['String']>;
  position: ArgumentPosition;
  title: Scalars['String'];
};

export type CreateBallotMeasureInput = {
  ballotMeasureCode: Scalars['String'];
  ballotState: State;
  definitions: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  fullTextUrl?: InputMaybe<Scalars['String']>;
  legislationStatus: LegislationStatus;
  measureType: Scalars['String'];
  officialSummary?: InputMaybe<Scalars['String']>;
  populistSummary?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type CreateBillInput = {
  arguments?: InputMaybe<Array<CreateArgumentInput>>;
  billNumber: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  fullTextUrl?: InputMaybe<Scalars['String']>;
  legiscanBillId?: InputMaybe<Scalars['Int']>;
  legiscanData?: InputMaybe<Scalars['JSON']>;
  legislationStatus: LegislationStatus;
  officialSummary?: InputMaybe<Scalars['String']>;
  populistSummary?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
  votesmartBillId?: InputMaybe<Scalars['Int']>;
};

export type CreateElectionInput = {
  description?: InputMaybe<Scalars['String']>;
  /** Must use format YYYY-MM-DD */
  electionDate: Scalars['NaiveDate'];
  slug?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type CreateIssueTagInput = {
  category?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  slug?: InputMaybe<Scalars['String']>;
};

export type CreateOrConnectIssueTagInput = {
  connect?: InputMaybe<Array<Scalars['String']>>;
  create?: InputMaybe<Array<CreateIssueTagInput>>;
};

export type CreateOrConnectOrganizationInput = {
  connect?: InputMaybe<Array<Scalars['String']>>;
  create?: InputMaybe<Array<CreateOrganizationInput>>;
};

export type CreateOrConnectPoliticianInput = {
  connect?: InputMaybe<Array<Scalars['String']>>;
  create?: InputMaybe<Array<CreatePoliticianInput>>;
};

export type CreateOrganizationInput = {
  description?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  facebookUrl?: InputMaybe<Scalars['String']>;
  headquartersPhone?: InputMaybe<Scalars['String']>;
  instagramUrl?: InputMaybe<Scalars['String']>;
  issueTags?: InputMaybe<CreateOrConnectIssueTagInput>;
  name: Scalars['String'];
  slug?: InputMaybe<Scalars['String']>;
  taxClassification?: InputMaybe<Scalars['String']>;
  thumbnailImageUrl?: InputMaybe<Scalars['String']>;
  twitterUrl?: InputMaybe<Scalars['String']>;
  websiteUrl?: InputMaybe<Scalars['String']>;
};

export type CreatePoliticianInput = {
  ballotName?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  facebookUrl?: InputMaybe<Scalars['String']>;
  firstName: Scalars['String'];
  homeState: State;
  instagramUrl?: InputMaybe<Scalars['String']>;
  issueTags?: InputMaybe<CreateOrConnectIssueTagInput>;
  lastName: Scalars['String'];
  legiscanPeopleId?: InputMaybe<Scalars['Int']>;
  middleName?: InputMaybe<Scalars['String']>;
  nickname?: InputMaybe<Scalars['String']>;
  officeParty?: InputMaybe<PoliticalParty>;
  organizationEndorsements?: InputMaybe<CreateOrConnectOrganizationInput>;
  politicianEndorsements?: InputMaybe<CreateOrConnectPoliticianInput>;
  preferredName?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
  thumbnailImageUrl?: InputMaybe<Scalars['String']>;
  twitterUrl?: InputMaybe<Scalars['String']>;
  votesmartCandidateBio?: InputMaybe<Scalars['JSON']>;
  votesmartCandidateId?: InputMaybe<Scalars['Int']>;
  websiteUrl?: InputMaybe<Scalars['String']>;
};

export type CreateUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  role?: InputMaybe<Role>;
  username: Scalars['String'];
};

export type CreateUserResult = {
  __typename?: 'CreateUserResult';
  id: Scalars['ID'];
};

export type DeleteArgumentResult = {
  __typename?: 'DeleteArgumentResult';
  id: Scalars['String'];
};

export type DeleteBallotMeasureResult = {
  __typename?: 'DeleteBallotMeasureResult';
  id: Scalars['String'];
};

export type DeleteBillResult = {
  __typename?: 'DeleteBillResult';
  id: Scalars['String'];
};

export type DeleteElectionResult = {
  __typename?: 'DeleteElectionResult';
  id: Scalars['String'];
};

export type DeleteIssueTagResult = {
  __typename?: 'DeleteIssueTagResult';
  id: Scalars['String'];
};

export type DeleteOrganizationResult = {
  __typename?: 'DeleteOrganizationResult';
  id: Scalars['String'];
};

export type DeletePoliticianResult = {
  __typename?: 'DeletePoliticianResult';
  id: Scalars['String'];
};

export type ElectionResult = {
  __typename?: 'ElectionResult';
  description?: Maybe<Scalars['String']>;
  electionDate: Scalars['NaiveDate'];
  id: Scalars['ID'];
  slug: Scalars['String'];
  title: Scalars['String'];
};

export type ElectionSearchInput = {
  slug?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type Endorsements = {
  __typename?: 'Endorsements';
  organizations: Array<OrganizationResult>;
  politicians: Array<PoliticianResult>;
};

export type GeneralInfo = {
  __typename?: 'GeneralInfo';
  linkBack: Scalars['String'];
  title: Scalars['String'];
};

export type GetCandidateBioResponse = {
  __typename?: 'GetCandidateBioResponse';
  candidate: Candidate;
  generalInfo: GeneralInfo;
  office?: Maybe<Office>;
};

export type History = {
  __typename?: 'History';
  action: Scalars['String'];
  chamber: Scalars['String'];
  chamberId: Scalars['Int'];
  date: Scalars['String'];
  importance: Scalars['Int'];
};

export type IssueTagResult = {
  __typename?: 'IssueTagResult';
  ballotMeasures: Array<BallotMeasureResult>;
  bills: Array<BillResult>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  organizations: Array<OrganizationResult>;
  politicians: Array<PoliticianResult>;
  slug: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type IssueTagSearch = {
  name?: InputMaybe<Scalars['String']>;
};

export enum LegislationStatus {
  BecameLaw = 'BECAME_LAW',
  FailedHouse = 'FAILED_HOUSE',
  FailedSenate = 'FAILED_SENATE',
  Introduced = 'INTRODUCED',
  PassedHouse = 'PASSED_HOUSE',
  PassedSenate = 'PASSED_SENATE',
  ResolvingDifferences = 'RESOLVING_DIFFERENCES',
  SentToExecutive = 'SENT_TO_EXECUTIVE',
  Unknown = 'UNKNOWN',
  Vetoed = 'VETOED'
}

export type LoginInput = {
  emailOrUsername: Scalars['String'];
  password: Scalars['String'];
};

export type LoginResult = {
  __typename?: 'LoginResult';
  accessToken: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBallotMeasure: BallotMeasureResult;
  createBill: BillResult;
  createElection: ElectionResult;
  createIssueTag: IssueTagResult;
  createOrganization: OrganizationResult;
  createPolitician: PoliticianResult;
  createUser: CreateUserResult;
  deleteArgument: DeleteArgumentResult;
  deleteBallotMeasure: DeleteBallotMeasureResult;
  deleteBill: DeleteBillResult;
  deleteElection: DeleteElectionResult;
  deleteIssueTag: DeleteIssueTagResult;
  deleteOrganization: DeleteOrganizationResult;
  deletePolitician: DeletePoliticianResult;
  downvoteArgument: Scalars['Boolean'];
  login: LoginResult;
  updateArgument: ArgumentResult;
  updateBallotMeasure: BallotMeasureResult;
  updateBill: BillResult;
  updateElection: ElectionResult;
  updateIssueTag: IssueTagResult;
  updateOrganization: OrganizationResult;
  updatePolitician: PoliticianResult;
  uploadPoliticianThumbnail: Scalars['Int'];
  upvoteArgument: Scalars['Boolean'];
};


export type MutationCreateBallotMeasureArgs = {
  electionId: Scalars['UUID'];
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


export type MutationCreateOrganizationArgs = {
  input: CreateOrganizationInput;
};


export type MutationCreatePoliticianArgs = {
  input: CreatePoliticianInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteArgumentArgs = {
  id: Scalars['String'];
};


export type MutationDeleteBallotMeasureArgs = {
  id: Scalars['String'];
};


export type MutationDeleteBillArgs = {
  id: Scalars['String'];
};


export type MutationDeleteElectionArgs = {
  id: Scalars['String'];
};


export type MutationDeleteIssueTagArgs = {
  id: Scalars['String'];
};


export type MutationDeleteOrganizationArgs = {
  id: Scalars['String'];
};


export type MutationDeletePoliticianArgs = {
  id: Scalars['String'];
};


export type MutationDownvoteArgumentArgs = {
  argumentId: Scalars['ID'];
  populistUserId: Scalars['ID'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationUpdateArgumentArgs = {
  id: Scalars['ID'];
  input: UpdateArgumentInput;
};


export type MutationUpdateBallotMeasureArgs = {
  id: Scalars['String'];
  input: UpdateBallotMeasureInput;
};


export type MutationUpdateBillArgs = {
  id?: InputMaybe<Scalars['String']>;
  input: UpdateBillInput;
  legiscanBillId?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateElectionArgs = {
  id: Scalars['String'];
  input: UpdateElectionInput;
};


export type MutationUpdateIssueTagArgs = {
  id: Scalars['String'];
  input: UpdateIssueTagInput;
};


export type MutationUpdateOrganizationArgs = {
  id: Scalars['String'];
  input: UpdateOrganizationInput;
};


export type MutationUpdatePoliticianArgs = {
  id: Scalars['String'];
  input: UpdatePoliticianInput;
};


export type MutationUploadPoliticianThumbnailArgs = {
  file: Scalars['Upload'];
};


export type MutationUpvoteArgumentArgs = {
  argumentId: Scalars['ID'];
  populistUserId: Scalars['ID'];
};

export type Office = {
  __typename?: 'Office';
  district: Scalars['String'];
  districtId: Scalars['String'];
  firstElect: Scalars['String'];
  lastElect: Scalars['String'];
  name: Array<Scalars['String']>;
  nextElect: Scalars['String'];
  parties: Scalars['String'];
  shortTitle: Scalars['String'];
  stateId: Scalars['String'];
  status: Scalars['String'];
  termEnd: Scalars['String'];
  termStart: Scalars['String'];
  title: Scalars['String'];
  typeField: Scalars['String'];
};

export type OrganizationResult = {
  __typename?: 'OrganizationResult';
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  issueTags: Array<IssueTagResult>;
  name: Scalars['String'];
  slug: Scalars['String'];
  thumbnailImageUrl?: Maybe<Scalars['String']>;
  websiteUrl?: Maybe<Scalars['String']>;
};

export type OrganizationResultConnection = {
  __typename?: 'OrganizationResultConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<OrganizationResultEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Total result set count */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type OrganizationResultEdge = {
  __typename?: 'OrganizationResultEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: OrganizationResult;
};

export type OrganizationSearch = {
  name?: InputMaybe<Scalars['String']>;
};

/** Information about pagination in a connection */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

export enum PoliticalParty {
  Constitution = 'CONSTITUTION',
  Democratic = 'DEMOCRATIC',
  Green = 'GREEN',
  Libertarian = 'LIBERTARIAN',
  Republican = 'REPUBLICAN',
  Unknown = 'UNKNOWN'
}

export type PoliticianResult = {
  __typename?: 'PoliticianResult';
  ballotName?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  endorsements: Endorsements;
  facebookUrl?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  fullName: Scalars['String'];
  homeState: State;
  id: Scalars['ID'];
  instagramUrl?: Maybe<Scalars['String']>;
  issueTags: Array<IssueTagResult>;
  lastName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  officeParty?: Maybe<PoliticalParty>;
  preferredName?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  sponsoredBills: Array<BillResult>;
  thumbnailImageUrl?: Maybe<Scalars['String']>;
  twitterUrl?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  votesmartCandidateBio: GetCandidateBioResponse;
  votesmartCandidateId: Scalars['Int'];
  websiteUrl?: Maybe<Scalars['String']>;
  /**
   * Calculates the total years a politician has been in office using
   * the votesmart politicial experience array.  Does not take into account
   * objects where the politician is considered a 'candidate'
   */
  yearsInPublicOffice: Scalars['Int'];
};

export type PoliticianResultConnection = {
  __typename?: 'PoliticianResultConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<PoliticianResultEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Total result set count */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type PoliticianResultEdge = {
  __typename?: 'PoliticianResultEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: PoliticianResult;
};

export type PoliticianSearch = {
  homeState?: InputMaybe<State>;
  name?: InputMaybe<Scalars['String']>;
  officeParty?: InputMaybe<PoliticalParty>;
};

export type Progress = {
  __typename?: 'Progress';
  date: Scalars['String'];
  event: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  allBallotMeasures: Array<BallotMeasureResult>;
  allElections: Array<ElectionResult>;
  allIssueTags: Array<IssueTagResult>;
  ballotMeasures: Array<BallotMeasureResult>;
  bills: BillResultConnection;
  electionById: ElectionResult;
  elections: Array<ElectionResult>;
  health: Scalars['Boolean'];
  issueTagBySlug: IssueTagResult;
  issueTags: Array<IssueTagResult>;
  organizationBySlug: OrganizationResult;
  organizations: OrganizationResultConnection;
  politicianById: PoliticianResult;
  politicianBySlug: PoliticianResult;
  politicians: PoliticianResultConnection;
  upcomingElections: Array<ElectionResult>;
};


export type QueryBallotMeasuresArgs = {
  search: BallotMeasureSearch;
};


export type QueryBillsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  search?: BillSearch;
};


export type QueryElectionByIdArgs = {
  id: Scalars['String'];
};


export type QueryElectionsArgs = {
  search: ElectionSearchInput;
};


export type QueryIssueTagBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryIssueTagsArgs = {
  search: IssueTagSearch;
};


export type QueryOrganizationBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryOrganizationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<OrganizationSearch>;
};


export type QueryPoliticianByIdArgs = {
  id: Scalars['String'];
};


export type QueryPoliticianBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryPoliticiansArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<PoliticianSearch>;
};

export type Referral = {
  __typename?: 'Referral';
  chamber: Scalars['String'];
  chamberId: Scalars['Int'];
  committeeId: Scalars['Int'];
  date: Scalars['String'];
  name: Scalars['String'];
};

export enum Role {
  Basic = 'BASIC',
  Premium = 'PREMIUM',
  Staff = 'STAFF',
  Superuser = 'SUPERUSER'
}

export type RollCall = {
  __typename?: 'RollCall';
  absent: Scalars['Int'];
  billId: Scalars['Int'];
  chamber: Scalars['String'];
  chamberId: Scalars['Int'];
  date: Scalars['String'];
  desc: Scalars['String'];
  nay: Scalars['Int'];
  nv: Scalars['Int'];
  passed: Scalars['Int'];
  rollCallId: Scalars['Int'];
  total: Scalars['Int'];
  votes: Array<Vote>;
  yea: Scalars['Int'];
};

export type Sast = {
  __typename?: 'Sast';
  sastBillId: Scalars['Int'];
  sastBillNumber: Scalars['String'];
  typeField: Scalars['String'];
  typeId: Scalars['Int'];
};

export type Session = {
  __typename?: 'Session';
  sessionId: Scalars['Int'];
  sessionName: Scalars['String'];
  sessionTitle: Scalars['String'];
  special: Scalars['Int'];
  yearEnd: Scalars['Int'];
  yearStart: Scalars['Int'];
};

export type Sponsor = {
  __typename?: 'Sponsor';
  ballotpedia: Scalars['String'];
  committeeId: Scalars['JSON'];
  committeeSponsor: Scalars['Int'];
  district: Scalars['String'];
  firstName: Scalars['String'];
  ftmEid: Scalars['Int'];
  lastName: Scalars['String'];
  middleName: Scalars['String'];
  name: Scalars['String'];
  nickname: Scalars['String'];
  opensecretsId: Scalars['String'];
  party: Scalars['String'];
  partyId: Scalars['JSON'];
  peopleId: Scalars['Int'];
  personHash: Scalars['String'];
  role: Scalars['String'];
  roleId: Scalars['Int'];
  sponsorOrder: Scalars['Int'];
  sponsorTypeId: Scalars['Int'];
  suffix: Scalars['String'];
  votesmartId: Scalars['Int'];
};

export enum State {
  Ak = 'AK',
  Al = 'AL',
  Ar = 'AR',
  Az = 'AZ',
  Ca = 'CA',
  Co = 'CO',
  Ct = 'CT',
  Dc = 'DC',
  De = 'DE',
  Fl = 'FL',
  Ga = 'GA',
  Hi = 'HI',
  Ia = 'IA',
  Id = 'ID',
  Il = 'IL',
  In = 'IN',
  Ks = 'KS',
  Ky = 'KY',
  La = 'LA',
  Ma = 'MA',
  Md = 'MD',
  Me = 'ME',
  Mi = 'MI',
  Mn = 'MN',
  Mo = 'MO',
  Ms = 'MS',
  Mt = 'MT',
  Nc = 'NC',
  Nd = 'ND',
  Ne = 'NE',
  Nh = 'NH',
  Nj = 'NJ',
  Nm = 'NM',
  Nv = 'NV',
  Ny = 'NY',
  Oh = 'OH',
  Ok = 'OK',
  Or = 'OR',
  Pa = 'PA',
  Ri = 'RI',
  Sc = 'SC',
  Sd = 'SD',
  Tn = 'TN',
  Tx = 'TX',
  Ut = 'UT',
  Va = 'VA',
  Vt = 'VT',
  Wa = 'WA',
  Wi = 'WI',
  Wv = 'WV',
  Wy = 'WY'
}

export type Subject = {
  __typename?: 'Subject';
  subjectId: Scalars['Int'];
  subjectName: Scalars['String'];
};

export type Supplement = {
  __typename?: 'Supplement';
  date: Scalars['String'];
  description: Scalars['String'];
  mime: Scalars['String'];
  mimeId: Scalars['Int'];
  stateLink: Scalars['String'];
  supplementId: Scalars['Int'];
  title: Scalars['String'];
  typeField: Scalars['String'];
  typeId: Scalars['Int'];
  url: Scalars['String'];
};

export type Text = {
  __typename?: 'Text';
  date: Scalars['String'];
  docId: Scalars['Int'];
  mime: Scalars['String'];
  mimeId: Scalars['Int'];
  stateLink: Scalars['String'];
  textSize: Scalars['Int'];
  typeField: Scalars['String'];
  typeId: Scalars['Int'];
  url: Scalars['String'];
};

export type UpdateArgumentInput = {
  body?: InputMaybe<Scalars['String']>;
  position: ArgumentPosition;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateBallotMeasureInput = {
  ballotMeasureCode?: InputMaybe<Scalars['String']>;
  ballotState?: InputMaybe<State>;
  definitions?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  fullTextUrl?: InputMaybe<Scalars['String']>;
  legislationStatus?: InputMaybe<LegislationStatus>;
  measureType?: InputMaybe<Scalars['String']>;
  officialSummary?: InputMaybe<Scalars['String']>;
  populistSummary?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateBillInput = {
  arguments?: InputMaybe<Array<CreateArgumentInput>>;
  billNumber: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  fullTextUrl?: InputMaybe<Scalars['String']>;
  legiscanBillId?: InputMaybe<Scalars['Int']>;
  legiscanData?: InputMaybe<Scalars['JSON']>;
  legislationStatus?: InputMaybe<LegislationStatus>;
  officialSummary?: InputMaybe<Scalars['String']>;
  populistSummary?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateElectionInput = {
  description?: InputMaybe<Scalars['String']>;
  /** Must use format YYYY-MM-DD */
  electionDate?: InputMaybe<Scalars['NaiveDate']>;
  slug?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateIssueTagInput = {
  category?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type UpdateOrganizationInput = {
  description?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  facebookUrl?: InputMaybe<Scalars['String']>;
  headquartersPhone?: InputMaybe<Scalars['String']>;
  instagramUrl?: InputMaybe<Scalars['String']>;
  issueTags?: InputMaybe<CreateOrConnectIssueTagInput>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  taxClassification?: InputMaybe<Scalars['String']>;
  thumbnailImageUrl?: InputMaybe<Scalars['String']>;
  twitterUrl?: InputMaybe<Scalars['String']>;
  websiteUrl?: InputMaybe<Scalars['String']>;
};

export type UpdatePoliticianInput = {
  ballotName?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  facebookUrl?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  homeState?: InputMaybe<State>;
  instagramUrl?: InputMaybe<Scalars['String']>;
  issueTags?: InputMaybe<CreateOrConnectIssueTagInput>;
  lastName?: InputMaybe<Scalars['String']>;
  legiscanPeopleId?: InputMaybe<Scalars['Int']>;
  middleName?: InputMaybe<Scalars['String']>;
  nickname?: InputMaybe<Scalars['String']>;
  officeParty?: InputMaybe<PoliticalParty>;
  organizationEndorsements?: InputMaybe<CreateOrConnectOrganizationInput>;
  politicianEndorsements?: InputMaybe<CreateOrConnectPoliticianInput>;
  preferredName?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  thumbnailImageUrl?: InputMaybe<Scalars['String']>;
  twitterUrl?: InputMaybe<Scalars['String']>;
  votesmartCandidateBio?: InputMaybe<Scalars['JSON']>;
  votesmartCandidateId?: InputMaybe<Scalars['Int']>;
  websiteUrl?: InputMaybe<Scalars['String']>;
};

export type Vote = {
  __typename?: 'Vote';
  absent: Scalars['Int'];
  chamber: Scalars['String'];
  chamberId: Scalars['Int'];
  date: Scalars['String'];
  desc: Scalars['String'];
  nay: Scalars['Int'];
  nv: Scalars['Int'];
  passed: Scalars['Int'];
  /** This field is not returned from get_bill, but can be populated with a subsequent call to `get_roll_call` */
  rollCallData?: Maybe<RollCall>;
  rollCallId: Scalars['Int'];
  stateLink: Scalars['String'];
  total: Scalars['Int'];
  url: Scalars['String'];
  yea: Scalars['Int'];
};

export type OrganizationBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type OrganizationBySlugQuery = { __typename?: 'Query', organizationBySlug: { __typename?: 'OrganizationResult', id: string, name: string, thumbnailImageUrl?: string | null | undefined } };

export type PoliticianIndexQueryVariables = Exact<{
  pageSize?: InputMaybe<Scalars['Int']>;
  cursor?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<PoliticianSearch>;
}>;


export type PoliticianIndexQuery = { __typename?: 'Query', politicians: { __typename?: 'PoliticianResultConnection', totalCount: number, edges?: Array<{ __typename?: 'PoliticianResultEdge', node: { __typename?: 'PoliticianResult', id: string, slug: string, fullName: string, homeState: State, officeParty?: PoliticalParty | null | undefined, votesmartCandidateBio: { __typename?: 'GetCandidateBioResponse', office?: { __typename?: 'Office', title: string, district: string, typeField: string } | null | undefined, candidate: { __typename?: 'Candidate', photo: string } } } } | null | undefined> | null | undefined, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null | undefined } } };

export type PoliticianBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type PoliticianBySlugQuery = { __typename?: 'Query', politicianBySlug: { __typename?: 'PoliticianResult', fullName: string, nickname?: string | null | undefined, preferredName?: string | null | undefined, homeState: State, officeParty?: PoliticalParty | null | undefined, thumbnailImageUrl?: string | null | undefined, websiteUrl?: string | null | undefined, twitterUrl?: string | null | undefined, facebookUrl?: string | null | undefined, instagramUrl?: string | null | undefined, yearsInPublicOffice: number, votesmartCandidateBio: { __typename?: 'GetCandidateBioResponse', office?: { __typename?: 'Office', name: Array<string>, termStart: string, termEnd: string } | null | undefined, candidate: { __typename?: 'Candidate', photo: string, congMembership: any } }, sponsoredBills: Array<{ __typename?: 'BillResult', slug: string, billNumber: string, title: string, legislationStatus: LegislationStatus }>, endorsements: { __typename?: 'Endorsements', organizations: Array<{ __typename?: 'OrganizationResult', id: string, slug: string, name: string, thumbnailImageUrl?: string | null | undefined }>, politicians: Array<{ __typename?: 'PoliticianResult', id: string, slug: string, fullName: string, officeParty?: PoliticalParty | null | undefined, thumbnailImageUrl?: string | null | undefined, votesmartCandidateBio: { __typename?: 'GetCandidateBioResponse', office?: { __typename?: 'Office', name: Array<string>, district: string, typeField: string } | null | undefined, candidate: { __typename?: 'Candidate', photo: string } } }> } } };


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
      ['OrganizationBySlug', variables],
      fetcher<OrganizationBySlugQuery, OrganizationBySlugQueryVariables>(OrganizationBySlugDocument, variables),
      options
    );

useOrganizationBySlugQuery.getKey = (variables: OrganizationBySlugQueryVariables) => ['OrganizationBySlug', variables];
;

export const useInfiniteOrganizationBySlugQuery = <
      TData = OrganizationBySlugQuery,
      TError = unknown
    >(
      pageParamKey: keyof OrganizationBySlugQueryVariables,
      variables: OrganizationBySlugQueryVariables,
      options?: UseInfiniteQueryOptions<OrganizationBySlugQuery, TError, TData>
    ) =>
    useInfiniteQuery<OrganizationBySlugQuery, TError, TData>(
      ['OrganizationBySlug.infinite', variables],
      (metaData) => fetcher<OrganizationBySlugQuery, OrganizationBySlugQueryVariables>(OrganizationBySlugDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteOrganizationBySlugQuery.getKey = (variables: OrganizationBySlugQueryVariables) => ['OrganizationBySlug.infinite', variables];
;

useOrganizationBySlugQuery.fetcher = (variables: OrganizationBySlugQueryVariables) => fetcher<OrganizationBySlugQuery, OrganizationBySlugQueryVariables>(OrganizationBySlugDocument, variables);
export const PoliticianIndexDocument = /*#__PURE__*/ `
    query PoliticianIndex($pageSize: Int, $cursor: String, $search: PoliticianSearch) {
  politicians(first: $pageSize, after: $cursor, search: $search) {
    edges {
      node {
        id
        slug
        fullName
        homeState
        officeParty
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
      variables === undefined ? ['PoliticianIndex'] : ['PoliticianIndex', variables],
      fetcher<PoliticianIndexQuery, PoliticianIndexQueryVariables>(PoliticianIndexDocument, variables),
      options
    );

usePoliticianIndexQuery.getKey = (variables?: PoliticianIndexQueryVariables) => variables === undefined ? ['PoliticianIndex'] : ['PoliticianIndex', variables];
;

export const useInfinitePoliticianIndexQuery = <
      TData = PoliticianIndexQuery,
      TError = unknown
    >(
      pageParamKey: keyof PoliticianIndexQueryVariables,
      variables?: PoliticianIndexQueryVariables,
      options?: UseInfiniteQueryOptions<PoliticianIndexQuery, TError, TData>
    ) =>
    useInfiniteQuery<PoliticianIndexQuery, TError, TData>(
      variables === undefined ? ['PoliticianIndex.infinite'] : ['PoliticianIndex.infinite', variables],
      (metaData) => fetcher<PoliticianIndexQuery, PoliticianIndexQueryVariables>(PoliticianIndexDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfinitePoliticianIndexQuery.getKey = (variables?: PoliticianIndexQueryVariables) => variables === undefined ? ['PoliticianIndex.infinite'] : ['PoliticianIndex.infinite', variables];
;

usePoliticianIndexQuery.fetcher = (variables?: PoliticianIndexQueryVariables) => fetcher<PoliticianIndexQuery, PoliticianIndexQueryVariables>(PoliticianIndexDocument, variables);
export const PoliticianBySlugDocument = /*#__PURE__*/ `
    query PoliticianBySlug($slug: String!) {
  politicianBySlug(slug: $slug) {
    fullName
    nickname
    preferredName
    homeState
    officeParty
    thumbnailImageUrl
    websiteUrl
    twitterUrl
    facebookUrl
    instagramUrl
    yearsInPublicOffice
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
      slug
      billNumber
      title
      legislationStatus
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
        officeParty
        thumbnailImageUrl
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
      ['PoliticianBySlug', variables],
      fetcher<PoliticianBySlugQuery, PoliticianBySlugQueryVariables>(PoliticianBySlugDocument, variables),
      options
    );

usePoliticianBySlugQuery.getKey = (variables: PoliticianBySlugQueryVariables) => ['PoliticianBySlug', variables];
;

export const useInfinitePoliticianBySlugQuery = <
      TData = PoliticianBySlugQuery,
      TError = unknown
    >(
      pageParamKey: keyof PoliticianBySlugQueryVariables,
      variables: PoliticianBySlugQueryVariables,
      options?: UseInfiniteQueryOptions<PoliticianBySlugQuery, TError, TData>
    ) =>
    useInfiniteQuery<PoliticianBySlugQuery, TError, TData>(
      ['PoliticianBySlug.infinite', variables],
      (metaData) => fetcher<PoliticianBySlugQuery, PoliticianBySlugQueryVariables>(PoliticianBySlugDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfinitePoliticianBySlugQuery.getKey = (variables: PoliticianBySlugQueryVariables) => ['PoliticianBySlug.infinite', variables];
;

usePoliticianBySlugQuery.fetcher = (variables: PoliticianBySlugQueryVariables) => fetcher<PoliticianBySlugQuery, PoliticianBySlugQueryVariables>(PoliticianBySlugDocument, variables);