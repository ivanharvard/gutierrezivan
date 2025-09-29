import { useState } from "react";

export type Project = {
    title: string;
    blurb: string;
    liveUrl?: string;
    codeUrl?: string;
    tags?: string[];
};

/// useProjects()
/// Imports and fetches the projects.json file. Logs errors to console.

export function useProjects() {
    const [data, setData] = useState<Project[] | null>(null);

    try {
        const url = new URL("projects.json", document.baseURI).toString();

        fetch(url, { cache: "no-store" })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((json: Project[]) => setData(json))
            .catch((e) => {
                console.error("Failed to fetch projects:", e);
            });
    } catch (e) {
        console.error("Failed to create projects URL:", e);
    }

    return { data };
}