import { use, useEffect, useState } from "react";

export type Project = {
    title: string;
    blurb: string;
    liveUrl?: string;
    codeUrl?: string;
    tags?: string[];
};

export function useProjects() {
    const [data, setData] = useState<Project[] | null> (null);
    const [error, setError] = useState<string | null> (null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Import the projects.json URL relative to the base URL
        const url = new URL("projects.json", import.meta.env.BASE_URL).toString();
        fetch(url, { cache: "no-store" })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                return res.json();
            })
            .then((json: Project[]) => setData(json))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { data, error, loading };
}