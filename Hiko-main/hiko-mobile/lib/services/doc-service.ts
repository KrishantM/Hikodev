import { TrackStatusReport, Hut } from "@/lib/types";

const FEATURE_DOC_ENABLED =
  process.env.EXPO_PUBLIC_FEATURE_DOC === "true";

export class DocService {
  async getTrackStatus(docTrackId: string): Promise<TrackStatusReport | null> {
    if (!FEATURE_DOC_ENABLED) {
      return this.getMockTrackStatus(docTrackId);
    }

    // TODO: Implement actual DOC API integration
    return this.getMockTrackStatus(docTrackId);
  }

  async getHutAvailability(
    docHutId: string,
    dateRange: { start: Date; end: Date }
  ): Promise<{ available: boolean; bookingUrl?: string }> {
    if (!FEATURE_DOC_ENABLED) {
      return { available: true };
    }

    // TODO: Implement actual DOC booking API integration
    return { available: true };
  }

  private getMockTrackStatus(
    docTrackId: string
  ): TrackStatusReport | null {
    return {
      id: `mock-${docTrackId}`,
      hikeId: docTrackId,
      type: "official",
      summary: "Track is open and in good condition",
      conditions: ["dry", "well-maintained"],
      hazards: [],
      source: "DOC",
      createdAt: new Date(),
    };
  }
}

export const docService = new DocService();
