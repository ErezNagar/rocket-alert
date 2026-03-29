import Cache from "./cache";
import Tracking from "./tracking";
import Utilities from "./utilities/utilities";

const POLYGONS_CACHE_KEY = "polygons";

/**
 * Load polygons (main entry point)
 */
export const loadPolygons = async () => {
  if (!Cache.canUseCache()) {
    Tracking.polygonCache("cant_use_cache");
    return loadFromFile(false);
  }

  return loadFromCache();
};

/**
 * Try cache first
 */
const loadFromCache = async () => {
  const polygons = Cache.getJSON(POLYGONS_CACHE_KEY);

  if (!polygons) {
    Tracking.polygonCache("miss");
    return loadFromFile(true);
  }

  const cachedVersion = Cache.get(Utilities.POLYGON_VERSION_KEY);

  if (cachedVersion === Utilities.POLYGON_VERSION_VALUE) {
    Tracking.polygonCache("hit");
    return polygons;
  }

  Tracking.polygonCache("older_version");
  return loadFromFile(true);
};

/**
 * Load from static file
 */
const loadFromFile = async (setToCache) => {
  const json = await import("./polygons.json");
  const polygons = json.default || json;

  if (setToCache) {
    Cache.setJSON(POLYGONS_CACHE_KEY, polygons);
    Cache.set(Utilities.POLYGON_VERSION_KEY, Utilities.POLYGON_VERSION_VALUE);
  }

  return polygons;
};
