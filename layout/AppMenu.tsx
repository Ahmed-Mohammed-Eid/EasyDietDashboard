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
            items: [{ label: dictionary.sidebar.home.dashboard, icon: 'pi pi-fw pi-home', to: `/${lang}/` }]
        },
        {
            label: lang === 'en' ? 'Categories' : 'الأقسام',
            icon: 'pi pi-fw pi-folder',
            items: [
                { label: lang === 'en' ? 'Categories List' : 'قائمة الأقسام', icon: 'pi pi-fw pi-list', to: `/${lang}/categories` },
                { label: lang === 'en' ? 'Add Category' : 'إضافة قسم', icon: 'pi pi-fw pi-plus', to: `/${lang}/categories/add` }
            ]
        },
        {
            label: lang === 'en' ? 'Meals' : 'الوجبات',
            icon: 'pi pi-fw pi-utensils',
            items: [
                { label: lang === 'en' ? 'Meals List' : 'قائمة الوجبات', icon: 'pi pi-fw pi-list', to: `/${lang}/meals` },
                { label: lang === 'en' ? 'Add Meal' : 'إضافة وجبة', icon: 'pi pi-fw pi-plus', to: `/${lang}/meals/add` },
                { label: lang === 'en' ? 'Meal Reviews' : 'تقييمات الوجبات', icon: 'pi pi-fw pi-star', to: `/${lang}/meals/reviews` }
            ]
        },
        {
            label: lang === 'en' ? 'Bundles' : 'الباقات',
            icon: 'pi pi-fw pi-shopping-cart',
            items: [
                { label: lang === 'en' ? 'Bundles List' : 'قائمة الباقات', icon: 'pi pi-fw pi-list', to: `/${lang}/bundles` },
                { label: lang === 'en' ? 'Add Bundle' : 'إضافة باقة', icon: 'pi pi-fw pi-plus', to: `/${lang}/bundles/add` }
            ]
        },
        {
            label: lang === 'en' ? 'Clients' : 'العملاء',
            icon: 'pi pi-fw pi-user',
            items: [
                { label: lang === 'en' ? 'Clients List' : 'قائمة العملاء', icon: 'pi pi-fw pi-list', to: `/${lang}/clients` },
                { label: lang === 'en' ? 'Add Client' : 'إضافة عميل', icon: 'pi pi-fw pi-plus', to: `/${lang}/clients/add` }
            ]
        },
        {
            label: lang === 'en' ? 'Employees' : 'الموظفين',
            icon: 'pi pi-fw pi-users',
            items: [
                { label: lang === 'en' ? 'Employees List' : 'قائمة الموظفين', icon: 'pi pi-fw pi-list', to: `/${lang}/employee` },
                { label: lang === 'en' ? 'Add Employee' : 'إضافة موظف', icon: 'pi pi-fw pi-plus', to: `/${lang}/employee/add` }
            ]
        },
        {
            label: lang === 'en' ? 'Menus' : 'القوائم',
            icon: 'pi pi-fw pi-book',
            items: [
                { label: lang === 'en' ? 'Daily Menu' : 'القوائم اليومية', icon: 'pi pi-fw pi-list', to: `/${lang}/menu/daily` },
                { label: lang === 'en' ? 'Add Daily Day' : 'إضافة للقائمة اليومية', icon: 'pi pi-fw pi-plus', to: `/${lang}/menu/daily/add` },
                { label: lang === 'en' ? 'Default Menu' : 'القائمة الافتراضية', icon: 'pi pi-fw pi-list', to: `/${lang}/menu/default` },
                { label: lang === 'en' ? 'Add Default Menu' : 'إضافة للقائمة الإفتراضية', icon: 'pi pi-fw pi-plus', to: `/${lang}/menu/default/add` }
            ]
        },
        {
            label: dictionary.sidebar.coupons.title,
            items: [
                { label: dictionary.sidebar.coupons.list, icon: 'pi pi-fw pi-list', to: `/${lang}/coupons` },
                { label: dictionary.sidebar.coupons.add, icon: 'pi pi-fw pi-plus', to: `/${lang}/coupons/add` }
            ]
        },
        {
            label: lang === 'en' ? 'Branches' : 'الفروع',
            icon: 'pi pi-fw pi-home',
            items: [
                { label: lang === 'en' ? 'Branches\' Manager' : "مدير الفرع" , icon: 'pi pi-fw pi-list', to: `/${lang}/branchManager` },
            ]
        },
        {
            label: lang === 'en' ? 'UI Management' : 'إدارة الواجهة',
            icon: 'pi pi-fw pi-cog',
            items: [
                {
                    label: lang === 'en' ? 'Sliders List' : 'قائمة الصور',
                    icon: 'pi pi-fw pi-cog',
                    to: `/${lang}/ui/sliders`
                },
                {
                    label: lang === 'en' ? 'Add Slider' : 'إضافة صورة',
                    icon: 'pi pi-fw pi-plus',
                    to: `/${lang}/ui/sliders/add`
                }
            ]
        },
        {
            label: lang === 'en' ? 'Reports' : 'التقارير',
            icon: 'pi pi-fw pi-chart-bar',
            items: [
                {label: lang === 'en' ? 'Reports List' : 'قائمة التقارير', icon: 'pi pi-fw pi-list', to: `/${lang}/reports`},
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
