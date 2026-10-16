import { Player } from "@remotion/player";
import React, { useEffect, useMemo, useState } from "react";
import { C } from "../../src/lib";
import { entries, themeSources, type Entry } from "./registry";

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
};

const CopyButton: React.FC<{ text: string; label?: string }> = ({ text, label = "复制" }) => {
  const [done, setDone] = useState(false);
  return (
    <button
      className={`copy ${done ? "done" : ""}`}
      onClick={async () => {
        await copyText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
    >
      {done ? "已复制 ✓" : label}
    </button>
  );
};

const CodeTabs: React.FC<{ tabs: { label: string; code: string }[] }> = ({ tabs }) => {
  const [i, setI] = useState(0);
  const cur = tabs[Math.min(i, tabs.length - 1)];
  return (
    <div className="code">
      <div className="code-head">
        <div className="tabs">
          {tabs.map((t, k) => (
            <button key={t.label} className={k === i ? "on" : ""} onClick={() => setI(k)}>
              {t.label}
            </button>
          ))}
        </div>
        <CopyButton text={cur.code} />
      </div>
      <pre>
        <code>{cur.code}</code>
      </pre>
    </div>
  );
};

type OpeningForm = { no: string; titleLines: string[]; channelName: string; hook: string; points: string[]; intensity: number };

const PropsPanel: React.FC<{ value: OpeningForm; onChange: (v: OpeningForm) => void }> = ({ value, onChange }) => {
  const set = (patch: Partial<OpeningForm>) => onChange({ ...value, ...patch });
  return (
    <div className="panel">
      <div className="panel-title">试试你的内容</div>
      <label>
        标题（一行一个，【】里的字变紫色）
        <textarea rows={2} value={value.titleLines.join("\n")} onChange={(e) => set({ titleLines: e.target.value.split("\n") })} />
      </label>
      <div className="row">
        <label>
          期数
          <input value={value.no} onChange={(e) => set({ no: e.target.value })} />
        </label>
        <label>
          账号名
          <input value={value.channelName} onChange={(e) => set({ channelName: e.target.value })} />
        </label>
      </div>
      <label>
        钩子（开场 C）
        <input value={value.hook} onChange={(e) => set({ hook: e.target.value })} />
      </label>
      <label>
        要点（开场 C，一行一个，最多 3 个）
        <textarea rows={3} value={value.points.join("\n")} onChange={(e) => set({ points: e.target.value.split("\n").slice(0, 3) })} />
      </label>
      <label>
        动画力度 {value.intensity.toFixed(2)}
        <input type="range" min={0.2} max={1} step={0.02} value={value.intensity} onChange={(e) => set({ intensity: Number(e.target.value) })} />
      </label>
      <CopyButton
        label="复制为 episode.ts"
        text={`export const episode = {\n  no: ${JSON.stringify(value.no)},\n  titleLines: ${JSON.stringify(value.titleLines.filter(Boolean))},\n  hook: ${JSON.stringify(value.hook)},\n  points: ${JSON.stringify(value.points.filter(Boolean))},\n};\nexport type Episode = typeof episode;\n`}
      />
    </div>
  );
};

const EntryView: React.FC<{ entry: Entry }> = ({ entry }) => {
  const [form, setForm] = useState<OpeningForm>(entry.defaultProps as OpeningForm);
  useEffect(() => setForm(entry.defaultProps as OpeningForm), [entry]);
  const inputProps = entry.editable
    ? { ...form, titleLines: form.titleLines.filter(Boolean).length ? form.titleLines.filter(Boolean) : [" "], points: form.points.filter(Boolean) }
    : entry.defaultProps ?? {};
  return (
    <div className="entry">
      <div className="entry-head">
        <h1>
          {entry.name}
          {entry.badge ? <span className="badge">{entry.badge}</span> : null}
        </h1>
        <p>{entry.desc}</p>
      </div>
      <div className={entry.editable ? "stage with-panel" : "stage"}>
        <div className="player">
          <div className="player-box">
          <Player
            key={entry.id}
            component={entry.component}
            inputProps={inputProps}
            durationInFrames={entry.durationInFrames}
            fps={30}
            compositionWidth={1920}
            compositionHeight={1080}
            style={{ width: "100%", height: "100%" }}
            controls
            loop
            autoPlay
            acknowledgeRemotionLicense
          />
          </div>
        </div>
        {entry.editable ? <PropsPanel value={form} onChange={setForm} /> : null}
      </div>
      <CodeTabs tabs={[{ label: "用法", code: entry.usage }, ...entry.sources.map((s) => ({ label: s.file, code: s.code }))]} />
    </div>
  );
};

const ThemeView: React.FC = () => (
  <div className="entry">
    <div className="entry-head">
      <h1>主题 · 配色与字体</h1>
      <p>所有组件的颜色都来自 theme.ts 里的 C，改这里全部生效。点色块复制色值。</p>
    </div>
    <div className="swatches">
      {Object.entries(C).map(([k, v]) => (
        <button key={k} className="swatch" onClick={() => copyText(v)} title="点击复制">
          <span className="chip" style={{ background: v }} />
          <b>C.{k}</b>
          <code>{v}</code>
        </button>
      ))}
    </div>
    <div className="fonts">
      <div>
        <span className="font-title">站酷庆科黄油体</span>
        <code>FONT_TITLE · 标题</code>
      </div>
      <div>
        <span className="font-body">思源黑体 500 / 700 / 900</span>
        <code>FONT_BODY · 正文、标签</code>
      </div>
    </div>
    <CodeTabs tabs={themeSources.map((s) => ({ label: s.file, code: s.code }))} />
  </div>
);

export const App: React.FC = () => {
  const [id, setId] = useState(() => location.hash.slice(1) || entries[0].id);
  useEffect(() => {
    const on = () => setId(location.hash.slice(1) || entries[0].id);
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  const entry = entries.find((e) => e.id === id);
  const groups = useMemo(() => {
    const g: Record<string, Entry[]> = {};
    entries.forEach((e) => (g[e.category] ??= []).push(e));
    return g;
  }, []);
  return (
    <div className="layout">
      <aside>
        <div className="brand">
          <span className="brand-mark">▣</span> 视频组件库
        </div>
        <a href="#theme" className={id === "theme" ? "on" : ""}>
          主题 · 配色与字体
        </a>
        {Object.entries(groups).map(([cat, list]) => (
          <div key={cat} className="group">
            <div className="group-title">{cat}</div>
            {list.map((e) => (
              <a key={e.id} href={`#${e.id}`} className={e.id === id ? "on" : ""}>
                {e.name}
                {e.badge ? <span className="dot" /> : null}
              </a>
            ))}
          </div>
        ))}
      </aside>
      <main>{id === "theme" ? <ThemeView /> : entry ? <EntryView entry={entry} /> : <ThemeView />}</main>
    </div>
  );
};
