import { OrganizationResult } from "generated";
import { create } from "zustand";

interface OrganizationState {
  organizationId: string | null;
  setOrganizationId: (id: string) => void;
  availableOrganizations: Partial<OrganizationResult>[];
  setAvailableOrganizations: (
    organizations: Partial<OrganizationResult>[]
  ) => void;
}

const useOrganizationStore = create<OrganizationState>((set) => ({
  organizationId: null,
  setOrganizationId: (id) => set({ organizationId: id }),
  availableOrganizations: [],
  setAvailableOrganizations: (orgs) => set({ availableOrganizations: orgs }),
}));

export default useOrganizationStore;
