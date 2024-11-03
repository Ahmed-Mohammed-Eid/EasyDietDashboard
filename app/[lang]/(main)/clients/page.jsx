// This is a React component for a Clients page that utilizes PrimeReact's TabView
// to display two tabs: "Offline Clients" and "Online Clients". The content of each
// tab is populated by a List component, which takes in the language and client type
// as props. The direction of the text is determined by the language parameter.

'use client';
import { TabView, TabPanel } from 'primereact/tabview';
import List from '../../../components/Main/Clients/List';

export default function ClientsPage({ params: { lang } }) {
    return (
        <div className={'card mb-0'} dir={lang === 'en' ? 'ltr' : 'rtl'}>
            <TabView>
                <TabPanel header={lang === 'en' ? 'Offline Clients' : 'العملاء الغير متصلين'}>
                    <List lang={lang} clientType={'offline'} />
                </TabPanel>
                <TabPanel header={lang === 'en' ? 'Online Clients' : 'العملاء المتصلين'}>
                    <List lang={lang} clientType={'online'} />
                </TabPanel>
            </TabView>
        </div>
    );
}
