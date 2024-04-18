'use client';

import { useEffect, useState } from 'react';
// PRIME REACT
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Badge } from 'primereact/badge';
import {Tag} from "primereact/tag";

// HELPERS
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function CouponsList({ lang }) {

    // STATES
    const [coupons, setCoupons] = useState([]);
    const [selectedCouponToDelete, setSelectedCouponToDelete] = useState(null);
    const [selectedCouponToEdit, setSelectedCouponToEdit] = useState(null);

    // EFFECT TO FETCH DATA
    useEffect(() => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // API CALL /coupons
        axios.get(`${process.env.API_URL}/all/coupons?page=1`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setCoupons(res.data);
            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Failed to fetch coupons' : 'فشل في جلب الكوبونات');
            });
    }, []);

    // EDIT COUPON
    const editCoupon = (coupon) => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE THE COUPON
        if (!coupon) {
            toast.error(lang === 'en' ? 'Coupon not found' : 'الكوبون غير موجود');
            return;
        }

        // API CALL /coupons
        axios.put(`${process.env.API_URL}/set/coupon/expired`, {
            couponId: selectedCouponToEdit._id,
            status: !selectedCouponToEdit.status
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setCoupons(res.data);
                setSelectedCouponToEdit(null);
                toast.success(lang === 'en' ? 'Coupon status changed successfully' : 'تم تغيير حالة الكوبون بنجاح');
            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Failed to change coupon status' : 'فشل في تغيير حالة الكوبون');
            });
    };

    // DELETE COUPON
    const deleteCoupon = (coupon) => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE THE COUPON
        if (!coupon) {
            toast.error(lang === 'en' ? 'Coupon not found' : 'الكوبون غير موجود');
            return;
        }

        // API CALL /coupons
        axios.delete(`${process.env.API_URL}/delete/coupon`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                couponId: selectedCouponToDelete._id
            }
        })
            .then(res => {
                setCoupons(res.data);
                setSelectedCouponToDelete(null);
                toast.success(lang === 'en' ? 'Coupon deleted successfully' : 'تم حذف الكوبون بنجاح');
            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Failed to delete coupon' : 'فشل في حذف الكوبون');
            });
    };


    return (
        <>
            <div className="card">
                <DataTable
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                    // value={coupons || []}
                    value={[
                        {
                            _id: '1',
                            couponText: 'COUPON1',
                            discountType: 'amount',
                            discountAmount: 10,
                            hasExpiry: true,
                            expiryDate: '2022-01-01',
                            hasUsageNumber: true,
                            usageNumber: 10,
                            numberOfCodes: 10
                        },
                        {
                            _id: '2',
                            couponText: 'COUPON2',
                            discountType: 'ratio',
                            discountAmount: 10,
                            hasExpiry: false,
                            expiryDate: '2022-01-01',
                            hasUsageNumber: false,
                            usageNumber: 10,
                            numberOfCodes: 10
                        },
                        {
                            _id: '3',
                            couponText: 'COUPON3',
                            discountType: 'amount',
                            discountAmount: 10,
                            hasExpiry: true,
                            expiryDate: '2022-01-01',
                            hasUsageNumber: true,
                            usageNumber: 10,
                            numberOfCodes: 10
                        },
                        {
                            _id: '4',
                            couponText: 'COUPON4',
                            discountType: 'ratio',
                            discountAmount: 10,
                            hasExpiry: false,
                            expiryDate: '2022-01-01',
                            hasUsageNumber: false,
                            usageNumber: 10,
                            numberOfCodes: 10
                        },
                        {
                            _id: '5',
                            couponText: 'COUPON5',
                            discountType: 'amount',
                            discountAmount: 10,
                            hasExpiry: true,
                            expiryDate: '2022-01-01',
                            hasUsageNumber: true,
                            usageNumber: 10,
                            numberOfCodes: 10
                        },
                        {
                            _id: '6',
                            couponText: 'COUPON6',
                            discountType: 'ratio',
                            discountAmount: 10,
                            hasExpiry: false,
                            expiryDate: '2022-01-01',
                            hasUsageNumber: false,
                            usageNumber: 10,
                            numberOfCodes: 10
                        },
                        {
                            _id: '7',
                            couponText: 'COUPON7',
                            discountType: 'amount',
                            discountAmount: 10,
                            hasExpiry: true,
                            expiryDate: '2022-01-01',
                            hasUsageNumber: true,
                            usageNumber: 10,
                            numberOfCodes: 10
                        },
                        {
                            _id: '8',
                            couponText: 'COUPON8',
                            discountType: 'ratio',
                            discountAmount: 10,
                            hasExpiry: false,
                            expiryDate: '2022-01-01',
                            hasUsageNumber: false,
                            usageNumber: 10,
                            numberOfCodes: 10
                        },
                        {
                            _id: '9',
                            couponText: 'COUPON9',
                            discountType: 'amount',
                            discountAmount: 10,
                            hasExpiry: true,
                            expiryDate: '2022-01-01',
                            hasUsageNumber: true,
                            usageNumber: 10,
                            numberOfCodes: 10
                        }]}
                    paginator
                    rows={25}
                    rowsPerPageOptions={[25, 50, 100]}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    header={lang === 'en' ? 'COUPONS' : 'الكوبونات'}
                    emptyMessage={lang === 'en' ? 'No coupons found' : 'لم يتم العثور على كوبونات'}
                    className="p-datatable-sm"
                >
                    <Column
                        field={''}
                        header={lang === 'en' ? '#' : '#'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by #' : 'ابحث بالرقم'}
                        style={{ whiteSpace: 'nowrap' }}
                        // SHOW THE INDEX
                        body={(rowData, index) => {
                            console.log(rowData, index);
                            return (
                                <div>
                                    {index.rowIndex + 1}
                                </div>
                            );
                        }}
                    />
                    <Column
                        field="couponText"
                        header={lang === 'en' ? 'Coupon Text' : 'نص الكوبون'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by Coupon Text' : 'ابحث بنص الكوبون'}
                        style={{ whiteSpace: 'nowrap' }}
                        // CUSTOM BODY TO ADD THE COPY CODE ON CLICK
                        body={(rowData) => {
                            return (
                                <div className={'flex justify-between'}>
                                    <p
                                        onClick={() => {
                                            navigator.clipboard.writeText(rowData.couponText);
                                            toast.success(lang === 'en' ? 'Copied to clipboard' : 'تم النسخ إلى الحافظة');
                                        }}
                                        style={{ cursor: 'pointer', color: '#6f3ee6', fontWeight: 'bold' }}
                                    >
                                        {rowData.couponText}
                                    </p>
                                </div>
                            );
                        }}
                    />
                    <Column
                        field="discountType"
                        header={lang === 'en' ? 'Discount Type' : 'نوع الخصم'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by Discount Type' : 'ابحث بنوع الخصم'}
                        style={{ whiteSpace: 'nowrap' }}
                        // CUSTOM BODY TO SHOW THE DISCOUNT TYPE INSTEAD OF THE VALUE
                        body={(rowData) => {
                            return (
                                <Tag
                                    value={rowData.discountType === 'amount' ? lang === 'en' ? 'Amount' : 'قيمة' : lang === 'en' ? 'Ratio' : 'نسبة'}
                                    severity={rowData.discountType === 'amount' ? 'success' : 'info'}
                                    style={{ fontSize: '12px', fontWeight: '400' }} />
                            );
                        }}
                    />
                    <Column
                        field="discountAmount"
                        header={lang === 'en' ? 'Discount Amount' : 'قيمة الخصم'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by Discount Amount' : 'ابحث بقيمة الخصم'}
                        style={{ whiteSpace: 'nowrap' }}
                        // CUSTOM BODY TO SHOW THE DISCOUNT AMOUNT WITH THE TYPE
                        body={(rowData) => {
                            return (
                                <div>
                                    {rowData.discountAmount} {rowData.discountType === 'amount' ? lang === 'en' ? 'kwd' : 'دينار' : '%'}
                                </div>
                            );
                        }}
                    />
                    <Column
                        field="hasExpiry"
                        header={lang === 'en' ? 'Has Expiry' : 'له تاريخ انتهاء'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by Has Expiry' : 'ابحث بله تاريخ انتهاء'}
                        style={{ whiteSpace: 'nowrap' }}
                        // SHOW THE HAS EXPIRY AS A CHECK MARK
                        body={(rowData) => {
                            return (
                                <div>
                                    {rowData.hasExpiry ? '✅' : '❌'}
                                </div>
                            );
                        }}
                    />
                    <Column
                        field="expiryDate"
                        header={lang === 'en' ? 'Expiry Date' : 'تاريخ الانتهاء'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by Expiry Date' : 'ابحث بتاريخ الانتهاء'}
                        style={{ whiteSpace: 'nowrap' }}
                    />
                    <Column
                        field="hasUsageNumber"
                        header={lang === 'en' ? 'Has Usage Number' : 'له عدد استخدامات'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by Has Usage Number' : 'ابحث بله عدد استخدامات'}
                        style={{ whiteSpace: 'nowrap' }}
                        // SHOW THE HAS USAGE NUMBER AS A CHECK MARK
                        body={(rowData) => {
                            return (
                                <div>
                                    {rowData.hasUsageNumber ? '✅' : '❌'}
                                </div>
                            );
                        }}
                    />
                    <Column
                        field="usageNumber"
                        header={lang === 'en' ? 'Usage Number' : 'عدد الاستخدامات'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by Usage Number' : 'ابحث بعدد الاستخدامات'}
                        style={{ whiteSpace: 'nowrap' }}
                    />
                    <Column
                        field="numberOfCodes"
                        header={lang === 'en' ? 'Number of Codes' : 'عدد الكودات'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by Number of Codes' : 'ابحث بعدد الكودات'}
                        style={{ whiteSpace: 'nowrap' }}
                    />
                    {/*  ACTIONS  */}
                    <Column
                        body={(rowData) => {
                            return (
                                <div className={'flex justify-center'}>
                                    <button
                                        className={'AMB_btn AMB_btn-primary'}
                                        onClick={() => setSelectedCouponToEdit(rowData)}
                                    >
                                        {lang === 'en' ? 'Edit' : 'تعديل'}
                                    </button>
                                    <button
                                        className={'AMB_btn AMB_btn-danger'}
                                        onClick={() => setSelectedCouponToDelete(rowData)}
                                    >
                                        {lang === 'en' ? 'Delete' : 'حذف'}
                                    </button>
                                </div>
                            );
                        }}
                        header={lang === 'en' ? 'Actions' : 'الإجراءات'}
                        style={{ width: '10%' }}
                    />
                </DataTable>

                {/* DELETE DIALOG */}
                <Dialog
                    visible={selectedCouponToDelete}
                    onHide={() => setSelectedCouponToDelete(null)}
                    header={lang === 'en' ? 'Delete Coupon' : 'حذف الكوبون'}
                    footer={(
                        <div className={'flex justify-center'}>
                            <button
                                className={'AMB_btn AMB_btn-danger'}
                                onClick={() => deleteCoupon(selectedCouponToDelete)}
                            >
                                {lang === 'en' ? 'Delete' : 'حذف'}
                            </button>
                            <button className={'AMB_btn AMB_btn-primary'}
                                    onClick={() => setSelectedCouponToDelete(null)}>
                                {lang === 'en' ? 'Cancel' : 'إلغاء'}
                            </button>
                        </div>
                    )}
                    position={'center'}
                    style={{ width: '100%', maxWidth: '500px' }}
                    draggable={false}
                    resizable={false}
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                >
                    <div className={'flex justify-center'}>
                        <p>{lang === 'en' ? 'Are you sure you want to delete this coupon?' : 'هل أنت متأكد أنك تريد حذف هذا الكوبون؟'}</p>
                    </div>
                </Dialog>

                {/* EDIT DIALOG */}
                <Dialog
                    visible={selectedCouponToEdit}
                    onHide={() => setSelectedCouponToEdit(null)}
                    header={lang === 'en' ? 'Edit Coupon' : 'تعديل الكوبون'}
                    footer={(
                        <div className={'flex justify-center'}>
                            <button
                                className={'AMB_btn AMB_btn-primary'}
                                onClick={() => editCoupon(selectedCouponToEdit)}
                            >
                                {lang === 'en' ? 'Save' : 'حفظ'}
                            </button>
                            <button className={'AMB_btn AMB_btn-danger'}
                                    onClick={() => setSelectedCouponToEdit(null)}>
                                {lang === 'en' ? 'Cancel' : 'إلغاء'}
                            </button>
                        </div>
                    )}
                    position={'center'}
                    style={{ width: '100%', maxWidth: '500px' }}
                    draggable={false}
                    resizable={false}
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                >
                    <div className={'flex justify-center'}>
                        <p>{lang === 'en' ? 'Are you sure you want to change the status of this coupon?' : 'هل أنت متأكد أنك تريد تغيير حالة هذا الكوبون؟'}</p>
                    </div>
                </Dialog>
            </div>
        </>
    );
}