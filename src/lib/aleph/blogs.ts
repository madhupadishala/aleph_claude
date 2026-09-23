export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  published: string;
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-good-clinicians-can-still-be-hard-to-find",
    title: "Why good clinicians can still be hard to find",
    excerpt:
      "Clinical ability and local visibility are different problems. Patients can only choose expertise they can first discover and understand.",
    category: "Visibility",
    readTime: "4 min read",
    published: "23 September 2026",
    sections: [
      {
        heading: "Expertise does not automatically create discovery",
        paragraphs: [
          "A clinician can be highly experienced and still appear weak online. Search engines, maps, clinic directories, and service pages respond to structured information, not professional reputation alone.",
          "That creates a frustrating gap: the clinician knows the quality of care they can provide, while a new patient sees only a name, a phone number, or an incomplete profile.",
        ],
      },
      {
        heading: "Patients need signals before they make contact",
        paragraphs: [
          "Before calling, patients often want basic certainty. They want to know what the clinician treats, where the clinic is, how to book, what the consultation involves, and whether the practice feels credible.",
          "Improving visibility therefore means more than ranking higher. It means making the practice easier to interpret when it is found.",
        ],
      },
      {
        heading: "Start with the foundations",
        paragraphs: [
          "A complete local profile, clear service descriptions, consistent clinic information, useful patient FAQs, and a simple booking path can remove a surprising amount of friction.",
          "The goal is not to look louder than every competitor. It is to make the clinician's real expertise easier for the right patient to recognise.",
        ],
      },
    ],
  },
  {
    slug: "talk-about-consultation-fees-with-confidence",
    title: "How to talk about consultation fees with confidence",
    excerpt:
      "Pricing becomes easier when patients understand the structure, value, and expected care pathway before the conversation turns into comparison alone.",
    category: "Pricing",
    readTime: "5 min read",
    published: "23 September 2026",
    sections: [
      {
        heading: "The fee is rarely the only question",
        paragraphs: [
          "When a patient asks about price, they may also be asking whether the consultation is worth their time, whether the clinician is the right fit, and what they can expect after the appointment.",
          "If the only information available is a number, the patient has very little else to compare.",
        ],
      },
      {
        heading: "Connect the fee to the care experience",
        paragraphs: [
          "Clear consultation duration, what is reviewed, how follow-up works, and what preparation is useful can make the fee conversation more concrete without becoming promotional.",
          "This is not about defending every rupee. It is about reducing ambiguity around what the patient is actually booking.",
        ],
      },
      {
        heading: "Consistency builds confidence",
        paragraphs: [
          "Clinicians often lose pricing confidence when every inquiry is handled differently. A consistent explanation, a clear booking message, and a defined follow-up policy help the practice communicate calmly.",
          "A sustainable practice needs fees the clinician can stand behind and a patient experience that makes those fees understandable.",
        ],
      },
    ],
  },
  {
    slug: "what-patients-need-before-they-book",
    title: "What patients need to know before they book",
    excerpt:
      "Better booking journeys begin by answering the practical and emotional questions a patient has before the first consultation.",
    category: "Patient trust",
    readTime: "4 min read",
    published: "23 September 2026",
    sections: [
      {
        heading: "Booking starts before the booking button",
        paragraphs: [
          "A patient usually reaches a booking decision after several smaller decisions: Is this the right specialty? Does the clinician handle my concern? Is the clinic accessible? What happens during the consultation?",
          "When those questions remain unanswered, even a technically perfect booking form can still underperform.",
        ],
      },
      {
        heading: "Reduce uncertainty with patient-friendly information",
        paragraphs: [
          "Service pages, FAQs, clinician profiles, location details, timings, consultation expectations, and simple next-step instructions can reduce hesitation without making unrealistic promises.",
          "The strongest patient communication is specific enough to be useful and careful enough to respect the uncertainty that naturally exists in healthcare.",
        ],
      },
      {
        heading: "Make the next step obvious",
        paragraphs: [
          "Once a patient understands fit, the practice should make action easy: one clear call, message, or booking route; visible clinic timings; and confirmation of what happens next.",
          "Trust is built partly through expertise and partly through operational clarity. A calm, predictable journey can communicate professionalism before the consultation begins.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
