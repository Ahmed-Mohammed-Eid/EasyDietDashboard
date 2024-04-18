/* eslint-disable @next/next/no-img-element */

import React, { ReactNode } from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '../types/types';


type ChildContainerProps = {
    children: ReactNode;
    dictionary: any;
    lang: string;
};

const AppMenu = ({ dictionary, lang }: ChildContainerProps) => {

    const model: AppMenuItem[] = [
        {
            label: dictionary.sidebar.home.title,
            items: [{ label: dictionary.sidebar.home.dashboard, icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: lang === 'en' ? 'Meals' : 'الوجبات',
            icon: 'pi pi-fw pi-utensils',
            items: [
                { label: lang === 'en' ? 'Meals List' : 'قائمة الوجبات', icon: 'pi pi-fw pi-list', to: '/meals' },
                { label: lang === 'en' ? 'Add Meal' : 'إضافة وجبة', icon: 'pi pi-fw pi-plus', to: '/meals/add' },
                { label: lang === 'en' ? 'Meal Reviews' : 'تقييمات الوجبات', icon: 'pi pi-fw pi-star', to: '/meals/reviews' }
            ]
        },
        {
            label: lang === 'en' ? 'Categories' : 'الأقسام',
            icon: 'pi pi-fw pi-folder',
            items: [
                { label: lang === 'en' ? 'Categories List' : 'قائمة الأقسام', icon: 'pi pi-fw pi-list', to: '/categories' },
                { label: lang === 'en' ? 'Add Category' : 'إضافة قسم', icon: 'pi pi-fw pi-plus', to: '/categories/add' }
            ]
        },
        {
            label: dictionary.sidebar.coupons.title,
            items: [
                { label: dictionary.sidebar.coupons.list, icon: 'pi pi-fw pi-list', to: '/coupons' },
                { label: dictionary.sidebar.coupons.add, icon: 'pi pi-fw pi-plus', to: '/coupons/add' }
            ]
        },
        {
            label: lang === 'en' ? 'UI Management' : 'إدارة الواجهة',
            icon: 'pi pi-fw pi-cog',
            items: [
                {
                    label: lang === 'en' ? 'Sliders List' : 'قائمة الصور',
                    icon: 'pi pi-fw pi-cog',
                    to: '/ui/sliders'
                },
                {
                    label: lang === 'en' ? 'Add Slider' : 'إضافة صورة',
                    icon: 'pi pi-fw pi-plus',
                    to: '/ui/sliders/add'
                }
            ]
        },
        {
            label: dictionary.sidebar.settings.title,
            items: [
                {
                    label: dictionary.sidebar.settings.logout,
                    icon: lang === 'en' ? 'pi pi-sign-out' : 'pi pi-sign-in',
                    to: '/auth/login',
                    command: () => {
                        // Clear local storage
                        localStorage.clear();
                        // Clear Cookies
                        document.cookie.split(';').forEach((c) => {
                            document.cookie = c
                                .replace(/^ +/, '')
                                .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
                        });
                        // Redirect to login page
                        window.location.href = '/auth/login';
                    }
                }
            ]
        }
    ];

    return (
        <MenuProvider dictionary={dictionary} lang={lang}>
            <ul className="layout-menu" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem lang={lang} item={item} root={true} index={i} key={item.label} /> :
                        <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
