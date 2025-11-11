import { beforeEach, describe, expect, it, vi } from "vitest";

import { getForecast } from "@/lib/services/weather";
import { mmkvInstance } from "@/lib/storage/mmkv";

const SAMPLE_FORECAST = {
  list: Array.from({ length: 8 }).map((_, index) => ({
    dt_txt: `2024-05-0${1 + Math.floor(index / 3)} 12:00:00`,
    main: { temp_min: 5 + index, temp_max: 15 + index },
    weather: [{ main: "Clouds", description: "Overcast", icon: "04d" }],
    wind: { speed: 3 },
    rain: { "3h": 0 },
  })),
};

describe("weather service", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => ({
      ok: true,
      json: async () => SAMPLE_FORECAST,
    })));
    mmkvInstance.clearAll?.();
    process.env.EXPO_PUBLIC_OWM_API_KEY = "test";
  });

  it("returns normalized weather data", async () => {
    const result = await getForecast("test-hike", -45.0, 170.0);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("tempMax");
    expect(result[0].provider).toBe("openweathermap");
  });

  it("caches forecasts for subsequent calls", async () => {
    await getForecast("cached-hike", -45.0, 170.0);
    const fetchSpy = fetch as unknown as ReturnType<typeof vi.fn>;
    expect(fetchSpy).toHaveBeenCalled();

    fetchSpy.mockClear();
    await getForecast("cached-hike", -45.0, 170.0);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
