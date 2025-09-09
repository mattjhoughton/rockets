import React, { createContext, useContext, useState } from "react";

export type Rocket = {
  id: string;
  name: string;
  height: { meters: number; feet: number };
  diameter: { meters: number; feet: number };
  mass: { kg: number; lb: number };
};

export type RocketsContextType = {
  rockets: Rocket[];
  loading: boolean;
  error: string | null;
  maxRocketDimensions: { height: number; diameter: number } | undefined;
  fetchRockets: () => Promise<void>;
};
const RocketsContext = createContext<RocketsContextType | undefined>(undefined);

export const useRocketsContext = () => {
  const context = useContext(RocketsContext);
  if (!context) {
    throw new Error("useRocketsContext must be used within a RocketsProvider");
  }
  return context;
};

export const RocketsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [rockets, setRockets] = useState<Rocket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxRocketDimensions, setMaxRocketDimensions] = useState<
    { height: number; diameter: number } | undefined
  >(undefined);

  const fetchRockets = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://api.spacexdata.com/v4/rockets");
      if (!response.ok) throw new Error("Failed to fetch rockets");
      const data = await response.json();

      if (data.length > 0) {
        const dimensions = {
          height: Math.max(
            ...data.map((rocket: Rocket) => rocket.height.meters)
          ),
          diameter: Math.max(
            ...data.map((rocket: Rocket) => rocket.diameter.meters)
          ),
        };

        setMaxRocketDimensions(dimensions);
      }

      setRockets(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const value = {
    rockets,
    loading,
    error,
    maxRocketDimensions,
    fetchRockets,
  };

  return (
    <RocketsContext.Provider value={value}>{children}</RocketsContext.Provider>
  );
};
