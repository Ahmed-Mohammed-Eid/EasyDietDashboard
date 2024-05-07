'use client';
import React from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { toast } from 'react-hot-toast';

export default function AddDefaultMenuPage({ params: { lang } }) {

    // STATES FOR FILTER
    const [meal, setMeal] = React.useState('all');
    const [date, setDate] = React.useState('');
    const [menu, setMenu] = React.useState([]);
    const [selectedMenu, setSelectedMenu] = React.useState([]);

    // HANDLER TO GET THE MENU DATA
    function getMenuData() {
        // GET THE TOKEN
        const token = localStorage.getItem('token');

        // GET THE MENU DATA
        axios.get(`${process.env.API_URL}/meals/filter`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                mealsFilter: meal
            }
        })
            .then(response => {
                const meals = response.data?.meals || [];
                // MENU
                setMenu(meals);
            })
            .then(data => {
                console.log(data);
            });
    }

    // EFFECT TO GET THE MENU DATA
    React.useEffect(() => {
        getMenuData();
    }, [meal]);

    // HANDLER TO ADD DAILY MENU
    function addDefaultMenu() {
        // GET THE TOKEN
        const token = localStorage.getItem('token');

        // VALIDATION
        if (!date) {
            // TOAST
            toast.error(lang === 'en' ? 'Please select a date' : 'يرجى تحديد تاريخ');
            return;
        }

        if (!selectedMenu.length) {
            // TOAST
            toast.error(lang === 'en' ? 'Please select a meal' : 'يرجى تحديد وجبة');
            return;
        }

        // ADD DAILY MENU
        axios.post(`${process.env.API_URL}/add/chiff/menu/day`, {
            date,
            mealsIds: selectedMenu.map(menu => menu._id)
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                // TOAST
                toast.success(lang === 'en' ? 'Default menu added successfully' : 'تمت إضافة القائمة الإفتراضية بنجاح');
                // GET THE MENU DATA
                getMenuData();
            })
            .then(data => {
                console.log(data);
            });
    }


    return (
        <div className={'card mb-0'} dir={lang === 'en' ? 'ltr' : 'rtl'}>
            <h5>{lang === 'en' ? 'Add Default Menu' : 'إضافة قائمة افتراضية'}</h5>
            <hr />

            {/*  DATE DROPDOWN  */}
            <div className={'card mb-5'}>
                <Dropdown
                    value={date}
                    options={
                        [
                            { label: '1', value: '1' },
                            { label: '2', value: '2' },
                            { label: '3', value: '3' },
                            { label: '4', value: '4' },
                            { label: '5', value: '5' },
                            { label: '6', value: '6' },
                            { label: '7', value: '7' },
                            { label: '8', value: '8' },
                            { label: '9', value: '9' },
                            { label: '10', value: '10' },
                            { label: '11', value: '11' },
                            { label: '12', value: '12' },
                            { label: '13', value: '13' },
                            { label: '14', value: '14' },
                            { label: '15', value: '15' },
                            { label: '16', value: '16' },
                            { label: '17', value: '17' },
                            { label: '18', value: '18' },
                            { label: '19', value: '19' },
                            { label: '20', value: '20' },
                            { label: '21', value: '21' },
                            { label: '22', value: '22' },
                            { label: '23', value: '23' },
                            { label: '24', value: '24' },
                            { label: '25', value: '25' },
                            { label: '26', value: '26' },
                            { label: '27', value: '27' },
                            { label: '28', value: '28' },
                            { label: '29', value: '29' },
                            { label: '30', value: '30' },
                            { label: '31', value: '31' }
                        ]
                    }
                    filter={true}
                    onChange={(e) => setDate(e.value)}
                    optionLabel={'label'}
                    optionValue={'value'}
                    placeholder={lang === 'en' ? 'Select Date' : 'اختر التاريخ'}
                    style={{ width: '100%' }}
                />
                <Button
                    label={lang === 'en' ? 'Add' : 'إضافة'}
                    className={'mt-3'}
                    onClick={addDefaultMenu}
                    style={{ width: '100%' }}
                    icon={'pi pi-plus'}
                />
            </div>

            {/* ADD DAILY MENU FILTER CARD */}
            <div className={'card mb-5'}>
                <div className={'grid'}>
                    {/*  ALL  */}
                    <div className={'col-12 flex gap-1'}>
                        <RadioButton
                            id={'all'}
                            name={'meal'}
                            value={'all'}
                            onChange={(e) => setMeal(e.value)}
                            label={lang === 'en' ? 'All' : 'الكل'}
                            checked={meal === 'all'}
                        />
                        <label htmlFor={'all'}>{lang === 'en' ? 'All' : 'الكل'}</label>
                    </div>
                    <div className={'col-3 flex gap-1'}>
                        <RadioButton
                            id={'breakfast'}
                            name={'meal'}
                            value={'breakfast'}
                            onChange={(e) => setMeal(e.value)}
                            label={lang === 'en' ? 'Breakfast' : 'الفطور'}
                            checked={meal === 'breakfast'}
                        />
                        <label htmlFor={'breakfast'}>{lang === 'en' ? 'Breakfast' : 'الفطور'}</label>
                    </div>
                    <div className={'col-3 flex gap-1'}>
                        <RadioButton
                            id={'lunch'}
                            name={'meal'}
                            value={'lunch'}
                            onChange={(e) => setMeal(e.value)}
                            label={lang === 'en' ? 'Lunch' : 'الغداء'}
                            checked={meal === 'lunch'}
                        />
                        <label htmlFor={'lunch'}>{lang === 'en' ? 'Lunch' : 'الغداء'}</label>
                    </div>
                    <div className={'col-3 flex gap-1'}>
                        <RadioButton
                            id={'dinner'}
                            name={'meal'}
                            value={'dinner'}
                            onChange={(e) => setMeal(e.value)}
                            label={lang === 'en' ? 'Dinner' : 'العشاء'}
                            checked={meal === 'dinner'}
                        />
                        <label htmlFor={'dinner'}>{lang === 'en' ? 'Dinner' : 'العشاء'}</label>
                    </div>
                    <div className={'col-3 flex gap-1'}>
                        <RadioButton
                            id={'snack'}
                            name={'meal'}
                            value={'snack'}
                            onChange={(e) => setMeal(e.value)}
                            label={lang === 'en' ? 'Snacks' : 'الوجبات الخفيفة'}
                            checked={meal === 'snack'}
                        />
                        <label htmlFor={'snack'}>{lang === 'en' ? 'Snacks' : 'الوجبات الخفيفة'}</label>
                    </div>
                </div>
            </div>

            {/*  DATA TABLE  */}
            <DataTable
                dir={lang === 'en' ? 'ltr' : 'rtl'}
                value={menu || []}
                paginator
                rows={31}
                rowsPerPageOptions={[10, 20, 31]}
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                header={lang === 'en' ? 'DAILY MENU' : 'القائمة الإفتراضية'}
                emptyMessage={lang === 'en' ? 'No records found' : 'لم يتم العثور على سجلات'}
                className="p-datatable-sm mt-4"
                selectionMode={'multiple'}
                selection={selectedMenu}
                onSelectionChange={(e) => setSelectedMenu(e.value)}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column
                    field="imagePath"
                    header={lang === 'en' ? 'Image' : 'الصورة'}
                    sortable
                    body={rowData => {
                        return <Image
                            src={rowData.imagePath}
                            alt={rowData.mealTitle}
                            width={50}
                            height={50}
                            style={{
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }}
                        />;
                    }}
                />
                <Column
                    field="mealTitle"
                    header={lang === 'en' ? 'Meal' : 'الوجبة'}
                    sortable
                    body={rowData => {
                        return rowData.mealTitle;
                    }}
                />
                <Column
                    field="mealTitleEn"
                    header={lang === 'en' ? 'Meal (EN)' : 'الوجبة (EN)'}
                    sortable
                    body={rowData => {
                        return rowData.mealTitleEn;
                    }}
                />
                <Column
                    field="mealType"
                    header={lang === 'en' ? 'Type' : 'النوع'}
                    sortable
                    filter={true}
                    body={rowData => {
                        return rowData.mealType;
                    }}
                />
            </DataTable>
        </div>
    );
}