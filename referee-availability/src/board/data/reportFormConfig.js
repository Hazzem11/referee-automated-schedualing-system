export const REPORT_FORM_OPTIONS = {
  locations: [
    "Alexandria - E. S. C. Le Relais",
    "Ottawa - Immaculata High School",
    "Nepean - Sir Robert Borden High School",
    "Kanata - Earl of March Secondary School",
  ],
  dates: ["2026-05-26", "2026-05-25", "2026-05-24", "2026-05-23"],
  times: ["07:00", "08:00", "09:30", "12:00", "18:00", "19:30"],
  assignments: [
    "CASH - 4 x 10 Elite",
    "INV - 4 x 8 Stopped",
    "CASH - 4 x 10 Stopped",
    "INV - Hourly Rate",
    "NoFee - 4 x 8 Stopped",
  ],
  levels: ["U-10 Boys", "U-12 Girls", "U-14 Boys", "U-16 Girls", "Senior Men", "Senior Women"],
  officials: [
    "",
    "Hazzem Sukar",
    "Michael Chagnon",
    "Nicolas AbantoEnns",
    "Marcelo Agcaoili",
    "Nour-el-islam Aabiyda",
  ],
};

export const REPORT_CONFIGS = {
  lateness: {
    title: "Lateness Report",
    intro: "Please use this form to send a Lateness Report to the vice-president.",
    policySections: [
      {
        heading: "Lateness Reports",
        text: "Lateness reports must be filed regardless of the reason. Our clients expect professional, on-time service from OVBABO members.",
      },
      {
        heading: "Failure to Comply",
        text: "Please refer to the OVBABO Policy on Sanctions for Missed Assignments, Late Arrival at Assignments and Failed Incident Reporting.",
      },
    ],
  },
  absence: {
    title: "Absence Report",
    intro: "Please use this form to send an Absence Report to the vice-president.",
    policySections: [
      {
        heading: "Absence Reports",
        text: "Absence reports must be filed when an assigned official fails to appear for a game. Report as soon as possible so a replacement can be arranged.",
      },
      {
        heading: "Failure to Comply",
        text: "Please refer to the OVBABO Policy on Sanctions for Missed Assignments, Late Arrival at Assignments and Failed Incident Reporting.",
      },
    ],
  },
  incident: {
    title: "Incident Report",
    intro: "Please use this form to send an Incident Report to the vice-president.",
    policySections: [
      {
        heading: "Incident Reports",
        text: "Incident reports document unusual or serious situations that occur during a game assignment. File promptly with accurate details.",
      },
      {
        heading: "Failure to Comply",
        text: "Please refer to the OVBABO Policy on Sanctions for Missed Assignments, Late Arrival at Assignments and Failed Incident Reporting.",
      },
    ],
  },
};
