import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const pages = import.meta.glob<{ default: ResolvedComponent }>(
    './pages/**/*.tsx',
    { eager: true },
);

void createInertiaApp({
    resolve: (name) => {
        const page = pages[`./pages/${name}.tsx`];

        if (!page) {
            throw new Error(`Inertia page "${name}" could not be found.`);
        }

        return page.default;
    },
    title: (title) => (title ? `${title} - ${appName}` : appName),
    progress: {
        color: '#4B5563',
    },
});
