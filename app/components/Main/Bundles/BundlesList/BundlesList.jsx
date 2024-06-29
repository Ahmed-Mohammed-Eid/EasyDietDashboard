'use client';

import { useEffect, useState } from 'react';
// PRIME REACT
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';

// HELPERS
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import isValidImageUrl from '../../../../../helpers/isValidImageUrl';

export default function BundlesList({ lang }) {

    // ROUTER
    const router = useRouter();

    // STATES
    const [bundles, setBundles] = useState([]);
    const [selectedBundleToDelete, setSelectedBundleToDelete] = useState(null);
    const [selectedBundleToView, setSelectedBundleToView] = useState(null);

    // EFFECT TO FETCH DATA
    useEffect(() => {
        getBundles();
    }, [lang]);

    // GET BUNDLES FUNCTION
    const getBundles = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // API CALL /bundles
        axios.get(`${process.env.API_URL}/get/bundles`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                const bundles = res.data?.bundles || [];
                setBundles(bundles);
            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Failed to fetch bundles' : 'فشل في جلب الباقات');
            });
    }

    // DELETE BUNDLE
    const deleteBundle = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE THE BUNDLE
        if (!selectedBundleToDelete) {
            return toast.error(lang === 'en' ? 'Please select a bundle to delete' : 'يرجى تحديد باقة لحذفها');
        }

        // API CALL /bundles
        axios.delete(`${process.env.API_URL}/delete/bundle`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                bundleId: selectedBundleToDelete?._id
            }
        })
            .then(_ => {
                setSelectedBundleToDelete(null);
                toast.success(lang === 'en' ? 'Bundle deleted successfully' : 'تم حذف الباقة بنجاح');
                getBundles();
            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Failed to delete bundle' : 'فشل في حذف الباقة');
            });
    };


    return (
        <>
            <div className="card">
                <DataTable
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                    value={bundles || []}
                    paginator
                    rows={25}
                    rowsPerPageOptions={[25, 50, 100]}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    header={lang === 'en' ? 'BUNDLES' : 'الباقات'}
                    emptyMessage={lang === 'en' ? 'No bundles found' : 'لم يتم العثور على باقات'}
                    className="p-datatable-sm"
                >
                    {/* IMAGE */}
                    <Column
                        field="bundleImageMale"
                        header={lang === 'en' ? 'Male Image' : 'صورة الذكر'}
                        style={{ whiteSpace: 'nowrap' }}
                        body={(rowData) => {
                            return (
                                <Image
                                    src={isValidImageUrl(rowData.bundleImageMale) ? rowData.bundleImageMale : '/assets/404.jpg'}
                                    // src={rowData.bundleImageMale}
                                    alt={rowData.bundleName}
                                    width={50}
                                    height={50}
                                    style={{
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '1px solid #ccc',
                                        width: '50px',
                                        height: '50px',
                                        overflow: 'hidden'
                                    }}
                                />
                            );
                        }}
                    />

                    <Column
                        field="bundleImageFemale"
                        header={lang === 'en' ? "Female Image" : "صورة الأنثى"}
                        style={{ whiteSpace: 'nowrap' }}
                        body={(rowData) => {
                            return (
                                <Image
                                    src={isValidImageUrl(rowData.bundleImageFemale) ? rowData.bundleImageFemale : '/assets/404.jpg'}
                                    alt={rowData.bundleName}
                                    width={50}
                                    height={50}
                                    style={{
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '1px solid #ccc',
                                        width: '50px',
                                        height: '50px',
                                        overflow: 'hidden'
                                    }}
                                />
                            );
                        }}
                    />

                    <Column
                        field="bundleNameEn"
                        header={lang === 'en' ? 'Bundle Title (EN)' : 'اسم الباقة (EN)'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by Bundle Title (EN)' : 'ابحث بالاسم (EN)'}
                        style={{ whiteSpace: 'nowrap' }}
                    />
                    <Column
                        field="bundleName"
                        header={lang === 'en' ? 'Bundle Title' : 'اسم الباقة'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by Bundle Title' : 'ابحث بالاسم'}
                        style={{ whiteSpace: 'nowrap' }}
                    />
                    {/* BUNDLE STATUS */}
                    <Column
                        field="deActivate"
                        header={lang === 'en' ? 'Status' : 'الحالة'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by Status' : 'ابحث بالحالة'}
                        style={{ whiteSpace: 'nowrap' }}
                        body={(rowData) => {
                            return (
                                <Tag value={lang === 'en' ? rowData.deActivate ? 'Deactivated' : 'Activated' : rowData.deActivate ? 'تم تعطيلها' : 'تم تفعيلها'} severity={rowData.deActivate  ? 'danger' : 'success'}/>
                            );
                        }}
                    />
                    
                    <Column
                        field="bundlePrice"
                        header={lang === 'en' ? 'Price' : 'السعر'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by Price' : 'ابحث بالسعر'}
                        style={{ whiteSpace: 'nowrap' }}
                        body={(rowData) => {
                            return (
                                <div>
                                    <span className={"font-bold"}>{rowData.bundlePrice}</span> {lang === 'en' ? 'KWD' : 'دينار'}
                                </div>
                            );
                        }}
                    />
                    <Column
                        field="mealsType"
                        header={lang === 'en' ? 'Meals Type' : 'نوع الوجبات'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by Meals Type' : 'ابحث بنوع الوجبات'}
                        style={{ whiteSpace: 'nowrap' }}
                        body={(rowData) => {
                            return (
                                <div className={'flex gap-1'}>
                                    {
                                        rowData.mealsType.map((type, index) => (
                                            <Tag key={index} value={type} severity={
                                                type === 'افطار' ? 'info' :
                                                    type === 'غداء' ? 'success' :
                                                        type === 'عشاء' ? 'warning' :
                                                            type === 'سناك' ? 'danger' : 'info'

                                            } />
                                        ))
                                    }
                                </div>
                            );
                        }}
                    />
                    {/*  ACTIONS  */}
                    <Column
                        body={(rowData) => {
                            return (
                                <div className={'flex justify-center'}>
                                    <button
                                        className={'AMB_btn AMB_btn-info'}
                                        onClick={() => setSelectedBundleToView(rowData)}
                                    >
                                        {lang === 'en' ? 'View' : 'عرض'}
                                    </button>
                                    <button
                                        className={'AMB_btn AMB_btn-primary'}
                                        onClick={() => router.push((`/${lang}/bundles/${rowData._id}`))}
                                    >
                                        {lang === 'en' ? 'Edit' : 'تعديل'}
                                    </button>
                                    <button
                                        className={'AMB_btn AMB_btn-danger'}
                                        onClick={() => setSelectedBundleToDelete(rowData)}
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
                    visible={selectedBundleToDelete}
                    onHide={() => setSelectedBundleToDelete(null)}
                    header={lang === 'en' ? 'Delete Bundle' : 'حذف الباقة'}
                    footer={(
                        <div className={'flex justify-center'}>
                            <button
                                className={'AMB_btn AMB_btn-danger'}
                                onClick={() => deleteBundle(selectedBundleToDelete)}
                            >
                                {lang === 'en' ? 'Delete' : 'حذف'}
                            </button>
                            <button className={'AMB_btn AMB_btn-primary'}
                                    onClick={() => setSelectedBundleToDelete(null)}>
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
                        <p>{lang === 'en' ? 'Are you sure you want to delete this bundle?' : 'هل أنت متأكد أنك تريد حذف هذه الباقة؟'}</p>
                    </div>
                </Dialog>

                {/*  VIEW DIALOG  */}
                <Dialog
                    visible={selectedBundleToView}
                    onHide={() => setSelectedBundleToView(null)}
                    header={lang === 'en' ? 'View Bundle' : 'عرض الباقة'}
                    footer={(
                        <div className={'flex justify-center'}>
                            <button className={'AMB_btn AMB_btn-primary'}
                                    onClick={() => setSelectedBundleToView(null)}>
                                {lang === 'en' ? 'Close' : 'إغلاق'}
                            </button>
                        </div>
                    )}
                    position={'center'}
                    style={{ width: '100%', maxWidth: '500px' }}
                    draggable={false}
                    resizable={false}
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                >
                    <div className="grid col-12">
                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Bundle Male Image' : 'صورة الذكر'}</div>
                            <div>
                                <Image
                                    // src={selectedBundleToView?.bundleImageMale}
                                    src={isValidImageUrl(selectedBundleToView?.bundleImageMale) ? selectedBundleToView?.bundleImageMale : '/assets/404.jpg'}
                                    alt={selectedBundleToView?.bundleName}
                                    width={100}
                                    height={100}
                                    style={{
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '1px solid #ccc',
                                        width: '100px',
                                        height: '100px',
                                        overflow: 'hidden'
                                    }}
                                />
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Bundle Female Image' : 'صورة الأنثى'}</div>
                            <div>
                                <Image
                                    // src={selectedBundleToView?.bundleImageFemale}
                                    src={isValidImageUrl(selectedBundleToView?.bundleImageFemale) ? selectedBundleToView?.bundleImageFemale : '/assets/404.jpg'}
                                    alt={selectedBundleToView?.bundleName}
                                    width={100}
                                    height={100}
                                    style={{
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '1px solid #ccc',
                                        width: '100px',
                                        height: '100px',
                                        overflow: 'hidden'
                                    }}
                                />
                            </div>
                        </div>

                        <div className="col-6">
                            <div
                                className="font-bold mb-2">{lang === 'en' ? 'Bundle Title (EN)' : 'اسم الباقة (EN)'}</div>
                            <div>{selectedBundleToView?.bundleNameEn}</div>
                        </div>
                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Bundle Title' : 'اسم الباقة'}</div>
                            <div>{selectedBundleToView?.bundleName}</div>
                        </div>

                        {/*PRICE*/}
                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Price' : 'السعر'}</div>
                            <div>
                                <span className={"font-bold"}>{selectedBundleToView?.bundlePrice}</span> {lang === 'en' ? 'KWD' : 'دينار'}
                            </div>
                        </div>

                        {/* bundleOffer Tag with the offer value */}
                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Offer' : 'العرض'}</div>
                            <div>
                                {
                                    +selectedBundleToView?.bundleOffer > 0 ? <Tag value={selectedBundleToView?.bundleOffer} severity={'success'} /> : <Tag value={lang === 'en' ? 'No Offer' : 'لا يوجد عرض'} severity={'warning'} />
                                }
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Meals Type' : 'نوع الوجبات'}</div>
                            <div className={'flex gap-1'}>
                                {
                                    selectedBundleToView?.mealsType.map((type, index) => {
                                        return (
                                        <Tag key={index} value={type} severity={
                                            type === 'افطار' ? 'info' :
                                                type === 'غداء' ? 'success' :
                                                    type === 'عشاء' ? 'warning' :
                                                        type === 'سناك' ? 'danger' : 'info'

                                        } />
                                    )})
                                }
                            </div>
                        </div>

                        {/*  fridayOption  */}
                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Friday Option' : 'خيار الجمعة'}</div>
                            <div>
                                {
                                    selectedBundleToView?.fridayOption ? <Tag value={lang === 'en' ? 'Available' : 'متاح'} severity={'success'} /> : <Tag value={lang === 'en' ? 'Not Available' : 'غير متاح'} severity={'danger'} />
                                }
                            </div>
                        </div>

                        {/*  mealsNumber  */}
                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Meals Number' : 'عدد الوجبات'}</div>
                            <div>{selectedBundleToView?.mealsNumber}</div>
                        </div>

                        {/*  snacksNumber  */}
                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Snacks Number' : 'عدد السناك'}</div>
                            <div>{selectedBundleToView?.snacksNumber}</div>
                        </div>

                        {/*  Period  */}
                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Period' : 'المدة'}</div>
                            <div>
                                {
                                    selectedBundleToView?.bundlePeriod === 1 ? lang === 'en' ? '1 Week' : 'أسبوع واحد' :
                                    selectedBundleToView?.bundlePeriod === 2 ? lang === 'en' ? '2 Weeks' : 'أسبوعين' :
                                    selectedBundleToView?.bundlePeriod === 3 ? lang === 'en' ? '3 Weeks' : '3 أسابيع' :
                                    selectedBundleToView?.bundlePeriod === 4 ? lang === 'en' ? '4 Weeks' : '4 أسابيع' : ''
                                }
                            </div>
                        </div>

                        {/*  bundleStatus  */}
                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Status' : 'الحالة'}</div>
                            <Tag value={lang === 'en' ? selectedBundleToView?.deActivate ? 'Deactivated' : 'Activated' : selectedBundleToView?.deActivate ? 'تم تعطيلها' : 'تم تفعيلها'} severity={selectedBundleToView?.deActivate ? 'danger' : 'success'} />
                        </div>

                        {/* hasDiscount */}
                        {selectedBundleToView?.hasDiscount && (<div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Has Discount' : 'يوجد خصم'}</div>
                            <div>
                                {
                                    selectedBundleToView?.hasDiscount ? <Tag value={lang === 'en' ? 'Yes' : 'نعم'} severity={'success'} /> : <Tag value={lang === 'en' ? 'No' : 'لا'} severity={'danger'} />
                                }
                            </div>
                        </div>)}

                        {/* discountAmount */}
                        {selectedBundleToView?.hasDiscount && (<div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Discount Amount' : 'قيمة الخصم'}</div>
                            <div>
                                {
                                    selectedBundleToView?.discountAmount
                                }
                            </div>
                        </div>)}

                        {/*  discountType */}
                        {selectedBundleToView?.hasDiscount && (<div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Discount Type' : 'نوع الخصم'}</div>
                            <div>
                                {
                                    selectedBundleToView?.discountType === "ratio" ? lang === 'en' ? 'Ratio' : 'نسبة' : lang === 'en' ? 'Amount' : 'قيمة'
                                }
                            </div>
                        </div>)}

                        {/*  customBundle : is it custom bundle or not  */}
                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Custom Bundle' : 'باقة مخصصة'}</div>
                            <div>
                                {
                                    selectedBundleToView?.customBundle ? <Tag value={lang === 'en' ? 'Yes' : 'نعم'} severity={'success'} /> : <Tag value={lang === 'en' ? 'No' : 'لا'} severity={'danger'} />
                                }
                            </div>
                        </div>

                        {/*  timeOnCard: Text on Card in Arabic  */}
                        <div className="col-12">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Text on Card' : 'النص على البطاقة'}</div>
                            <div>{selectedBundleToView?.timeOnCard}</div>
                        </div>

                        {/* timeOnCardEn */}
                        <div className="col-12">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Text on Card (EN)' : 'النص على البطاقة (EN)'}</div>
                            <div>{selectedBundleToView?.timeOnCardEn}</div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </>
    );
}