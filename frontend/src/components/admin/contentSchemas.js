// Declarative field schemas for the admin Content editor.
// Field types: "text" (single line), "textarea", "number", "group" (fixed nested object),
// "list" (array of objects, admin can add/remove items), "stringlist" (array of plain strings).

export const CONTENT_SCHEMAS = [
  {
    key: "site_settings",
    label: "Site Settings",
    fields: [
      { key: "siteName", label: "Site Name", type: "text" },
      { key: "mlaName", label: "MLA Name", type: "text" },
      { key: "constituency", label: "Constituency", type: "text" },
      { key: "district", label: "District", type: "text" },
      { key: "state", label: "State", type: "text" },
      {
        key: "office", label: "Head Office", type: "group", fields: [
          { key: "phone", label: "Phone", type: "text" },
          { key: "email", label: "Email", type: "text" },
          { key: "address", label: "Address", type: "textarea" },
        ]
      },
      {
        key: "social", label: "Social Links", type: "group", fields: [
          { key: "facebook", label: "Facebook URL", type: "text" },
          { key: "instagram", label: "Instagram URL", type: "text" },
          { key: "youtube", label: "YouTube URL", type: "text" },
          { key: "whatsapp", label: "WhatsApp URL", type: "text" },
        ]
      },
    ],
  },
  {
    key: "home",
    label: "Home Page",
    fields: [
      { key: "heroTitle", label: "Hero Title", type: "text" },
      { key: "heroSubtitle", label: "Hero Subtitle", type: "textarea" },
      {
        key: "stats", label: "Key Stats", type: "list", itemLabel: "Stat", itemFields: [
          { key: "label", label: "Label", type: "text" },
          { key: "value", label: "Value", type: "text" },
          { key: "desc", label: "Description", type: "text" },
        ]
      },
    ],
  },
  {
    key: "about",
    label: "About / Biography",
    fields: [
      { key: "designation", label: "Designation", type: "text" },
      { key: "party", label: "Party", type: "text" },
      { key: "bio", label: "Biography", type: "textarea" },
      { key: "education", label: "Education", type: "text" },
      { key: "vision", label: "Vision Statement", type: "textarea" },
      {
        key: "milestones", label: "Career Milestones", type: "list", itemLabel: "Milestone", itemFields: [
          { key: "year", label: "Year", type: "text" },
          { key: "event", label: "Event", type: "textarea" },
        ]
      },
    ],
  },
  {
    key: "constituency",
    label: "Constituency",
    fields: [
      { key: "heritageParagraphs", label: "Heritage & History Paragraphs", type: "stringlist" },
      {
        key: "quickFacts", label: "Quick Facts", type: "list", itemLabel: "Fact", itemFields: [
          { key: "label", label: "Label", type: "text" },
          { key: "value", label: "Value", type: "text" },
        ]
      },
      {
        key: "landmarks", label: "Landmarks & Tourism", type: "list", itemLabel: "Landmark", itemFields: [
          { key: "name", label: "Name", type: "text" },
          { key: "desc", label: "Description", type: "textarea" },
          { key: "image", label: "Image URL", type: "text" },
        ]
      },
    ],
  },
  {
    key: "development",
    label: "Development Projects",
    fields: [
      { key: "activeFundsAllocated", label: "Active Funds Allocated (badge text)", type: "text" },
      {
        key: "projects", label: "Projects", type: "list", itemLabel: "Project", itemFields: [
          { key: "title", label: "Title", type: "text" },
          { key: "category", label: "Category", type: "text" },
          { key: "status", label: "Status (Completed / In Progress)", type: "text" },
          { key: "progress", label: "Progress %", type: "number" },
          { key: "budget", label: "Budget", type: "text" },
          { key: "desc", label: "Description", type: "textarea" },
        ]
      },
    ],
  },
  {
    key: "news",
    label: "News & Events",
    fields: [
      {
        key: "articles", label: "News Articles", type: "list", itemLabel: "Article", itemFields: [
          { key: "title", label: "Title", type: "text" },
          { key: "category", label: "Category", type: "text" },
          { key: "date", label: "Date", type: "text" },
          { key: "summary", label: "Summary", type: "textarea" },
          { key: "image", label: "Image URL", type: "text" },
        ]
      },
      {
        key: "events", label: "Upcoming Events", type: "list", itemLabel: "Event", itemFields: [
          { key: "title", label: "Title", type: "text" },
          { key: "date", label: "Date", type: "text" },
          { key: "time", label: "Time", type: "text" },
          { key: "venue", label: "Venue", type: "text" },
          { key: "desc", label: "Description", type: "textarea" },
        ]
      },
    ],
  },
  {
    key: "schemes",
    label: "Welfare Schemes",
    fields: [
      {
        key: "schemes", label: "Schemes", type: "list", itemLabel: "Scheme", itemFields: [
          { key: "title", label: "Title", type: "text" },
          { key: "category", label: "Category", type: "text" },
          { key: "eligibility", label: "Eligibility", type: "textarea" },
          { key: "benefits", label: "Benefits", type: "textarea" },
          { key: "procedure", label: "How to Apply", type: "textarea" },
        ]
      },
    ],
  },
  {
    key: "contact",
    label: "Contact / Offices",
    fields: [
      {
        key: "offices", label: "Office Locations", type: "list", itemLabel: "Office", itemFields: [
          { key: "name", label: "Name", type: "text" },
          { key: "address", label: "Address", type: "textarea" },
          { key: "timings", label: "Timings", type: "text" },
          { key: "phone", label: "Phone", type: "text" },
          { key: "email", label: "Email", type: "text" },
        ]
      },
    ],
  },
  {
    key: "legislative",
    label: "Legislative Data",
    fields: [
      {
        key: "attendance", label: "Assembly Attendance", type: "group", fields: [
          { key: "totalSessions", label: "Total Sessions", type: "number" },
          { key: "daysAttended", label: "Days Attended", type: "number" },
        ]
      },
      {
        key: "questions", label: "Assembly Questions", type: "list", itemLabel: "Question", itemFields: [
          { key: "date", label: "Date", type: "text" },
          { key: "topic", label: "Topic", type: "text" },
          { key: "summary", label: "Summary", type: "textarea" },
        ]
      },
    ],
  },
];
