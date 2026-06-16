// Replaces the "{role}" token in any content string with the learner's
// saved target role. If they have not written one yet, we fall back to a
// neutral phrase so copy still reads as a sentence.

const FALLBACK = "your target role";

export function applyRole(text: string, role: string): string {
  const value = role.trim().length > 0 ? role.trim() : FALLBACK;
  return text.split("{role}").join(value);
}
