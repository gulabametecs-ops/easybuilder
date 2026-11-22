// Follow-up pipeline for platform sales leads (demo / signup / contact).
export const FOLLOW_UP_STATUSES = ["new", "verified", "contacted", "interested", "converted", "not interested"] as const;
export type FollowUpStatus = (typeof FOLLOW_UP_STATUSES)[number];

// Notes are appended to the lead's message (no extra column).
export const NOTE_MARK = "\n\n— Note · ";

/** Split a stored message into the visitor's form answers and the follow-up notes. */
export function splitLeadMessage(message: string): { details: string[]; notes: { when: string; text: string }[] } {
  const [head, ...rest] = (message || "").split(NOTE_MARK);
  return {
    details: head.split("\n").map((l) => l.trim()).filter(Boolean),
    notes: rest.map((chunk) => {
      const [when, ...text] = chunk.split("\n");
      return { when: when.trim(), text: text.join("\n").trim() };
    }),
  };
}
