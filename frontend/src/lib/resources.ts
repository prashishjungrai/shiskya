import type { SchemaFaqItem } from "@/lib/schema";

export type ResourceArticle = {
  slug: string;
  title: string;
  description: string;
  targetKeyword: string;
  intent: "informational" | "commercial";
  readingTime: string;
  intro: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
  faqs: SchemaFaqItem[];
  cta: {
    heading: string;
    body: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
};

export const RESOURCE_ARTICLES: ResourceArticle[] = [
  {
    slug: "plus-two-exam-preparation-guide",
    title: "+2 Exam Preparation Guide: How to Finish the Syllabus Faster and Revise Smarter",
    description:
      "A practical +2 exam preparation guide for students who want faster syllabus coverage, stronger revision, and clearer study priorities.",
    targetKeyword: "+2 exam preparation guide",
    intent: "informational",
    readingTime: "7 min read",
    intro:
      "Students often lose marks because revision starts too late. A better +2 preparation plan begins with syllabus clarity, realistic weekly targets, and regular teacher support before pressure peaks.",
    sections: [
      {
        heading: "Start by mapping the full syllabus",
        paragraphs: [
          "Break the syllabus into chapters, concepts, and question types instead of treating the course as one large task.",
          "This gives students and parents a clearer view of what is already complete, what needs support, and where tuition can shorten the learning cycle.",
        ],
        bullets: [
          "Mark high-weight chapters first.",
          "Separate weak topics from revision topics.",
          "Track completion weekly, not monthly.",
        ],
      },
      {
        heading: "Use a revision rhythm that starts before the syllabus ends",
        paragraphs: [
          "Revision works best when it overlaps with learning. Students retain more when short review sessions happen while chapters are still active.",
          "This is one reason guided tuition helps: the student does not have to decide the entire structure alone.",
        ],
        bullets: [
          "Keep one weekly slot for chapter recap.",
          "Solve past-style questions after each topic.",
          "Use mistake review as part of revision, not only mock tests.",
        ],
      },
      {
        heading: "Ask for help early on weak subjects",
        paragraphs: [
          "Delaying support usually turns a single weak chapter into a confidence problem across the subject.",
          "If a student is falling behind in Physics, Chemistry, Mathematics, or any engineering foundation topic, intervention should happen before exam season.",
        ],
      },
    ],
    faqs: [
      {
        question: "When should +2 exam preparation become intensive?",
        answer:
          "It should become intensive as soon as the student can identify weak chapters, not only at the end of the term.",
      },
      {
        question: "How does tuition help +2 students finish the syllabus faster?",
        answer:
          "Structured classes, planned practice, and teacher feedback reduce wasted time and keep students accountable to weekly progress.",
      },
    ],
    cta: {
      heading: "Need a faster +2 study plan?",
      body: "Compare available courses or ask for guidance on which class structure fits the student’s current stage.",
      primaryLabel: "Explore courses",
      primaryHref: "/courses",
      secondaryLabel: "Contact admissions",
      secondaryHref: "/contact",
    },
  },
  {
    slug: "engineering-study-plan-for-busy-students",
    title: "Engineering Study Plan for Busy Students: How to Balance Classes, Practice, and Revision",
    description:
      "A practical engineering study plan for students who need better structure, more consistent practice, and less last-minute pressure.",
    targetKeyword: "engineering study plan",
    intent: "informational",
    readingTime: "6 min read",
    intro:
      "Engineering students often struggle because study time is fragmented. A stronger plan is not about studying all day; it is about protecting focused blocks for concept review, problem-solving, and revision.",
    sections: [
      {
        heading: "Protect smaller but sharper study blocks",
        paragraphs: [
          "Long study sessions are not always realistic. Busy students do better with shorter sessions that each have a defined outcome.",
          "One session can focus on concept review, another on numerical problems, and another on revision mistakes.",
        ],
        bullets: [
          "Use one daily block for concept learning.",
          "Use one separate block for problem practice.",
          "Keep one weekly block for backlog recovery.",
        ],
      },
      {
        heading: "Turn weak areas into a tracked list",
        paragraphs: [
          "When students rely on memory to track weak subjects, they underestimate the gap. A visible list makes prioritisation easier.",
          "This is especially useful when a student is also preparing for tests, labs, or entrance-related pressure.",
        ],
      },
      {
        heading: "Use guided support for topics that stall progress",
        paragraphs: [
          "If self-study keeps breaking down at the same concept, the issue is no longer discipline alone. It is a structure problem.",
          "Teacher support helps the student move past that block faster and keep the rest of the study plan intact.",
        ],
      },
    ],
    faqs: [
      {
        question: "What makes an engineering study plan realistic?",
        answer:
          "A realistic plan separates concept learning, problem-solving, and revision instead of trying to cover everything in one sitting.",
      },
      {
        question: "Should busy students study every subject daily?",
        answer:
          "Not always. It is usually better to rotate by urgency and keep weak subjects on a predictable weekly schedule.",
      },
    ],
    cta: {
      heading: "Need help balancing engineering preparation?",
      body: "Review available courses or ask for a guided recommendation based on your current pressure points.",
      primaryLabel: "View engineering-related courses",
      primaryHref: "/courses",
      secondaryLabel: "Meet the teachers",
      secondaryHref: "/teachers",
    },
  },
  {
    slug: "how-to-complete-syllabus-fast-without-rushing",
    title: "How to Complete the Syllabus Fast Without Rushing Through Concepts",
    description:
      "Learn how to finish the syllabus faster without losing understanding, retention, or exam readiness.",
    targetKeyword: "how to complete syllabus fast",
    intent: "informational",
    readingTime: "5 min read",
    intro:
      "Fast syllabus completion only helps when the student still understands the material. The goal is not speed alone; the goal is controlled progress with fewer gaps and better recall.",
    sections: [
      {
        heading: "Reduce switching between too many topics",
        paragraphs: [
          "Students often lose time by moving between unrelated chapters without closing any of them properly.",
          "A better approach is to group related topics and complete them in focused batches.",
        ],
      },
      {
        heading: "Use active recall while learning",
        paragraphs: [
          "Rereading notes feels productive but does not always show whether the concept is actually understood.",
          "Students complete the syllabus more confidently when they test recall and problem-solving while moving forward.",
        ],
        bullets: [
          "Write quick self-check questions after each topic.",
          "Explain the concept aloud in simple language.",
          "Solve one applied question before moving on.",
        ],
      },
      {
        heading: "Ask for structured support before the backlog grows",
        paragraphs: [
          "Fast progress becomes much harder once several chapters are unfinished. Guided tuition is most useful before that backlog becomes normal.",
          "That is why enquiry and course selection should happen early, not after exam pressure spikes.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can students complete the syllabus quickly without memorising blindly?",
        answer:
          "Yes. Faster completion is possible when concept learning, active recall, and guided revision happen together instead of separately.",
      },
      {
        question: "What usually slows syllabus completion down?",
        answer:
          "Weak topic prioritisation, inconsistent revision, and waiting too long to ask for teacher support are common causes.",
      },
    ],
    cta: {
      heading: "Want a more structured syllabus plan?",
      body: "Start with the course catalogue, then use the contact page to ask about the right batch or support level.",
      primaryLabel: "Browse the catalogue",
      primaryHref: "/courses",
      secondaryLabel: "Send an enquiry",
      secondaryHref: "/contact",
    },
  },
];

export function getResourceArticle(slug: string) {
  return RESOURCE_ARTICLES.find((article) => article.slug === slug) || null;
}
