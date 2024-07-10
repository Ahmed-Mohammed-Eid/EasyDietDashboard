'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { toast } from 'react-hot-toast';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';

export default function List({ clientType = 'offline', lang }) {

    //ROUTER
    const router = useRouter();

    // PAGE STATE
    const [page, setPage] = useState(1);
    const [loadOption, setLoadOption] = useState('deleteOld');
    const [globalFilter, setGlobalFilter] = useState("");

    // STATE TO STORE DATA
    const [clients, setClients] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [actionType, setActionType] = useState('');
    // INFO DIALOG
    const [infoDialog, setInfoDialog] = useState(false);
    const [fullBundleData, setFullBundleData] = useState({});
    // BUNDLES STATE
    const [bundles, setBundles] = useState([]);
    // FREEZE STATE
    const [freezeDialog, setFreezeDialog] = useState(false);
    const [freezeData, setFreezeData] = useState({
        clientId: '',
        pauseDate: '',
        period: ''
    });
    // SUBSCRIPTION STATE
    const [subscriptionDialog, setSubscriptionDialog] = useState(false);
    // ADDRESS STATE
    const [addressDialog, setAddressDialog] = useState({
        visible: false,
        clientId: ''
    });
    // RENEW STATE
    const [selectedBundleToRenew, setSelectedBundleToRenew] = useState({
        clientId: '',
        bundleId: '',
        startingAt: ''
    });

    // ADD OR REMOVE DAYS
    const [daysData, setDaysData] = useState({
        numberOfDays: 0,
        action: 'add',
        fridayOption: false,
        clientId: ''
    });

    // DELETE STATE
    const [deleteDialog, setDeleteDialog] = useState({
        clientId: '',
        visible: false
    });

    // LIST FILTERS
    const [filterType, setFilterType] = useState('all');


    // EFFECT TO FETCH DATA
    useEffect(() => {
        // FETCH DATA
        getData(page, clientType, filterType);
    }, [page, clientType, filterType]);

    // HANDLER TO GET THE DATA
    const getData = (page, clientType, filter) => {
        // GET THE TOKEN
        const token = localStorage.getItem('token');

        // VALIDATE HAS MORE
        if (!hasMore && !actionType) {
            return toast.error(lang === 'en' ? 'No more data' : 'لا يوجد المزيد من البيانات');
        }

        axios.get(`${process.env.API_URL}/all/clients?clientType=${clientType}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                page: page || 1,
                allClients: filter === 'all' ? 'all' : '',
                isActive: filter === 'isActive',
                isFreezed: filter === 'isFreezed'
            }
        })
            .then(response => {
                const clientsArray = response.data?.data?.clients || [];
                if (loadOption === 'saveOld') {
                    setClients([...clients, ...clientsArray]);
                }

                if (loadOption === 'deleteOld') {
                    setClients(clientsArray);
                }

                if (loadOption !== 'saveOld' && loadOption !== 'deleteOld') {
                    setClients(clientsArray);
                }

                setHasMore(response.data?.data?.hasNextPage);
            })
            .catch(error => {
                console.error(error);
            });
    };

    // GET THE BUNDLE DATA FROM THE SERVER
    const getBundleData = (clientId) => {
        // GET THE TOKEN
        const token = localStorage.getItem('token');

        axios.get(`${process.env.API_URL}/client/details`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                clientId: clientId
            }
        })
            .then(response => {
                setFullBundleData(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    // GET ALL BUNDLES
    const getBundles = () => {
        // GET THE TOKEN
        const token = localStorage.getItem('token');

        axios.get(`${process.env.API_URL}/get/bundles`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                const bundles = response.data?.bundles || [];
                setBundles(bundles);
            })
            .catch(error => {
                console.error(error);
            });
    };

    // THE FREEZE STATUS
    const FreezeHandler = () => {
        // GET THE TOKEN
        const token = localStorage.getItem('token');

        // clientId, pauseDate, period
        const freezeUrl = `${process.env.API_URL}/pause/subscription`; // POST

        // VALIDATION
        if (!freezeData.clientId || !freezeData.pauseDate || !freezeData.period) {
            toast.error(lang === 'en' ? 'Please fill all fields' : 'يرجى ملء جميع الحقول');
            return;
        }

        // FORMAT THE DATE TO BE IN THE FORMAT OF DD-MM-YYYY
        const date = new Date(freezeData.pauseDate);
        const formattedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;

        // HANDLE FREEZE
        axios.post(freezeUrl, {
            clientId: freezeData.clientId,
            pauseDate: formattedDate,
            period: freezeData.period
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(_ => {
                toast.success(lang === 'en' ? 'Client Freezed' : 'تم تجميد العميل');
                setFreezeDialog(false);
                // REFRESH THE DATA
                getData(page, clientType,filterType);

                // CLEAR THE ACTION TYPE
                setActionType('');
            })
            .catch(error => {
                console.error(error);
                toast.error(lang === 'en' ? 'Something went wrong' : 'حدث خطأ ما');
            });
    };

    // THE UNFREEZE STATUS
    const UnFreezeHandler = () => {
        // GET THE TOKEN
        const token = localStorage.getItem('token');

        // clientId, pauseDate, period
        const unFreezeUrl = `${process.env.API_URL}/activate/subscription`; // POST

        // VALIDATION
        if (!freezeData.clientId || !freezeData.pauseDate) {
            toast.error(lang === 'en' ? 'Please fill all fields' : 'يرجى ملء جميع الحقول');
            return;
        }

        // HANDLE UNFREEZE
        axios.put(unFreezeUrl, {
            clientId: freezeData.clientId,
            activationDate: freezeData.pauseDate
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(_ => {
                toast.success(lang === 'en' ? 'Client Unfreeze' : 'تم فك تجميد العميل');
                setFreezeDialog(false);
                // REFRESH THE DATA
                getData(page, clientType,filterType);

                // CLEAR THE ACTION TYPE
                setActionType('');
            })
            .catch(error => {
                console.error(error);
                toast.error(lang === 'en' ? 'Something went wrong' : 'حدث خطأ ما');
            });
    };

    // UNSUBSCRIBE HANDLER
    const UnsubscribeHandler = () => {
        // GET THE TOKEN
        const token = localStorage.getItem('token');

        // clientId, pauseDate, period
        const unSubscribeUrl = `${process.env.API_URL}/unsubscribe/client`; // PATCH

        // VALIDATION
        if (!subscriptionDialog?._id) {
            toast.error(lang === 'en' ? 'Please fill all fields' : 'يرجى ملء جميع الحقول');
            return;
        }

        // HANDLE UNSUBSCRIBE
        axios.patch(unSubscribeUrl, {
            clientId: subscriptionDialog._id
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(_ => {
                toast.success(lang === 'en' ? 'Client Unsubscribed' : 'تم الغاء اشتراك العميل');
                setSubscriptionDialog(false);
                // REFRESH THE DATA
                getData(page, clientType,filterType);

                // CLEAR THE ACTION TYPE
                setActionType('');
            })
            .catch(error => {
                console.error(error);
                toast.error(lang === 'en' ? 'Something went wrong' : 'حدث خطأ ما');
            });
    };

    // RENEW  HANDLER
    const RenewHandler = (event) => {
        // STOP THE DEFAULT BEHAVIOR
        event.preventDefault();

        // GET THE TOKEN
        const token = localStorage.getItem('token');

        // clientId, pauseDate, period
        const renewUrl = `${process.env.API_URL}/renew/subscription`; // POST

        // VALIDATION
        if (!selectedBundleToRenew || !infoDialog._id || !selectedBundleToRenew.startingAt) {
            toast.error(lang === 'en' ? 'Please fill all fields' : 'يرجى ملء جميع الحقول');
            return;
        }


        // FORMAT THE DATE TO BE IN THE FORMAT OF DD-MM-YYYY
        const date = new Date(selectedBundleToRenew.startingAt);
        const formattedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;

        // HANDLE RENEW
        axios.post(renewUrl, {
            clientId: infoDialog._id,
            bundleId: selectedBundleToRenew.bundleId,
            startingAt: formattedDate
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(_ => {
                toast.success(lang === 'en' ? 'Bundle Renewed' : 'تم تجديد الباقة');
                // REFRESH THE DATA
                getData(page, clientType,filterType);
                // CLOSE THE DIALOG
                setInfoDialog(false);
                // RESET THE SELECTED BUNDLE
                setSelectedBundleToRenew({
                    clientId: '',
                    bundleId: '',
                    startingAt: ''
                });
            })
            .catch(error => {
                console.error(error);
                toast.error(lang === 'en' ? 'Something went wrong' : 'حدث خطأ ما');
            });
    };

    // DELETE HANDLER
    const DeleteHandler = (event) => {
        // STOP THE DEFAULT BEHAVIOR
        event.preventDefault();

        // GET THE TOKEN
        const token = localStorage.getItem('token');

        // DELETE URL
        const deleteUrl = `${process.env.API_URL}/admin/remove/client`; // DELETE

        // VALIDATION
        if (!deleteDialog?.clientId) {
            toast.error(lang === 'en' ? 'Please fill all fields' : 'يرجى ملء جميع الحقول');
            return;
        }

        // HANDLE DELETE
        axios.delete(deleteUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                clientId: deleteDialog.clientId
            }
        })
            .then(_ => {
                toast.success(lang === 'en' ? 'Client Deleted' : 'تم حذف العميل');
                // REFRESH THE DATA
                getData(page, clientType,filterType);
                // CLOSE THE DIALOG
                setDeleteDialog({
                    clientId: '',
                    visible: false
                });

                // CLEAR THE ACTION TYPE
                setActionType('');
            })
            .catch(error => {
                console.error(error);
                toast.error(lang === 'en' ? 'Something went wrong' : 'حدث خطأ ما');
            });
    };

    // MODIFY SUBSCRIPTION DAYS HANDLER
    const ModifySubscriptionDaysHandler = () => {
        // GET THE TOKEN
        const token = localStorage.getItem('token');

        // MODIFY SUBSCRIPTION DAYS URL
        const modifySubscriptionDaysUrl = `${process.env.API_URL}/modify/subscription/days`; // POST

        // VALIDATION
        if (!daysData?.numberOfDays || !daysData?.action || !daysData?.clientId) {
            toast.error(lang === 'en' ? 'Please fill all fields' : 'يرجى ملء جميع الحقول');
            return;
        }

        // HANDLE MODIFY SUBSCRIPTION DAYS
        axios.post(modifySubscriptionDaysUrl, daysData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(_ => {
                toast.success(lang === 'en' ? 'Days Added or Removed' : 'تمت اضافة او ازالة الايام');

                // REFRESH THE DATA
                getData(page, clientType,filterType);

                // CLEAR THE ACTION TYPE
                setActionType('');

            })
            .catch(error => {
                console.error(error);
                toast.error(lang === 'en' ? 'Something went wrong' : 'حدث خطأ ما');
            });
    };


    // GLOBAL FILTER
    const onGlobalFilter = (e) => {
        setGlobalFilter(e.target.value);
    };

    return (
        <>
            {/*LOAD MORE DATA*/}
            <div className={'card'}>
                <h5>{lang === 'en' ? 'Load More' : 'تحميل المزيد'}</h5>
                <hr />
                <div className={'grid'}>
                    <div className={'col-8'}>
                        <Dropdown
                            value={loadOption}
                            options={[
                                { label: lang === 'en' ? 'Save Old' : 'حفظ القديم', value: 'saveOld' },
                                { label: lang === 'en' ? 'Delete Old' : 'حذف القديم', value: 'deleteOld' }
                            ]}
                            onChange={(e) => {
                                setLoadOption(e.value);
                            }}
                            placeholder={lang === 'en' ? 'Select Option' : 'اختر الخيار'}
                            style={{ width: '100%' }}
                            showClear={true}
                        />
                    </div>
                    <div className={'col-4'}>
                        <Button
                            label={lang === 'en' ? 'Load More' : 'تحميل المزيد'}
                            icon={'pi pi-refresh'}
                            onClick={() => {
                                if (hasMore) {
                                    setPage(page + 1);
                                }
                            }}
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>
            </div>

            {/*FILTER*/}
            <div className={'card'}>
                <h5>{lang === 'en' ? 'Filter' : 'الفلتر'}</h5>
                <hr />

                <div className={'grid'}>
                    <div className={'col-4 flex gap-1'}>
                        <RadioButton
                            value={'isActive'}
                            checked={filterType === 'isActive'}
                            onChange={(e) => {
                                if (e.value !== filterType) {
                                    // RESET THE MORE TO TRUE
                                    setHasMore(true);
                                }
                                setFilterType(e.value);
                            }}
                        />
                        <label>{lang === 'en' ? 'Active' : 'نشط'}</label>
                    </div>
                    <div className={'col-4 flex gap-1'}>
                        <RadioButton
                            value={'isFreezed'}
                            checked={filterType === 'isFreezed'}
                            onChange={(e) => {
                                if (e.value !== filterType) {
                                    // RESET THE MORE TO TRUE
                                    setHasMore(true);
                                }
                                setFilterType(e.value);
                            }}
                        />
                        <label>{lang === 'en' ? 'Freezed' : 'مجمد'}</label>
                    </div>
                    <div className={'col-4 flex gap-1'}>
                        <RadioButton
                            value={'all'}
                            checked={filterType === 'all'}
                            onChange={(e) => {
                                if (e.value !== filterType) {
                                    // RESET THE MORE TO TRUE
                                    setHasMore(true);
                                }
                                setFilterType(e.value);
                            }}
                        />
                        <label>{lang === 'en' ? 'All' : 'الكل'}</label>
                    </div>

                    {/*  SEARCH  */}
                    <div className={'col-12'}>
                        <label
                            htmlFor={'search'}
                            style={{ display: 'block', fontWeight: 'bold' }}
                        >
                            {lang === 'en' ? 'Search' : 'بحث'}
                        </label>
                        <InputText
                            id={'search'}
                            value={globalFilter}
                            onChange={onGlobalFilter}
                            placeholder={lang === 'en' ? 'Search' : 'بحث'}
                            style={{ width: '100%', marginTop: '1rem' }}
                        />
                    </div>
                </div>
            </div>

            <DataTable
                value={clients || []}
                paginator={true}
                rows={50}
                rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
                className="p-datatable-sm"
                globalFilter={globalFilter}
            >
                <Column
                    field="subscriptionId"
                    header={lang === 'en' ? 'ID' : 'رقم الاشتراك'}
                    filter
                    sortable
                />
                <Column
                    field="clientName"
                    header={lang === 'en' ? 'Name' : 'الاسم'}
                    filter
                    sortable
                    style={{ width: 'fit-content', whiteSpace: 'nowrap' }}
                />
                <Column
                    field="clientNameEn"
                    header={lang === 'en' ? 'Name (EN)' : 'الاسم (EN)'}
                    filter
                    sortable
                    style={{ width: 'fit-content', whiteSpace: 'nowrap' }}
                />
                {/*remaining days and colors based on the number*/}
                <Column
                    field="remainingDays"
                    header={lang === 'en' ? 'Remaining Days' : 'الايام المتبقية'}
                    filter
                    sortable
                    body={(rowData) => {
                        return (
                            <Tag
                                value={rowData.remainingDays}
                                severity={rowData.remainingDays <= 0 ? 'danger' : (rowData.remainingDays <= 5 ? 'warning' : 'success')}
                            />
                        );
                    }}
                    style={{ width: 'fit-content', whiteSpace: 'nowrap' }}
                />

                <Column
                    field="subscriped"
                    header={lang === 'en' ? 'Status' : 'الحالة'}
                    filter
                    sortable
                    body={(rowData) => {
                        return (
                            <Tag
                                value={rowData.subscriped ? lang === 'en' ? 'Subscribed' : 'مشترك' : lang === 'en' ? 'Unsubscribed' : 'غير مشترك'}
                                severity={rowData.subscriped ? 'success' : 'danger'}
                            />
                        );
                    }}
                />
                {/*frozen status*/}
                <Column
                    field="clientStatus.paused"
                    header={lang === 'en' ? 'Frozen' : 'مجمد'}
                    filter
                    filterPlaceholder={lang === 'en' ? 'Type True or False' : 'اكتب صح او خطا'}
                    sortable
                    body={(rowData) => {
                        if (!rowData.subscriped && rowData.clientStatus.paused) {
                            return (
                                <Tag
                                    value={lang === 'en' ? 'Paused' : 'مجمد'}
                                    severity={'danger'}
                                />
                            );
                        } else if (!rowData.subscriped && !rowData.clientStatus.paused) {
                            return (
                                <Tag
                                    value={lang === 'en' ? 'Unsubscribed' : 'غير مشترك'}
                                    severity={'danger'}
                                />
                            );
                        } else if (rowData.subscriped && !rowData.clientStatus.paused) {
                            return (
                                <Tag
                                    value={lang === 'en' ? 'Active' : 'نشط'}
                                    severity={'success'}
                                />
                            );
                        }
                    }}
                />

                <Column
                    field="email"
                    header={lang === 'en' ? 'Email' : 'البريد الالكتروني'}
                    filter
                    sortable
                    style={{ width: 'fit-content', whiteSpace: 'nowrap' }}
                />
                <Column
                    field="phoneNumber"
                    header={lang === 'en' ? 'Phone' : 'رقم الهاتف'}
                    filter
                    sortable
                    style={{ width: 'fit-content', whiteSpace: 'nowrap' }}
                />

                {/*  ACTIONS  */}
                <Column
                    field="actions"
                    header={lang === 'en' ? 'Actions' : 'الاجراءات'}
                    style={{ width: 'fit-content', whiteSpace: 'nowrap' }}
                    body={(rowData) => {
                        return (
                            <div className="d-flex justify-content-around">
                                {/*VIEW*/}
                                <button
                                    className="btn btn-sm btn-info"
                                    onClick={() => {
                                        // OPEN THE DIALOG AND GET THE DATA
                                        setInfoDialog(rowData);
                                        // GET THE BUNDLE DATA
                                        getBundleData(rowData._id);
                                        // GET ALL BUNDLES
                                        getBundles();
                                        // GET THE CLIENT ID
                                        setDaysData({ ...daysData, clientId: rowData._id });

                                        // SET THE ACTION TYPE
                                        setActionType('view');
                                    }}
                                >
                                    {lang === 'en' ? 'View' : 'عرض'}
                                </button>

                                {/*FREEZE & UNFREEZE*/}
                                <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => {
                                        // HANDLE FREEZE
                                        setFreezeDialog(rowData);
                                        setFreezeData({
                                            clientId: rowData._id,
                                            pauseDate: '',
                                            period: ''
                                        });

                                        // SET THE ACTION TYPE
                                        setActionType('freeze');
                                    }}
                                >
                                    {lang === 'en' ? (rowData.clientStatus.paused ? 'Unfreeze' : 'freeze') : (rowData.clientStatus.paused ? 'فك التجميد' : 'تجميد')}
                                </button>

                                {/*UNSUBSCRIBE*/}
                                {rowData?.subscriped && (<button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => {
                                        // HANDLE UNSUBSCRIBE
                                        setSubscriptionDialog(rowData);

                                        // SET THE ACTION TYPE
                                        setActionType('unsubscribe');
                                    }}
                                >
                                    {lang === 'en' ? 'Unsubscribe' : 'الغاء الاشتراك'}
                                </button>)}

                                {/*PRINT ADDRESS BUTTON*/}
                                {(rowData?.clientType === 'offline' && rowData?.subscriped) && (<button
                                    className="btn btn-sm btn-tertiary"
                                    onClick={() => {
                                        // HANDLE PRINT ADDRESS
                                        setAddressDialog({
                                            visible: true,
                                            clientId: rowData._id
                                        });
                                    }}
                                >
                                    {lang === 'en' ? 'Print Address' : 'طباعة العنوان'}
                                </button>)}

                                {/*EDIT*/}
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                        // HANDLE EDIT
                                        router.push(`/${lang}/clients/${rowData._id}`);
                                    }}
                                >
                                    {lang === 'en' ? 'Edit' : 'تعديل'}
                                </button>

                                {/*DELETE*/}
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => {
                                        // HANDLE DELETE
                                        setDeleteDialog({
                                            clientId: rowData._id,
                                            visible: true
                                        });

                                        // SET THE ACTION TYPE
                                        setActionType('delete');
                                    }}
                                >
                                    {lang === 'en' ? 'Delete' : 'حذف'}
                                </button>
                            </div>
                        );
                    }}
                />
            </DataTable>

            {/* INFO DIALOG */}
            <Dialog
                visible={infoDialog}
                dir={lang === 'en' ? 'ltr' : 'rtl'}
                header={lang === 'en' ? 'Client Info' : 'معلومات العميل'}
                modal
                maximizable={true}
                onHide={() => {
                    setInfoDialog(false);

                    // CLEAR THE ACTION TYPE
                    setActionType('');
                }}
            >
                {/*QUICK ACTIONS*/}
                <div className={'card mt-2 grid'}>
                    <div className={'col-12'}>
                        <h5>{lang === 'en' ? 'Quick Actions' : 'الاجراءات السريعة'}</h5>
                    </div>
                    {infoDialog.subscriped && (<div className={'col-6'}>
                        {/*CONTRACT*/}
                        <Button
                            label={lang === 'en' ? 'Print Contract' : 'طباعة العقد'}
                            icon={'pi pi-print'}
                            severity={'info'}
                            style={{ width: '100%' }}
                            onClick={() => {
                                // VALIDATION
                                if (!infoDialog.subscriped) {
                                    toast.error(lang === 'en' ? 'This client is not subscribed' : 'هذا العميل غير مشترك');
                                    return;
                                }
                                // VALIDATE IF THE CLIENT ID IS NOT NULL
                                if (!infoDialog._id) {
                                    toast.error(lang === 'en' ? 'Client ID is not valid' : 'رقم العميل غير صحيح');
                                    return;
                                }

                                // HANDLE PRINT CONTRACT
                                axios.get(`${process.env.API_URL}/print/client/contract?clientId=${infoDialog._id}`, {
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    }
                                })
                                    .then(response => {
                                        const contractUrl = response.data?.url;
                                        if (contractUrl) {
                                            window.open(contractUrl, '_blank');
                                        }
                                    })
                                    .catch(error => {
                                        console.error(error);
                                    });
                            }}
                        />
                    </div>)}
                    <div className={`${infoDialog.subscriped ? 'col-6' : 'col-12'}`}>
                        {/*SUBSCRIPTION HISTORY*/}
                        <Button
                            label={lang === 'en' ? 'Subscription History' : 'تاريخ الاشتراكات'}
                            icon={'pi pi-calendar'}
                            severity={'help'}
                            style={{ width: '100%' }}
                            onClick={() => {
                                // VALIDATE IF THE CLIENT ID IS NOT NULL
                                if (!infoDialog._id) {
                                    toast.error(lang === 'en' ? 'Client ID is not valid' : 'رقم العميل غير صحيح');
                                    return;
                                }

                                // HANDLE SUBSCRIPTION HISTORY
                                axios.get(`${process.env.API_URL}/report`, {
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    },
                                    params: {
                                        clientId: infoDialog._id,
                                        reportName: 'clientHistory'
                                    }
                                })
                                    .then(response => {
                                        const reportUrl = response.data?.url;
                                        if (reportUrl) {
                                            window.open(reportUrl, '_blank');
                                        }
                                    })
                                    .catch(error => {
                                        console.error(error);
                                    });
                            }}
                        />
                    </div>
                </div>
                {/* RENEW BUNDLE */}
                <div className={'card mt-2 grid'}>
                    <div className={'col-12'}>
                        <h5>{lang === 'en' ? 'Renew Bundle' : 'تجديد الباقة'}</h5>
                    </div>
                    {/*  RENEW LOGIC  */}
                    <div className={'col-6'}>
                        <label
                            className={'mb-2 inline-block'}>{lang === 'en' ? 'Select Bundle' : 'اختر الباقة'}</label>
                        <Dropdown
                            value={selectedBundleToRenew?.bundleId || ''}
                            options={bundles}
                            onChange={(e) => setSelectedBundleToRenew({
                                ...selectedBundleToRenew,
                                bundleId: e.value
                            })}
                            optionLabel={lang === 'en' ? 'bundleNameEn' : 'bundleName'}
                            optionValue={'_id'}
                            placeholder={lang === 'en' ? 'Select Bundle' : 'اختر الباقة'}
                            style={{ width: '100%' }}
                            className={'mb-2'}
                            filter={true}
                        />
                    </div>
                    <div className={'col-6'}>
                        <label
                            className={'mb-2 inline-block'}>{lang === 'en' ? 'Starting Date' : 'تاريخ البدء'}</label>
                        <Calendar
                            value={selectedBundleToRenew?.startingAt}
                            onChange={(e) => {
                                setSelectedBundleToRenew({ ...selectedBundleToRenew, startingAt: e.target.value });
                            }}
                            showIcon
                            dateFormat="yy-mm-dd"
                            placeholder={lang === 'en' ? 'Select Date' : 'اختر التاريخ'}
                            // MIN DATE IS AFTER 48 HOURS
                            minDate={new Date(new Date().getTime() + 48 * 60 * 60 * 1000)}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className={'col-12'}>
                        <Button
                            label={lang === 'en' ? 'Renew Bundle' : 'تجديد الباقة'}
                            icon={'pi pi-refresh'}
                            severity={'primary'}
                            style={{ width: '100%' }}
                            onClick={RenewHandler}
                        />
                    </div>
                </div>
                {/*ADD OR REMOVE DAYS*/} {/*numberOfDays, action = [add | remove], fridayOption = [true | false], clientId */}
                {infoDialog.subscriped && (<div className={'card mt-2 grid'}>
                    <div className={'col-12'}>
                        <h5>{lang === 'en' ? 'Add or Remove Days' : 'اضافة او ازالة ايام'}</h5>
                    </div>
                    <div className={'col-6'}>
                        <label
                            className={'mb-2 inline-block'}>{lang === 'en' ? 'Action' : 'الاجراء'}</label>
                        <Dropdown
                            value={daysData?.action || ''}
                            options={[
                                { label: lang === 'en' ? 'Add' : 'اضافة', value: 'add' },
                                { label: lang === 'en' ? 'Remove' : 'ازالة', value: 'remove' }
                            ]}
                            onChange={(e) => {
                                setDaysData({ ...daysData, action: e.value });
                            }}
                            placeholder={lang === 'en' ? 'Select Action' : 'اختر الاجراء'}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className={'col-6'}>
                        <label
                            className={'mb-2 inline-block'}>{lang === 'en' ? 'Friday Option' : 'خيار الجمعة'}</label>
                        <Dropdown
                            value={daysData?.fridayOption || ''}
                            options={[
                                { label: lang === 'en' ? 'Yes' : 'نعم', value: true },
                                { label: lang === 'en' ? 'No' : 'لا', value: false }
                            ]}
                            onChange={(e) => {
                                setDaysData({ ...daysData, fridayOption: e.value });
                            }}
                            placeholder={lang === 'en' ? 'Select Option' : 'اختر الخيار'}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className={'col-12'}>
                        <label
                            className={'mb-2 inline-block'}>{lang === 'en' ? 'Number of Days' : 'عدد الايام'}</label>
                        <InputNumber
                            value={0}
                            onChange={(e) => {
                                setDaysData({ ...daysData, numberOfDays: e.value });
                            }}
                            mode="decimal"
                            min={0}
                            max={1000}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className={'col-12'}>
                        <Button
                            label={lang === 'en' ? 'Take Action' : 'تنفيذ الاجراء'}
                            icon={'pi pi-refresh'}
                            severity={'primary'}
                            style={{ width: '100%' }}
                            onClick={ModifySubscriptionDaysHandler}
                        />
                    </div>
                </div>)}
                {/* INFO */}
                <div className={'card grid'}>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'System ID' : 'رقم النظام'}</h5>
                        <p
                            style={{
                                color: infoDialog.subscriped ? 'green' : 'red',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                            // COPY TO CLIPBOARD
                            onClick={() => {
                                navigator.clipboard.writeText(infoDialog._id);
                                toast.success(lang === 'en' ? 'Copied' : 'تم النسخ');
                            }}
                        >
                            {infoDialog._id}
                        </p>
                    </div>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Subscription ID' : 'رقم الاشتراك'}</h5>
                        <p
                            style={{
                                color: infoDialog.subscriped ? 'blue' : 'red',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                            // COPY TO CLIPBOARD
                            onClick={() => {
                                navigator.clipboard.writeText(infoDialog.subscriptionId);
                                toast.success(lang === 'en' ? 'Copied' : 'تم النسخ');
                            }}
                        >
                            {infoDialog.subscriptionId}
                        </p>
                    </div>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Name' : 'الاسم'}</h5>
                        <p>{infoDialog.clientName}</p>
                    </div>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Name (EN)' : 'الاسم (EN)'}</h5>
                        <p>{infoDialog.clientNameEn}</p>
                    </div>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Email' : 'البريد الالكتروني'}</h5>
                        <p>{infoDialog.email}</p>
                    </div>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Phone' : 'رقم الهاتف'}</h5>
                        <p
                            style={{
                                color: 'blue',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                            // COPY TO CLIPBOARD
                            onClick={() => {
                                navigator.clipboard.writeText(infoDialog.phoneNumber);
                                toast.success(lang === 'en' ? 'Copied' : 'تم النسخ');
                            }}
                        >
                            {infoDialog.phoneNumber}
                        </p>
                    </div>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Status' : 'الحالة'}</h5>
                        <Tag
                            value={infoDialog.subscriped ? lang === 'en' ? 'Subscribed' : 'مشترك' : lang === 'en' ? 'Unsubscribed' : 'غير مشترك'}
                            severity={infoDialog.subscriped ? 'success' : 'danger'}
                        />
                    </div>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Gender' : 'الجنس'}</h5>
                        <p>
                            {infoDialog.gender}
                        </p>
                    </div>
                    {/*  ACCOUNT CREATED AT  */}
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Account Created At' : 'تاريخ الانشاء'}</h5>
                        <p>{infoDialog.createdAt}</p>
                    </div>
                </div>
                {/*  ADDRESS  */}
                <div className={'card grid'}>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Governorate' : 'المحافظة'}</h5>
                        <p>{infoDialog.governorate}</p>
                    </div>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Distrect' : 'الحي'}</h5>
                        <p>{infoDialog.distrect}</p>
                    </div>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Street' : 'الشارع'}</h5>
                        <p>{infoDialog.streetName}</p>
                    </div>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Alley' : 'الزقاق'}</h5>
                        <p>{infoDialog.alley}</p>
                    </div>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Building' : 'المبنى'}</h5>
                        <p>{infoDialog.homeNumber}</p>
                    </div>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Floor' : 'الطابق'}</h5>
                        <p>{infoDialog.floorNumber}</p>
                    </div>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Apartment' : 'الشقة'}</h5>
                        <p>{infoDialog.appartment}</p>
                    </div>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Apartment Number' : 'رقم الشقة'}</h5>
                        <p>{infoDialog.appartmentNo}</p>
                    </div>
                    <div className={'col-12'}>
                        <h5>{lang === 'en' ? 'Landmark' : 'العلامة المميزة'}</h5>
                        <p>{infoDialog.landmark}</p>
                    </div>
                </div>
                {/*  Bundle  */}
                <div className={'card grid'}>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Bundle Name' : 'اسم الباقة'}</h5>
                        <p>{fullBundleData?.bundleName || ''}</p>
                    </div>

                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Bundle Name (EN)' : 'اسم الباقة (EN)'}</h5>
                        <p>{fullBundleData?.bundleNameEn || ''}</p>
                    </div>

                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Bundle Days' : 'عدد الايام'}</h5>
                        <p>{fullBundleData?.bundleDays || ''}</p>
                    </div>

                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Remaining Days' : 'الايام المتبقية'}</h5>
                        <p>{fullBundleData?.remainingDays || ''}</p>
                    </div>

                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Start Date' : 'تاريخ البدء'}</h5>
                        <p>
                            {
                                new Date(fullBundleData?.startDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                            }
                        </p>
                    </div>
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'End Date' : 'تاريخ الانتهاء'}</h5>
                        <p>{
                            new Date(fullBundleData?.endDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })
                        }</p>
                    </div>
                    {/*  FREEZE STATUS  */}
                    <div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Frozen' : 'مجمد'}</h5>
                        <p>{infoDialog?.clientStatus?.paused ? lang === 'en' ? 'Paused' : 'مجمد' : lang === 'en' ? 'Active' : 'نشط'}</p>
                    </div>
                    {/*  IF FREEZED SHOW THE FREEZE DATE  */}
                    {infoDialog?.clientStatus?.paused && (<div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Freeze Date' : 'تاريخ التجميد'}</h5>
                        <p>
                            {
                                new Date(infoDialog?.clientStatus?.pauseDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                            }
                        </p>
                    </div>)}
                    {/*  IF FREEZED SHOW THE FREEZE DAYS NUMBER  */}
                    {infoDialog?.clientStatus?.paused && (<div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Freeze Days' : 'عدد الايام المجمدة'}</h5>
                        <p>{infoDialog?.clientStatus?.pauseCounter} {lang === 'en' ? 'Days' : 'ايام'}</p>
                    </div>)}
                </div>
            </Dialog>

            {/* FREEZE DIALOG */}
            <Dialog
                visible={freezeDialog}
                dir={lang === 'en' ? 'ltr' : 'rtl'}
                header={!freezeDialog?.clientStatus?.paused ? (lang === 'en' ? 'Freeze Subscription' : 'تجميد الاشتراك') : (lang === 'en' ? 'Unfreeze Subscription' : 'فك تجميد الاشتراك')}
                modal
                onHide={() => {
                    setFreezeDialog(false);
                    setFreezeData({
                        clientId: '',
                        pauseDate: '',
                        period: ''
                    });

                    // CLEAR THE ACTION TYPE
                    setActionType('');
                }}
            >
                <div className={'grid mt-2'}>
                    <div className={`${!freezeDialog?.clientStatus?.paused ? 'col-6' : 'col-12'}`}>
                        {!freezeDialog?.clientStatus?.paused && (
                            <h5>{lang === 'en' ? 'Pause Date' : 'تاريخ التجميد'}</h5>)}
                        {freezeDialog?.clientStatus?.paused && (
                            <h5>{lang === 'en' ? 'Activation Date' : 'تاريخ التفعيل'}</h5>)}
                        <Calendar
                            value={freezeData.pauseDate}
                            onChange={(e) => setFreezeData({ ...freezeData, pauseDate: e.target.value })}
                            showIcon
                            dateFormat="yy-mm-dd"
                            placeholder={lang === 'en' ? 'Select Date' : 'اختر التاريخ'}
                            // MIN DATE IS AFTER 48 HOURS
                            minDate={!freezeDialog?.clientStatus?.paused ? new Date(new Date().getTime() + 24 * 60 * 60 * 1000) : new Date(freezeDialog?.clientStatus?.pauseDate)}
                            style={{ width: '100%' }}
                        />
                    </div>
                    {!freezeDialog?.clientStatus?.paused && (<div className={'col-6'}>
                        <h5>{lang === 'en' ? 'Period' : 'المدة'}</h5>
                        <InputNumber
                            value={freezeData.period}
                            onChange={(e) => setFreezeData({ ...freezeData, period: e.value })}
                            mode="decimal"
                            min={1}
                            max={365}
                            placeholder={lang === 'en' ? 'Enter Days' : 'ادخل الايام'}
                            style={{ width: '100%' }}
                        />
                    </div>)}
                    <div className={'col-12'}>
                        <Button
                            label={lang === 'en' ? freezeDialog?.clientStatus?.paused ? 'Unfreeze' : 'Freeze' : freezeDialog?.clientStatus?.paused ? 'فك التجميد' : 'تجميد'}
                            icon={'pi pi-power-off'}
                            severity={'primary'}
                            style={{ width: '100%' }}
                            onClick={() => {
                                // HANDLE FREEZE
                                if (freezeDialog?.clientStatus?.paused) {
                                    UnFreezeHandler();
                                } else {
                                    FreezeHandler();
                                }
                            }}
                        />
                    </div>
                </div>
            </Dialog>

            {/* SUBSCRIPTION DIALOG */}
            <Dialog
                visible={subscriptionDialog}
                dir={lang === 'en' ? 'ltr' : 'rtl'}
                header={lang === 'en' ? 'Subscription' : 'الاشتراك'}
                modal
                onHide={() => {
                    setSubscriptionDialog(false);

                    // CLEAR THE ACTION TYPE
                    setActionType('');
                }}
            >
                <p>
                    {lang === 'en' ? 'Are you sure you want to unsubscribe this client?' : 'هل انت متأكد من الغاء اشتراك هذا العميل؟'}
                </p>
                <Button
                    label={lang === 'en' ? 'Unsubscribe' : 'الغاء الاشتراك'}
                    icon={'pi pi-trash'}
                    severity={'danger'}
                    style={{ width: '100%' }}
                    onClick={() => {
                        // HANDLE UNSUBSCRIBE
                        UnsubscribeHandler();
                    }}
                />
            </Dialog>

            {/* ADDRESS DIALOG */}
            <Dialog
                visible={addressDialog.visible}
                dir={lang === 'en' ? 'ltr' : 'rtl'}
                header={lang === 'en' ? 'Print Address' : 'طباعة العنوان'}
                modal
                onHide={() => {
                    setAddressDialog({
                        visible: false
                    });

                    // CLEAR THE ACTION TYPE
                    setActionType('');
                }}
                style={{
                    width: '100%',
                    maxWidth: '500px'
                }}
            >
                <div className={'grid'}>
                    <div className={'col-12'}>
                        <Button
                            label={lang === 'en' ? 'Print' : 'طباعة'}
                            icon={'pi pi-print'}
                            severity={'primary'}
                            style={{ width: '100%' }}
                            onClick={() => {

                                if (!addressDialog?.clientId) {
                                    toast.error(lang === 'en' ? 'Client ID is not valid' : 'رقم العميل غير صحيح');
                                    return;
                                }

                                // HANDLE PRINT ADDRESS
                                axios.get(`${process.env.API_URL}/print/offline/address`, {
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    },
                                    params: {
                                        clientId: addressDialog?.clientId
                                    }
                                })
                                    .then(response => {
                                        const addressUrl = response.data?.url;
                                        if (addressUrl) {
                                            window.open(addressUrl, '_blank');
                                        }
                                    })
                                    .catch(error => {
                                        console.error(error);
                                    });
                            }}
                        />
                    </div>
                </div>
            </Dialog>

            {/* DELETE DIALOG */}
            <Dialog
                visible={deleteDialog.visible}
                dir={lang === 'en' ? 'ltr' : 'rtl'}
                header={lang === 'en' ? 'Delete Client' : 'حذف العميل'}
                modal
                onHide={() => {
                    setDeleteDialog({
                        clientId: '',
                        visible: false
                    });

                    // CLEAR THE ACTION TYPE
                    setActionType('');
                }}
            >
                <p>
                    {lang === 'en' ? 'Are you sure you want to delete this client?' : 'هل انت متأكد من حذف هذا العميل؟'}
                </p>
                <Button
                    label={lang === 'en' ? 'Delete' : 'حذف'}
                    icon={'pi pi-trash'}
                    severity={'danger'}
                    style={{ width: '100%' }}
                    onClick={DeleteHandler}
                />
            </Dialog>
        </>
    );
}