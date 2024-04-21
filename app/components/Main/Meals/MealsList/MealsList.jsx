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

export default function MealsList({ lang }) {

    // ROUTER
    const router = useRouter();

    // STATES
    const [meals, setMeals] = useState([]);
    const [selectedMealToDelete, setSelectedMealToDelete] = useState(null);
    const [selectedMealToEdit, setSelectedMealToEdit] = useState(null);
    const [selectedMealToView, setSelectedMealToView] = useState(null);

    // EFFECT TO FETCH DATA
    useEffect(() => {
        getMeals();
    }, [lang]);

    // GET MEALS HANDLER
    const getMeals = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // API CALL /meals
        axios.get(`${process.env.API_URL}/get/all/meals?page=1`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                const meals = res.data?.meals || [];
                setMeals(meals);
            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Failed to fetch meals' : 'فشل في جلب الوجبات');
            });
    }

    // DELETE MEAL
    const deleteMeal = (meal) => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE THE MEAL
        if (!meal) {
            toast.error(lang === 'en' ? 'Meal not found' : 'الوجبة غير موجود');
            return;
        }

        // API CALL /meals
        axios.delete(`${process.env.API_URL}/delete/meal`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                mealId: selectedMealToDelete._id
            }
        })
            .then(res => {
                setSelectedMealToDelete(null);
                toast.success(lang === 'en' ? 'Meal deleted successfully' : 'تم حذف الوجبة بنجاح');

                // REFRESH THE DATA
                getMeals();

            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Failed to delete meal' : 'فشل في حذف الوجبة');
            });
    };


    return (
        <>
            <div className="card">
                <DataTable
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                    value={meals || []}
                    paginator
                    rows={25}
                    rowsPerPageOptions={[25, 50, 100]}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    header={lang === 'en' ? 'MEALS' : 'الوجبات'}
                    emptyMessage={lang === 'en' ? 'No meals found' : 'لم يتم العثور على وجبات'}
                    className="p-datatable-sm"
                >
                    {/* IMAGE */}
                    <Column
                        field="imagePath"
                        header={lang === 'en' ? 'Image' : 'صورة'}
                        style={{ whiteSpace: 'nowrap' }}
                        body={(rowData) => {
                            return (
                                <Image
                                    src={rowData.imagePath}
                                    alt={rowData.mealTitle}
                                    width={50}
                                    height={50}
                                    style={{
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '1px solid #ccc'
                                    }}
                                />
                            );
                        }}
                    />
                    <Column
                        field="mealTitleEn"
                        header={lang === 'en' ? 'Meal Title (EN)' : 'اسم الوجبة (EN)'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by Meal Title (EN)' : 'ابحث بالاسم (EN)'}
                        style={{ whiteSpace: 'nowrap' }}
                    />
                    <Column
                        field="mealTitle"
                        header={lang === 'en' ? 'Meal Title' : 'اسم الوجبة'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by Meal Title' : 'ابحث بالاسم'}
                        style={{ whiteSpace: 'nowrap' }}
                    />
                    <Column
                        field="mealType"
                        header={lang === 'en' ? 'Meal Type' : 'نوع الوجبة'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by Meal Type' : 'ابحث بالنوع'}
                        style={{ whiteSpace: 'nowrap' }}
                        // SHOW THE MEAL TYPE AS A TAG
                        body={(rowData) => {
                            return (
                                <Tag value={rowData.mealType} severity="info" />
                            );
                        }}
                    />
                    <Column
                        field="mealBlocked"
                        header={lang === 'en' ? 'Blocked' : 'محظور'}
                        sortable
                        filter
                        filterPlaceholder={lang === 'en' ? 'Search by Blocked' : 'ابحث بالحظر'}
                        style={{ whiteSpace: 'nowrap' }}
                        // SHOW THE BLOCKED AS A CHECK MARK
                        body={(rowData) => {
                            return (
                                <div>
                                    <Tag value={rowData.mealBlocked ? (lang === 'en' ? 'Blocked' : 'محظور') : (lang === 'en' ? 'Not Blocked' : 'غير محظور')} severity={rowData.mealBlocked ? 'danger' : 'success'} />
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
                                        onClick={() => setSelectedMealToView(rowData)}
                                    >
                                        {lang === 'en' ? 'View' : 'عرض'}
                                    </button>
                                    <button
                                        className={'AMB_btn AMB_btn-primary'}
                                        onClick={() => router.push((`/meals/${rowData._id}`))}
                                    >
                                        {lang === 'en' ? 'Edit' : 'تعديل'}
                                    </button>
                                    <button
                                        className={'AMB_btn AMB_btn-danger'}
                                        onClick={() => setSelectedMealToDelete(rowData)}
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
                    visible={selectedMealToDelete}
                    onHide={() => setSelectedMealToDelete(null)}
                    header={lang === 'en' ? 'Delete Meal' : 'حذف الوجبة'}
                    footer={(
                        <div className={'flex justify-center'}>
                            <button
                                className={'AMB_btn AMB_btn-danger'}
                                onClick={() => deleteMeal(selectedMealToDelete)}
                            >
                                {lang === 'en' ? 'Delete' : 'حذف'}
                            </button>
                            <button className={'AMB_btn AMB_btn-primary'}
                                    onClick={() => setSelectedMealToDelete(null)}>
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
                        <p>{lang === 'en' ? 'Are you sure you want to delete this meal?' : 'هل أنت متأكد أنك تريد حذف هذا الوجبة؟'}</p>
                    </div>
                </Dialog>

                {/*  VIEW DIALOG  */}
                <Dialog
                    visible={selectedMealToView}
                    onHide={() => setSelectedMealToView(null)}
                    header={lang === 'en' ? 'View Meal' : 'عرض الوجبة'}
                    footer={(
                        <div className={'flex justify-center'}>
                            <button className={'AMB_btn AMB_btn-primary'}
                                    onClick={() => setSelectedMealToView(null)}>
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
                        <div className="col-12">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Image' : 'صورة'}</div>
                            <div>
                                <Image
                                    src={isValidImageUrl(selectedMealToView?.imagePath) ? selectedMealToView?.imagePath : '/assets/404.jpg'}
                                    alt={selectedMealToView?.mealTitle}
                                    width={200}
                                    height={200}
                                    style={{
                                        borderRadius: '10px',
                                        objectFit: 'cover',
                                        border: '1px solid #ccc'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-6">
                            <div
                                className="font-bold mb-2">{lang === 'en' ? 'Meal Title (EN)' : 'اسم الوجبة (EN)'}</div>
                            <div>{selectedMealToView?.mealTitleEn}</div>
                        </div>
                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Meal Title' : 'اسم الوجبة'}</div>
                            <div>{selectedMealToView?.mealTitle}</div>
                        </div>
                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Meal Type' : 'نوع الوجبة'}</div>
                            <div>{selectedMealToView?.mealType}</div>
                        </div>
                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Meal Blocked' : 'محظور'}</div>
                            <Tag value={selectedMealToView?.mealBlocked ? (lang === 'en' ? 'Blocked' : 'محظور') : (lang === 'en' ? 'Not Blocked' : 'غير محظور')} severity={selectedMealToView?.mealBlocked ? 'danger' : 'success'} />
                        </div>
                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Protine' : 'بروتين'}</div>
                            <div>{selectedMealToView?.protine}</div>
                        </div>
                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Carbohydrates' : 'كربوهيدرات'}</div>
                            <div>{selectedMealToView?.carbohydrates}</div>
                        </div>
                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Fats' : 'دهون'}</div>
                            <div>{selectedMealToView?.fats}</div>
                        </div>
                        <div className="col-6">
                            <div className="font-bold mb-2">{lang === 'en' ? 'Calories' : 'سعرات'}</div>
                            <div>{selectedMealToView?.calories}</div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </>
    );
}