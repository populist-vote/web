import { create } from "zustand";

interface OrganizationState {
  organizationId: string | null;
  setOrganizationId: (id: string) => void;
  initializeOrganization: (orgId: string) => void;
}

const useOrganizationStore = create<OrganizationState>((set) => ({
  organizationId: null,
  // Set organizationId and persist it
  setOrganizationId: (id: string) => {
    localStorage.setItem("currentOrganizationId", id);
    set({ organizationId: id });
  },
  initializeOrganization: (orgId) => {
    set((state) => {
      // Only initialize if organizationId is still null (not previously loaded)
      if (!state.organizationId) {
        const savedOrgId = localStorage.getItem("currentOrganizationId");
        if (savedOrgId) {
          return { organizationId: savedOrgId };
        }
        return { organizationId: orgId };
      }
      return state; // No change if organizationId is already set
    });
  },
}));

export default useOrganizationStore;
