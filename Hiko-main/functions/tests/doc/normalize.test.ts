import { describe, expect, it } from "vitest";

import { toAlert, toCampsite, toHike, toHut } from "../../src/doc/normalize";

describe("DOC normalizers", () => {
  it("normalizes track data", () => {
    const hike = toHike({
      id: "track-1",
      name: "Sample Track",
      region: "Fiordland",
      startPoint: { lat: -45.123, lng: 167.987 },
      lengthKm: 12.4,
      difficulty: "Moderate",
      multiDay: true,
      features: ["waterfalls", "alpine"],
      tags: ["featured"],
      status: "Open",
    });

    expect(hike).toMatchObject({
      docTrackId: "track-1",
      name: "Sample Track",
      region: "Fiordland",
      start: { lat: -45.123, lng: 167.987 },
      distanceKm: 12.4,
      difficulty: "moderate",
      overnight: true,
      statusSummary: "open",
    });
  });

  it("normalizes huts", () => {
    const hut = toHut({
      id: "hut-1",
      name: "Lake Hut",
      location: { lat: -44.1, lng: 168.1 },
      capacity: 12,
      facilities: ["toilets"],
      bookingUrl: "https://example.com",
    });

    expect(hut).toMatchObject({
      docHutId: "hut-1",
      name: "Lake Hut",
      location: { lat: -44.1, lng: 168.1 },
      capacity: 12,
      facilities: ["toilets"],
      bookingUrl: "https://example.com",
    });
  });

  it("normalizes campsites", () => {
    const campsite = toCampsite({
      id: "camp-1",
      name: "Valley Campsite",
      location: { lat: -43.5, lng: 169.2 },
      facilities: ["water"],
      type: "Serviced",
    });

    expect(campsite).toMatchObject({
      docCampsiteId: "camp-1",
      name: "Valley Campsite",
      location: { lat: -43.5, lng: 169.2 },
      facilities: ["water"],
      type: "Serviced",
    });
  });

  it("normalizes alerts", () => {
    const alert = toAlert({
      id: "alert-1",
      title: "Track closed",
      body: "Due to weather",
      sourceType: "track",
      sourceId: "track-1",
      severity: "Closed",
    });

    expect(alert).toMatchObject({
      alertId: "alert-1",
      sourceType: "track",
      sourceId: "track-1",
      severity: "closed",
    });
  });
});
