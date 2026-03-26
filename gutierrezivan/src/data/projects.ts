import projectData from "./projects.json"
import type { Project } from "../types/Project";


/// useProjects()
/// Imports and fetches the projects.json file. 

export function useProjects() {
    return { data: projectData as Project[] };
}