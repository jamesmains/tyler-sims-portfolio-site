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
  IconBrandJavascript
} from '@tabler/icons-react';


export type GalleryImage = {
    id: string;
    url: string;
    alt: string;
}

export type Project = {
    id: number | undefined ;                // Identifier for the project
    title: string;              // Name of the project
    description: string;        // General short form text for the project

    bodyContent: string;        // HTML rich content text used to give more insights on the project
    showcase: string;           // Filepath for the main image for this project
    gallery: GalleryImage[];    // Custom type that needs to be read from json upon loading
    tech: string[];             // Will be turned into a json string upon saving and read from json upon loading
    isPublished: boolean;       // Determines if this project is viewable by the public projects listing page
}

export type Tech = {
    id: string;                 // Internal key value (i.e. 'csharp')
    label: string;              // Display name (i.e. 'C#')
    icon: React.ElementType;          // React component for the icon
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
];