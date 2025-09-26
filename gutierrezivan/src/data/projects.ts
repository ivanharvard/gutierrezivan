import { useEffect, useState } from "react";

export type Project = {
    title: string;
    blurb: string;
    liveUrl?: string;
    codeUrl?: string;
    tags?: string[];
};

/// useProjects()
/// Imports and fetches the projects.json file.

export function useProjects() {
    const [data, setData] = useState<Project[] | null> (null);
    const [error, setError] = useState<string | null> (null);
    const [loading, setLoading] = useState(true);

    try {
      const url = new URL("projects.json", document.baseURI).toString();

      fetch(url, { cache: "no-store" })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((json: Project[]) => setData(json))
        .catch((e) => setError(e instanceof Error ? e.message : String(e)))
        .finally(() => setLoading(false));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
    }

    return { data, error, loading };
}