'use client';
import React, { useEffect, useState } from 'react';
// PRIME REACT
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

// COMPONENTS
import CustomFileUpload from '../../Layout/customFileUpload/customFileUpload';

// HELPERS
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function EditCategoryForm({ lang, id }) {

    // STATES
    const [categoryNameAR, setCategoryNameAR] = useState('');
    const [categoryNameEN, setCategoryNameEN] = useState('');
    const [files, setFiles] = useState(null);

    // HANDLERS
    function handleSubmit(e) {
        // PREVENT DEFAULT
        e.preventDefault();

        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');


        // VALIDATE
        if (!categoryNameAR || !categoryNameEN || !id) {
            return toast.error(lang === 'en' ? 'Please fill all required fields' : 'يرجى ملء جميع الحقول المطلوبة');
        }

        // SUBMIT
        const data = new FormData();
        data.append('categoryNameAR', categoryNameAR);
        data.append('categoryNameEN', categoryNameEN);
        data.append('categoryId', id);

        if(files) {
            // LOOP THROUGH FILES
            for (let i = 0; i < files.length; i++) {
                data.append('files', files[i]);
            }
        }

        // API CALL /create/coupons
        axios.put(`${process.env.API_URL}/edit/category`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    toast.success(lang === 'en' ? 'Category Updated successfully' : 'تم تعديل القسم بنجاح');
                }
            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Something went wrong' : 'حدث خطأ ما');
            });
    }

    // EFFECT TO GET THE CATEGORY
    useEffect(() => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // API CALL /get/category/:id
        axios.get(`${process.env.API_URL}/category?categoryId=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                console.log(res.data);
                setCategoryNameAR(res.data?.category?.categoryNameAR || '');
                setCategoryNameEN(res.data?.category?.categoryNameEN || '');
            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Something went wrong' : 'حدث خطأ ما');
            });
    }, [id, lang]);

    return (
        <form dir={lang === 'en' ? 'ltr' : 'rtl'} onSubmit={handleSubmit}>
            <div className={`card`}>
                <h1 className={'text-2xl mb-5 uppercase'}>
                    {lang === 'en' ? 'Edit Category' : 'تعديل القسم'}
                </h1>

                <div className={'p-fluid formgrid grid'}>
                    <div className={'field col-12 md:col-6'}>
                        <label htmlFor="couponCode">{lang === 'en' ? 'Category Name (EN)' : 'اسم القسم (EN)'}</label>
                        <InputText
                            id="categoryNameEN"
                            value={categoryNameEN}
                            onChange={(e) => setCategoryNameEN(e.target.value)}
                            placeholder={lang === 'en' ? 'Category Name (EN)' : 'اسم القسم (EN)'}
                        />
                    </div>
                    <div className={'field col-12 md:col-6'}>
                        <label
                            htmlFor="categoryNameAR">{lang === 'en' ? 'Category Name (AR)' : 'اسم القسم (AR)'}</label>
                        <InputText
                            id="categoryNameAR"
                            value={categoryNameAR}
                            onChange={(e) => setCategoryNameAR(e.target.value)}
                            placeholder={lang === 'en' ? 'Category Name (AR)' : 'اسم القسم (AR)'}
                        />
                    </div>
                    <div className={'field col-12'} dir={'ltr'}>
                        <label htmlFor="files"
                               dir={lang === 'en' ? 'ltr' : 'rtl'}>{lang === 'en' ? 'Category Image' : 'صورة القسم'}</label>
                        <CustomFileUpload
                            setFiles={(files) => {
                                setFiles(files);
                            }}
                            multiple={true}
                        />
                    </div>
                </div>
            </div>
            <div className={'flex justify-center mt-5'}>
                <Button
                    label={lang === 'en' ? 'Edit Category' : 'تعديل القسم'}
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