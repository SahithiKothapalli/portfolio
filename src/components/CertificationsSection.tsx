'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown, Award } from 'lucide-react';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface CertItem {
  id: string;
  title: string;
  issuer: string;
  date: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  skills: string | null;
  order: number | null;
}

interface CertificationsSectionProps {
  items: CertItem[];
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function parseYear(date: string | null): string {
  if (!date) return '—';
  const d = new Date(date);
  if (!isNaN(d.getFullYear())) return String(d.getFullYear());
  const match = date.match(/\d{4}/);
  return match ? match[0] : date;
}

function parseSkills(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    // not JSON – fall through to CSV split
  }
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/* ─────────────────────────────────────────────
   Hover flood + mobile CSS
───────────────────────────────────────────── */
const GLOBAL_STYLES = `
.cert-row {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: color 0.25s;
}
.cert-row::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(139, 92, 246, 0.08);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}
.cert-row:hover::before {
  transform: scaleX(1);
}
.cert-num {
  font-family: monospace;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: var(--foreground);
  opacity: 0.3;
  padding-left: 2px;
  padding-right: 12px;
  white-space: nowrap;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1;
}
.cert-row:hover .cert-num {
  color: rgb(139, 92, 246) !important;
  opacity: 1 !important;
  transform: translateX(2px);
}
.cert-row:hover .cert-title {
  color: rgb(139, 92, 246) !important;
}
.cert-row:focus-visible {
  outline: 2px solid rgba(139, 92, 246, 0.6);
  outline-offset: -2px;
}

@media (max-width: 600px) {
  .cert-row::before { display: none; }
  .cert-row {
    grid-template-columns: 48px 1px 1fr auto !important;
    min-height: auto !important;
    padding: 14px 0 !important;
  }
  .cert-num {
    font-size: 22px !important;
    padding-right: 8px !important;
  }
  .cert-title {
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: unset !important;
  }
  .cert-expanded-inner {
    padding-left: 16px !important;
  }
}
`;

/* ─────────────────────────────────────────────
   Expanded Panel
───────────────────────────────────────────── */
function ExpandedPanel({ item }: { item: CertItem }) {
  const skills = parseSkills(item.skills);

  return (
    <motion.div
      key="expanded"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ overflow: 'hidden' }}
    >
      <div
        className="cert-expanded-inner"
        style={{
          background: 'rgba(139,92,246,0.04)',
          borderBottom: '1px solid var(--border)',
          padding: '14px 16px 16px 78px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {/* Credential ID badge */}
        {item.credentialId && (
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              background: 'rgba(139,92,246,0.1)',
              color: 'rgb(139,92,246)',
              border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: '4px',
              padding: '2px 8px',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            {item.credentialId}
          </span>
        )}

        {/* Skill pills */}
        {skills.map((skill) => (
          <span
            key={skill}
            style={{
              fontSize: '11px',
              background: 'var(--muted)',
              color: 'var(--muted-foreground)',
              borderRadius: '9999px',
              padding: '2px 10px',
              whiteSpace: 'nowrap',
            }}
          >
            {skill}
          </span>
        ))}

        <span style={{ flex: 1 }} />

        {/* Verify link */}
        {item.credentialUrl && (
          <a
            href={item.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgb(139,92,246)',
              textDecoration: 'none',
              padding: '4px 12px',
              border: '1px solid rgba(139,92,246,0.35)',
              borderRadius: '6px',
              background: 'transparent',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background =
                'rgba(139,92,246,0.12)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background =
                'transparent')
            }
          >
            Verify
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function CertificationsSection({
  items,
}: CertificationsSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...items].sort((a, b) => {
    if (a.order !== null && b.order !== null) return a.order - b.order;
    if (a.order !== null) return -1;
    if (b.order !== null) return 1;
    return 0;
  });

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <section
      style={{
        width: '100%',
        maxWidth: '860px',
        margin: '0 auto',
        padding: '80px 24px',
      }}
    >
      {/* Global CSS */}
      <style>{GLOBAL_STYLES}</style>

      {/* ── Badge ── */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: 'rgb(139,92,246)',
          textTransform: 'uppercase',
          marginBottom: '20px',
          padding: '4px 10px',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '4px',
          background: 'rgba(139,92,246,0.06)',
        }}
      >
        <Award size={12} />
        Verified Credentials
      </div>

      {/* ── Section Heading ── */}
      <h2
        style={{
          fontSize: 'clamp(28px, 5vw, 48px)',
          fontWeight: 700,
          color: 'var(--foreground)',
          marginBottom: '48px',
          lineHeight: 1.15,
        }}
      >
        Credentials{' '}
        <em
          style={{
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'var(--muted-foreground)',
          }}
        >
          I&apos;ve earned.
        </em>
      </h2>

      {/* ── Empty state ── */}
      {sorted.length === 0 && (
        <div
          style={{
            border: '1.5px dashed var(--border)',
            borderRadius: '8px',
            padding: '48px 24px',
            textAlign: 'center',
            color: 'var(--muted-foreground)',
            fontSize: '14px',
          }}
        >
          No certifications yet.
        </div>
      )}

      {/* ── Indexed list ── */}
      {sorted.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {sorted.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            const year = parseYear(item.date);
            const hasDetails =
              !!item.credentialId ||
              !!item.credentialUrl ||
              !!(item.skills && item.skills.trim().length > 0);

            return (
              <div key={item.id}>
                {/* ── Row ── */}
                <div
                  className="cert-row"
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onClick={() => toggle(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggle(item.id);
                    }
                  }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '70px 1px 1fr auto 28px',
                    alignItems: 'center',
                    borderBottom: isExpanded
                      ? 'none'
                      : '1px solid var(--border)',
                    minHeight: '76px',
                    padding: '12px 0',
                  }}
                >
                  {/* Big Index Numeral */}
                  <div
                    className="cert-num"
                  >
                    {pad(idx + 1)}
                  </div>

                  {/* Vertical divider */}
                  <div
                    style={{
                      width: '1px',
                      alignSelf: 'stretch',
                      background: 'var(--border)',
                      zIndex: 1,
                    }}
                  />

                  {/* Title + Issuer */}
                  <div
                    style={{
                      paddingLeft: '20px',
                      paddingRight: '16px',
                      zIndex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      className="cert-title"
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--foreground)',
                        transition: 'color 0.25s',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--muted-foreground)',
                        marginTop: '2px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.issuer}
                    </div>
                  </div>

                  {/* Year */}
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      color: 'var(--muted-foreground)',
                      paddingRight: '10px',
                      whiteSpace: 'nowrap',
                      zIndex: 1,
                    }}
                  >
                    {year}
                  </div>

                  {/* Chevron */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingRight: '4px',
                      zIndex: 1,
                      visibility: hasDetails ? 'visible' : 'hidden',
                    }}
                  >
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        display: 'flex',
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      <ChevronDown size={15} />
                    </motion.div>
                  </div>
                </div>

                {/* ── Expanded panel ── */}
                <AnimatePresence initial={false}>
                  {isExpanded && hasDetails && (
                    <ExpandedPanel item={item} />
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
