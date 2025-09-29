export type ExperienceRole = {
    title: string;
    startDate: string; // e.g., "Jan 2023" or "2023-01"
    endDate?: string; // undefined means "Present"
    location?: string;
    blurb?: string; // Optional description
};

export type Experience = {
    type: 'work' | 'extracurricular' | 'volunteering';
    organization: string;
    roles: ExperienceRole[]; // Timeline of roles at this organization
    url?: string; // Organization website/LinkedIn
    tags?: string[]; // Overall skills/technologies used across all roles
};