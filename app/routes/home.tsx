import type { Route } from "./+types/home";
import { useEffect } from "react";
// @ts-ignore
import Sky from "../components/sky";
// @ts-ignore
import Loader from "../components/loader";
// @ts-ignore
import Rockets from "../components/rockets-list";
// @ts-ignore
import { RocketsProvider, useRocketsContext } from "../contexts/RocketsContext.tsx";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

function AppContent() {
  const { rockets, maxRocketDimensions, loading, error, fetchRockets } =
    useRocketsContext();

  useEffect(() => {
    fetchRockets();
  }, []);

  return (
    <div className="App">
      <Sky />
      {loading && <Loader text="Fetching Rockets..." />}
      {error && <div>{error}</div>}
      {maxRocketDimensions !== undefined && <Rockets rockets={rockets} />}
    </div>
  );
}

export default function Home() {
  return (
    <RocketsProvider>
      <AppContent />
    </RocketsProvider>
  );
}
