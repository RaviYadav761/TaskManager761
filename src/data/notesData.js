/**
 * Notes categories, styling badges, and initial seed notes
 */

export const CATEGORY_STYLES = {
  "Mobile App Sprint": "bg-[#EEF4FF] text-[#3B82F6]",
  "Website Relaunch": "bg-[#F3E8FF] text-[#9333EA]",
  "Brand Guidelines v2": "bg-[#ECFDF5] text-[#10B981]",
  "Q3 Marketing Plan": "bg-[#FFF1F2] text-[#F43F5E]",
  "Fitness": "bg-[#FEF3C7] text-[#D97706]",
  "General": "bg-[#F3F4F6] text-[#4B5563]",
};

export const INITIAL_NOTES = [
  {
    id: "note-retro-takeaways",
    title: "Sprint retro takeaways",
    category: "Mobile App Sprint",
    categoryBg: "bg-[#EEF4FF] text-[#3B82F6]",
    timeAgo: "2h ago",
    isFavorite: true,
    author: "Alex",
    snippet: "Team agreed to shorten standups and move QA earlier in the sprint cycle...",
    introText:
      "We ran the Sprint 4 retrospective with the full mobile team. Overall velocity improved from last sprint, but a few process gaps surfaced that we want to address before Sprint 5 kicks off.",
    whatWentWell: [
      "Daily standups stayed under 10 minutes consistently",
      "Design handoff docs were clearer and reduced back-and-forth",
      "Zero critical bugs shipped to production this sprint",
    ],
    actionItems: [
      { id: "act-1", text: "Move QA pass earlier in the sprint", done: true },
      { id: "act-2", text: "Shorten standup to 3 questions format", done: false },
      { id: "act-3", text: "Schedule API scope sync for Sprint 5 planning", done: false },
    ],
    closingText: "",
    images: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "note-client-feedback",
    title: "Client feedback – homepage",
    category: "Website Relaunch",
    categoryBg: "bg-[#F3E8FF] text-[#9333EA]",
    timeAgo: "5h ago",
    isFavorite: false,
    author: "Alex",
    snippet: "Client wants a bolder hero section and clearer CTA placement above the fold...",
    introText:
      "Client reviewed the desktop staging build and gave very positive remarks on page performance. A few UI tweaks requested before final sign-off.",
    whatWentWell: [
      "High satisfaction with the 3D card interactions",
      "Typography readability praised on both Mac and Windows displays",
    ],
    actionItems: [
      { id: "act-cf-1", text: "Bolder hero section with prominent CTA buttons", done: false },
      { id: "act-cf-2", text: "Update customer testimonials carousel", done: true },
    ],
    closingText: "",
    images: [],
    updatedAt: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: "note-brand-color",
    title: "Brand color exploration",
    category: "Brand Guidelines v2",
    categoryBg: "bg-[#ECFDF5] text-[#10B981]",
    timeAgo: "2 days ago",
    isFavorite: false,
    author: "Alex",
    snippet: "Explored 4 emerald-based palettes for the new guideline document...",
    introText:
      "Exploring refined primary and accent swatches to complement Taskly's signature warm cream background.",
    whatWentWell: [],
    actionItems: [],
    closingText: "",
    images: [],
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];
