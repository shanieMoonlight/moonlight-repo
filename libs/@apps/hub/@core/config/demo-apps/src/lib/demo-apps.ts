import { AppImages } from "@sb-hub/core-config/images";


export interface DemoAppData {
    name: string;
    description: string;
    icon: string;
    url: string;
    image: string;
}

//###################################//


export const DEMO_APPS: DemoAppData[] = [
    {
        name: 'Material Theming',
        description: 'A powerful, flexible theming system for Angular Material',
        icon: 'palette',
        url: 'https://spiderbabymaterialtheming.web.app',
        image:AppImages.Demos.MatTheme.medium
    },
    {
        name: 'Mini-State',
        description: 'A lightweight, signals-based state management library for Angular applications',
        icon: 'merge',
        url: 'https://spider-baby-mini-state.web.app/',
        image:AppImages.Demos.MiniState.medium
    }
]

//###################################//