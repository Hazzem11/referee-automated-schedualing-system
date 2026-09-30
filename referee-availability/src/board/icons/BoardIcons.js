import React from "react";

const Svg = ({ children, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

const icons = {
  globe: (
    <Svg>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </Svg>
  ),
  users: (
    <Svg>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </Svg>
  ),
  calendar: (
    <Svg>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </Svg>
  ),
  clipboard: (
    <Svg>
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
    </Svg>
  ),
  "file-bar": (
    <Svg>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </Svg>
  ),
  shield: (
    <Svg>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  ),
  "user-circle": (
    <Svg>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Svg>
  ),
  bell: (
    <Svg>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </Svg>
  ),
  book: (
    <Svg>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </Svg>
  ),
  "file-text": (
    <Svg>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </Svg>
  ),
  "map-pin": (
    <Svg>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
      <circle cx="12" cy="10" r="3" />
    </Svg>
  ),
  "user-check": (
    <Svg>
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </Svg>
  ),
  clock: (
    <Svg>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Svg>
  ),
  trophy: (
    <Svg>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" />
      <path d="M7 4H4a1 1 0 00-1 1v1a3 3 0 003 3M17 4h3a1 1 0 011 1v1a3 3 0 01-3 3" />
    </Svg>
  ),
  training: (
    <Svg>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2.7 3 6 3s6-1 6-3v-5" />
    </Svg>
  ),
  "calendar-day": (
    <Svg>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01M12 14h.01M16 14h.01" />
    </Svg>
  ),
  wrench: (
    <Svg>
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </Svg>
  ),
  "clipboard-check": (
    <Svg>
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <polyline points="9 14 11 16 15 12" />
    </Svg>
  ),
  "user-x": (
    <Svg>
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="18" y1="8" x2="23" y2="13" />
      <line x1="23" y1="8" x2="18" y2="13" />
    </Svg>
  ),
  alert: (
    <Svg>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Svg>
  ),
  scroll: (
    <Svg>
      <path d="M8 21h12a2 2 0 002-2v-2H10v2a2 2 0 01-2 2z" />
      <path d="M6 19H4a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v2" />
    </Svg>
  ),
  help: (
    <Svg>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Svg>
  ),
  dollar: (
    <Svg>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </Svg>
  ),
  "user-plus": (
    <Svg>
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </Svg>
  ),
  lock: (
    <Svg>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </Svg>
  ),
  ban: (
    <Svg>
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </Svg>
  ),
  shuffle: (
    <Svg>
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </Svg>
  ),
  "log-out": (
    <Svg>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </Svg>
  ),
  link: (
    <Svg>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </Svg>
  ),
  basketball: (
    <Svg>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20M2 12h20M5 5c3 3 3 11 0 14M19 5c-3 3-3 11 0 14" />
    </Svg>
  ),
  chevron: (
    <Svg>
      <polyline points="9 18 15 12 9 6" />
    </Svg>
  ),
};

const groupIcons = {
  Public: "globe",
  Members: "users",
  Games: "calendar",
  Evaluations: "clipboard",
  Reports: "file-bar",
  Admin: "shield",
};

const linkIcons = {
  "/board/public/executive-team": "users",
  "/board/public/locations": "map-pin",
  "/board/admin/account": "user-circle",
  "/board/members/updates": "bell",
  "/board/members/rules": "book",
  "/board/members/policies": "file-text",
  "/board/members/list": "users",
  "/board/members/referee-coach-list": "user-check",
  "/board/games/my-games": "calendar",
  "/board/games/availability": "clock",
  "/board/games/tournaments": "trophy",
  "/board/games/training": "training",
  "/board/games/today": "calendar-day",
  "/board/games/manage": "wrench",
  "/board/evaluations/my-games": "clipboard-check",
  "/board/evaluations/docs": "file-text",
  "/board/reports/lateness": "clock",
  "/board/reports/absence": "user-x",
  "/board/reports/incident": "alert",
  "/board/reports/executive-minutes": "file-text",
  "/board/reports/constitution": "scroll",
  "/board/admin/questions": "help",
  "/board/admin/dues-fees": "dollar",
  "/board/admin/register": "user-plus",
  "/board/admin/password": "lock",
  "/board/admin/suspensions": "ban",
  "/board/admin/auto-assign": "shuffle",
  "/board/admin/referees": "users",
  "/board/admin/logout": "log-out",
};

export const BoardIcon = ({ name, className }) => {
  const icon = icons[name];
  if (!icon) return null;
  return <span className={className ? `board-icon ${className}` : "board-icon"}>{icon}</span>;
};

export const getGroupIcon = (title) => groupIcons[title] || "link";
export const getLinkIcon = (to) => linkIcons[to] || "link";
