export type ProjectCategory = "research" | "open source" | "software";

export type Project = {
    title: string;
    blurb: string;
    liveUrl?: string;
    codeUrl?: string;
    categories?: ProjectCategory[];
    tags?: string[];
};
