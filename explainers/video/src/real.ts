// Copied from the recorded demo, demo/data/demo.db (recorded 2026-11-13 on
// nvidia/nemotron-3.5-super-vl:free, sessions spread over 2026-11-07..13). Re-copy if re-recorded.
export const REAL = {
  cast: [
    ["omar", "support-bot"],
    ["maya", "dev-assistant"],
    ["lena", "sales-assistant"],
    ["raj", "ops-helper"],
  ] as [string, string][],
  call: {
    who: "omar → support-bot · session f537fab50c6e · calls row 4",
    text: "Lumen Dental wants a refund in T-322. Are they eligible, and who has to approve it?",
    steps: [
      ["The agent posts to the proxy", "dummy key, X-Agent-User: omar"],
      ["The proxy reads who is calling", "then strips those headers and the dummy key"],
      ["The real key goes on", "only the proxy process holds it"],
      ["The gateway sends it", "free model, slot available, first try"],
      ["The answer comes back unchanged", "two tool calls, get_ticket and get_policy, in 1.1 s"],
      ["One row is written", "bodies too, with keys and bearer tokens redacted"],
    ] as [string, string][],
    row: [
      ["ts", "2026-11-12T01:37:49Z"],
      ["user", "omar"],
      ["dept", "support"],
      ["agent", "support-bot"],
      ["session", "f537fab50c6e"],
      ["model", "nvidia/nemotron-3.5-super-vl:free"],
      ["route", "primary"],
      ["status", "200"],
      ["finish_reason", "tool_calls"],
      ["duration_ms", "1130"],
      ["total_tokens", "645"],
      ["cost_usd", "NULL (free)"],
    ] as [string, string][],
  },
  gateway: [
    ["130 / 130", "calls on the free model (route primary)"],
    ["0", "retries, fallbacks or errors"],
    ["$0", "paid spend"],
  ] as [string, string][],
  kpis: [
    ["calls", "130"],
    ["sessions", "48"],
    ["users", "4"],
    ["tokens", "97,873"],
    ["avg latency", "1.7 s"],
  ] as [string, string][],
};
