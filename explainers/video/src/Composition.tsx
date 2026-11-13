// llm-proxy-log explainer: ~56 s, 1920x1080, 30 fps, silent.
// Every message, field value and number below comes from the recorded demo (demo/data/demo.db,
// copied into real.ts); the dashboard frame is a real screenshot (public/dashboard.png).
import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { REAL } from "./real";

const C = {
  bg: "#0b1020",
  panel: "#141b33",
  line: "#2c3866",
  text: "#e8ecf8",
  dim: "#9aa6c8",
  accent: "#22d3ee",
  key: "#ffb547",
  ok: "#4fd18b",
  bad: "#ff5a6a",
};
const USER: Record<string, string> = { maya: "#60a5fa", omar: "#34d399", lena: "#a78bfa", raj: "#fbbf24" };
const FONT = 'Inter, "Helvetica Neue", Helvetica, Arial, "Segoe UI", sans-serif';
const MONO = '"JetBrains Mono", "DejaVu Sans Mono", Menlo, monospace';
const FPS = 30;
const S = (s: number) => Math.round(s * FPS);

const SCENES = [
  { id: "title", d: 4 },
  { id: "problem", d: 7 },
  { id: "change", d: 7.5 },
  { id: "call", d: 12 },
  { id: "gateway", d: 10 },
  { id: "dashboard", d: 9 },
  { id: "outro", d: 5.5 },
] as const;
const TOTAL = SCENES.reduce((a, s) => a + S(s.d), 0);

const ease = (f: number, from: number, dur: number) =>
  interpolate(f - from, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

const Appear: React.FC<{ at?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at = 0,
  y = 26,
  children,
  style,
}) => {
  const o = ease(useCurrentFrame(), at, 14);
  return <div style={{ opacity: o, transform: `translateY(${(1 - o) * y}px)`, ...style }}>{children}</div>;
};

const Frame: React.FC<{ dur: number; children: React.ReactNode; pad?: string }> = ({ dur, children, pad }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 10, dur - 10, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: o, padding: pad ?? "84px 120px", fontFamily: FONT, color: C.text }}>
      {children}
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.accent }) => (
  <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color, fontWeight: 700, marginBottom: 14 }}>
    {children}
  </div>
);
const H: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 64 }) => (
  <div style={{ fontSize: size, fontWeight: 800, lineHeight: 1.12 }}>{children}</div>
);
const Box: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({
  children,
  color = C.line,
  style,
}) => (
  <div style={{ background: C.panel, border: `3px solid ${color}`, borderRadius: 22, padding: "24px 30px", ...style }}>
    {children}
  </div>
);
const Who: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginBottom: 8 }}>{children}</div>
);
const Dot: React.FC<{ color: string; size?: number }> = ({ color, size = 22 }) => (
  <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: color, flexShrink: 0 }} />
);
// The project's mark: a ledger page, one row lighting up.
const Ledger: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="14" y="8" width="72" height="84" rx="10" fill={C.accent + "18"} stroke={C.accent} strokeWidth={5} />
    {[28, 44, 60, 76].map((y, i) => (
      <line key={y} x1="28" x2={i === 2 ? 72 : 64} y1={y} y2={y} stroke={i === 2 ? C.accent : C.dim} strokeWidth={i === 2 ? 7 : 5} strokeLinecap="round" />
    ))}
  </svg>
);

/* 1 · Title */
const Title: React.FC<{ dur: number }> = ({ dur }) => {
  const s = spring({ frame: useCurrentFrame(), fps: useVideoConfig().fps, config: { damping: 14 } });
  return (
    <Frame dur={dur}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26 }}>
        <div style={{ transform: `scale(${s})` }}>
          <Ledger size={190} />
        </div>
        <Appear at={8}>
          <div style={{ fontFamily: MONO, fontSize: 96, fontWeight: 800 }}>llm-proxy-log</div>
        </Appear>
        <Appear at={16}>
          <div style={{ fontSize: 46, color: C.dim, textAlign: "center" }}>An LLM proxy that logs every call, per user</div>
        </Appear>
      </AbsoluteFill>
    </Frame>
  );
};

/* 2 · The problem */
const QUESTIONS = ["Whose agent made these calls?", "What exactly was sent, and what came back?", "Which conversation burned the tokens?"];
const Problem: React.FC<{ dur: number }> = ({ dur }) => (
  <Frame dur={dur}>
    <Kicker>The problem</Kicker>
    <H>Four agents, one API key, one bill</H>
    <div style={{ display: "flex", gap: 70, marginTop: 90, alignItems: "center" }}>
      <div style={{ display: "grid", gap: 18, width: 560 }}>
        {REAL.cast.map(([user, agent], i) => (
          <Appear key={user} at={8 + i * 6}>
            <Box style={{ padding: "16px 26px", display: "flex", gap: 18, alignItems: "center" }}>
              <Dot color={USER[user]} />
              <span style={{ fontSize: 34, fontWeight: 700 }}>{agent}</span>
              <span style={{ fontSize: 28, color: C.dim }}>for {user}</span>
            </Box>
          </Appear>
        ))}
      </div>
      <Appear at={S(1.6)}>
        <Box color={C.key} style={{ width: 420, textAlign: "center", padding: "40px 30px" }}>
          <div style={{ fontSize: 30, color: C.dim }}>provider dashboard</div>
          <div style={{ fontSize: 76, fontWeight: 800, marginTop: 10 }}>1 key</div>
          <div style={{ fontSize: 30, color: C.dim, marginTop: 6 }}>totals per day, no people</div>
        </Box>
      </Appear>
      <div style={{ display: "grid", gap: 26, flex: 1 }}>
        {QUESTIONS.map((q, i) => (
          <Appear key={q} at={S(2.8) + i * 16}>
            <div style={{ fontSize: 40, fontWeight: 700, color: C.key }}>{q}</div>
          </Appear>
        ))}
      </div>
    </div>
    <Appear at={S(4.6)}>
      <div style={{ fontSize: 36, color: C.dim, marginTop: 80, lineHeight: 1.4 }}>
        Adding logging to every agent is repetitive, easy to forget, and puts the real key in every agent's environment.
      </div>
    </Appear>
  </Frame>
);

/* 3 · One change */
const Change: React.FC<{ dur: number }> = ({ dur }) => (
  <Frame dur={dur}>
    <Kicker>One change per agent</Kicker>
    <H>Point the base URL at the proxy, say who is calling</H>
    <Appear at={14}>
      <div style={{ fontFamily: MONO, fontSize: 40, lineHeight: 1.6, marginTop: 60, background: C.panel, padding: "30px 40px", borderRadius: 20, border: `3px solid ${C.line}` }}>
        <div><span style={{ color: C.dim }}>client = OpenAI(</span></div>
        <div style={{ paddingLeft: 60 }}><span style={{ color: C.dim }}>base_url=</span><span style={{ color: C.ok }}>"http://127.0.0.1:8080/v1"</span><span style={{ color: C.dim }}>,</span></div>
        <div style={{ paddingLeft: 60 }}><span style={{ color: C.dim }}>api_key=</span><span style={{ color: C.ok }}>"dummy"</span><span style={{ color: C.dim }}>,   # the proxy holds the real key</span></div>
        <div style={{ paddingLeft: 60 }}><span style={{ color: C.dim }}>default_headers={"{"}</span><span style={{ color: C.accent }}>"X-Agent-User"</span>: <span style={{ color: C.ok }}>"omar"</span>, <span style={{ color: C.accent }}>"X-Agent-Dept"</span>: <span style={{ color: C.ok }}>"support"</span><span style={{ color: C.dim }}>{"}"})</span></div>
      </div>
    </Appear>
    <div style={{ display: "flex", gap: 30, marginTop: 50 }}>
      {[
        ["No SDK, no agent code", "any OpenAI-compatible client"],
        ["One key, one place", "rotate it without touching agents"],
        ["One SQLite file", "logs/proxy.db, one row per call"],
      ].map(([t, s], i) => (
        <Appear key={t} at={S(3.2) + i * 12} style={{ flex: 1 }}>
          <Box style={{ padding: "22px 28px" }}>
            <div style={{ fontSize: 36, fontWeight: 800 }}>{t}</div>
            <div style={{ fontSize: 28, color: C.dim, marginTop: 6 }}>{s}</div>
          </Box>
        </Appear>
      ))}
    </div>
  </Frame>
);

/* 4 · One real call becomes one row */
const Call: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const r = REAL.call;
  const travel = ease(f, S(2.0), S(1.6));
  return (
    <Frame dur={dur} pad="70px 120px">
      <Kicker>One real call from the demo</Kicker>
      <Box style={{ padding: "18px 28px" }}>
        <Who>{r.who}</Who>
        <div style={{ fontSize: 40, lineHeight: 1.35 }}>“{r.text}”</div>
      </Box>
      <div style={{ display: "flex", gap: 46, marginTop: 34 }}>
        <div style={{ width: 720, display: "grid", gap: 18, alignContent: "start" }}>
          {r.steps.map(([t, s], i) => (
            <Appear key={t} at={S(1.2) + i * S(1.1)}>
              <div style={{ display: "flex", gap: 18 }}>
                <div style={{ fontFamily: MONO, fontSize: 34, color: C.accent, fontWeight: 800, width: 40 }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 33, fontWeight: 800 }}>{t}</div>
                  <div style={{ fontSize: 26, color: C.dim, marginTop: 2, lineHeight: 1.35 }}>{s}</div>
                </div>
              </div>
            </Appear>
          ))}
        </div>
        <Box color={C.accent} style={{ flex: 1, padding: "20px 30px", opacity: 0.4 + 0.6 * travel }}>
          <Who>logs/proxy.db · table calls · one new row</Who>
          <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", rowGap: 6, fontFamily: MONO, fontSize: 27 }}>
            {r.row.map(([k, v], i) => {
              const o = ease(f, S(3.0) + i * 6, 10);
              return (
                <React.Fragment key={k}>
                  <div style={{ color: C.dim }}>{k}</div>
                  <div style={{ opacity: o, color: k === "route" || k === "cost_usd" ? C.ok : C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v}</div>
                </React.Fragment>
              );
            })}
          </div>
        </Box>
      </div>
    </Frame>
  );
};

/* 5 · The gateway */
const RULES: [string, string][] = [
  ["Rate limit", "16 free calls a minute; agents wait for a slot instead of failing"],
  ["Backoff", "a busy provider (429 / 502 / 503) is retried on the same free model"],
  ["Fallback", "free daily cap used up, or the free model hangs: a cheap paid model"],
  ["Spend cap", "paid calls stop at $3, counting only what this proxy run spent"],
  ["Cache", "every answer stored by request hash, so a day can be replayed"],
];
const Gateway: React.FC<{ dur: number }> = ({ dur }) => (
  <Frame dur={dur}>
    <Kicker>The gateway inside the proxy</Kicker>
    <H>Shared budget rules, enforced in the one place every call passes</H>
    <div style={{ display: "flex", gap: 50, marginTop: 50 }}>
      <div style={{ display: "grid", gap: 16, width: 1060 }}>
        {RULES.map(([t, s], i) => (
          <Appear key={t} at={12 + i * 12}>
            <Box style={{ display: "flex", gap: 26, alignItems: "baseline", padding: "18px 28px" }}>
              <div style={{ fontSize: 36, fontWeight: 800, width: 230, flexShrink: 0 }}>{t}</div>
              <div style={{ fontSize: 28, color: C.dim, lineHeight: 1.35 }}>{s}</div>
            </Box>
          </Appear>
        ))}
      </div>
      <Appear at={S(5.2)} style={{ flex: 1 }}>
        <Box color={C.ok} style={{ padding: "30px 34px" }}>
          <Who>the recorded demo</Who>
          {REAL.gateway.map(([v, k]) => (
            <div key={k} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 58, fontWeight: 800 }}>{v}</div>
              <div style={{ fontSize: 26, color: C.dim }}>{k}</div>
            </div>
          ))}
        </Box>
      </Appear>
    </div>
  </Frame>
);

/* 6 · Dashboard */
const Dashboard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [S(1), dur], [1.0, 1.22], { extrapolateLeft: "clamp" });
  return (
    <Frame dur={dur} pad="60px 90px">
      <Kicker>Read it back</Kicker>
      <div style={{ display: "flex", gap: 36, alignItems: "flex-start" }}>
        <div style={{ width: 1240, height: 855, overflow: "hidden", borderRadius: 18, border: `3px solid ${C.line}` }}>
          <Img src={staticFile("dashboard.png")} style={{ width: "100%", transform: `scale(${z})`, transformOrigin: "85% 70%" }} />
        </div>
        <div style={{ display: "grid", gap: 16, flex: 1 }}>
          {REAL.kpis.map(([k, v], i) => (
            <Appear key={k} at={10 + i * 8}>
              <Box style={{ padding: "14px 22px" }}>
                <div style={{ fontSize: 46, fontWeight: 800 }}>{v}</div>
                <div style={{ fontSize: 23, color: C.dim }}>{k}</div>
              </Box>
            </Appear>
          ))}
          <Appear at={S(4)}>
            <div style={{ fontSize: 26, color: C.dim, lineHeight: 1.4, marginTop: 6 }}>
              Same file, read-only: the dashboard, <span style={{ fontFamily: MONO }}>view_log.py</span>, llm-session-console, or your own SQL.
            </div>
          </Appear>
        </div>
      </div>
    </Frame>
  );
};

/* 7 · Outro */
const Outro: React.FC<{ dur: number }> = ({ dur }) => (
  <Frame dur={dur}>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24, textAlign: "center" }}>
      <Ledger size={120} />
      <H size={68}>Every call, written down</H>
      <Appear at={10}>
        <div style={{ fontSize: 34, color: C.dim, maxWidth: 1400 }}>
          Python standard library only. Try it with no key:<br /><span style={{ fontFamily: MONO, color: C.text, whiteSpace: "nowrap" }}>python3 dashboard/server.py --demo</span>
        </div>
      </Appear>
      <Appear at={22}>
        <div style={{ fontSize: 32, color: C.text }}>Ships with its blueprint: goal, spec, decisions and the prompts to rebuild it.</div>
      </Appear>
      <Appear at={34}>
        <div style={{ fontFamily: MONO, fontSize: 34, color: C.accent, marginTop: 16 }}>github.com/claudiucalomfirescu/llm-proxy-log</div>
      </Appear>
    </AbsoluteFill>
  </Frame>
);

const COMPONENTS: Record<string, React.FC<{ dur: number }>> = {
  title: Title,
  problem: Problem,
  change: Change,
  call: Call,
  gateway: Gateway,
  dashboard: Dashboard,
  outro: Outro,
};

export const ProxyLogExplainer: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 20%, #0f2a3a 0%, ${C.bg} 60%)` }}>
      {SCENES.map((s) => {
        const d = S(s.d);
        const Comp = COMPONENTS[s.id];
        const el = (
          <Sequence key={s.id} from={from} durationInFrames={d} name={s.id}>
            <Comp dur={d} />
          </Sequence>
        );
        from += d;
        return el;
      })}
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <Composition id="ProxyLogExplainer" component={ProxyLogExplainer} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
);
