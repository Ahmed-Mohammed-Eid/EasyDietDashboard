import React from 'react';
import { RadioButton } from 'primereact/radiobutton';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toast } from 'react-hot-toast';

export default function ContentContainer({ lang }) {


    // STATES FOR FILTER
    const [meal, setMeal] = React.useState('all');
    const [date, setDate] = React.useState('');
    const [mainMenu, setMainMenu] = React.useState([]);
    const [menu, setMenu] = React.useState([]);


    // HANDLER TO GET THE MENU DATA
    function getDayMeals() {
        // GET THE TOKEN
        const token = localStorage.getItem('token');


        // FORMAT THE DATE TO BE IN THE FORMAT OF DD-MM-YYYY
        let formattedDate = '';

        if (date) {
            const newDate = new Date(date);
            formattedDate = `${newDate.getMonth() + 1}-${newDate.getDate()}-${newDate.getFullYear()}`;
        } else {
            const newDate = new Date();
            formattedDate = `${newDate.getMonth() + 1}-${newDate.getDate()}-${newDate.getFullYear()}`;
        }

        // GET THE MENU DATA
        axios.get(`${process.env.API_URL}/today/delivery/meals`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                mealsFilter: meal,
                date: formattedDate
            }
        })
            .then(response => {
                const clients = response.data?.clients || [];

                // SET THE MAIN MENU
                setMainMenu(response.data?.clients || []);

                // LOOP THROUGH THE CLIENTS AND MAKE AN ARRAY OF MEALS WITH THE CLIENT DATA
                const dayMeals = clients.map(client => {
                    return client?.dayMeals.map(meal => {
                        return {
                            clientId: client.clientId,
                            subscriptionId: client.subscriptionId,
                            dateId: client.dateId,
                            mealId: meal._id,
                            clientName: client.clientName,
                            clientNameEn: client.clientNameEn,
                            phoneNumber: client.phoneNumber,
                            meal: meal.title,
                            type: meal.mealType,
                            actions: 'actions'
                        };
                    });
                });

                // FLATTEN THE ARRAY
                const dayMealsFlattened = dayMeals.flat();

                // MENU
                setMenu(dayMealsFlattened || []);
            })
            .then(data => {
                console.log(data);
            });
    }

    // HANDLER TO SET A MEAL AS DELIVERED
    function markAsDelivered(clientId, dayMealId, dateId) {
        // GET THE TOKEN
        const token = localStorage.getItem('token');

        // VALIDATION
        if (!clientId || !dayMealId || !dateId) {
            return toast.error(lang === 'en' ? 'Please select a meal to mark as delivered' : 'الرجاء تحديد وجبة لوضع علامة على أنها تم التسليم');
        }

        // MARK THE MEAL AS DELIVERED
        axios.put(`${process.env.API_URL}/set/meal/delivered`, {
            clientId: clientId,
            dayMealId: dayMealId,
            dateId: dateId
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(_ => {
                toast.success(lang === 'en' ? 'Meal has been marked as delivered' : 'تم وضع علامة على الوجبة كتم التسليم');
                getDayMeals();
            })
            .catch(error => {
                console.error(error);
            });
    }

    // HANDLER TO SET ALL MEALS AS DELIVERED
    function markAllAsDelivered() {
        // GET THE TOKEN
        const token = localStorage.getItem('token');

        // VALIDATION
        if (!menu.length) {
            return toast.error(lang === 'en' ? 'There are no meals to mark as delivered' : 'لا توجد وجبات لوضع علامة على أنها تم التسليم');
        }

        // MARK ALL MEALS AS DELIVERED
        axios.put(`${process.env.API_URL}/set/all/meals/delivered`, {
            clients: mainMenu
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(_ => {
                toast.success(lang === 'en' ? 'All meals have been marked as delivered' : 'تم وضع علامة على جميع الوجبات كتم التسليم');
                getDayMeals();
            })
            .catch(error => {
                console.error(error);
            });
    }

    // HANDLER TO PRINT LABELS
    function printLabels() {
        // GET THE TOKEN
        const token = localStorage.getItem('token');

        // VALIDATION
        if (!menu.length) {
            return toast.error(lang === 'en' ? 'There are no meals to print labels for' : 'لا توجد وجبات لطباعة البطاقات');
        }

        // FORMAT THE DATE TO BE IN THE FORMAT OF DD-MM-YYYY
        let formattedDate = '';

        if (date) {
            const newDate = new Date(date);
            formattedDate = `${newDate.getMonth() + 1}-${newDate.getDate()}-${newDate.getFullYear()}`;
        } else {
            const newDate = new Date();
            formattedDate = `${newDate.getMonth() + 1}-${newDate.getDate()}-${newDate.getFullYear()}`;
        }

        // PRINT LABELS
        axios.get(`${process.env.API_URL}/print/labels`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                date: formattedDate,
                mealFilter: meal
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                const url = res.data?.url;
                if (url) {
                    const timer = setTimeout(() => {
                        window.open(url, '_blank');
                        clearTimeout(timer);
                    }, 1000);
                } else {
                    toast.error(lang === 'en' ? 'Failed to print labels' : 'فشل في طباعة البطاقات');
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    // EFFECT TO GET THE MENU DATA
    React.useEffect(() => {
        getDayMeals();
    }, [meal, date]);

    return (
        <div className={'card mb-0'} dir={lang === 'en' ? 'ltr' : 'rtl'}>
            <h5>{lang === 'en' ? 'Branch Manager' : 'مدير الفرع'}</h5>
            <hr />
            {/*  DATE DROPDOWN  */}
            <div className={'card mb-5 grid'}>
                <div className={'col-12'}>
                    <Calendar
                        value={date || new Date()}
                        onChange={(e) => setDate(e.value)}
                        placeholder={lang === 'en' ? 'Select Date' : 'اختر التاريخ'}
                        showIcon
                        className={'w-100'}
                        style={{ width: '100%' }}
                    />
                </div>
                <div className={'col-12 md:col-6'}>
                    <Button
                        label={lang === 'en' ? 'Print Labels' : 'طباعة البطاقات'}
                        className={'mt-3'}
                        // onClick={addDailyMenu}
                        style={{ width: '100%' }}
                        icon={'pi pi-print'}
                        onClick={printLabels}
                    />
                </div>
                <div className={'col-12 md:col-6'}>
                    <Button
                        label={lang === 'en' ? 'Mark All As Delivered' : 'وضع علامة على جميع كما تم التسليم'}
                        className={'mt-3'}
                        style={{ width: '100%' }}
                        severity={'success'}
                        icon={'pi pi-check'}
                        onClick={markAllAsDelivered}
                    />
                </div>
            </div>

            {/* ADD DAILY MENU FILTER CARD */}
            <div className={'card mb-5'}>
                <div className={'grid'}>
                    {/*  ALL  */}
                    <div className={'md:col-12 col-6 flex gap-1'}>
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
                    <div className={'md:col-3 col-6 flex gap-1'}>
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
                    <div className={'md:col-3 col-6 flex gap-1'}>
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
                    <div className={'md:col-3 col-6 flex gap-1'}>
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
                    <div className={'md:col-3 col-6 flex gap-1'}>
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

            {/* MENU TABLE */}
            <DataTable
                value={menu || []}
                className={'card mb-5'}
                dir={lang === 'en' ? 'ltr' : 'rtl'}
                size={'small'}
            >
                <Column
                    field={'meal'}
                    header={lang === 'en' ? 'MEMBERSHIP ID' : 'رقم العضوية'}
                    filter={true}
                    filterPlaceholder={lang === 'en' ? 'Search by Membership ID' : 'البحث بواسطة رقم العضوية'}
                    sortable={true}
                />
                <Column
                    field={lang === 'en' ? 'clientName' : 'clientNameEn'}
                    header={lang === 'en' ? 'Name' : 'الاسم'}
                    filter={true}
                    filterPlaceholder={lang === 'en' ? 'Search by Name' : 'البحث بواسطة الاسم'}
                    sortable={true}
                />
                {/*  MOBILE  */}
                <Column
                    field={'phoneNumber'}
                    header={lang === 'en' ? 'Mobile' : 'الجوال'}
                    filter={true}
                    filterPlaceholder={lang === 'en' ? 'Search by Mobile' : 'البحث بواسطة الجوال'}
                    sortable={true}
                />
                {/*  MEAL  */}
                <Column
                    field={'meal'}
                    header={lang === 'en' ? 'Meal' : 'الوجبة'}
                    filter={true}
                    filterPlaceholder={lang === 'en' ? 'Search by Meal' : 'البحث بواسطة الوجبة'}
                    sortable={true}
                />
                {/*  TYPE  */}
                <Column
                    field={'type'}
                    header={lang === 'en' ? 'Type' : 'النوع'}
                    filter={true}
                    filterPlaceholder={lang === 'en' ? 'Search by Type' : 'البحث بواسطة النوع'}
                    sortable={true}
                />

                {/*  ACTIONS  */}
                <Column
                    field={'actions'}
                    header={lang === 'en' ? 'Actions' : 'الإجراءات'}
                    body={(rowData) => {
                        return (
                            <div className={'flex gap-1'}>
                                <Button
                                    icon={'pi pi-check'}
                                    className={'p-button-rounded p-button-success'}
                                    size={'small'}
                                    tooltip={lang === 'en' ? 'Mark as Delivered' : 'وضع علامة على أنه تم التسليم'}
                                    onClick={() => markAsDelivered(rowData.clientId, rowData.mealId, rowData.dateId)}
                                />
                            </div>
                        );
                    }}
                />
            </DataTable>
        </div>
    );
}