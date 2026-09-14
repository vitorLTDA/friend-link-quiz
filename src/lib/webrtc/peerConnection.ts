import type { GameMessage, SignalPayload } from "@/types/game";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
];

const GATHER_TIMEOUT_MS = 6000;
const DATA_CHANNEL_LABEL = "quiz";

export type PeerEvents = {
  onStateChange?: (state: RTCPeerConnectionState) => void;
  onChannelOpen?: () => void;
  onChannelClose?: () => void;
  onMessage?: (message: GameMessage) => void;
  onError?: (reason: string) => void;
};

/**
 * Thin, UI-agnostic wrapper around RTCPeerConnection + RTCDataChannel.
 * Signaling is manual: offers and answers are exported as plain payloads.
 */
export class PeerSession {
  private pc: RTCPeerConnection;
  private channel: RTCDataChannel | null = null;
  private candidates: string[] = [];
  private events: PeerEvents;
  private closed = false;

  constructor(events: PeerEvents = {}) {
    this.events = events;
    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    this.pc.onicecandidate = (event) => {
      if (event.candidate?.candidate) {
        this.candidates.push(JSON.stringify(event.candidate.toJSON()));
      }
    };
    this.pc.onconnectionstatechange = () => {
      this.events.onStateChange?.(this.pc.connectionState);
      if (this.pc.connectionState === "failed") {
        this.events.onError?.("connection-failed");
      }
    };
    this.pc.ondatachannel = (event) => this.attachChannel(event.channel);
  }

  private attachChannel(channel: RTCDataChannel) {
    this.channel = channel;
    channel.onopen = () => this.events.onChannelOpen?.();
    channel.onclose = () => this.events.onChannelClose?.();
    channel.onmessage = (event) => {
      try {
        this.events.onMessage?.(JSON.parse(event.data as string) as GameMessage);
      } catch {
        /* ignore malformed frames */
      }
    };
  }

  private waitForGathering(): Promise<void> {
    if (this.pc.iceGatheringState === "complete") return Promise.resolve();
    return new Promise((resolve) => {
      const timer = setTimeout(finish, GATHER_TIMEOUT_MS);
      const check = () => {
        if (this.pc.iceGatheringState === "complete") finish();
      };
      function finish() {
        clearTimeout(timer);
        resolve();
      }
      this.pc.addEventListener("icegatheringstatechange", check);
    });
  }

  /** Host side: create the data channel and the offer payload. */
  async createOffer(gameId: string): Promise<SignalPayload> {
    this.attachChannel(this.pc.createDataChannel(DATA_CHANNEL_LABEL, { ordered: true }));
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    await this.waitForGathering();
    return {
      v: 1,
      kind: "offer",
      gameId,
      sdp: this.pc.localDescription?.sdp ?? offer.sdp ?? "",
      candidates: [...this.candidates],
    };
  }

  /** Guest side: accept the offer payload and produce the answer payload. */
  async acceptOfferAndCreateAnswer(offer: SignalPayload): Promise<SignalPayload> {
    await this.pc.setRemoteDescription({ type: "offer", sdp: offer.sdp });
    await this.addRemoteCandidates(offer.candidates);
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    await this.waitForGathering();
    return {
      v: 1,
      kind: "answer",
      gameId: offer.gameId,
      sdp: this.pc.localDescription?.sdp ?? answer.sdp ?? "",
      candidates: [...this.candidates],
    };
  }

  /** Host side: finish the handshake with the guest's answer payload. */
  async acceptAnswer(answer: SignalPayload): Promise<void> {
    await this.pc.setRemoteDescription({ type: "answer", sdp: answer.sdp });
    await this.addRemoteCandidates(answer.candidates);
  }

  private async addRemoteCandidates(candidates: string[]) {
    for (const raw of candidates) {
      try {
        await this.pc.addIceCandidate(JSON.parse(raw) as RTCIceCandidateInit);
      } catch {
        /* a rejected candidate is not fatal */
      }
    }
  }

  send(message: GameMessage): boolean {
    if (this.channel?.readyState !== "open") return false;
    this.channel.send(JSON.stringify(message));
    return true;
  }

  get isChannelOpen() {
    return this.channel?.readyState === "open";
  }

  get connectionState() {
    return this.pc.connectionState;
  }

  /** Raw details, only used behind "Advanced connection details". */
  debugInfo() {
    return {
      connectionState: this.pc.connectionState,
      iceConnectionState: this.pc.iceConnectionState,
      iceGatheringState: this.pc.iceGatheringState,
      signalingState: this.pc.signalingState,
      dataChannel: this.channel?.readyState ?? "none",
      localCandidates: this.candidates.length,
    };
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    try {
      this.channel?.close();
      this.pc.close();
    } catch {
      /* noop */
    }
  }
}
