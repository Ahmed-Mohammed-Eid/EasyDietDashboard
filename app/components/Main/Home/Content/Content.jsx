'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

// import ClientsChart from '../Charts/ClientsChart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import Image from 'next/image';

export default function Content({ lang }) {
    // STATES
    const [bestSellingBundles, setBestSellingBundles] = useState([]);
    const [clientsStats, setClientsStats] = useState({});
    const [clientsTypes, setClientsTypes] = useState([{}]);
    const [topSelectedMeals, setTopSelectedMeals] = useState([]);
    const [bundlesNumber, setBundlesNumber] = useState(0);
    const [mealsNumber, setMealsNumber] = useState(0);
    const [specialistsNumber, setSpecialistsNumber] = useState(0);
    // CLIENT TYPES STATE END AND NEW
    const [clientTypesTable, setClientTypesTable] = useState({
        newClients: [],
        endingClients: [],
        newOfflineClients: [],
        endingOfflineClients: [],
        renewedClients: []
    });

    // EFFECT TO GET THE DATA
    useEffect(() => {
        // GET THE STATS
        getStats();

        // GET THE NEW AND ENDING SOON CLIENTS
        getClientsTypes();
    }, [lang]);

    // GET THE STATES HANDLER
    const getStats = async () => {
        // GET THE TOKEN
        const token = localStorage.getItem('token');

        // GET THE DATA
        axios
            .get(`${process.env.API_URL}/get/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                const data = response.data?.data;
                // SET THE DATA
                setBestSellingBundles(data?.bestSeller || []);
                setClientsStats(data?.clientsStats || {});
                setTopSelectedMeals(data?.topSelectedMeals || []);
                setBundlesNumber(data?.bundlesNumber || 0);
                setMealsNumber(data?.mealsNumber || 0);
                setSpecialistsNumber(data?.specialistsNumber || 0);

                // SET THE CLIENTS TYPES
                const clientsTypes = [];
                for (const key in data?.clientsStats) {
                    // TAKE THE KEY EX: ALL, ACTIVE, ACTIVE OFFLINE, ... AND ADD THE ARABIC NAME AND ENGLISH NAME AND THE NUMBER

                    if (key === 'all') {
                        clientsTypes.push({
                            type: lang === 'en' ? 'All' : 'الكل',
                            number: data?.clientsStats[key]
                        });
                    }

                    if (key === 'active') {
                        clientsTypes.push({
                            type: lang === 'en' ? 'Active Online' : 'نشط اونلاين',
                            number: data?.clientsStats[key]
                        });
                    }

                    if (key === 'activeOffline') {
                        clientsTypes.push({
                            type: lang === 'en' ? 'Active Offline' : 'نشط اوفلاين',
                            number: data?.clientsStats[key]
                        });
                    }

                    if (key === 'freezedOnline') {
                        clientsTypes.push({
                            type: lang === 'en' ? 'Freezed Online' : 'مجمد اونلاين',
                            number: data?.clientsStats[key]
                        });
                    }

                    if (key === 'freezedOffline') {
                        clientsTypes.push({
                            type: lang === 'en' ? 'Freezed Offline' : 'مجمد اوفلاين',
                            number: data?.clientsStats[key]
                        });
                    }

                    if (key === 'inactive') {
                        clientsTypes.push({
                            type: lang === 'en' ? 'Inactive Online' : 'غير نشط اونلاين',
                            number: data?.clientsStats[key]
                        });
                    }

                    if (key === 'inactiveOffline') {
                        clientsTypes.push({
                            type: lang === 'en' ? 'Inactive Offline' : 'غير نشط اوفلاين',
                            number: data?.clientsStats[key]
                        });
                    }

                    if (key === 'inactiveOnline') {
                        clientsTypes.push({
                            type: lang === 'en' ? 'Inactive Online' : 'غير نشط اونلاين',
                            number: data?.clientsStats[key]
                        });
                    }
                }

                setClientsTypes(clientsTypes);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // GET THE CLIENTS TYPES
    const getClientsTypes = () => {
        // GET THE TOKEN
        const token = localStorage.getItem('token');

        // GET THE DATA
        axios
            .get(`${process.env.API_URL}/monitor/clients`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                const data = response.data;
                console.log(data);
                // SET THE DATA
                setClientTypesTable({
                    newClients: data?.newClients || [],
                    endingClients: data?.endingClients || [],
                    newOfflineClients: data?.newOfflineClients || [],
                    endingOfflineClients: data?.endingOfflineClients || [],
                    renewedClients: data?.renewedClients || []
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="grid" dir={lang === 'en' ? 'ltr' : 'rtl'}>
            <div className="col-12 md:col-6">
                <div className="card mb-2">
                    <h5>{lang === 'en' ? 'Bundles Number' : 'عدد الباقات'}</h5>
                    <p>{bundlesNumber}</p>
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="card mb-2">
                    <h5>{lang === 'en' ? 'Meals Number' : 'عدد الوجبات'}</h5>
                    <p>{mealsNumber}</p>
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="card mb-2">
                    <h5>{lang === 'en' ? 'Specialists Number' : 'عدد الاخصائيين'}</h5>
                    <p>{specialistsNumber}</p>
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="card mb-2">
                    <h5>{lang === 'en' ? 'Clients Number' : 'عدد العملاء'}</h5>
                    <p>{clientsStats?.all || 0}</p>
                </div>
            </div>

            {/*<div className="col-12 md:col-5 pr-1">*/}
            {/*    <ClientsChart clientsStats={clientsStats} lang={lang} />*/}
            {/*</div>*/}

            {/*  THE LIST OF EVERY CLIENTS TYPE AND IT'S NUMBER  */}
            <div className="col-12">
                <div className="card">
                    <h5>{lang === 'en' ? 'Clients Types' : 'انواع العملاء'}</h5>
                    <DataTable dir={lang === 'en' ? 'ltr' : 'rtl'} value={clientsTypes || []} className="p-datatable-sm">
                        <Column field="type" header={lang === 'en' ? 'Type' : 'النوع'} />
                        <Column field="number" header={lang === 'en' ? 'Number' : 'العدد'} />
                    </DataTable>
                </div>
            </div>

            {/* RENEWED CLIENTS */}
            <div className="col-12">
                <div className="card">
                    <h5>{lang === 'en' ? 'Renewed Clients' : 'العملاء المجددين'}</h5>
                    <DataTable dir={lang === 'en' ? 'ltr' : 'rtl'} value={clientTypesTable.renewedClients || []} className="p-datatable-sm">
                        {/*ID*/}
                        <Column field="clientId.subscriptionId" header={lang === 'en' ? 'ID' : 'الرقم'} />
                        {/*NAME*/}
                        <Column field="clientId.clientName" header={lang === 'en' ? 'Name' : 'الاسم'} />
                        {/* PHONE NUMBER */}
                        <Column field="clientId.phoneNumber" header={lang === 'en' ? 'Phone Number' : 'رقم الهاتف'} />
                        {/* BUNDLE */}
                        <Column field="bundleId.bundleName" header={lang === 'en' ? 'Bundle Name' : 'اسم الباقة'} />
                        <Column field="bundleId.bundleNameEn" header={lang === 'en' ? 'Bundle Name En' : 'اسم الباقة بالانجليزي'} />
                        {/* START DATE */}
                        <Column
                            field="clientId.subscripedBundle.startingDate"
                            header={lang === 'en' ? 'Start Date' : 'تاريخ البداية'}
                            body={(rowData) => {
                                return new Date(rowData?.clientId?.subscripedBundle?.startingDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
                            }}
                        />
                        {/* END DATE */}
                        <Column
                            field="clientId.subscripedBundle.endingDate"
                            header={lang === 'en' ? 'End Date' : 'تاريخ الانتهاء'}
                            body={(rowData) => {
                                return new Date(rowData?.clientId?.subscripedBundle?.endingDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
                            }}
                        />
                    </DataTable>
                </div>
            </div>

            {/*  THE LIST OF THE NEW CLIENTS ONLINE */}
            <div className="col-12">
                <div className="card">
                    <h5>{lang === 'en' ? 'New Clients Online' : 'العملاء الجدد اونلاين'}</h5>
                    <DataTable dir={lang === 'en' ? 'ltr' : 'rtl'} value={clientTypesTable.newClients || []} className="p-datatable-sm">
                        {/*ID*/}
                        <Column field="subscriptionId" header={lang === 'en' ? 'ID' : 'الرقم'} />
                        {/*NAME*/}
                        <Column field="clientName" header={lang === 'en' ? 'Name' : 'الاسم'} />
                        <Column field="phoneNumber" header={lang === 'en' ? 'Phone Number' : 'رقم الهاتف'} />
                        {/* BUNDLE */}
                        <Column field="subscripedBundle.bundleId.bundleName" header={lang === 'en' ? 'Bundle Name' : 'اسم الباقة'} />
                        <Column field="subscripedBundle.bundleId.bundleNameEn" header={lang === 'en' ? 'Bundle Name En' : 'اسم الباقة بالانجليزي'} />
                        {/* START DATE */}
                        <Column
                            field="subscripedBundle.startingDate"
                            header={lang === 'en' ? 'Start Date' : 'تاريخ البداية'}
                            body={(rowData) => {
                                return new Date(rowData?.subscripedBundle?.startingDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
                            }}
                        />
                        {/* END DATE */}
                        <Column
                            field="subscripedBundle.endingDate"
                            header={lang === 'en' ? 'End Date' : 'تاريخ الانتهاء'}
                            body={(rowData) => {
                                return new Date(rowData?.subscripedBundle?.endingDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
                            }}
                        />
                    </DataTable>
                </div>
            </div>

            {/*  THE LIST OF THE ENDING SOON CLIENTS ONLINE */}
            <div className="col-12">
                <div className="card">
                    <h5>{lang === 'en' ? 'Ending Soon Clients Online' : 'عملاء ستنتهى اشتراكاتهم اونلاين'}</h5>
                    <DataTable dir={lang === 'en' ? 'ltr' : 'rtl'} value={clientTypesTable.endingClients || []} className="p-datatable-sm">
                        {/*ID*/}
                        <Column field="subscriptionId" header={lang === 'en' ? 'ID' : 'الرقم'} />
                        {/*NAME*/}
                        <Column field="clientName" header={lang === 'en' ? 'Name' : 'الاسم'} />
                        <Column field="phoneNumber" header={lang === 'en' ? 'Phone Number' : 'رقم الهاتف'} />
                        {/* BUNDLE */}
                        <Column field="subscripedBundle.bundleId.bundleName" header={lang === 'en' ? 'Bundle Name' : 'اسم الباقة'} />
                        <Column field="subscripedBundle.bundleId.bundleNameEn" header={lang === 'en' ? 'Bundle Name En' : 'اسم الباقة بالانجليزي'} />
                        {/* START DATE */}
                        <Column
                            field="subscripedBundle.startingDate"
                            header={lang === 'en' ? 'Start Date' : 'تاريخ البداية'}
                            body={(rowData) => {
                                return new Date(rowData?.subscripedBundle?.startingDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
                            }}
                        />
                        {/* END DATE */}
                        <Column
                            field="subscripedBundle.endingDate"
                            header={lang === 'en' ? 'End Date' : 'تاريخ الانتهاء'}
                            body={(rowData) => {
                                return new Date(rowData?.subscripedBundle?.endingDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
                            }}
                        />
                    </DataTable>
                </div>
            </div>

            {/*  THE LIST OF THE NEW CLIENTS OFFLINE */}
            <div className="col-12">
                <div className="card">
                    <h5>{lang === 'en' ? 'New Clients Offline' : 'العملاء الجدد اوفلاين'}</h5>
                    <DataTable dir={lang === 'en' ? 'ltr' : 'rtl'} value={clientTypesTable.newOfflineClients || []} className="p-datatable-sm">
                        {/*ID*/}
                        <Column field="subscriptionId" header={lang === 'en' ? 'ID' : 'الرقم'} />
                        {/*NAME*/}
                        <Column field="clientName" header={lang === 'en' ? 'Name' : 'الاسم'} />
                        <Column field="phoneNumber" header={lang === 'en' ? 'Phone Number' : 'رقم الهاتف'} />
                        {/* BUNDLE */}
                        <Column field="bundleId.bundleName" header={lang === 'en' ? 'Bundle Name' : 'اسم الباقة'} />
                        <Column field="bundleId.bundleNameEn" header={lang === 'en' ? 'Bundle Name En' : 'اسم الباقة بالانجليزي'} />
                        {/* START DATE */}
                        <Column
                            field="subscripedBundle.startingDate"
                            header={lang === 'en' ? 'Start Date' : 'تاريخ البداية'}
                            body={(rowData) => {
                                return new Date(rowData?.subscripedBundle?.startingDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
                            }}
                        />
                        {/* END DATE */}
                        <Column
                            field="subscripedBundle.endingDate"
                            header={lang === 'en' ? 'End Date' : 'تاريخ الانتهاء'}
                            body={(rowData) => {
                                return new Date(rowData?.subscripedBundle?.endingDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
                            }}
                        />
                    </DataTable>
                </div>
            </div>

            {/*  THE LIST OF THE ENDING SOON CLIENTS OFFLINE */}
            <div className="col-12">
                <div className="card">
                    <h5>{lang === 'en' ? 'Ending Soon Clients Offline' : 'عملاء ستنتهى اشتراكاتهم اوفلاين'}</h5>
                    <DataTable dir={lang === 'en' ? 'ltr' : 'rtl'} value={clientTypesTable.endingOfflineClients || []} className="p-datatable-sm">
                        {/*ID*/}
                        <Column field="subscriptionId" header={lang === 'en' ? 'ID' : 'الرقم'} />
                        {/*NAME*/}
                        <Column field="clientName" header={lang === 'en' ? 'Name' : 'الاسم'} />
                        <Column field="phoneNumber" header={lang === 'en' ? 'Phone Number' : 'رقم الهاتف'} />
                        {/* BUNDLE */}
                        <Column field="bundleId.bundleName" header={lang === 'en' ? 'Bundle Name' : 'اسم الباقة'} />
                        <Column field="bundleId.bundleNameEn" header={lang === 'en' ? 'Bundle Name En' : 'اسم الباقة بالانجليزي'} />
                        {/* START DATE */}
                        <Column
                            field="subscripedBundle.startingDate"
                            header={lang === 'en' ? 'Start Date' : 'تاريخ البداية'}
                            body={(rowData) => {
                                return new Date(rowData?.subscripedBundle?.startingDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
                            }}
                        />
                        {/* END DATE */}
                        <Column
                            field="subscripedBundle.endingDate"
                            header={lang === 'en' ? 'End Date' : 'تاريخ الانتهاء'}
                            body={(rowData) => {
                                return new Date(rowData?.subscripedBundle?.endingDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
                            }}
                        />
                    </DataTable>
                </div>
            </div>

            {/*  THE LIST OF THE BEST SELLING BUNDLES  */}
            <div className="col-12">
                <div className="card">
                    <h5>{lang === 'en' ? 'Best Selling Bundles' : 'افضل الباقات مبيعا'}</h5>
                    <DataTable dir={lang === 'en' ? 'ltr' : 'rtl'} value={bestSellingBundles || []} className="p-datatable-sm">
                        <Column
                            field="bundleImageMale"
                            header={lang === 'en' ? 'Bundle Image' : 'صورة الباقة'}
                            body={(rowData) => {
                                return <Image src={rowData.bundleImageMale || '/assets/404.jpg'} alt={lang === 'en' ? 'Bundle Image' : 'صورة الباقة'} width={50} height={50} style={{ borderRadius: '50%' }} />;
                            }}
                        />
                        <Column
                            field="bundleImageFemale"
                            header={lang === 'en' ? 'Bundle Image' : 'صورة الباقة'}
                            body={(rowData) => {
                                return <Image src={rowData.bundleImageFemale || '/assets/404.jpg'} alt={lang === 'en' ? 'Bundle Image' : 'صورة الباقة'} width={50} height={50} style={{ borderRadius: '50%' }} />;
                            }}
                        />
                        <Column field="bundleName" header={lang === 'en' ? 'Bundle Name' : 'اسم الباقة'} />
                        <Column field="bundleNameEn" header={lang === 'en' ? 'Bundle Name En' : 'اسم الباقة بالانجليزي'} />
                        <Column field="bundlePrice" header={lang === 'en' ? 'Bundle Price' : 'سعر الباقة'} />
                    </DataTable>
                </div>
            </div>

            {/*  THE LIST OF THE TOP SELECTED MEALS  */}
            <div className="col-12">
                <div className="card">
                    <h5>{lang === 'en' ? 'Top Selected Meals' : 'افضل الوجبات مبيعا'}</h5>
                    <DataTable dir={lang === 'en' ? 'ltr' : 'rtl'} value={topSelectedMeals || []} className="p-datatable-sm">
                        <Column
                            field="imagePath"
                            header={lang === 'en' ? 'Meal Image' : 'صورة الوجبة'}
                            body={(rowData) => {
                                return <Image src={rowData.imagePath || '/assets/404.jpg'} alt={lang === 'en' ? 'Meal Image' : 'صورة الوجبة'} width={50} height={50} style={{ borderRadius: '50%' }} />;
                            }}
                        />
                        <Column field="mealTitle" header={lang === 'en' ? 'Meal Name' : 'اسم الوجبة'} />
                        <Column field="mealTitleEn" header={lang === 'en' ? 'Meal Name En' : 'اسم الوجبة بالانجليزي'} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
}
