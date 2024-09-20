import { OrganizationResult } from "generated";
import { create } from "zustand";

interface OrganizationState {
  organizationId: string | null;
  setOrganizationId: (id: string) => void;
  availableOrganizations: Partial<OrganizationResult>[];
  setAvailableOrganizations: (
    organizations: Partial<OrganizationResult>[]
  ) => void;
  initializeOrganization: (orgId: string) => void;
}

const useOrganizationStore = create<OrganizationState>((set) => ({
  organizationId: null,
  availableOrganizations: [],
  setAvailableOrganizations: (orgs) => set({ availableOrganizations: orgs }),
  // Set organizationId and persist it
  setOrganizationId: (id: string) => {
    localStorage.setItem("currentOrganizationId", id);
    set({ organizationId: id });
  },

  // Load from local storage when app initializes
  initializeOrganization: (orgId) => {
    const savedOrgId = localStorage.getItem("currentOrganizationId");
    if (savedOrgId) {
      set({ organizationId: savedOrgId });
    } else {
      set({ organizationId: orgId });
    }
  },
}));

export default useOrganizationStore;
