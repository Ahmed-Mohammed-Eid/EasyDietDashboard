'use client';
import React, { useEffect, useState } from 'react';
import classes from './BundlesAddForm.module.scss';
// PRIME REACT
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';

// IMPORTS
import CustomFileUpload from '../../Layout/customFileUpload/customFileUpload';

// HELPERS
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import Image from 'next/image';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';

export default function BundlesAddForm({ lang }) {

    // DIALOG STATE
    const [displayDialog, setDisplayDialog] = useState(false);
    const [meals, setMeals] = useState([]);
    const [selectedMeals, setSelectedMeals] = useState([]);

    // CATEGORIES
    const [categories, setCategories] = useState([]);

    // STATES
    const [bundleName, setBundleName] = useState('');
    const [bundleNameEn, setBundleNameEn] = useState('');
    const [timeOnCard, setTimeOnCard] = useState('');
    const [timeOnCardEn, setTimeOnCardEn] = useState('');
    const [mealsNumber, setMealsNumber] = useState(0);
    const [breakfast, setBreakfast] = useState(false);
    const [lunch, setLunch] = useState(false);
    const [dinner, setDinner] = useState(false);
    const [snacks, setSnacks] = useState(false);
    const [snacksNumber, setSnacksNumber] = useState(0);
    const [bundlePeriod, setBundlePeriod] = useState(0);
    const [bundleOffer, setBundleOffer] = useState(0);
    const [fridayOption, setFridayOption] = useState(false);
    const [bundlePrice, setBundlePrice] = useState(0);
    const [customBundle, setCustomBundle] = useState(false);
    const [categoryId, setCategoryId] = useState('');
    const [hasDiscount, setHasDiscount] = useState(false);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountType, setDiscountType] = useState('ratio');
    // IMAGES
    const [maleImage, setMaleImage] = useState('');
    const [femaleImage, setFemaleImage] = useState('');


    // HANDLERS
    function handleSubmit(e) {
        // PREVENT DEFAULT
        e.preventDefault();

        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE
        if (
            !bundleName ||
            !bundleNameEn ||
            !timeOnCard ||
            !timeOnCardEn ||
            !mealsNumber ||
            !bundlePeriod ||
            !bundlePrice ||
            !categoryId ||
            (hasDiscount && !discountAmount && !discountType) ||
            (!breakfast && !lunch && !dinner && !snacks)
        ) {
            return toast.error(lang === 'en' ? 'Please fill all required fields' : 'يرجى ملء جميع الحقول المطلوبة');
        }

        if(!maleImage || !femaleImage){
            return toast.error(lang === 'en' ? 'Please upload images' : 'يرجى تحميل الصور');
        }

        if(selectedMeals.length <= 0){
            return toast.error(lang === 'en' ? 'Please select meals' : 'يرجى اختيار الوجبات');
        }


        // FORM DATA
        const formData = new FormData();

        formData.append('bundleName', bundleName);
        formData.append('bundleNameEn', bundleNameEn);
        formData.append('mealsNumber', mealsNumber);
        formData.append('breakfast', breakfast ? 'on' : 'off');
        formData.append('lunch', lunch ? 'on' : 'off');
        formData.append('dinner', dinner ? 'on' : 'off');
        formData.append('snacksNumber', snacksNumber);
        formData.append('bundlePeriod', bundlePeriod);
        formData.append('bundleOffer', bundleOffer);
        formData.append('fridayOption', fridayOption);
        formData.append('bundlePrice', bundlePrice);
        formData.append('timeOnCard', timeOnCard);
        formData.append('timeOnCardEn', timeOnCardEn);

        // DISCOUNT
        formData.append('hasDiscount', hasDiscount);
        formData.append('discountAmount', discountAmount);
        formData.append('discountType', discountType);

        // IMAGES files
        formData.append('files', maleImage);
        formData.append('files', femaleImage);

        // MEALS
        selectedMeals.forEach(meal => {
            formData.append('mealsIds[]', meal._id);
        });

        // API CALL /create/bundle
        axios.post(`${process.env.API_URL}/create/bundle`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(_ => {
                toast.success(lang === 'en' ? 'Bundle added successfully' : 'تمت إضافة الباقة بنجاح');
            })
            .catch(err => {
                toast.error(lang === 'en' ? 'Something went wrong' : 'حدث خطأ ما');
            });
    }

    // EFFECT TO FETCH DATA OF MEALS
    useEffect(() => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // API CALL /meals
        axios.get(`${process.env.API_URL}/get/all/meals?page=1`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                const meals = res.data?.data?.meals || [];
                setMeals(meals);
            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Failed to fetch meals' : 'فشل في جلب الوجبات');
            });
    }, [lang]);

    // EFFECT TO FETCH THE CATEGORIES
    useEffect(() => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // API CALL /categories
        axios.get(`${process.env.API_URL}/category/list`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                const categories = res.data?.categories || [];

                // LOOP THROUGH THE CATEGORIES AND CREATE AN ARRAY OF OBJECTS categoryNameAR and categoryNameEN to use in the dropdown with the value of the _id
                const categoriesOptions = categories.map(category => {
                    return {
                        label: lang === 'en' ? category.categoryNameEN : category.categoryNameAR,
                        value: category._id
                    };
                });

                setCategories(categoriesOptions);
            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Failed to fetch categories' : 'فشل في جلب التصنيفات');
            });
    }, [lang]);

    return (
        <>
            <form dir={lang === 'en' ? 'ltr' : 'rtl'} onSubmit={handleSubmit}>
                <div className={`card`}>
                    <div className={'flex justify-content-between'}>
                        <h1 className={'text-2xl mb-5 uppercase'}>
                            {lang === 'en' ? 'Add Bundle' : 'إضافة باقة'}
                        </h1>
                        <Button
                            label={lang === 'en' ? 'Select Meals' : 'اختر الوجبات'}
                            icon="pi pi-plus"
                            severity={'secondary'}
                            type={'button'}
                            onClick={() => setDisplayDialog(true)}
                        />
                    </div>

                    <div className={'p-fluid formgrid grid'}>
                        <div className={'field col-12'}>
                            <label htmlFor="categoryId">{lang === 'en' ? 'Category' : 'التصنيف'}</label>
                            <Dropdown
                                id="categoryId"
                                value={categoryId}
                                options={categories || []}
                                onChange={(e) => setCategoryId(e.value)}
                                placeholder={lang === 'en' ? 'Select a category' : 'اختر تصنيف'}
                            />
                        </div>

                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor="bundleTitle">{lang === 'en' ? 'Bundle Title' : 'اسم الباقة'}</label>
                            <InputText
                                id="bundleTitle"
                                value={bundleName}
                                onChange={(e) => setBundleName(e.target.value)}
                                placeholder={lang === 'en' ? 'Bundle Title' : 'اسم الباقة'}
                            />
                        </div>
                        <div className={'field col-12 md:col-6'}>
                            <label
                                htmlFor="bundleTitleEn">{lang === 'en' ? 'Bundle Title (English)' : 'اسم الباقة (إنجليزي)'}</label>
                            <InputText
                                id="bundleTitleEn"
                                value={bundleNameEn}
                                onChange={(e) => setBundleNameEn(e.target.value)}
                                placeholder={lang === 'en' ? 'Bundle Title (English)' : 'اسم الباقة (إنجليزي)'}
                            />
                        </div>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor="timeOnCard">{lang === 'en' ? 'Text on Card' : 'النص على البطاقة'}</label>
                            <InputText
                                id="timeOnCard"
                                value={timeOnCard}
                                onChange={(e) => setTimeOnCard(e.target.value)}
                                placeholder={lang === 'en' ? 'Text on Card' : 'النص على البطاقة'}
                            />
                        </div>
                        <div className={'field col-12 md:col-6'}>
                            <label
                                htmlFor="timeOnCardEn">{lang === 'en' ? 'Text on Card (English)' : 'النص على البطاقة (إنجليزي)'}</label>
                            <InputText
                                id="timeOnCardEn"
                                value={timeOnCardEn}
                                onChange={(e) => setTimeOnCardEn(e.target.value)}
                                placeholder={lang === 'en' ? 'Text on Card (English)' : 'النص على البطاقة (إنجليزي)'}
                            />
                        </div>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor="mealsNumber">{lang === 'en' ? 'Meals Number' : 'عدد الوجبات'}</label>
                            <InputNumber
                                id="mealsNumber"
                                value={mealsNumber}
                                onChange={(e) => setMealsNumber(e.value)}
                                placeholder={lang === 'en' ? 'Meals Number' : 'عدد الوجبات'}
                            />
                        </div>

                        {/* SNACKS */}
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor="snacksNumber">{lang === 'en' ? 'Snacks Number' : 'عدد السناك'}</label>
                            <InputNumber
                                id="snacksNumber"
                                value={snacksNumber}
                                onChange={(e) => setSnacksNumber(e.value)}
                                placeholder={lang === 'en' ? 'Snacks Number' : 'عدد السناك'}
                            />
                        </div>

                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor="bundlePeriod">{lang === 'en' ? 'Bundle Period' : 'فترة الباقة'}</label>
                            <Dropdown
                                id="bundlePeriod"
                                options={[
                                    { label: lang === 'en' ? '1 Week' : 'أسبوع واحد', value: 1 },
                                    { label: lang === 'en' ? '2 Weeks' : 'أسبوعين', value: 2 },
                                    { label: lang === 'en' ? '3 Weeks' : '3 أسابيع', value: 3 },
                                    { label: lang === 'en' ? '1 Month' : 'شهر واحد', value: 4 }
                                ]}
                                value={bundlePeriod}
                                onChange={(e) => setBundlePeriod(e.value)}
                                placeholder={lang === 'en' ? 'Bundle Period' : 'فترة الباقة'}
                            />
                        </div>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor="bundleOffer">{lang === 'en' ? 'Bundle Offer' : 'عرض الباقة'}</label>
                            <InputNumber
                                id="bundleOffer"
                                value={bundleOffer}
                                onChange={(e) => setBundleOffer(e.value)}
                                placeholder={lang === 'en' ? 'Bundle Offer' : 'عرض الباقة'}
                            />
                        </div>
                        <div className={'field col-12'}>
                            <label htmlFor="bundlePrice">{lang === 'en' ? 'Bundle Price' : 'سعر الباقة'}</label>
                            <InputNumber
                                id="bundlePrice"
                                value={bundlePrice}
                                onChange={(e) => setBundlePrice(e.value)}
                                placeholder={lang === 'en' ? 'Bundle Price' : 'سعر الباقة'}
                            />
                        </div>

                        {/* FRIDAY OPTION */}
                        <div className={'field col-12 md:col-6 flex flex-column align-items-center'}>
                            <label htmlFor="fridayOption">{lang === 'en' ? 'Friday Option' : 'خيار الجمعة'}</label>
                            <InputSwitch
                                id="fridayOption"
                                checked={fridayOption}
                                onChange={(e) => setFridayOption(e.value)}
                            />
                        </div>


                        {/* Discount */}
                        <div className={'field col-12 md:col-6 flex flex-column align-items-center'}>
                            <label htmlFor="hasDiscount">{lang === 'en' ? 'Has Discount' : 'يوجد خصم'}</label>
                            <InputSwitch
                                id="hasDiscount"
                                checked={hasDiscount}
                                onChange={(e) => setHasDiscount(e.value)}
                            />
                        </div>

                        {/* MEALS OPTIONS */}
                        <div className={'field col-12'}>
                            <label htmlFor="mealsOptions">{lang === 'en' ? 'Meals Options' : 'خيارات الوجبات'}</label>
                            <div className={'p-fluid formgrid grid'}>
                                <div className={'field col-3'}>
                                    <div className={'flex justify-between gap-1'}>
                                        <Checkbox
                                            inputId="breakfast"
                                            value="Breakfast"
                                            checked={breakfast}
                                            onChange={(e) => setBreakfast(e.checked)}
                                        />
                                        <label htmlFor="breakfast">{lang === 'en' ? 'Breakfast' : 'فطور'}</label>
                                    </div>
                                </div>
                                <div className={'field col-3'}>
                                    <div className={'flex justify-between gap-1'}>
                                        <Checkbox
                                            inputId="lunch"
                                            value="Lunch"
                                            checked={lunch}
                                            onChange={(e) => setLunch(e.checked)}
                                        />
                                        <label htmlFor="lunch">{lang === 'en' ? 'Lunch' : 'غداء'}</label>
                                    </div>
                                </div>
                                <div className={'field col-3'}>
                                    <div className={'flex justify-between gap-1'}>
                                        <Checkbox
                                            inputId="dinner"
                                            value="Dinner"
                                            checked={dinner}
                                            onChange={(e) => setDinner(e.checked)}
                                        />
                                        <label htmlFor="dinner">{lang === 'en' ? 'Dinner' : 'عشاء'}</label>
                                    </div>
                                </div>
                                <div className={'field col-3'}>
                                    <div className={'flex justify-between gap-1'}>
                                        <Checkbox
                                            inputId="snacks"
                                            value="Snacks"
                                            checked={snacks}
                                            onChange={(e) => setSnacks(e.checked)}
                                        />
                                        <label htmlFor="snacks">{lang === 'en' ? 'Snacks' : 'سناك'}</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Discount Type */}
                        {hasDiscount && (
                            <div className={'field col-12 md:col-6'}>
                                <label htmlFor="discountType">{lang === 'en' ? 'Discount Type' : 'نوع الخصم'}</label>
                                <Dropdown
                                    id="discountType"
                                    value={discountType}
                                    options={[
                                        { label: lang === 'en' ? 'Ratio' : 'نسبة', value: 'ratio' },
                                        { label: lang === 'en' ? 'Amount' : 'قيمة', value: 'amount' }
                                    ]}
                                    onChange={(e) => setDiscountType(e.value)}
                                    placeholder={lang === 'en' ? 'Select a type' : 'اختر نوع'}
                                />
                            </div>)
                        }

                        {/* Discount Amount */}
                        {hasDiscount && (
                            <div className={'field col-12 md:col-6'}>
                                <label
                                    htmlFor="discountAmount">{lang === 'en' ? 'Discount Amount' : 'قيمة الخصم'}</label>
                                <InputNumber
                                    id="discountAmount"
                                    value={discountAmount}
                                    onChange={(e) => setDiscountAmount(e.value)}
                                    placeholder={lang === 'en' ? 'Discount Amount' : 'قيمة الخصم'}
                                />
                            </div>
                        )}

                        {/* MALE IMAGE */}
                        <div className={'field col-12 md:col-6'} dir={'ltr'}>
                            <label dir={lang === 'en' ? 'ltr' : 'rtl'}
                                   style={{ textAlign: lang === 'en' ? 'left' : 'right' }}
                                   htmlFor="maleImage">{lang === 'en' ? 'Male Image' : 'صورة الذكر'}</label>
                            <CustomFileUpload
                                id="maleImage"
                                multiple={false}
                                setFiles={(files) => setMaleImage(files[0])}
                                removeThisItem={() => setMaleImage('')}
                            />
                        </div>

                        {/* FEMALE IMAGE */}
                        <div className={'field col-12 md:col-6'} dir={'ltr'}>
                            <label dir={lang === 'en' ? 'ltr' : 'rtl'}
                                   style={{ textAlign: lang === 'en' ? 'left' : 'right' }}
                                   htmlFor="femalImage">{lang === 'en' ? 'Female Image' : 'صورة الأنثى'}</label>
                            <CustomFileUpload
                                id="femalImage"
                                multiple={false}
                                setFiles={(files) => setFemaleImage(files[0])}
                                removeThisItem={() => setFemaleImage('')}
                            />
                        </div>
                    </div>
                </div>
                <div className={'flex justify-center mt-5'}>
                    <Button
                        label={lang === 'en' ? 'Add Bundle' : 'إضافة باقة'}
                        icon="pi pi-plus"
                        style={{
                            width: '100%',
                            padding: '1rem'
                        }}
                    />
                </div>
            </form>

            {/*  DIALOG FOR MEALS  */}
            <Dialog
                header={lang === 'en' ? 'Select Meals' : 'اختر الوجبات'}
                visible={displayDialog}
                style={{ width: '90vw' }}
                onHide={() => setDisplayDialog(false)}
                maximizable
            >
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
                    selectionMode={'multiple'}
                    selection={selectedMeals}
                    onSelectionChange={(e) => setSelectedMeals(e.value)}
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>

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
                                    <Tag
                                        value={rowData.mealBlocked ? (lang === 'en' ? 'Blocked' : 'محظور') : (lang === 'en' ? 'Not Blocked' : 'غير محظور')}
                                        severity={rowData.mealBlocked ? 'danger' : 'success'} />
                                </div>
                            );
                        }}
                    />
                </DataTable>
            </Dialog>
        </>
    );
}