'use client';
import React, { useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { toast } from 'react-hot-toast';


export default function DailyMenuPage({ params: { lang } }) {

    // STATE TO STORE THE MENU DATA
    const [menu, setMenu] = React.useState([]);
    const [selectedDayToDelete, setSelectedDayToDelete] = React.useState({
        date: '',
        dialogVisible: false
    });

    // EFFECT TO GET THE MENU DATA
    useEffect(() => {
        getMenuData();
    }, []);

    // GET THE MENU DATA HANDLER
    function getMenuData() {
        // GET THE TOKEN
        const token = localStorage.getItem('token');

        // GET THE MENU DATA
        axios.get(`${process.env.API_URL}/get/menu`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                // MENU
                const menu = response.data.menu;
                setMenu(menu);
            })
            .then(data => {
                console.log(data);
            });
    }

    // DELETE DAY HANDLER
    function deleteDay() {
        // GET THE TOKEN
        const token = localStorage.getItem('token');

        // DELETE THE DAY
        axios.delete(`${process.env.API_URL}/delete/menu/day?date=${selectedDayToDelete?.date}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                // TOAST
                toast.success(lang === 'en' ? 'Day deleted successfully' : 'تم حذف اليوم بنجاح');
                // HIDE THE DIALOG
                setSelectedDayToDelete({ ...selectedDayToDelete, dialogVisible: false });
                // GET THE MENU DATA
                getMenuData();
            })
            .then(data => {
                console.log(data);
            });
    }

    return (
        <div
            className={'card mb-0'}
            dir={lang === 'en' ? 'ltr' : 'rtl'}
        >
            <h3 className={'mb-5'}>{lang === 'en' ? 'Daily Menu' : 'القائمة اليومية'}</h3>
            <DataTable
                dir={lang === 'en' ? 'ltr' : 'rtl'}
                value={menu || []}
                paginator
                rows={31}
                rowsPerPageOptions={[10, 20, 31]}
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                header={lang === 'en' ? 'DAILY MENU' : 'القائمة اليومية'}
                emptyMessage={lang === 'en' ? 'No records found' : 'لم يتم العثور على سجلات'}
                className="p-datatable-sm"
            >
                <Column
                    field="date"
                    header={lang === 'en' ? 'Date' : 'التاريخ'}
                    sortable
                    filter
                />
                <Column
                    field="breakfast"
                    header={lang === 'en' ? 'Breakfast' : 'الفطور'}
                    sortable
                    body={rowData => {
                        return rowData.breakfast.map((item, index) => (
                            <li key={index}>{item.mealId.mealTitle}</li>
                        ));
                    }}
                />
                <Column
                    field="lunch"
                    header={lang === 'en' ? 'Lunch' : 'الغداء'}
                    sortable
                    body={rowData => {
                        return rowData.lunch.map((item, index) => (
                            <li key={index}>{item.mealId.mealTitle}</li>
                        ));
                    }}
                />
                <Column
                    field="dinner"
                    header={lang === 'en' ? 'Dinner' : 'العشاء'}
                    sortable
                    body={rowData => {
                        return rowData.dinner.map((item, index) => (
                            <li key={index}>{item.mealId.mealTitle}</li>
                        ));
                    }}
                />
                <Column
                    field="snack"
                    header={lang === 'en' ? 'Snacks' : 'الوجبات الخفيفة'}
                    sortable
                    body={rowData => {
                        return rowData.snack.map((item, index) => (
                            <li key={index}>{item.mealId.mealTitle}</li>
                        ));
                    }}
                />
                <Column
                    field={'actions'}
                    header={lang === 'en' ? 'Actions' : 'الإجراءات'}
                    body={(rowData) => {
                        return (
                            <div>
                                {/*<button className={'btn btn-sm btn-primary'}>{lang === 'en' ? 'Edit' : 'تعديل'}</button>*/}
                                <button
                                    className={'btn btn-sm btn-danger'}
                                    onClick={() => setSelectedDayToDelete({
                                        date: rowData.date,
                                        dialogVisible: true
                                    })}
                                >
                                    {lang === 'en' ? 'Delete' : 'حذف'}
                                </button>
                            </div>
                        );
                    }}
                />
            </DataTable>
            <Dialog
                onHide={() => setSelectedDayToDelete({ date: '', dialogVisible: false })}
                visible={selectedDayToDelete.dialogVisible}
                header={lang === 'en' ? 'Delete Day' : 'حذف اليوم'}
                style={{ width: '50vw' }}
                dir={lang === 'en' ? 'ltr' : 'rtl'}
            >
                <h5>{lang === 'en' ? 'Are you sure you want to delete this day?' : 'هل أنت متأكد أنك تريد حذف هذا اليوم؟'}</h5>
                <button
                    className={'btn btn-sm btn-danger'}
                    onClick={deleteDay}
                >
                    {lang === 'en' ? 'Delete' : 'حذف'}
                </button>
                <button
                    className={'btn btn-sm btn-secondary'}
                    onClick={() => setSelectedDayToDelete({ date: '', dialogVisible: false })}
                >
                    {lang === 'en' ? 'Cancel' : 'إلغاء'}
                </button>
            </Dialog>
        </div>
    );
}