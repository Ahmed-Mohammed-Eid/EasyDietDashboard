/* eslint-disable @next/next/no-img-element */

import React from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '../types/types';

const AppMenu = ({dictionary, lang}) => {

    console.log('dictionary', dictionary);

    const model: AppMenuItem[] = [
        {
            label: dictionary.sidebar.home.title,
            items: [{ label: dictionary.sidebar.home.dashboard, icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: dictionary.sidebar.settings.title,
            items: [
                {
                    label: dictionary.sidebar.settings.logout, icon: lang === 'en' ? 'pi pi-sign-out' : 'pi pi-sign-in', to: '/auth/login', command: () => {
                        // Clear local storage
                        localStorage.clear();
                        // Clear Cookies
                        document.cookie.split(";").forEach((c) => {
                            document.cookie = c
                                .replace(/^ +/, "")
                                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                        });
                        // Redirect to login page
                        window.location.href = '/auth/login';
                    },
                },
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu" dir={lang === "ar" ? 'rtl' : 'ltr'}>
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
