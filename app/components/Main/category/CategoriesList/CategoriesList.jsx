'use client';

import { useEffect, useState } from 'react';
// PRIME REACT
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

// HELPERS
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';

export default function CategoriesList({ lang }) {
    // ROUTER
    const router = useRouter();

    // STATES
    const [categories, setCategories] = useState([]);
    const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState(null);

    // EFFECT TO FETCH DATA
    useEffect(() => {
        // GET CATEGORIES LIST
        getCategoriesList();
    }, []);

    // GET CATEGORIES LIST HANDLER
    const getCategoriesList = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // API CALL /categories
        axios
            .get(`${process.env.API_URL}/category/list`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                setCategories(res.data?.categories || []);
            })
            .catch((err) => {
                console.log(err);
                toast.error(lang === 'en' ? 'Failed to fetch categories' : 'فشل في جلب الأقسام');
            });
    };

    // DELETE CATEGORY HANDLER
    const deleteCategory = (category) => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // API CALL /category/delete
        axios
            .delete(`${process.env.API_URL}/delete/bundle/category?categoryId=${category._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                toast.success(lang === 'en' ? 'Category deleted successfully' : 'تم حذف القسم بنجاح');
                setSelectedCategoryToDelete(null);
                getCategoriesList();
            })
            .catch((err) => {
                console.log(err);
                toast.error(lang === 'en' ? 'Failed to delete category' : 'فشل في حذف القسم');
            });
    };

    return (
        <>
            <div className="card">
                <DataTable
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                    value={categories || []}
                    paginator
                    rows={25}
                    rowsPerPageOptions={[25, 50, 100]}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    header={lang === 'en' ? 'Categories' : 'الأقسام'}
                    emptyMessage={lang === 'en' ? 'No categories found' : 'لم يتم العثور على أقسام'}
                    className="p-datatable-sm"
                >
                    {/*  IMAGE  */}
                    <Column
                        body={(rowData) => {
                            return (
                                <Image
                                    src={rowData?.categoryImage || '/assets/404.jpg'}
                                    alt={lang === 'en' ? 'Category Image' : 'صورة القسم'}
                                    width={50}
                                    height={50}
                                    style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid #ccc' }}
                                />
                            );
                        }}
                        header={lang === 'en' ? 'Image' : 'الصورة'}
                        style={{ width: '10%' }}
                    />
                    {/*  NAME EN  */}
                    <Column field="categoryNameEN" header={lang === 'en' ? 'Name (EN)' : 'الاسم (EN)'} sortable filter />

                    {/*  NAME AR  */}
                    <Column field="categoryNameAR" header={lang === 'en' ? 'Name (AR)' : 'الاسم (AR)'} sortable filter />

                    {/*  ACTIONS  */}
                    <Column
                        body={(rowData) => {
                            return (
                                <div className={'flex justify-center'}>
                                    <button className={'AMB_btn AMB_btn-primary'} onClick={() => router.push(`/${lang}/categories/${rowData._id}`)}>
                                        {lang === 'en' ? 'Edit' : 'تعديل'}
                                    </button>
                                    <button className={'AMB_btn AMB_btn-danger'} onClick={() => setSelectedCategoryToDelete(rowData)}>
                                        {lang === 'en' ? 'Delete' : 'حذف'}
                                    </button>
                                </div>
                            );
                        }}
                        header={lang === 'en' ? 'Actions' : 'الإجراءات'}
                        style={{ width: '10%' }}
                    />
                </DataTable>
            </div>

            {/* DELETE DIALOG */}
            <Dialog
                visible={selectedCategoryToDelete !== null}
                onHide={() => setSelectedCategoryToDelete(null)}
                header={lang === 'en' ? 'Delete Category' : 'حذف القسم'}
                footer={
                    <div className={'flex justify-center'}>
                        <button className={'AMB_btn AMB_btn-danger'} onClick={() => deleteCategory(selectedCategoryToDelete)}>
                            {lang === 'en' ? 'Delete' : 'حذف'}
                        </button>
                        <button className={'AMB_btn AMB_btn-primary'} onClick={() => setSelectedCategoryToDelete(null)}>
                            {lang === 'en' ? 'Cancel' : 'إلغاء'}
                        </button>
                    </div>
                }
                position={'center'}
                style={{ width: '100%', maxWidth: '500px' }}
                draggable={false}
                resizable={false}
                dir={lang === 'en' ? 'ltr' : 'rtl'}
            >
                <div className={'flex justify-center'}>
                    <p>{lang === 'en' ? 'Are you sure you want to delete this Category?' : 'هل أنت متأكد أنك تريد حذف هذا القسم؟'}</p>
                </div>
            </Dialog>
        </>
    );
}
