"use client";

import { TabView, TabPanel } from 'primereact/tabview';
import List from '../../../components/Main/Clients/List';


export default function ClientsPage({params: {lang}}) {
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