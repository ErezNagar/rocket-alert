import { loadPolygons } from "../polygonService";
import Cache from "../cache";
import Tracking from "../tracking";
import Utilities from "../utilities/utilities";

jest.mock("../cache", () => ({
  canUseCache: jest.fn(),
  getJSON: jest.fn(),
  get: jest.fn(),
  setJSON: jest.fn(),
  set: jest.fn(),
}));

jest.mock("../tracking", () => ({
  polygonCache: jest.fn(),
}));

jest.mock("../utilities/utilities", () => ({
  POLYGON_VERSION_KEY: "version_key",
  POLYGON_VERSION_VALUE: "v1",
}));

jest.mock("../polygons.json", () => ({
  __esModule: true,
  default: { test: "polygon-data" },
}));

describe("polygonService - loadPolygons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Loads from file when cache cannot be used", async () => {
    Cache.canUseCache.mockReturnValue(false);

    const result = await loadPolygons();

    expect(Cache.canUseCache).toHaveBeenCalled();
    expect(Tracking.polygonCache).toHaveBeenCalledWith("cant_use_cache");
    expect(result).toEqual({ test: "polygon-data" });
  });

  it("Loads from file and caches when cache miss", async () => {
    Cache.canUseCache.mockReturnValue(true);
    Cache.getJSON.mockReturnValue(null);

    const result = await loadPolygons();

    expect(Cache.getJSON).toHaveBeenCalledWith("polygons");
    expect(Tracking.polygonCache).toHaveBeenCalledWith("miss");

    expect(Cache.setJSON).toHaveBeenCalledWith("polygons", result);
    expect(Cache.set).toHaveBeenCalledWith(
      Utilities.POLYGON_VERSION_KEY,
      Utilities.POLYGON_VERSION_VALUE,
    );

    expect(result).toEqual({ test: "polygon-data" });
  });

  it("Returns cached polygons when version matches", async () => {
    const cachedPolygons = { cached: true };

    Cache.canUseCache.mockReturnValue(true);
    Cache.getJSON.mockReturnValue(cachedPolygons);
    Cache.get.mockReturnValue("v1");

    const result = await loadPolygons();

    expect(Cache.getJSON).toHaveBeenCalledWith("polygons");
    expect(Cache.get).toHaveBeenCalledWith(Utilities.POLYGON_VERSION_KEY);

    expect(Tracking.polygonCache).toHaveBeenCalledWith("hit");
    expect(result).toBe(cachedPolygons);

    expect(Cache.setJSON).not.toHaveBeenCalled();
  });

  it("Reloads from file when cache version is outdated", async () => {
    Cache.canUseCache.mockReturnValue(true);
    Cache.getJSON.mockReturnValue({ old: true });
    Cache.get.mockReturnValue("old_version");

    const result = await loadPolygons();

    expect(Tracking.polygonCache).toHaveBeenCalledWith("older_version");

    expect(Cache.setJSON).toHaveBeenCalledWith("polygons", {
      test: "polygon-data",
    });

    expect(Cache.set).toHaveBeenCalledWith(
      Utilities.POLYGON_VERSION_KEY,
      Utilities.POLYGON_VERSION_VALUE,
    );

    expect(result).toEqual({ test: "polygon-data" });
  });

  it("Handles JSON import with default export", async () => {
    Cache.canUseCache.mockReturnValue(false);

    const result = await loadPolygons();

    expect(result).toEqual({ test: "polygon-data" });
  });

  it("Does not cache when setToCache is false (cache disabled path)", async () => {
    Cache.canUseCache.mockReturnValue(false);

    await loadPolygons();

    expect(Cache.setJSON).not.toHaveBeenCalled();
    expect(Cache.set).not.toHaveBeenCalled();
  });

  it("Calls correct cache flow sequence (integration-like)", async () => {
    Cache.canUseCache.mockReturnValue(true);
    Cache.getJSON.mockReturnValue(null);

    await loadPolygons();

    expect(Cache.canUseCache).toHaveBeenCalledTimes(1);
    expect(Cache.getJSON).toHaveBeenCalledTimes(1);
    expect(Cache.setJSON).toHaveBeenCalledTimes(1);
    expect(Cache.set).toHaveBeenCalledTimes(1);
  });
});
