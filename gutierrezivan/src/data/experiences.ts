import { useState } from "react";
import type { Experience } from "../types/Experience";

/// useExperiences()
/// Imports and fetches the experience.json file. Logs errors to console.

export function useExperiences() {
    const [data, setData] = useState<Experience[] | null>(null);

    try {
        const url = new URL("experience.json", document.baseURI).toString();

        fetch(url, { cache: "no-store" })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((json: Experience[]) => setData(json))
            .catch((e) => {
                console.error("Failed to fetch experiences:", e);
            });
    } catch (e) {
        console.error("Failed to create experiences URL:", e);
    }

    return { data };
}