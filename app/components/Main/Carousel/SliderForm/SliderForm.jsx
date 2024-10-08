"use client";
import React, {useState} from 'react';
import CustomFileUpload from "../../Layout/customFileUpload/customFileUpload";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {toast} from "react-hot-toast";
import axios from "axios";

export default function SliderForm({lang}) {

    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [form, setForm] = useState({
        files: []
    });

    // HANDLERS
    function addAds(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // VALIDATE THE FORM
        if (!form.files || form.files.length < 1) {
            toast.error(lang === 'en' ? 'Please select an image' : 'الرجاء اختيار صورة');
            return;
        }

        // SET THE LOADING TO TRUE
        setLoading(true);

        // CREATE THE FORM DATA
        const formData = new FormData();

        // Set the loading state for the spinner
        setLoading(true);

        // APPEND THE FILES
        for (let i = 0; i < form.files.length; i++) {
            formData.append("files", form.files[i]);
        }

        // SEND THE REQUEST
        axios.post(`${process.env.API_URL}/carousel/ads`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                toast.success(response.data?.message || lang === "en" ? "Slider image added successfully." : "تمت إضافة صورة السلايدر بنجاح.");
                setLoading(false);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || lang === "en" ? "Failed to add slider image." : "فشل في إضافة صورة السلايدر.");
                setLoading(false);
            })
    }


    return (
        <div className={"card mb-0"} dir={
            lang === 'en' ? 'ltr' : 'rtl'
        }>
            <h1 className={"text-2xl font-bold mb-4 uppercase"}>
                {lang === 'en' ? 'Add Slider Images' : 'إضافة صور السلايدر'}
            </h1>
            <form className="grid formgrid p-fluid" onSubmit={addAds}>
                <div className="col-12 mb-2 lg:mb-2" dir={'ltr'}>
                    <label className={"mb-2 block"} htmlFor="male-image"
                        dir={lang === 'en' ? 'ltr' : 'rtl'}
                    >
                        {lang === 'en' ? 'Ad Image (Image Size Must Be 1900px * 300px)' : 'صورة الإعلان (يجب أن يكون حجم الصورة 1900 بكسل * 300 بكسل)'}
                    </label>
                    <CustomFileUpload
                        setFiles={(files) => {
                            setForm({ ...form, files })
                        }}
                        accept={"image/*"}
                        multiple={true}
                        removeThisItem={(index) => {
                            // ITEMS COPY
                            const items = [...form?.files || []]
                            // FILTER THE ITEMS
                            const newItems = items.filter((item, i) => {
                                return i !== index
                            })
                            // SET THE STATE
                            setForm({ ...form, files: newItems })
                        }}
                    />
                </div>
                <div className="field col-12 mt-4 ml-auto">
                    <Button
                        type={"submit"}
                        label={loading ? <ProgressSpinner fill={'#fff'} strokeWidth={'4'}
                                                          style={{
                                                              width: '2rem',
                                                              height: '2rem'
                                                          }} /> : `${lang === 'en' ? 'Add' : 'إضافة'}`}
                        disabled={loading} />
                </div>
            </form>
        </div>
    )
}