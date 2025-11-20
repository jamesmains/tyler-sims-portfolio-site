import {
  IconBrandCSharp,
  IconBrandUnity,
  IconBrandReact,
  IconBrandPython,
  IconBrandTypescript,
  IconBrandVite,
  IconBrandAndroid,
  IconBrandHtml5,
  IconBrandCpp,
  IconBrandJavascript,
  IconBrandDjango,
  IconBrandYoutube,
  IconBrandGithub,
  IconBrandItch,
  IconWorldPin,
} from '@tabler/icons-react';


export type GalleryImage = {
    id: string;
    url: string;
    alt: string;
}

export type ProjectLink = {
    id: string;
    url: string;
}

export type Project = {
    id: number | undefined ;                // Identifier for the project
    title: string;              // Name of the project
    description: string;        // General short form text for the project

    bodyContent: string;        // HTML rich content text used to give more insights on the project
    showcase: string;           // Filepath for the main image for this project
    gallery: GalleryImage[];    // Custom type that needs to be read from json upon loading
    tech: string[];             // Will be turned into a json string upon saving and read from json upon loading
    type: string[];             // Will be turned into a json string upon saving and read from json upon loading
    links: ProjectLink[];       // External links related to the project
    isPublished: boolean;       // Determines if this project is viewable by the public projects listing page
}

export type Tech = {
    id: string;                 // Internal key value (i.e. 'csharp')
    label: string;              // Display name (i.e. 'C#')
    icon: React.ElementType;    // React component for the icon
}

export const predefinedTechs: Tech[] = [
  { id: 'csharp', label: 'C#', icon: IconBrandCSharp },
  { id: 'unity', label: 'Unity', icon: IconBrandUnity },
  { id: 'react', label: 'React', icon: IconBrandReact },
  { id: 'python', label: 'Python', icon: IconBrandPython },
  { id: 'typescript', label: 'TypeScript', icon: IconBrandTypescript },
  { id: 'vite', label: 'Vite', icon: IconBrandVite },
  { id: 'android', label: 'Android', icon: IconBrandAndroid },
  { id: 'html5', label: 'HTML5', icon: IconBrandHtml5 },
  { id: 'cpp', label: 'C++', icon: IconBrandCpp },
  { id: 'javascript', label: 'JavaScript', icon: IconBrandJavascript },
  { id: 'django', label: 'Django', icon: IconBrandDjango },
];

export const predefinedProjectTypes = ["Game", "Prototype", "Web", "Playable", "In Progress", "Complete"];

export type ExternalLink = {
    id: string;                 // Internal key value (i.e. 'youtube')
    label: string;              // Display action text (i.e. 'Watch')
    name: string;               // For ease of Admin use (i.e. 'YouTube')
    tooltip: string;            // Tooltip display text (i.e. 'Watch on YouTube')
    icon: React.ElementType;    // React component for the icon
}
export const prefedinedProjectExternalLinks: ExternalLink[] = [
  {id: 'youtube', label:'Watch', name:'YouTube', tooltip:'Watch on YouTube', icon: IconBrandYoutube},
  {id: 'github', label:'Source', name:'GitHub', tooltip:'View source code on GitHub', icon: IconBrandGithub},  
  {id: 'itch_play', label:'Play', name:'Itch.io (Play)',
     tooltip:'Play on Itch.io', icon:IconBrandItch},                  // Should be the target itch link
  {id: 'itch_download', label:'Download', name:'Itch.io (Download)',
     tooltip:'Download on Itch.io', icon:IconBrandItch},              // Backup if play in browser is not an option
  {id: 'other', label:'View', name:'External Page (View)', tooltip:'View external content', icon: IconWorldPin},  
];

// Filters for searching from a projects listing page
const projectFilterOptions = [
    { id: 'query', label: 'Search Title', type: 'text'},
    { id: 'tech', label: 'Technology', type: 'dropdown', options: predefinedTechs},
];