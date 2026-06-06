"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Link from "next/link";

const sg = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sg",
});
const jb = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jb",
});

// ── Types ──────────────────────────────────────────────────────────────────────

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string; // YYYY-MM-DD
}

interface MonthData {
  expenses: Expense[];
  budget: number;
}

type AllData = Record<string, MonthData>;

// ── Constants ──────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: "food",          label: "Food",          color: "#f97316" },
  { key: "transport",     label: "Transport",     color: "#22d3ee" },
  { key: "housing",       label: "Housing",       color: "#a78bfa" },
  { key: "entertainment", label: "Entertainment", color: "#ec4899" },
  { key: "shopping",      label: "Shopping",      color: "#84cc16" },
  { key: "health",        label: "Health",        color: "#10b981" },
  { key: "education",     label: "Education",     color: "#f59e0b" },
  { key: "other",         label: "Other",         color: "#6b7280" },
] as const;

const STORAGE_KEY = "expenses-v1";

const EMPTY_MONTH: MonthData = { expenses: [], budget: 0 };

// ── Helpers ────────────────────────────────────────────────────────────────────

function toMonthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function getDaysInMonth(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

function shiftMonth(key: string, delta: number) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return toMonthKey(d);
}

function formatAmount(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDateLabel(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getCatMeta(key: string) {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[7];
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ExpensesPage() {
  const NOW = toMonthKey(new Date());

  const [currentMonth, setCurrentMonth] = useState(NOW);
  const [allData, setAllData] = useState<AllData>({});
  const [mounted, setMounted] = useState(false);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [formAmount, setFormAmount] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState("food");
  const [formDate, setFormDate] = useState(todayISO());
  const [formError, setFormError] = useState(false);

  // Budget
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  // Responsive
  const [isMobile, setIsMobile] = useState(false);

  // ── Persistence ──────────────────────────────────────────────────────────────

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAllData(JSON.parse(raw));
    } catch {}
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    } catch {}
  }, [allData, mounted]);

  // ── Derived state ────────────────────────────────────────────────────────────

  const monthData: MonthData = allData[currentMonth] ?? EMPTY_MONTH;

  const expenses = useMemo(
    () => [...monthData.expenses].sort((a, b) => b.date.localeCompare(a.date)),
    [monthData.expenses]
  );

  const total = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses]
  );

  const budget = monthData.budget;
  const budgetPct = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;

  const daysInMonth = getDaysInMonth(currentMonth);
  const isCurrentMonth = currentMonth === NOW;
  const dayOfMonth = isCurrentMonth ? new Date().getDate() : daysInMonth;
  const avgPerDay = dayOfMonth > 0 ? total / dayOfMonth : 0;
  const daysLeft = isCurrentMonth ? daysInMonth - new Date().getDate() : 0;

  const categoryTotals = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        ...cat,
        amount: expenses
          .filter((e) => e.category === cat.key)
          .reduce((s, e) => s + e.amount, 0),
      }))
        .filter((c) => c.amount > 0)
        .sort((a, b) => b.amount - a.amount),
    [expenses]
  );

  const grouped = useMemo(() => {
    const acc: Record<string, Expense[]> = {};
    for (const e of expenses) {
      if (!acc[e.date]) acc[e.date] = [];
      acc[e.date].push(e);
    }
    return acc;
  }, [expenses]);

  const groupedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const budgetBarColor =
    budgetPct < 60 ? "#22d3ee" : budgetPct < 85 ? "#a78bfa" : "#ef4444";

  // ── Actions ──────────────────────────────────────────────────────────────────

  const updateMonth = useCallback(
    (key: string, fn: (d: MonthData) => MonthData) => {
      setAllData((prev) => ({
        ...prev,
        [key]: fn(prev[key] ?? EMPTY_MONTH),
      }));
    },
    []
  );

  const addExpense = useCallback(() => {
    const amount = parseFloat(formAmount);
    if (!formAmount || isNaN(amount) || amount <= 0) {
      setFormError(true);
      setTimeout(() => setFormError(false), 600);
      return;
    }
    const expense: Expense = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      amount,
      description: formDesc.trim() || "Untitled",
      category: formCategory,
      date: formDate,
    };
    const expMonth = formDate.slice(0, 7);
    updateMonth(expMonth, (d) => ({
      ...d,
      expenses: [...d.expenses, expense],
    }));
    setFormAmount("");
    setFormDesc("");
    setFormCategory("food");
    setFormDate(todayISO());
    setShowForm(false);
    if (expMonth !== currentMonth) setCurrentMonth(expMonth);
  }, [formAmount, formDesc, formCategory, formDate, currentMonth, updateMonth]);

  const deleteExpense = useCallback((id: string) => {
    setAllData((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = {
          ...next[key],
          expenses: next[key].expenses.filter((e) => e.id !== id),
        };
      }
      return next;
    });
  }, []);

  const saveBudget = useCallback(() => {
    const b = parseFloat(budgetInput);
    if (!isNaN(b) && b >= 0) {
      updateMonth(currentMonth, (d) => ({ ...d, budget: b }));
    }
    setEditingBudget(false);
    setBudgetInput("");
  }, [budgetInput, currentMonth, updateMonth]);

  // ── Styles ───────────────────────────────────────────────────────────────────

  const glass: React.CSSProperties = {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "14px 16px",
    color: "#faf5ef",
    fontFamily: "var(--font-sg), sans-serif",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  if (!mounted) return null;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div
      className={`${sg.variable} ${jb.variable}`}
      style={{
        minHeight: "100vh",
        background: "#0a0a08",
        color: "#faf5ef",
        fontFamily: "var(--font-sg), sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* Subtle grid */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Ambient glows */}
      <div aria-hidden style={{
        position: "fixed", top: -300, right: -200,
        width: 700, height: 700,
        background: "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div aria-hidden style={{
        position: "fixed", bottom: -250, left: -200,
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* ── Content ── */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 1080, margin: "0 auto",
        padding: isMobile ? "0 16px 120px" : "0 32px 120px",
      }}>

        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "28px 0 0", marginBottom: 44,
        }}>
          <Link
            href="/"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              color: "rgba(250,245,239,0.35)", textDecoration: "none",
              fontSize: 12, fontFamily: "var(--font-jb), monospace",
              letterSpacing: "0.1em", transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#22d3ee")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(250,245,239,0.35)")}
          >
            ← PORTFOLIO
          </Link>

          <span style={{
            fontFamily: "var(--font-jb), monospace",
            fontSize: 10, letterSpacing: "0.35em",
            color: "rgba(250,245,239,0.2)", textTransform: "uppercase",
          }}>
            EXPENSES
          </span>

          <div style={{ width: 80 }} />
        </div>

        {/* Month navigator */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 20, marginBottom: 52,
        }}>
          <NavButton onClick={() => setCurrentMonth(shiftMonth(currentMonth, -1))}>
            ‹
          </NavButton>

          <div style={{ textAlign: "center", minWidth: 200 }}>
            <motion.h1
              key={currentMonth}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              style={{
                fontFamily: "var(--font-sg), sans-serif",
                fontSize: "clamp(20px, 4vw, 30px)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                margin: 0, lineHeight: 1.1,
              }}
            >
              {formatMonth(currentMonth)}
            </motion.h1>

            <AnimatePresence>
              {!isCurrentMonth && (
                <motion.button
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  onClick={() => setCurrentMonth(NOW)}
                  style={{
                    marginTop: 6, fontSize: 11,
                    fontFamily: "var(--font-jb), monospace",
                    letterSpacing: "0.08em", color: "#22d3ee",
                    background: "none", border: "none",
                    cursor: "pointer", opacity: 0.7, padding: 0,
                  }}
                >
                  → current month
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <NavButton onClick={() => setCurrentMonth(shiftMonth(currentMonth, 1))}>
            ›
          </NavButton>
        </div>

        {/* Hero total */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{
            fontSize: 10, fontFamily: "var(--font-jb), monospace",
            letterSpacing: "0.3em", color: "rgba(250,245,239,0.3)",
            marginBottom: 10, textTransform: "uppercase",
          }}>
            TOTAL SPENT
          </div>

          <motion.div
            key={`total-${currentMonth}`}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: "var(--font-jb), monospace",
              fontSize: "clamp(48px, 10vw, 88px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              ...(total > 0
                ? {
                    background: "linear-gradient(135deg, #22d3ee 20%, #a78bfa 80%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }
                : { color: "rgba(250,245,239,0.12)" }),
            }}
          >
            ${formatAmount(total)}
          </motion.div>

          {/* Stats pills */}
          <div style={{
            display: "flex", justifyContent: "center",
            gap: 12, marginTop: 24, flexWrap: "wrap",
          }}>
            {[
              {
                label: "TRANSACTIONS",
                value: expenses.length.toString(),
                show: true,
              },
              {
                label: "AVG / DAY",
                value: avgPerDay > 0 ? `$${formatAmount(avgPerDay)}` : "—",
                show: true,
              },
              {
                label: "DAYS LEFT",
                value: daysLeft.toString(),
                show: isCurrentMonth,
              },
            ]
              .filter((s) => s.show)
              .map((s) => (
                <div
                  key={s.label}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 100,
                    ...glass,
                  }}
                >
                  <span style={{
                    fontFamily: "var(--font-jb), monospace",
                    fontSize: 10, letterSpacing: "0.15em",
                    color: "rgba(250,245,239,0.3)", marginRight: 8,
                  }}>
                    {s.label}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-jb), monospace",
                    fontSize: 13, fontWeight: 600, color: "#faf5ef",
                  }}>
                    {s.value}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Budget bar */}
        <div style={{
          ...glass, borderRadius: 16,
          padding: "20px 24px", marginBottom: 44,
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: 14,
          }}>
            <span style={{
              fontFamily: "var(--font-jb), monospace",
              fontSize: 10, letterSpacing: "0.25em",
              color: "rgba(250,245,239,0.3)", textTransform: "uppercase",
            }}>
              Monthly Budget
            </span>

            {editingBudget ? (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  autoFocus
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveBudget();
                    if (e.key === "Escape") setEditingBudget(false);
                  }}
                  placeholder={budget > 0 ? budget.toString() : "Amount..."}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(34,211,238,0.45)",
                    borderRadius: 8, padding: "5px 12px",
                    color: "#faf5ef",
                    fontFamily: "var(--font-jb), monospace",
                    fontSize: 13, width: 120, outline: "none",
                  }}
                />
                <button
                  onClick={saveBudget}
                  style={{
                    background: "#22d3ee", border: "none",
                    borderRadius: 7, padding: "5px 12px",
                    color: "#0a0a08",
                    fontFamily: "var(--font-jb), monospace",
                    fontSize: 11, fontWeight: 700, cursor: "pointer",
                    letterSpacing: "0.05em",
                  }}
                >
                  SET
                </button>
                <button
                  onClick={() => setEditingBudget(false)}
                  style={{
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 7, padding: "5px 10px",
                    color: "rgba(250,245,239,0.4)",
                    fontFamily: "var(--font-jb), monospace",
                    fontSize: 11, cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setEditingBudget(true);
                  setBudgetInput(budget > 0 ? budget.toString() : "");
                }}
                style={{
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, padding: "5px 14px",
                  color: budget > 0 ? "#faf5ef" : "rgba(250,245,239,0.3)",
                  fontFamily: "var(--font-jb), monospace",
                  fontSize: 12, cursor: "pointer",
                }}
              >
                {budget > 0 ? `$${formatAmount(budget)}` : "+ Set budget"}
              </button>
            )}
          </div>

          <div style={{
            height: 6, background: "rgba(255,255,255,0.06)",
            borderRadius: 100, overflow: "hidden",
          }}>
            <motion.div
              animate={{ width: budget > 0 ? `${budgetPct}%` : "0%" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{
                height: "100%", borderRadius: 100,
                background: `linear-gradient(90deg, #22d3ee, ${budgetBarColor})`,
                boxShadow: `0 0 10px ${budgetBarColor}50`,
              }}
            />
          </div>

          {budget > 0 && (
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginTop: 8,
              fontFamily: "var(--font-jb), monospace",
              fontSize: 11, color: "rgba(250,245,239,0.3)",
            }}>
              <span>{budgetPct.toFixed(1)}% used</span>
              <span>
                {total > budget
                  ? `$${formatAmount(total - budget)} over budget`
                  : `$${formatAmount(budget - total)} remaining`}
              </span>
            </div>
          )}
        </div>

        {/* Main grid: list + breakdown */}
        <div style={{
          display: "grid",
          gridTemplateColumns:
            !isMobile && categoryTotals.length > 0 ? "1fr 300px" : "1fr",
          gap: 24, alignItems: "start",
        }}>
          {/* Expense list */}
          <div>
            <AnimatePresence mode="wait">
              {groupedDates.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    textAlign: "center",
                    padding: "80px 24px",
                    fontFamily: "var(--font-jb), monospace",
                  }}
                >
                  <div style={{
                    fontSize: 56, marginBottom: 20,
                    color: "rgba(250,245,239,0.08)",
                    letterSpacing: "-0.04em",
                  }}>
                    ◌
                  </div>
                  <div style={{
                    fontSize: 12, letterSpacing: "0.2em",
                    color: "rgba(250,245,239,0.2)", marginBottom: 8,
                  }}>
                    NO EXPENSES YET
                  </div>
                  <div style={{
                    fontSize: 11, color: "rgba(250,245,239,0.12)",
                    letterSpacing: "0.05em",
                  }}>
                    Press + to log your first one
                  </div>
                </motion.div>
              ) : (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {groupedDates.map((date) => (
                    <div key={date} style={{ marginBottom: 28 }}>
                      <div style={{
                        fontFamily: "var(--font-jb), monospace",
                        fontSize: 10, letterSpacing: "0.25em",
                        color: "rgba(250,245,239,0.28)",
                        marginBottom: 10, paddingLeft: 4,
                        textTransform: "uppercase",
                      }}>
                        {formatDateLabel(date)}
                      </div>

                      <AnimatePresence>
                        {grouped[date].map((expense, i) => {
                          const cat = getCatMeta(expense.category);
                          return (
                            <motion.div
                              key={expense.id}
                              layout
                              initial={{ opacity: 0, x: -16 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 16, scaleY: 0.5, marginBottom: 0, height: 0, padding: 0 }}
                              transition={{ delay: i * 0.03, duration: 0.2 }}
                              style={{
                                display: "flex", alignItems: "center", gap: 14,
                                padding: "14px 18px",
                                ...glass,
                                borderRadius: 12, marginBottom: 8,
                                position: "relative", overflow: "hidden",
                                cursor: "default",
                                transition: "border-color 0.15s",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
                              }
                            >
                              {/* Left color strip */}
                              <div style={{
                                position: "absolute", left: 0, top: 0, bottom: 0,
                                width: 3, background: cat.color,
                                borderRadius: "12px 0 0 12px",
                              }} />

                              {/* Category badge */}
                              <div style={{
                                padding: "4px 10px", borderRadius: 100,
                                background: `${cat.color}18`,
                                border: `1px solid ${cat.color}35`,
                                fontFamily: "var(--font-jb), monospace",
                                fontSize: 9, letterSpacing: "0.12em",
                                color: cat.color, whiteSpace: "nowrap",
                                flexShrink: 0, textTransform: "uppercase",
                              }}>
                                {cat.label}
                              </div>

                              {/* Description */}
                              <div style={{
                                flex: 1,
                                fontFamily: "var(--font-sg), sans-serif",
                                fontSize: 14,
                                color: "rgba(250,245,239,0.75)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}>
                                {expense.description}
                              </div>

                              {/* Amount */}
                              <div style={{
                                fontFamily: "var(--font-jb), monospace",
                                fontSize: 15, fontWeight: 600,
                                color: "#faf5ef", flexShrink: 0,
                              }}>
                                ${formatAmount(expense.amount)}
                              </div>

                              {/* Delete */}
                              <motion.button
                                whileHover={{ scale: 1.15, color: "#ef4444" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => deleteExpense(expense.id)}
                                style={{
                                  width: 26, height: 26, borderRadius: "50%",
                                  border: "1px solid rgba(239,68,68,0.25)",
                                  background: "rgba(239,68,68,0.04)",
                                  color: "rgba(239,68,68,0.4)",
                                  cursor: "pointer",
                                  display: "flex", alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 14, flexShrink: 0,
                                  transition: "color 0.15s",
                                }}
                              >
                                ×
                              </motion.button>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Category breakdown sidebar */}
          <AnimatePresence>
            {categoryTotals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{
                  ...glass, borderRadius: 16, padding: "22px 20px",
                  position: isMobile ? "static" : "sticky", top: 24,
                  ...(isMobile ? { marginTop: 24 } : {}),
                }}
              >
                <div style={{
                  fontFamily: "var(--font-jb), monospace",
                  fontSize: 10, letterSpacing: "0.25em",
                  color: "rgba(250,245,239,0.3)",
                  marginBottom: 22, textTransform: "uppercase",
                }}>
                  By Category
                </div>

                {categoryTotals.map((cat) => {
                  const pct = total > 0 ? (cat.amount / total) * 100 : 0;
                  return (
                    <div key={cat.key} style={{ marginBottom: 18 }}>
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "flex-start", marginBottom: 7,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            width: 7, height: 7, borderRadius: "50%",
                            background: cat.color,
                            boxShadow: `0 0 6px ${cat.color}90`,
                            flexShrink: 0,
                          }} />
                          <span style={{
                            fontFamily: "var(--font-sg), sans-serif",
                            fontSize: 13, color: "rgba(250,245,239,0.65)",
                          }}>
                            {cat.label}
                          </span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{
                            fontFamily: "var(--font-jb), monospace",
                            fontSize: 13, fontWeight: 600, color: "#faf5ef",
                          }}>
                            ${formatAmount(cat.amount)}
                          </div>
                          <div style={{
                            fontFamily: "var(--font-jb), monospace",
                            fontSize: 10, color: "rgba(250,245,239,0.28)",
                          }}>
                            {pct.toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      <div style={{
                        height: 3, background: "rgba(255,255,255,0.05)",
                        borderRadius: 100, overflow: "hidden",
                      }}>
                        <motion.div
                          key={`${cat.key}-${currentMonth}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
                          style={{
                            height: "100%", borderRadius: 100,
                            background: cat.color,
                            boxShadow: `0 0 6px ${cat.color}60`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Divider + total check */}
                <div style={{
                  marginTop: 20, paddingTop: 16,
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{
                    fontFamily: "var(--font-jb), monospace",
                    fontSize: 10, letterSpacing: "0.15em",
                    color: "rgba(250,245,239,0.3)", textTransform: "uppercase",
                  }}>
                    Total
                  </span>
                  <span style={{
                    fontFamily: "var(--font-jb), monospace",
                    fontSize: 14, fontWeight: 700, color: "#22d3ee",
                  }}>
                    ${formatAmount(total)}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── FAB ── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setShowForm(true)}
        style={{
          position: "fixed", bottom: 32, right: 32,
          width: 58, height: 58, borderRadius: "50%",
          background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
          border: "none", color: "#0a0a08",
          fontSize: 30, fontWeight: 300,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 28px rgba(34,211,238,0.4), 0 0 60px rgba(167,139,250,0.15)",
          zIndex: 100, lineHeight: 1,
          fontFamily: "var(--font-sg), sans-serif",
        }}
        aria-label="Add expense"
      >
        +
      </motion.button>

      {/* ── Add expense sheet ── */}
      <AnimatePresence>
        {showForm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.65)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                zIndex: 200,
              }}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              style={{
                position: "fixed", bottom: 0, left: 0, right: 0,
                background: "#111110",
                border: "1px solid rgba(255,255,255,0.1)",
                borderBottom: "none",
                borderRadius: "22px 22px 0 0",
                padding: isMobile ? "28px 20px 48px" : "32px 36px 52px",
                zIndex: 300,
                maxWidth: 560, margin: "0 auto",
              }}
            >
              {/* Drag handle */}
              <div style={{
                width: 36, height: 4, borderRadius: 100,
                background: "rgba(255,255,255,0.15)",
                margin: "0 auto 28px",
              }} />

              <div style={{
                fontFamily: "var(--font-jb), monospace",
                fontSize: 10, letterSpacing: "0.3em",
                color: "rgba(250,245,239,0.3)",
                marginBottom: 24, textTransform: "uppercase",
              }}>
                Add Expense
              </div>

              {/* Amount */}
              <div style={{ position: "relative", marginBottom: 16 }}>
                <span style={{
                  position: "absolute", left: 16, top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "var(--font-jb), monospace",
                  fontSize: 28, color: "rgba(250,245,239,0.25)",
                  pointerEvents: "none",
                }}>
                  $
                </span>
                <motion.input
                  animate={formError ? { x: [0, -8, 8, -6, 6, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  autoFocus
                  type="number"
                  step="0.01"
                  min="0"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addExpense()}
                  placeholder="0.00"
                  style={{
                    ...inputBase,
                    paddingLeft: 44, fontSize: 32,
                    fontFamily: "var(--font-jb), monospace",
                    fontWeight: 600,
                    border: formError
                      ? "1px solid rgba(239,68,68,0.6)"
                      : "1px solid rgba(255,255,255,0.1)",
                  }}
                  onFocus={(e) => {
                    if (!formError) e.target.style.borderColor = "rgba(34,211,238,0.5)";
                  }}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: 16 }}>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addExpense()}
                  placeholder="What was this for?"
                  style={inputBase}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(34,211,238,0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
              </div>

              {/* Date */}
              <div style={{ marginBottom: 20 }}>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  style={{
                    ...inputBase,
                    fontFamily: "var(--font-jb), monospace",
                    fontSize: 14,
                    colorScheme: "dark",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(34,211,238,0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
              </div>

              {/* Category pills */}
              <div style={{
                display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28,
              }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setFormCategory(cat.key)}
                    style={{
                      padding: "7px 14px", borderRadius: 100,
                      border: formCategory === cat.key
                        ? `1px solid ${cat.color}`
                        : "1px solid rgba(255,255,255,0.1)",
                      background: formCategory === cat.key
                        ? `${cat.color}1a`
                        : "rgba(255,255,255,0.03)",
                      color: formCategory === cat.key
                        ? cat.color
                        : "rgba(250,245,239,0.45)",
                      fontFamily: "var(--font-jb), monospace",
                      fontSize: 11, letterSpacing: "0.08em",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={addExpense}
                style={{
                  width: "100%", padding: "16px",
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
                  border: "none", color: "#0a0a08",
                  fontFamily: "var(--font-sg), sans-serif",
                  fontSize: 15, fontWeight: 700,
                  letterSpacing: "0.01em", cursor: "pointer",
                }}
              >
                Add Expense
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function NavButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      style={{
        width: 38, height: 38, borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.03)",
        color: "rgba(250,245,239,0.5)", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        transition: "border-color 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)";
        e.currentTarget.style.color = "#22d3ee";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        e.currentTarget.style.color = "rgba(250,245,239,0.5)";
      }}
    >
      {children}
    </motion.button>
  );
}
