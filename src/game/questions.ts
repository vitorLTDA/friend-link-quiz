import type { Question } from "@/types/game";

const q = (
  id: string,
  emoji: string,
  question: string,
  options: [string, string, string, string],
): Question => ({
  id,
  emoji,
  question,
  options: options.map((text, i) => ({ id: ["A", "B", "C", "D"][i], text })),
});

export const QUESTIONS: Question[] = [
  q("q1", "📱", "How do I handle texting back?", [
    "Reply within 3 seconds.",
    'Read it in notifications, reply in my head, forget to send for 3 days.',
    'Leave everyone on "Read" intentionally.',
    "Send 15 consecutive short messages instead of one paragraph.",
  ]),
  q("q2", "⏰", "How do I show up to plans?", [
    "Early, awkwardly waiting outside.",
    "Exactly on time, every time.",
    "15 minutes late with a dramatic story.",
    "I cancel the night before and feel great about it.",
  ]),
  q("q3", "☕", "What is my order at a café?", [
    "Black coffee, no nonsense.",
    "Something with 4 syllables and caramel.",
    "Iced, always, even in winter.",
    "Whatever the person before me ordered.",
  ]),
  q("q4", "🎵", "What is playing in my headphones right now?", [
    "The same song for the 40th time today.",
    "A 6-hour playlist I never made it through.",
    "A podcast about something oddly specific.",
    "Nothing. Silence is the vibe.",
  ]),
  q("q5", "🛒", "How do I shop?", [
    "A list, a plan, in and out.",
    "I go in for milk, leave with a plant.",
    "Add to cart at 2am, regret at 9am.",
    "I only shop when everything runs out at once.",
  ]),
  q("q6", "🎬", "How do I pick something to watch?", [
    "Scroll for 45 minutes, watch nothing.",
    "Rewatch the same comfort show forever.",
    "Documentaries so I feel productive.",
    "Whatever is trending, no questions asked.",
  ]),
  q("q7", "🍕", "It's 1am and I'm hungry. What happens?", [
    "Cereal, standing at the counter.",
    "Order delivery and pretend it's a treat.",
    "Full meal, actual pan, chaotic kitchen.",
    "I drink water and go to sleep sad.",
  ]),
  q("q8", "🏋️", "What is my relationship with the gym?", [
    "I'm there before sunrise, unfortunately.",
    "I pay monthly for the privilege of not going.",
    "Long walks count and you can't stop me.",
    "Gym? I take the stairs sometimes.",
  ]),
  q("q9", "🎁", "How do I handle gifts?", [
    "Planned two months in advance.",
    "Gas station panic buy.",
    "I give money in an envelope, it's efficient.",
    "Something handmade and slightly unhinged.",
  ]),
  q("q10", "🧹", "How clean is my room right now?", [
    "Spotless, ask anyone.",
    "Clean-ish, one chair holds all my clothes.",
    "There's a floor under there somewhere.",
    "It depends entirely on who's coming over.",
  ]),
  q("q11", "😤", "How do I argue?", [
    "Calm facts and receipts.",
    "I go quiet and think about it for a week.",
    "Loud first, apologize later.",
    "I make a joke so we can stop.",
  ]),
  q("q12", "✈️", "How do I pack for a trip?", [
    "Packed and weighed, three days early.",
    "One hour before the taxi.",
    "Way too much, wear the same two things.",
    "Hand luggage only, I'm built different.",
  ]),
  q("q13", "🎤", "Karaoke night. What's my move?", [
    "Mic hog with a full setlist.",
    "Only duets, never alone.",
    "I clap loudly and refuse forever.",
    "One song, extremely serious performance.",
  ]),
  q("q14", "💤", "What is my sleep schedule?", [
    "In bed by 10, genuinely thriving.",
    "3am, staring at the ceiling.",
    "Nap all day, alive at night.",
    "There is no schedule, only vibes.",
  ]),
  q("q15", "🐶", "If I were an animal at a party, I'd be...", [
    "The dog greeting every single person.",
    "The cat hiding in the bedroom.",
    "The parrot repeating the best joke.",
    "The raccoon going through the snacks.",
  ]),
  q("q16", "💸", "How do I handle splitting the bill?", [
    "Calculator out, exact cents.",
    'I just say "I got it" and cry later.',
    "Someone else always figures it out.",
    "I round up and over-tip.",
  ]),
  q("q17", "📸", "How do I appear in photos?", [
    "Same pose since 2014.",
    "I'm the one taking them, always.",
    "Blurry, mid-sentence, chaotic.",
    "Sunglasses so nothing can go wrong.",
  ]),
];

export const TOTAL_QUESTIONS = QUESTIONS.length;

export const getQuestionById = (id: string) => QUESTIONS.find((item) => item.id === id);
