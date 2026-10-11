"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebaseAuth";
import {
  ADMIN_EMAIL,
  deleteMessage,
  listenToMessages,
  loadContent,
  saveContent,
  setMessageStatus,
} from "@/lib/content";
import { defaultContent } from "@/lib/defaultContent";

/* ============================================================
   SMALL HELPERS
   ============================================================ */

const clone = (v) => JSON.parse(JSON.stringify(v));

const getIn = (obj, path) =>
  path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);

function setIn(obj, keys, value) {
  if (!keys.length) return value;
  const [key, ...rest] = keys;
  return { ...obj, [key]: setIn(obj?.[key] ?? {}, rest, value) };
}

const inputClass =
  "w-full rounded-lg border border-[#D8CCBC] bg-white px-3 py-2.5 text-sm text-[#211C19] placeholder:text-[#71655C]/60 focus:border-[#8B1026] focus:outline-none focus:ring-2 focus:ring-[#8B1026]/15";

/* ============================================================
   EDITABLE SECTIONS (what each tab lets you change)
   ============================================================ */

const JOURNEY_ICONS = ["light", "education", "code", "mobile", "ai", "automation", "rocket"];
const STRENGTH_ICONS = ["ai", "data", "backend", "mobile"];
const PROJECT_TYPES = [
  ["analytics", "Data / analytics"],
  ["ai", "AI / classification"],
  ["vision", "Computer vision"],
  ["tasks", "Task management"],
  ["mobile", "Mobile app (Events)"],
  ["news", "Mobile app (News)"],
  ["islamic", "Mobile app (Islami)"],
];

const TABS = [
  {
    id: "hero",
    label: "Hero & CV",
    path: "hero",
    hint: "The first screen of your site and the Download CV button.",
    fields: [
      { key: "badge", label: "Small top line", type: "text" },
      { key: "titleBefore", label: "Headline — first word(s)", type: "text" },
      { key: "titleHighlight", label: "Headline — highlighted word (red)", type: "text" },
      {
        key: "titleAfter",
        label: "Headline — rest (each line on its own row)",
        type: "textarea",
        rows: 3,
      },
      { key: "description", label: "Intro paragraph", type: "textarea", rows: 5 },
      { key: "primaryButton", label: "Main button text", type: "text" },
      { key: "secondaryButton", label: "Second button text", type: "text" },
      { key: "meta", label: "Line under the hero (location, degree...)", type: "strings", addLabel: "Add item" },
      {
        key: "photo",
        label: "Photo path or URL",
        type: "text",
        help: 'A file in your "public" folder, e.g. /Ahmed Elhossary.jpeg — or a full https:// link.',
      },
      { key: "cvLabel", label: "CV button text", type: "text" },
      {
        key: "cvUrl",
        label: "CV file path or URL",
        type: "text",
        help: "To change your CV: put the new PDF in the public folder (same name replaces it), or paste a link.",
      },
    ],
  },
  {
    id: "ticker",
    label: "Skills ticker",
    path: "ticker",
    hint: "The moving line of words under the hero.",
    fields: [{ key: "items", label: "Words", type: "strings", addLabel: "Add word" }],
  },
  {
    id: "about",
    label: "About",
    path: "about",
    hint: "Use **double stars** around words to make them bold.",
    fields: [
      { key: "headingMain", label: "Heading — first part", type: "text" },
      { key: "headingAccent", label: "Heading — red part", type: "text" },
      { key: "paragraphs", label: "Paragraphs", type: "strings", multiline: true, addLabel: "Add paragraph" },
      {
        key: "quickInfo",
        label: "Quick info cards",
        type: "list",
        itemLabel: (it) => it.label || "Card",
        newItem: () => ({ label: "", value: "" }),
        itemFields: [
          { key: "label", label: "Label", type: "text" },
          { key: "value", label: "Value", type: "text" },
        ],
      },
      {
        key: "strengths",
        label: "Strength boxes",
        type: "list",
        itemLabel: (it) => it.label || "Strength",
        newItem: () => ({ label: "", icon: "ai" }),
        itemFields: [
          { key: "label", label: "Text", type: "text" },
          { key: "icon", label: "Icon", type: "select", options: STRENGTH_ICONS.map((v) => [v, v]) },
        ],
      },
    ],
  },
  {
    id: "skills",
    label: "Skills",
    path: "skills",
    fields: [
      { key: "title", label: "Section title", type: "text" },
      { key: "description", label: "Section description", type: "textarea", rows: 3 },
      {
        key: "categories",
        label: "Skill categories",
        type: "list",
        itemLabel: (it) => it.title || "Category",
        newItem: () => ({ title: "NEW CATEGORY", items: [] }),
        itemFields: [
          { key: "title", label: "Category title", type: "text" },
          {
            key: "items",
            label: "Skills in this category",
            type: "list",
            itemLabel: (it) => it.name || "Skill",
            newItem: () => ({ name: "", detail: "", icon: "" }),
            itemFields: [
              { key: "name", label: "Name", type: "text" },
              { key: "detail", label: "Short description", type: "text" },
              { key: "icon", label: "Badge letters (1–3 characters)", type: "text" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    path: "projects",
    fields: [
      { key: "title", label: "Section title", type: "text" },
      { key: "description", label: "Section description", type: "textarea", rows: 3 },
      {
        key: "items",
        label: "Projects",
        type: "list",
        itemLabel: (it) => it.title || "Project",
        newItem: () => ({
          title: "New project",
          category: "CATEGORY",
          description: "",
          tech: [],
          overview: [""],
          technologies: [],
          type: "analytics",
          contribution: "",
          github: "",
        }),
        itemFields: [
          { key: "title", label: "Title", type: "text" },
          { key: "category", label: "Category line (small caps)", type: "text" },
          { key: "description", label: "Short description (on the card)", type: "textarea", rows: 3 },
          { key: "type", label: "Preview style", type: "select", options: PROJECT_TYPES },
          { key: "github", label: "GitHub link", type: "text" },
          { key: "contribution", label: "Your role (optional, e.g. Contributor)", type: "text" },
          { key: "tech", label: "Tech tags (on the card)", type: "strings", addLabel: "Add tag" },
          { key: "overview", label: "Overview paragraphs (in the popup)", type: "strings", multiline: true, addLabel: "Add paragraph" },
          {
            key: "technologies",
            label: "Technologies used (in the popup)",
            type: "list",
            itemLabel: (it) => it.name || "Technology",
            newItem: () => ({ name: "", use: "" }),
            itemFields: [
              { key: "name", label: "Name", type: "text" },
              { key: "use", label: "What it was used for", type: "text" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "journey",
    label: "Journey",
    path: "journey",
    fields: [
      { key: "title", label: "Section title", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "textarea", rows: 2 },
      { key: "introTitle", label: "Intro card — title", type: "text" },
      { key: "introText", label: "Intro card — text", type: "textarea", rows: 4 },
      {
        key: "milestones",
        label: "Timeline milestones",
        type: "list",
        itemLabel: (it) => `${it.period || ""} — ${it.title || "Milestone"}`,
        newItem: () => ({ period: "", title: "", description: "", icon: "code", skills: [] }),
        itemFields: [
          { key: "period", label: "Date / period", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "description", label: "Description", type: "textarea", rows: 4 },
          { key: "icon", label: "Icon", type: "select", options: JOURNEY_ICONS.map((v) => [v, v]) },
          { key: "skills", label: "Skills & knowledge tags", type: "strings", addLabel: "Add tag" },
        ],
      },
      { key: "closingTitle", label: "Closing card — title", type: "text" },
      { key: "closingText", label: "Closing card — text", type: "textarea", rows: 3 },
    ],
  },
  {
    id: "sections",
    label: "Extra sections",
    path: "sections",
    hint: "Add your own sections (certificates, services, achievements...). Each one appears just before Contact and automatically gets its own link in the navbar. Delete a section with ✕ and its navbar link disappears too.",
    fields: [
      {
        key: "items",
        label: "Your sections",
        type: "list",
        itemLabel: (it) => it.navLabel || it.title || "Section",
        newItem: () => ({
          id: `section-${Date.now()}`,
          navLabel: "New section",
          title: "New section title",
          description: "",
          background: "light",
          cards: [],
        }),
        itemFields: [
          {
            key: "navLabel",
            label: "Name in the navbar",
            type: "text",
            help: "Keep it short, e.g. Certificates",
          },
          { key: "title", label: "Section title (big heading)", type: "text" },
          { key: "description", label: "Intro text (optional)", type: "textarea", rows: 3 },
          {
            key: "background",
            label: "Background colour",
            type: "select",
            options: [
              ["light", "Light"],
              ["warm", "Warm beige"],
            ],
          },
          {
            key: "cards",
            label: "Cards inside this section",
            type: "list",
            itemLabel: (it) => it.title || "Card",
            newItem: () => ({ title: "", subtitle: "", text: "", link: "", linkLabel: "" }),
            itemFields: [
              { key: "title", label: "Card title", type: "text" },
              { key: "subtitle", label: "Small line above the title (e.g. a year)", type: "text" },
              { key: "text", label: "Card text", type: "textarea", rows: 4 },
              { key: "link", label: "Link (optional)", type: "text" },
              { key: "linkLabel", label: "Link text (e.g. View certificate)", type: "text" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "contact",
    label: "Contact & footer",
    path: "contact",
    fields: [
      { key: "headingBefore", label: "Heading — first line", type: "text" },
      { key: "headingHighlight", label: "Heading — red line", type: "text" },
      { key: "description", label: "Description", type: "textarea", rows: 3 },
      { key: "github", label: "GitHub link (empty = hide button)", type: "text" },
      { key: "linkedin", label: "LinkedIn link (empty = hide button)", type: "text" },
      { key: "footerLeft", label: "Footer — left text", type: "text" },
      { key: "footerCenter", label: "Footer — middle text", type: "text" },
    ],
  },
];

/* ============================================================
   GENERIC FIELD EDITORS
   ============================================================ */

function IconButton({ onClick, title, children, danger }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-bold transition-colors ${
        danger
          ? "border-[#8B1026]/30 text-[#8B1026] hover:bg-[#8B1026] hover:text-white"
          : "border-[#D8CCBC] text-[#4B210B] hover:bg-[#E8D2B3]"
      }`}
    >
      {children}
    </button>
  );
}

const moveItem = (arr, i, d) => {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

function StringList({ value = [], onChange, multiline, addLabel = "Add" }) {
  const set = (i, v) => onChange(value.map((x, idx) => (idx === i ? v : x)));

  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          {multiline ? (
            <textarea
              rows={3}
              value={item}
              onChange={(e) => set(i, e.target.value)}
              className={inputClass}
            />
          ) : (
            <input
              value={item}
              onChange={(e) => set(i, e.target.value)}
              className={inputClass}
            />
          )}
          <IconButton title="Move up" onClick={() => onChange(moveItem(value, i, -1))}>↑</IconButton>
          <IconButton title="Move down" onClick={() => onChange(moveItem(value, i, 1))}>↓</IconButton>
          <IconButton title="Remove" danger onClick={() => onChange(value.filter((_, idx) => idx !== i))}>✕</IconButton>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="rounded-lg border border-dashed border-[#8B1026]/40 px-3 py-2 text-xs font-semibold text-[#8B1026] hover:bg-[#8B1026]/5"
      >
        + {addLabel}
      </button>
    </div>
  );
}

function ObjectList({ field, value = [], onChange }) {
  const update = (i, item) => onChange(value.map((x, idx) => (idx === i ? item : x)));

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <details
          key={i}
          className="group rounded-xl border border-[#D8CCBC] bg-[#F2EEE3]/60 open:bg-white"
        >
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3">
            <span className="text-xs text-[#8B1026] transition-transform group-open:rotate-90">▶</span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#4B210B]">
              {i + 1}. {field.itemLabel ? field.itemLabel(item) : `Item ${i + 1}`}
            </span>
            <IconButton title="Move up" onClick={() => onChange(moveItem(value, i, -1))}>↑</IconButton>
            <IconButton title="Move down" onClick={() => onChange(moveItem(value, i, 1))}>↓</IconButton>
            <IconButton
              title="Delete"
              danger
              onClick={() => {
                if (window.confirm("Delete this item?")) {
                  onChange(value.filter((_, idx) => idx !== i));
                }
              }}
            >
              ✕
            </IconButton>
          </summary>

          <div className="space-y-4 border-t border-[#D8CCBC] px-4 py-4">
            {field.itemFields.map((f) => (
              <FieldEditor
                key={f.key}
                field={f}
                value={item?.[f.key]}
                onChange={(v) => update(i, { ...item, [f.key]: v })}
              />
            ))}
          </div>
        </details>
      ))}

      <button
        type="button"
        onClick={() => onChange([...value, field.newItem()])}
        className="rounded-lg border border-dashed border-[#8B1026]/40 px-4 py-2.5 text-sm font-semibold text-[#8B1026] hover:bg-[#8B1026]/5"
      >
        + Add new
      </button>
    </div>
  );
}

function FieldEditor({ field, value, onChange }) {
  let control;

  switch (field.type) {
    case "textarea":
      control = (
        <textarea
          rows={field.rows || 4}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      );
      break;
    case "select":
      control = (
        <select
          value={value ?? field.options[0][0]}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          {field.options.map(([v, label]) => (
            <option key={v} value={v}>
              {label}
            </option>
          ))}
        </select>
      );
      break;
    case "strings":
      control = (
        <StringList
          value={value || []}
          onChange={onChange}
          multiline={field.multiline}
          addLabel={field.addLabel}
        />
      );
      break;
    case "list":
      control = <ObjectList field={field} value={value || []} onChange={onChange} />;
      break;
    default:
      control = (
        <input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      );
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold tracking-wide text-[#4B210B]">
        {field.label}
      </label>
      {control}
      {field.help && <p className="mt-1.5 text-xs text-[#71655C]">{field.help}</p>}
    </div>
  );
}

/* ============================================================
   MESSAGES INBOX
   ============================================================ */

function formatDate(ts) {
  const d = ts?.toDate ? ts.toDate() : null;
  return d
    ? d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
    : "just now";
}

function Messages({ messages, error }) {
  const [filter, setFilter] = useState("all");

  const shown = messages.filter((m) =>
    filter === "all" ? m.status !== "archived" : m.status === filter
  );

  const run = (fn) => fn().catch((e) => window.alert(`Action failed: ${e.message}`));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {[
          ["all", "Inbox"],
          ["new", "Unread"],
          ["read", "Read"],
          ["archived", "Archived"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              filter === id
                ? "border-[#8B1026] bg-[#8B1026] text-white"
                : "border-[#D8CCBC] text-[#4B210B] hover:bg-[#E8D2B3]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-[#8B1026]/10 p-3 text-sm text-[#8B1026]">
          Could not load messages: {error}
        </p>
      )}

      {!shown.length && !error && (
        <p className="rounded-xl border border-dashed border-[#D8CCBC] p-8 text-center text-sm text-[#71655C]">
          No messages here yet.
        </p>
      )}

      <div className="space-y-3">
        {shown.map((m) => (
          <article
            key={m.id}
            className={`rounded-xl border p-5 ${
              m.status === "new"
                ? "border-[#8B1026]/40 bg-white shadow-sm"
                : "border-[#D8CCBC] bg-[#F2EEE3]/60"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-[#211C19]">
                  {m.name}{" "}
                  {m.status === "new" && (
                    <span className="ml-1 rounded-full bg-[#8B1026] px-2 py-0.5 text-[10px] font-bold text-white">
                      NEW
                    </span>
                  )}
                </p>
                <a
                  href={`mailto:${m.email}`}
                  className="text-xs text-[#8B1026] underline-offset-2 hover:underline"
                >
                  {m.email}
                </a>
              </div>
              <span className="text-xs text-[#71655C]">{formatDate(m.createdAt)}</span>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#4B210B]">
              {m.message}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-[#D8CCBC] pt-3">
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&authuser=${encodeURIComponent(
                  ADMIN_EMAIL
                )}&to=${encodeURIComponent(m.email)}&su=${encodeURIComponent(
                  "Re: your message"
                )}&body=${encodeURIComponent(
                  `Hi ${m.name},\n\n\n\n---\nOn ${formatDate(m.createdAt)} you wrote:\n${m.message}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (m.status === "new") setMessageStatus(m.id, "read").catch(() => {});
                }}
                className="rounded-lg bg-[#151413] px-3 py-1.5 text-xs font-semibold !text-white hover:bg-black"
              >
                Reply in Gmail ↗
              </a>
              {m.status !== "read" && (
                <button
                  type="button"
                  onClick={() => run(() => setMessageStatus(m.id, "read"))}
                  className="rounded-lg border border-[#D8CCBC] px-3 py-1.5 text-xs font-semibold text-[#4B210B] hover:bg-[#E8D2B3]"
                >
                  Mark as read
                </button>
              )}
              {m.status !== "new" && (
                <button
                  type="button"
                  onClick={() => run(() => setMessageStatus(m.id, "new"))}
                  className="rounded-lg border border-[#D8CCBC] px-3 py-1.5 text-xs font-semibold text-[#4B210B] hover:bg-[#E8D2B3]"
                >
                  Mark as unread
                </button>
              )}
              {m.status !== "archived" && (
                <button
                  type="button"
                  onClick={() => run(() => setMessageStatus(m.id, "archived"))}
                  className="rounded-lg border border-[#D8CCBC] px-3 py-1.5 text-xs font-semibold text-[#4B210B] hover:bg-[#E8D2B3]"
                >
                  Archive
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Delete this message permanently?")) {
                    run(() => deleteMessage(m.id));
                  }
                }}
                className="rounded-lg border border-[#8B1026]/30 px-3 py-1.5 text-xs font-semibold text-[#8B1026] hover:bg-[#8B1026] hover:text-white"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */

function Dashboard({ user }) {
  const [content, setContent] = useState(null);
  const [tabId, setTabId] = useState("hero");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null); // { type: "ok" | "error", text }
  const [messages, setMessages] = useState([]);
  const [messagesError, setMessagesError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Load the current content
  useEffect(() => {
    let alive = true;
    loadContent()
      .then((c) => alive && setContent(clone(c)))
      .catch(() => alive && setContent(clone(defaultContent)));
    return () => {
      alive = false;
    };
  }, []);

  // Live messages
  useEffect(() => {
    const unsub = listenToMessages(
      (list) => {
        setMessages(list);
        setMessagesError("");
      },
      (err) => setMessagesError(err.message)
    );
    return unsub;
  }, []);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const unread = useMemo(() => messages.filter((m) => m.status === "new").length, [messages]);

  const tab = TABS.find((t) => t.id === tabId);

  const updateGroup = useCallback((path, group) => {
    setContent((c) => setIn(c, path.split("."), group));
    setDirty(true);
    setNotice(null);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setNotice(null);
    try {
      await saveContent(content);
      setDirty(false);
      setNotice({ type: "ok", text: "Saved — your website is updated." });
    } catch (e) {
      setNotice({
        type: "error",
        text:
          e?.code === "permission-denied"
            ? "Permission denied. Check that firestore.rules is published and you signed in with the admin Google account."
            : `Could not save: ${e.message}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const resetSection = () => {
    if (!tab) return;
    if (!window.confirm(`Reset "${tab.label}" to the original defaults? (Not saved until you press Save.)`)) return;
    updateGroup(tab.path, clone(getIn(defaultContent, tab.path)));
  };

  const pickTab = (id) => {
    setTabId(id);
    setMenuOpen(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  const navButton = (id, label, badge) => (
    <button
      key={id}
      type="button"
      onClick={() => pickTab(id)}
      className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
        tabId === id
          ? "bg-[#8B1026] !text-white"
          : "text-[#4B210B] hover:bg-[#E8D2B3]"
      }`}
    >
      <span>{label}</span>
      {badge > 0 && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            tabId === id ? "bg-white text-[#8B1026]" : "bg-[#8B1026] text-white"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F2EEE3] text-[#191817]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-[#D8CCBC] bg-[#F2EEE3]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-lg border border-[#D8CCBC] px-3 py-2 text-sm font-bold text-[#4B210B] lg:hidden"
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <p className="font-serif text-lg font-bold italic text-[#8B1026] sm:text-xl">
            Admin Dashboard
          </p>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {dirty && (
              <span className="hidden text-xs font-semibold text-[#8B1026] sm:inline">
                ● Unsaved changes
              </span>
            )}

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-lg border border-[#D8CCBC] px-3 py-2 text-xs font-semibold text-[#4B210B] hover:bg-[#E8D2B3] sm:inline-block"
            >
              View site ↗
            </a>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !dirty}
              className="rounded-lg bg-[#151413] px-4 py-2 text-xs font-bold !text-white transition-opacity hover:bg-black disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>

            <button
              type="button"
              onClick={() => signOut(auth)}
              title={user.email}
              className="rounded-lg border border-[#D8CCBC] px-3 py-2 text-xs font-semibold text-[#4B210B] hover:bg-[#E8D2B3]"
            >
              Sign out
            </button>
          </div>
        </div>

        {notice && (
          <div
            role="status"
            className={`px-4 py-2 text-center text-sm font-semibold ${
              notice.type === "ok" ? "bg-[#E8D2B3] text-[#4B210B]" : "bg-[#8B1026] text-white"
            }`}
          >
            {notice.text}
          </div>
        )}
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className={`${menuOpen ? "block" : "hidden"} lg:block`}>
          <nav className="sticky top-24 space-y-1 rounded-2xl border border-[#D8CCBC] bg-white/60 p-3">
            {navButton("messages", "Messages", unread)}
            <div className="my-2 border-t border-[#D8CCBC]" />
            <p className="px-4 pb-1 pt-1 text-[10px] font-bold tracking-[0.18em] text-[#71655C]">
              EDIT WEBSITE
            </p>
            {TABS.map((t) => navButton(t.id, t.label, 0))}
          </nav>
        </aside>

        {/* Content area */}
        <main className="min-w-0 rounded-2xl border border-[#D8CCBC] bg-white/60 p-5 sm:p-8">
          {tabId === "messages" ? (
            <>
              <h1 className="font-serif text-3xl font-black italic text-[#8B1026]">Messages</h1>
              <p className="mb-6 mt-1 text-sm text-[#71655C]">
                Everything visitors send through your contact form.
              </p>
              <Messages messages={messages} error={messagesError} />
            </>
          ) : !content ? (
            <p className="text-sm text-[#71655C]">Loading content...</p>
          ) : (
            tab && (
              <>
                <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="font-serif text-3xl font-black italic text-[#8B1026]">
                      {tab.label}
                    </h1>
                    {tab.hint && <p className="mt-1 text-sm text-[#71655C]">{tab.hint}</p>}
                  </div>

                  <button
                    type="button"
                    onClick={resetSection}
                    className="rounded-lg border border-[#D8CCBC] px-3 py-2 text-xs font-semibold text-[#71655C] hover:bg-[#E8D2B3]"
                  >
                    Reset section
                  </button>
                </div>

                <div className="space-y-6">
                  {tab.fields.map((f) => {
                    const group = getIn(content, tab.path) || {};
                    return (
                      <FieldEditor
                        key={`${tab.id}-${f.key}`}
                        field={f}
                        value={group[f.key]}
                        onChange={(v) => updateGroup(tab.path, { ...group, [f.key]: v })}
                      />
                    );
                  })}
                </div>

                <div className="mt-8 border-t border-[#D8CCBC] pt-5">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || !dirty}
                    className="rounded-lg bg-[#151413] px-5 py-2.5 text-sm font-bold !text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </>
            )
          )}
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   LOGIN GATE
   ============================================================ */

export default function AdminPage() {
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [error, setError] = useState("");

  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u)), []);

  const handleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      if (e?.code !== "auth/popup-closed-by-user") {
        setError(e.message || "Sign-in failed.");
      }
    }
  };

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2EEE3] text-sm text-[#71655C]">
        Loading...
      </div>
    );
  }

  const allowed =
    user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() && user.emailVerified;

  if (allowed) return <Dashboard user={user} />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2EEE3] px-5">
      <div className="w-full max-w-md rounded-2xl border border-[#D8CCBC] bg-white/70 p-8 text-center shadow-sm">
        <p className="font-mono text-xs tracking-[0.2em] text-[#8B1026]">ADMIN</p>
        <h1 className="mt-3 font-serif text-3xl font-black italic text-[#8B1026]">
          Portfolio Dashboard
        </h1>

        {user ? (
          <>
            <p className="mt-5 text-sm leading-7 text-[#4B210B]">
              <strong>{user.email}</strong> is not allowed to open this dashboard.
            </p>
            <button
              type="button"
              onClick={() => signOut(auth)}
              className="mt-6 rounded-lg bg-[#151413] px-5 py-3 text-sm font-bold !text-white hover:bg-black"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <p className="mt-5 text-sm leading-7 text-[#71655C]">
              Sign in with the Google account of the site owner.
            </p>
            <button
              type="button"
              onClick={handleLogin}
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-lg bg-[#151413] px-5 py-3 text-sm font-bold !text-white hover:bg-black"
            >
              Sign in with Google
            </button>
          </>
        )}

        {error && <p className="mt-4 text-sm text-[#8B1026]">{error}</p>}
      </div>
    </div>
  );
}
