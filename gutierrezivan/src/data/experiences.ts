import experienceData from "./experience.json"
import type { Experience } from "../types/Experience";

/// useExperiences()
/// Imports the experience.json file. 

export function useExperiences() {
    return { data: experienceData as Experience[] };
}