import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import * as Location from "expo-location";

export type UserLocation = {
  city: string;
  pin: string;
  /** Set when the value came from the device's GPS rather than being picked. */
  fromDevice?: boolean;
};

const DEFAULT: UserLocation = { city: "Kaithal, Haryana", pin: "136027" };

type Ctx = {
  location: UserLocation;
  setLocation: (l: UserLocation) => void;
  /** Resolves the device's position to a city/PIN. Returns an error string on failure. */
  detect: () => Promise<string | null>;
  detecting: boolean;
};

const LocationContext = createContext<Ctx>({
  location: DEFAULT,
  setLocation: () => {},
  detect: async () => null,
  detecting: false,
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<UserLocation>(DEFAULT);
  const [detecting, setDetecting] = useState(false);

  const detect = useCallback(async (): Promise<string | null> => {
    setDetecting(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return "Location permission denied. You can pick your district manually.";
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [place] = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });

      if (!place) return "Could not resolve your position. Pick your district instead.";

      // district/subregion is the most useful level for this app; fall back
      // through the other fields when a provider leaves one empty.
      const town = place.district || place.subregion || place.city || place.name || "";
      const region = place.region || "";
      const city = [town, region].filter(Boolean).join(", ") || "Current location";

      setLocation({ city, pin: place.postalCode ?? "—", fromDevice: true });
      return null;
    } catch {
      return "Could not get your location. Check that location services are on.";
    } finally {
      setDetecting(false);
    }
  }, []);

  const value = useMemo(
    () => ({ location, setLocation, detect, detecting }),
    [location, detect, detecting]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export const useLocation = () => useContext(LocationContext);
