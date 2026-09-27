export type AdminPrefs = {
  notifyLeads: boolean;
  notifyAppointments: boolean;
  notifyWeeklySummary: boolean;
};

export const DEFAULT_ADMIN_PREFS: AdminPrefs = {
  notifyLeads: true,
  notifyAppointments: true,
  notifyWeeklySummary: false,
};

export function parseAdminPrefs(raw: string | null | undefined): AdminPrefs {
  try {
    return { ...DEFAULT_ADMIN_PREFS, ...(JSON.parse(raw || "{}") as object) };
  } catch {
    return DEFAULT_ADMIN_PREFS;
  }
}
