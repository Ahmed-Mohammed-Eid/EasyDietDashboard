'use client';
import React, { useState } from 'react';
import classes from './CouponsAddForm.module.scss';
// PRIME REACT
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

// HELPERS
import { toast } from 'react-hot-toast';
import axios from 'axios';


export default function CouponsAddForm({ lang }) {

    // STATES
    const [couponText, setCouponText] = useState('');
    const [discountType, setDiscountType] = useState('amount');
    const [discountAmount, setDiscountAmount] = useState('');
    const [hasExpiry, setHasExpiry] = useState(false);
    const [expiryDate, setExpiryDate] = useState('');
    const [hasUsageNumber, setHasUsageNumber] = useState(false);
    const [usageNumber, setUsageNumber] = useState('');
    const [numberOfCodes, setNumberOfCodes] = useState('');

    // HANDLERS
    function handleSubmit(e) {
        // PREVENT DEFAULT
        e.preventDefault();

        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');


        // VALIDATE
        if (!couponText || !discountAmount || !numberOfCodes || (hasExpiry && !expiryDate) || (hasUsageNumber && !usageNumber)) {
            alert(lang === 'en' ? 'Please fill all required fields' : 'يرجى ملء جميع الحقول المطلوبة');
            return toast.error(lang === 'en' ? 'Please fill all required fields' : 'يرجى ملء جميع الحقول المطلوبة');
        }

        // SUBMIT
        const data = {
            couponText,
            discountType,
            discountAmount,
            hasExpiry,
            expiryDate,
            hasUsageNumber,
            usageNumber,
            numberOfCodes
        };

        // API CALL /create/coupons
        axios.post(`${process.env.API_URL}/create/coupons`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(_ => {
                toast.success(lang === 'en' ? 'Coupon added successfully' : 'تمت إضافة الكوبون بنجاح');
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
                    {lang === 'en' ? 'Add New Coupon' : 'إضافة كوبون جديد'}
                </h1>

                <div className={'p-fluid formgrid grid'}>
                    <div className={'field col-12 md:col-6'}>
                        <label htmlFor="couponText">{lang === 'en' ? 'Coupon Text' : 'نص الكوبون'}</label>
                        <InputText id="couponText" value={couponText} onChange={(e) => setCouponText(e.target.value)} />
                    </div>
                    <div className={'field col-12 md:col-6'}>
                        <label htmlFor="discountType">{lang === 'en' ? 'Discount Type' : 'نوع الخصم'}</label>
                        <Dropdown
                            id="discountType"
                            value={discountType}
                            options={[
                                { label: lang === 'en' ? 'Amount' : 'قيمة', value: 'amount' },
                                { label: lang === 'en' ? 'Ratio' : 'نسبة', value: 'ratio' }
                            ]}
                            onChange={(e) => setDiscountType(e.value)}
                        />
                    </div>
                    <div className={'field col-12'}>
                        <label htmlFor="discountAmount">{lang === 'en' ? 'Discount Amount' : 'قيمة الخصم'}</label>
                        <InputNumber id="discountAmount" value={discountAmount}
                                     onValueChange={(e) => setDiscountAmount(e.value)} />
                    </div>
                    <div className={'field col-12 flex flex-column align-items-center'}>
                        <label htmlFor="hasExpiry">{lang === 'en' ? 'Has Expiry' : 'له تاريخ انتهاء'}</label>
                        <InputSwitch id="hasExpiry" checked={hasExpiry} onChange={(e) => setHasExpiry(e.value)} />
                    </div>
                    {hasExpiry && (<div className={'field col-12'} dir={'ltr'}>
                        <label htmlFor="expiryDate"
                               dir={lang === 'en' ? 'ltr' : 'rtl'}>{lang === 'en' ? 'Expiry Date' : 'تاريخ الانتهاء'}</label>
                        <Calendar
                            id="expiryDate"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.value)}
                                  showIcon
                            // DISABLE PAST DATES
                            minDate={new Date()}
                        />
                    </div>)}
                    <div className={'field col-12 flex flex-column align-items-center'}>
                        <label
                            htmlFor="hasUsageNumber">{lang === 'en' ? 'Has Usage Number' : 'له عدد استخدامات'}</label>
                        <InputSwitch id="hasUsageNumber" checked={hasUsageNumber}
                                     onChange={(e) => setHasUsageNumber(e.value)} />
                    </div>
                    {hasUsageNumber && (<div className={'field col-12'}>
                        <label htmlFor="usageNumber"
                               dir={lang === 'en' ? 'ltr' : 'rtl'}>{lang === 'en' ? 'Usage Number' : 'عدد الاستخدامات'}</label>
                        <InputNumber id="usageNumber" value={usageNumber}
                                     onValueChange={(e) => setUsageNumber(e.value)} />
                    </div>)}
                    <div className={'field col-12'}>
                        <label htmlFor="numberOfCodes">{lang === 'en' ? 'Number of Codes' : 'عدد الكودات'}</label>
                        <InputNumber id="numberOfCodes" value={numberOfCodes}
                                     onValueChange={(e) => setNumberOfCodes(e.value)} />
                    </div>
                </div>
            </div>
            <div className={'flex justify-center mt-5'}>
                <Button
                    label={lang === 'en' ? 'Add Coupon' : 'إضافة الكوبون'}
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