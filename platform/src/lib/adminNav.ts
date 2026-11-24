import { isStoreVertical } from "./store";

// Which sector-specific admin modules a business sees in its sidebar.
// Pages stay reachable by URL; this only keeps the menu relevant (a gym doesn't need "Results").
const SCHOOLS = ["play-school", "primary-school", "school", "school-coaching", "coaching"];
const INSTITUTES = ["education-consultancy", "skill-learning", "language-institute", "driving-school", "computer-institute"];
const COMMUNITY = ["ngo-charity", "social-foundation", "animal-welfare", "senior-care", "resident-welfare", "women-empowerment", "child-education-ngo", "environment-ngo", "health-relief-ngo", "food-bank"];

export const REAL_ESTATE = ["real-estate-broker", "pg-hostel", "builder-developer"];

export type SectorModules = { notices: boolean; results: boolean; volunteers: boolean; events: boolean; properties: boolean; causes: boolean; store: boolean };

export function sectorModules(vertical: string): SectorModules {
  return {
    notices: [...SCHOOLS, ...INSTITUTES, "resident-welfare"].includes(vertical),
    results: SCHOOLS.includes(vertical),
    volunteers: COMMUNITY.includes(vertical),
    events: [...COMMUNITY, "events-training"].includes(vertical),
    properties: REAL_ESTATE.includes(vertical),
    causes: COMMUNITY.includes(vertical),
    store: isStoreVertical(vertical),
  };
}
