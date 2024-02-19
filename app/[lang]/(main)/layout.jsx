import Layout from '../../../layout/layout';
import { getDictionary } from '../../dictionaries/dictionaries';

export const metadata = {
    title: 'EasyDiet - Dashboard',
    description: 'EasyDiet - Dashboard',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    icons: {
        icon: '/favicon.ico'
    }
};

export default async function AppLayout({ children, params: {lang} }) {
    const dictionary = await getDictionary(lang);
    return <Layout dictionary={dictionary} lang={lang}>{children}</Layout>;
}
