# Friend Quiz Connect

Build the complete frontend for a serverless 2-player multiplayer quiz game.

Core concept

The game is a "How well do you know your friend?" multiplayer game for exactly 2 players.

There is no backend/server/database/API. Do not create API requests, backend services, authentication systems, or database models.

The multiplayer connection will eventually use WebRTC RTCPeerConnection directly between the two browsers.

For now, create the entire UI, routing, navigation, state structure, and WebRTC connection flow on the frontend so the application is ready to have the actual game logic implemented.

Technology / Architecture

Use:

React

TypeScript

Vite

React Router

Tailwind CSS

shadcn/ui components where appropriate

Keep the architecture clean and modular.

Create reusable components instead of putting everything into a single page.

Create a client-side game state structure that can later be connected to WebRTC.

Do NOT make network/API requests.

Use browser APIs such as RTCPeerConnection, RTCDataChannel, URL parameters, and local state where appropriate.

Main User Flow

There are two players:

Player A = Room creator

Player B = Friend joining the room

The flow should be:

Player A opens the application.

Player A clicks "Create Game".

The browser creates an RTCPeerConnection.

Player A creates a WebRTC offer.

Player A gathers ICE candidates.

Once the offer and ICE candidates are available, generate a shareable link containing the connection information.

Player A copies/sends this link to Player B.

Player B opens the link.

Player B's browser reads the offer from the URL.

Player B creates the WebRTC answer.

Player B gathers its ICE candidates.

Generate an answer that Player B can send back to Player A, preferably as a shareable link or a copyable connection payload.

Player A pastes the answer or opens the answer link.

Player A completes the WebRTC connection.

Once the peer-to-peer connection is established, both players enter the game.

Both players answer the questions.

One player's answers are eventually compared with the other player's guesses.

Show the final results.

The actual WebRTC implementation should be isolated in a dedicated hook/service such as:

useWebRTC.ts

and/or:

src/lib/webrtc/

Make the UI independent from the low-level WebRTC implementation as much as possible.

Routes

Create the following routes:

/

Landing page.

Show:

Game logo/name

Short explanation

"Create Game" primary button

"Join Game" secondary button

Small explanation that the game is peer-to-peer and does not require an account

/create

Create-game page.

Show:

Page title: "Create a Game"

Short explanation

Primary button: "Create Room"

After clicking:

Show a room/setup state with:

"Your game is ready!"

Connection status

Shareable link

Copy button

QR-code placeholder/component

Instructions:

"Send this link to your friend."

Also show:

"Waiting for your friend to connect..."

Connection states should be visually clear:

Creating connection

Gathering connection information

Waiting for friend

Friend connected

Ready to start

Do not expose raw WebRTC information by default. Keep it hidden behind something like:

"Advanced connection details"

if necessary for debugging.

/join

Join page.

This page should be capable of reading the WebRTC offer from the URL.

Show:

"Your friend invited you to a game!"

Display:

Friend/game invitation information

"Join Game" button

After processing the offer:

Show:

"Preparing your connection..."

Then generate the WebRTC answer.

Once the answer is ready:

Show:

"You're almost ready!"

Provide:

Answer share link

Copy button

Copy answer data button as a fallback

Instructions:

"Send this answer back to your friend."

Also display connection status.

/connect

Create a dedicated connection-completion page.

This page should be usable by Player A after receiving Player B's answer.

Provide two ways to complete the connection:

Open an answer link.

Paste the answer data manually into a textarea.

UI:

"Connect to your friend"

Textarea: "Paste your friend's answer here"

"Connect" button

Connection status

Error state for invalid connection data

When the connection succeeds:

Show:

"You're connected!"

Then provide:

"Start Game"

The game should only start after the WebRTC connection has been successfully established.

/game

Main game screen.

The game is a sequence of questions.

There are exactly two players.

The UI should clearly show:

Current question number

Total questions

Progress bar

Question

Four answer choices

Selected answer state

Continue/Next button

Connection status

Example question:

"How do I handle texting back?"

A) Reply within 3 seconds.

B) Read it in notifications, reply in my head, forget to send for 3 days.

C) Leave everyone on "Read" intentionally.

D) Send 15 consecutive short messages instead of one paragraph.

Make the question card visually prominent and fun.

Do not reveal the correct/other player's answer while answering.

Game Mechanics UI

The important concept is that both players answer the same questions.

One player's answers are used as the answers that the other player tries to guess.

The UI should support these phases:

Phase 1 — Answering

Both players independently answer the questions.

Show:

"Answer honestly 👀"

Do not reveal the other player's answer.

Phase 2 — Guessing

After the player's own answers have been collected, the player tries to guess what their friend answered.

Show:

"How well do you know your friend?"

For each question:

Show the question

Show the four choices

Ask the player to guess their friend's answer

Do not reveal whether the guess is correct until the appropriate results screen.

Phase 3 — Waiting

If one player finishes before the other:

Show:

"You're done!"

"Waiting for your friend to finish..."

Use a friendly animated waiting state.

Do not make the UI appear frozen.

Show the connection status.

Results Page

Route:

/results

After both players finish, calculate and display the comparison.

Show:

Final Score

Example:

"8 / 10"

"You really know your friend!"

Use a large score visualization.

Also show:

Number correct

Number incorrect

Percentage

Optional playful rating

Example ratings:

10/10 → "Mind reader 🧠"

8–9 → "Best friend material 👀"

5–7 → "You know them... mostly."

0–4 → "Do you two even talk? 😂"

Keep these customizable in a constants/config file.

Question Results

Below the score, show every question.

For each question display:

Question

Player's original answer

Friend's guess

Correct / Incorrect indicator

Correct answer

Example:

Question 3

"How do I handle texting back?"

Your answer:
B

Friend guessed:
D

❌ Incorrect

Use distinct visual states for correct and incorrect answers.

Allow the user to scroll through all questions.

Multiplayer Synchronization

Create a clean abstraction for sending game state through WebRTC.

For example:

type GameMessage =
  | {
      type: "PLAYER_READY";
    }
  | {
      type: "ANSWER_SUBMITTED";
      questionId: string;
      answer: string;
    }
  | {
      type: "GUESS_SUBMITTED";
      questionId: string;
      answer: string;
    }
  | {
      type: "GAME_FINISHED";
    };


Create a WebRTC/data-channel layer that can eventually send and receive these messages.

Do not use a server for synchronization.

The UI should react to local state and incoming WebRTC messages.

WebRTC Requirements

Create a dedicated WebRTC abstraction.

Suggested structure:

src/
  components/
  pages/
  hooks/
    useWebRTC.ts
    useGame.ts
  lib/
    webrtc/
      peerConnection.ts
      signaling.ts
      serialization.ts
  game/
    questions.ts
    gameState.ts
    scoring.ts
  routes/
  types/


The WebRTC layer should handle:

RTCPeerConnection creation

Offer creation

Answer creation

ICE candidate gathering

ICE candidate handling

RTCDataChannel

Connection state

Data sending

Data receiving

Cleanup

Use STUN servers only if necessary for WebRTC connectivity.

Do not create a custom signaling server.

Signaling Through Links

Since there is no server, the application should use manual signaling.

Player A's URL should contain serialized connection information including:

SDP offer

ICE candidates

Player B's response should contain:

SDP answer

ICE candidates

Create a serialization/deserialization utility so WebRTC data can safely be encoded into URL parameters.

Prefer a compact encoding such as:

JSON → compression/encoding → encodeURIComponent


Avoid exposing huge unreadable JSON in the UI.

Create utilities such as:

encodeOffer()
decodeOffer()

encodeAnswer()
decodeAnswer()


The exact serialization implementation should be isolated so it can easily be changed later.

Important WebRTC UX

Connection failures must be handled gracefully.

Create UI states for:

Initializing

Creating offer

Gathering ICE candidates

Waiting for Player B

Creating answer

Waiting for Player A

Connecting

Connected

Disconnected

Connection failed

Invalid connection link

Expired/invalid connection data

Provide useful messages rather than technical errors.

For example:

Instead of:

"ICE gathering failed"

show:

"We couldn't establish the connection. Please try creating a new game."

Provide a "Try Again" button.

Navigation

Use React Router.

The user should not need to manually navigate between normal game states.

Navigation should happen automatically based on the connection/game state.

For example:

Create Game:

/ → /create → /connect → /game → /results

Join Game:

/ → /join → /game → /results

Use route guards where appropriate so users cannot directly access /game without an active game connection.

If the user refreshes the page, attempt to recover the local game state when possible using localStorage/sessionStorage.

Design Direction

Create a modern, playful UI aimed at friends playing together.

The design should feel like a polished indie multiplayer game rather than a generic dashboard.

Use:

Large typography

Rounded cards

Smooth animations

Clear progress indicators

Playful micro-interactions

Subtle gradients

Good spacing

Mobile-first design

The game must work especially well on phones because players will likely open the invitation link on mobile.

Avoid making the interface overly complicated.

The question/answer screen should be the main visual focus.

Components

Create reusable components such as:

GameHeader

ProgressBar

QuestionCard

AnswerOption

ConnectionStatus

ConnectionCard

ShareLink

CopyButton

WaitingForPlayer

GameScore

QuestionResult

ResultsList

PlayerAvatar

GameButton

QRCodeCard

Use consistent components throughout the application.

State Management

Keep the state client-side.

Create a central game state similar to:

interface GameState {
  gameId: string;
  role: "host" | "guest";
  phase:
    | "lobby"
    | "answering"
    | "guessing"
    | "waiting"
    | "results";

  currentQuestionIndex: number;

  myAnswers: Record<string, string>;
  friendAnswers: Record<string, string>;

  myGuesses: Record<string, string>;

  isConnected: boolean;
}


Feel free to improve this structure if a better architecture is appropriate.

Keep game logic separate from UI components.

Questions

Create a local question dataset.

Start with at least 15 fun questions about knowing a friend.

Each question should have:

interface Question {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
}


Include the example question:

"How do I handle texting back?"

with the four options:

Reply within 3 seconds.

Read it in notifications, reply in my head, forget to send for 3 days.

Leave everyone on "Read" intentionally.

Send 15 consecutive short messages instead of one paragraph.

Create enough questions so the UI can be tested without needing a backend.

Scoring

Create a pure scoring function:

calculateScore(
  originalAnswers,
  guesses
)


It should return:

total questions

correct answers

incorrect answers

percentage

per-question results

Keep scoring logic independent of React.

Error Handling

Add friendly error states for:

Invalid invitation link

Missing offer

Missing answer

Invalid encoded data

WebRTC connection failure

Data channel disconnected

Unexpected game state

Player leaving/disconnecting

Never display raw exceptions to the user.

Important Constraints

DO NOT:

Create a backend

Create API endpoints

Create a database

Add authentication

Make HTTP requests for game functionality

Depend on Firebase

Depend on Supabase

Depend on a custom signaling server

The entire game should be capable of running as a static frontend.

The only network communication should eventually be direct WebRTC peer-to-peer communication between the two players.

Build the application with clean abstractions so the WebRTC implementation can be tested and replaced independently from the UI.

Final Goal

I want Lovable to produce a complete polished frontend application, not just a landing page.

Implement:

All routes

Navigation

Page layouts

Responsive design

Components

Game state structure

Question data

Scoring logic

WebRTC abstraction

Manual signaling through shareable links

Offer/answer handling

ICE candidate handling

DataChannel abstraction

Connection states

Game flow

Waiting states

Results

Error states

The result should feel like a complete playable 2-player friend quiz game, with WebRTC/manual signaling as the only multiplayer mechanism.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e5a9380c-a67d-4a3e-b34c-17490fe7984c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
