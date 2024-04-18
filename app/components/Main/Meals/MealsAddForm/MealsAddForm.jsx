'use client';
import React, { useState } from 'react';
import classes from './MealsAddForm.module.scss';
// PRIME REACT
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';

// IMPORTS
import CustomFileUpload from '../../Layout/customFileUpload/customFileUpload';

// HELPERS
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function MealsAddForm({ lang }) {

    // STATES
    const [mealTitle, setMealTitle] = useState('');
    const [mealTitleEn, setMealTitleEn] = useState('');
    const [mealType, setMealType] = useState('');
    const [protine, setProtine] = useState('');
    const [carbohydrates, setCarbohydrates] = useState('');
    const [fats, setFats] = useState('');
    const [calories, setCalories] = useState('');
    const [description, setDescription] = useState('');
    const [numberOfSelection, setNumberOfSelection] = useState('');
    const [selectionPeriod, setSelectionPeriod] = useState('');
    const [file, setFile] = useState('');

    // HANDLERS
    function handleSubmit(e) {
        // PREVENT DEFAULT
        e.preventDefault();

        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');


        // VALIDATE
        if (!mealTitle || !mealTitleEn || !mealType || !protine || !carbohydrates || !fats || !calories || !file) {
            return toast.error(lang === 'en' ? 'Please fill all required fields' : 'يرجى ملء جميع الحقول المطلوبة');
        }

        // FORM DATA
        const formData = new FormData();
        formData.append('mealTitle', mealTitle);
        formData.append('mealTitleEn', mealTitleEn);
        formData.append('mealTypes', mealType.join(','));
        formData.append('protine', protine);
        formData.append('carbohydrates', carbohydrates);
        formData.append('fats', fats);
        formData.append('calories', calories);
        formData.append('description', description);
        formData.append('numberOfSelection', numberOfSelection);
        formData.append('selectionPeriod', selectionPeriod);
        formData.append('file', file);

        // API CALL /create/meal
        axios.post(`${process.env.API_URL}/create/meal`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    toast.success(lang === 'en' ? 'Meal added successfully' : 'تمت إضافة الوجبة بنجاح');
                }
            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Something went wrong' : 'حدث خطأ ما');
            });
    }

    return (
        <form dir={lang === 'en' ? 'ltr' : 'rtl'} onSubmit={handleSubmit}>
            <div className={`card`}>
                <h1 className={'text-2xl mb-5 uppercase'}>
                    {lang === 'en' ? 'Add Meal' : 'إضافة وجبة'}
                </h1>

                <div className={'p-fluid formgrid grid'}>
                    <div className={'field col-12 md:col-6'}>
                        <label htmlFor="mealTitle">{lang === 'en' ? 'Meal Title' : 'اسم الوجبة'}</label>
                        <InputText
                            id="mealTitle"
                            value={mealTitle}
                            onChange={(e) => setMealTitle(e.target.value)}
                        />
                    </div>
                    <div className={'field col-12 md:col-6'}>
                        <label
                            htmlFor="mealTitleEn">{lang === 'en' ? 'Meal Title (English)' : 'اسم الوجبة (إنجليزي)'}</label>
                        <InputText
                            id="mealTitleEn"
                            value={mealTitleEn}
                            onChange={(e) => setMealTitleEn(e.target.value)}
                        />
                    </div>
                    <div className={'field col-12'}>
                        <label htmlFor="mealType">{lang === 'en' ? 'Meal Type' : 'نوع الوجبة'}</label>
                        <MultiSelect
                            id="mealType"
                            value={mealType}
                            options={[
                                { value: 'افطار', label: lang === 'en' ? 'Breakfast' : 'فطور' },
                                { value: 'غداء', label: lang === 'en' ? 'Lunch' : 'غداء' },
                                { value: 'عشاء', label: lang === 'en' ? 'Dinner' : 'عشاء' },
                                { value: 'سناك', label: lang === 'en' ? 'Snack' : 'سناك' }
                            ]}
                            onChange={(e) => setMealType(e.value)}
                            placeholder={lang === 'en' ? 'Select a type' : 'اختر نوع'}
                        />
                    </div>
                    <div className={'field col-12 md:col-6'}>
                        <label htmlFor="protine">{lang === 'en' ? 'Protine' : 'بروتين'}</label>
                        <InputNumber
                            id="protine"
                            value={protine}
                            onChange={(e) => setProtine(e.value)}
                        />
                    </div>
                    <div className={'field col-12 md:col-6'}>
                        <label htmlFor="carbohydrates">{lang === 'en' ? 'Carbohydrates' : 'كربوهيدرات'}</label>
                        <InputNumber
                            id="carbohydrates"
                            value={carbohydrates}
                            onChange={(e) => setCarbohydrates(e.value)}
                        />
                    </div>
                    <div className={'field col-12 md:col-6'}>
                        <label htmlFor="fats">{lang === 'en' ? 'Fats' : 'دهون'}</label>
                        <InputNumber
                            id="fats"
                            value={fats}
                            onChange={(e) => setFats(e.value)}
                        />
                    </div>
                    <div className={'field col-12 md:col-6'}>
                        <label htmlFor="calories">{lang === 'en' ? 'Calories' : 'سعرات حرارية'}</label>
                        <InputNumber
                            id="calories"
                            value={calories}
                            onChange={(e) => setCalories(e.value)}
                        />
                    </div>
                    <div className={'field col-12'}>
                        <label htmlFor="description">{lang === 'en' ? 'Description' : 'وصف'}</label>
                        <InputTextarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{
                                height: '150px',
                                resize: 'none'
                            }}
                        />
                    </div>
                    <div className={'field col-12 md:col-6'}>
                        <label
                            htmlFor="numberOfSelection">{lang === 'en' ? 'Number of Selection' : 'عدد الاختيارات'}</label>
                        <InputNumber
                            id="numberOfSelection"
                            value={numberOfSelection}
                            onChange={(e) => setNumberOfSelection(e.value)}
                        />
                    </div>
                    <div className={'field col-12 md:col-6'}>
                        <label htmlFor="selectionPeriod">{lang === 'en' ? 'Selection Period' : 'فترة الاختيار'}</label>
                        <InputNumber
                            id="selectionPeriod"
                            value={selectionPeriod}
                            onChange={(e) => setSelectionPeriod(e.value)}
                        />
                    </div>
                    <div className={'field col-12'} dir={'ltr'}>
                        <label dir={lang === 'en' ? 'ltr' : 'rtl'}
                               style={{ textAlign: lang === 'en' ? 'left' : 'right' }}
                               htmlFor="file">{lang === 'en' ? 'Meal Image' : 'صورة الوجبة'}</label>
                        <CustomFileUpload
                            id="file"
                            multiple={false}
                            setFiles={(files) => setFile(files[0])}
                            removeThisItem={() => setFile('')}
                        />
                    </div>
                </div>
            </div>
            <div className={'flex justify-center mt-5'}>
                <Button
                    label={lang === 'en' ? 'Add Meal' : 'إضافة وجبة'}
                    icon="pi pi-plus"
                    style={{
                        width: '100%',
                        padding: '1rem'
                    }}
                />
            </div>
        </form>
    );
}