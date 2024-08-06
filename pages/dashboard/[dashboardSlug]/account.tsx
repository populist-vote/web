import {
  Badge,
  Button,
  Layout,
  LoaderFlag,
  Select,
  TextInput,
} from "components";
import {
  OrganizationMemberResult,
  OrganizationResult,
  OrganizationRoleType,
  PendingInviteResult,
  useInviteUserMutation,
  useOrganizationAccountQuery,
  useUpdateOrganizationMutation,
} from "generated";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { ReactNode, useMemo, useState } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from ".";
import { OrganizationAvatar } from "components/Avatar/Avatar";
import { useForm } from "react-hook-form";
import styles from "./account.module.scss";
import { toast } from "react-toastify";
import { ColumnDef } from "@tanstack/react-table";
import { Table } from "components/Table/Table";
import { FaTrash } from "react-icons/fa";
import { Modal } from "components/Modal/Modal";
import { useQueryClient } from "@tanstack/react-query";
import { getRelativeTimeString } from "utils/dates";
import { FileRejection, FileWithPath, useDropzone } from "react-dropzone";

export async function getServerSideProps({
  query,
  locale,
}: {
  query: { dashboardSlug: string };
  locale: SupportedLocale;
}) {
  return {
    props: {
      dashboardSlug: query.dashboardSlug,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common", "embeds"],
        nextI18nextConfig
      )),
    },
  };
}

interface OrganizationDetailsForm {
  name: string;
  websiteUrl: string | null | undefined;
  email: string | null | undefined;
  description: string | null | undefined;
}

function AvatarSection({ organization }: { organization: OrganizationResult }) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState(
    () => organization.assets.thumbnailImage400
  );
  const queryClient = useQueryClient();

  const onDropAccepted = (files: FileWithPath[]) => {
    setUploading(true);
    const formData = new FormData();
    const uploadOrganizationThumbnailOperation = `
      {
        "query":"mutation UploadOrganizationThumbnail($id: String, $file: Upload) {uploadOrganizationThumbnail(id: $id, file: $file) }",
        "variables":{
            "id": "${organization.id}",
            "file": null
        }
      }
      `;

    formData.append("operations", uploadOrganizationThumbnailOperation);
    const map = `{"file": ["variables.file"]}`;
    formData.append("map", map);
    if (files[0]) formData.append("file", files[0]);

    fetch(`${process.env.GRAPHQL_SCHEMA_PATH}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then(async (data) => {
        queryClient
          .invalidateQueries({
            queryKey: ["OrganizationAccount"],
          })
          .catch((err) => toast.error(err));
        const json = await data.json();
        setAvatarUrl(json.data.uploadOrganizationThumbnail);
      })
      .catch((error) => toast.error(error))
      .finally(() => setUploading(false));
  };

  const onDropRejected = (e: FileRejection[]) => {
    e.forEach((file) => {
      toast.error(file.errors[0]?.message);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    multiple: false,
    maxSize: 2 * 1024 * 1024,
  });

  const label = isDragActive
    ? "Drop image here"
    : !avatarUrl
      ? "Upload avatar image"
      : "Change avatar image";

  return (
    <section>
      <h2>Avatar</h2>
      <div className={styles.avatarSection}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {uploading ? (
            <LoaderFlag />
          ) : (
            <OrganizationAvatar
              src={avatarUrl as string}
              size={200}
              alt="Organization Logo"
            />
          )}
          <div {...getRootProps()} style={{ marginTop: "2rem" }}>
            <input {...getInputProps()} />
            <Button
              variant="secondary"
              size="large"
              theme="blue"
              label={label}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailsSection({
  organization,
}: {
  organization: OrganizationResult;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      name: organization.name,
      websiteUrl: organization.websiteUrl,
      email: organization.email,
      description: organization.description,
    },
  });

  const organizationMutation = useUpdateOrganizationMutation();
  const updateOrganization = (data: OrganizationDetailsForm) => {
    organizationMutation.mutate(
      {
        input: {
          id: organization.id,
          name: data.name,
          websiteUrl: data.websiteUrl,
          email: data.email,
          description: data.description,
        },
      },
      {
        onSuccess: () => {
          toast.success("Organization updated successfully");
        },
        onError: (error) => {
          toast.error("Failed to update organization: " + error);
        },
      }
    );
  };

  return (
    <section>
      <h2>Details</h2>
      <form onSubmit={handleSubmit(updateOrganization)}>
        <TextInput
          label="Name"
          name={"name"}
          register={register}
          control={control}
        />
        <TextInput
          label="Website"
          name={"websiteUrl"}
          register={register}
          control={control}
        />
        <TextInput
          label="Contact Email"
          name={"email"}
          register={register}
          control={control}
        />
        <TextInput
          label="Description"
          name={"description"}
          register={register}
          control={control}
          textarea
          style={{ height: "200px" }}
        />
        <div className={styles.flexRight}>
          <Button
            type="submit"
            variant="secondary"
            label="Save"
            disabled={!isDirty}
          />
        </div>
      </form>
    </section>
  );
}

function MembersSection({
  organization,
}: {
  organization: OrganizationResult;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const orgMembers = organization.members || [];
  const { register, control, formState, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      role: OrganizationRoleType.Member,
    },
  });
  const orgRoleOptions = Object.values(OrganizationRoleType).map((role) => ({
    label: role,
    value: role,
  }));

  const inviteUserMutation = useInviteUserMutation();

  const queryClient = useQueryClient();

  const handleInviteMember = (data: Partial<OrganizationMemberResult>) => {
    try {
      inviteUserMutation.mutate(
        {
          input: {
            email: data.email as string,
            role: data.role,
            organizationId: organization.id,
          },
        },
        {
          onSuccess: () => {
            void queryClient.invalidateQueries({
              queryKey: ["OrganizationAccount"],
            });
            toast.success("User invited successfully");
          },
          onError: (error) => {
            toast.error("Failed to invite user: " + error);
          },
        }
      );
    } catch (error) {
      toast.error("Failed to invite user: " + error);
    } finally {
      setIsOpen(false);
    }
  };

  const columns = useMemo<ColumnDef<Partial<OrganizationMemberResult>>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => (
          <div>
            {`${info.row.original.firstName} ${info.row.original.lastName} `}{" "}
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => <div>{info.getValue() as string}</div>,
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => <Badge size="small">{info.getValue() as string}</Badge>,
      },
      {
        id: "actions",
        header: "",
        cell: () => (
          <div style={{ float: "right" }}>
            <FaTrash />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <section>
      <h2>Members</h2>
      <div
        style={{
          alignItems: "end",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Button
          variant="primary"
          label="Invite Member"
          size="medium"
          onClick={() => setIsOpen(true)}
        />
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div style={{ padding: "1.5rem", width: "32rem" }}>
            <h2>Invite Member</h2>
            <form
              onSubmit={handleSubmit(handleInviteMember)}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <TextInput
                size="small"
                label="Email"
                name="email"
                register={register}
                control={control}
              />
              <div>
                <label htmlFor="role" style={{ fontWeight: 500 }}>
                  Role
                </label>
                <Select
                  backgroundColor="blue"
                  name="role"
                  register={register}
                  options={orgRoleOptions}
                />
              </div>

              <Button
                type="submit"
                variant="secondary"
                label="Invite"
                style={{ marginTop: "1rem" }}
                disabled={formState.isSubmitting || !formState.isDirty}
              />
            </form>
          </div>
        </Modal>

        <Table
          columns={columns}
          initialState={{
            sorting: [{ id: "name", desc: false }],
            pagination: { pageSize: 10 },
          }}
          data={orgMembers}
          paginate={orgMembers.length > 10}
        />
      </div>
    </section>
  );
}

export function PendingInvites({
  organization,
}: {
  organization: OrganizationResult;
}) {
  const columns = useMemo<ColumnDef<Partial<PendingInviteResult>>[]>(
    () => [
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => <div>{info.getValue() as string}</div>,
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => <Badge size="small">{info.getValue() as string}</Badge>,
      },
      {
        accessorKey: "createdAt",
        header: "Invited At",
        cell: (info) =>
          getRelativeTimeString(new Date(info.getValue() as string)),
      },
      {
        id: "actions",
        header: "",
        cell: () => (
          <div style={{ float: "right" }}>
            <FaTrash />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <section>
      <h2>Pending Invites</h2>
      {organization.pendingInvites.length === 0 ? (
        <span className={styles.noResults}>NO INVITES</span>
      ) : (
        <Table
          columns={columns}
          initialState={{
            sorting: [{ id: "createdAt", desc: true }],
            pagination: { pageSize: 10 },
          }}
          data={organization.pendingInvites || []}
          paginate={organization.pendingInvites.length > 10}
        />
      )}
    </section>
  );
}

export default function Account({ dashboardSlug }: { dashboardSlug: string }) {
  const { data, isLoading: isOrganizationLoading } =
    useOrganizationAccountQuery(
      {
        slug: dashboardSlug,
      },
      {
        retry: false,
      }
    );

  const { isLoading, user: _user } = useAuth({
    organizationId: data?.organizationBySlug?.id,
    redirectTo: "/login",
  });

  if (isLoading || isOrganizationLoading) {
    return <LoaderFlag />;
  }
  if (!data?.organizationBySlug) return null;

  return (
    <div className={styles.profile}>
      <AvatarSection
        organization={data?.organizationBySlug as OrganizationResult}
      />
      <DetailsSection
        organization={data?.organizationBySlug as OrganizationResult}
      />
      <MembersSection
        organization={data?.organizationBySlug as OrganizationResult}
      />
      <PendingInvites
        organization={data?.organizationBySlug as OrganizationResult}
      />
    </div>
  );
}

Account.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
