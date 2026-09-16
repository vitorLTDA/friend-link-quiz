export interface ScoreRating {
  /** inclusive lower bound of the percentage range */
  minPercentage: number;
  title: string;
  blurb: string;
}

/** Playful ratings, ordered from best to worst. Fully customizable. */
export const SCORE_RATINGS: ScoreRating[] = [
  {
    minPercentage: 100,
    title: "Mind reader 🧠",
    blurb: "Perfect score. This is either friendship or surveillance.",
  },
  {
    minPercentage: 80,
    title: "Best friend material 👀",
    blurb: "You really know your friend. Genuinely impressive.",
  },
  {
    minPercentage: 50,
    title: "You know them... mostly.",
    blurb: "Solid effort. A few surprises in there though.",
  },
  {
    minPercentage: 0,
    title: "Do you two even talk? 😂",
    blurb: "Time for a long call and a couple of apologies.",
  },
];

export const getRating = (percentage: number): ScoreRating =>
  SCORE_RATINGS.find((rating) => percentage >= rating.minPercentage) ??
  SCORE_RATINGS[SCORE_RATINGS.length - 1]!;

export const PHASE_COPY = {
  answering: {
    title: "Answer honestly 👀",
    subtitle: "Your answers become the questions your friend has to guess.",
  },
  guessing: {
    title: "How well do you know your friend?",
    subtitle: "Pick the answer you think they gave.",
  },
  waiting: {
    title: "You're done!",
    subtitle: "Waiting for your friend to finish...",
  },
} as const;

export const CONNECTION_COPY: Record<string, { label: string; hint: string }> = {
  idle: { label: "Not connected", hint: "No game running yet." },
  initializing: { label: "Starting up", hint: "Preparing your connection..." },
  "creating-offer": { label: "Creating connection", hint: "Setting up your private room..." },
  gathering: { label: "Gathering connection info", hint: "Finding the best route to your friend..." },
  "waiting-for-guest": { label: "Waiting for your friend", hint: "Send them the link to join." },
  "creating-answer": { label: "Preparing your connection", hint: "Almost there..." },
  "waiting-for-host": { label: "Waiting for your friend", hint: "Send your answer back to them." },
  connecting: { label: "Connecting", hint: "Shaking hands with your friend's browser..." },
  connected: { label: "Friend connected", hint: "You're ready to play!" },
  disconnected: { label: "Disconnected", hint: "Your friend seems to have left the game." },
  failed: {
    label: "Connection failed",
    hint: "We couldn't establish the connection. Please try creating a new game.",
  },
  "invalid-data": {
    label: "Invalid invitation",
    hint: "That link doesn't look right. Ask your friend for a fresh one.",
  },
};
