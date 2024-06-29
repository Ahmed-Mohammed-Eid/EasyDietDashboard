'use client';

import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { InputMask } from 'primereact/inputmask';
import governoratesAndRegions from '../../../../json/governoratesAndRegions.json';
import { getCitiesByGovernorate } from '../../../../helpers/getTheCites';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Chips } from 'primereact/chips';
import { Password } from 'primereact/password';

export default function UpdateClientForm({ lang, id }) {

    // STATE
    const [clientType, setClientType] = React.useState('');
    const [clientName, setClientName] = React.useState('');
    const [clientNameEn, setClientNameEn] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [gender, setGender] = React.useState('');
    const [governorate, setGovernorate] = React.useState('');
    const [distrect, setDistrect] = React.useState('');
    const [streetName, setStreetName] = React.useState('');
    const [homeNumber, setHomeNumber] = React.useState('');
    const [alley, setAlley] = React.useState('');
    const [floorNumber, setFloorNumber] = React.useState('');
    const [appartment, setAppartment] = React.useState('');
    const [appartmentNo, setAppartmentNo] = React.useState('');
    const [landmark, setLandmark] = React.useState('');
    const [dislikedMeals, setDislikedMeals] = React.useState('');

    // SUBMIT HANDLER
    const handleSubmit = (e) => {
        e.preventDefault();

        // VALIDATION
        if(clientType === 'online' && (!email)) {
            toast.error(lang === 'en' ? 'Please fill all client information fields' : 'يرجى ملء جميع حقول معلومات العميل');
            return;
        }

        // # CLIENT INFORMATION
        if (!clientName || !clientNameEn || !phoneNumber || !gender) {
            toast.error(lang === 'en' ? 'Please fill all client information fields' : 'يرجى ملء جميع حقول معلومات العميل');
            return;
        }

        // # ADDRESS INFORMATION
        if (!governorate || !distrect || !streetName || !homeNumber) {
            toast.error(lang === 'en' ? 'Please fill all address information fields' : 'يرجى ملء جميع حقول معلومات العنوان');
            return;
        }

        // AXIOS REQUEST
        axios.put(`${process.env.API_URL}/edit/client/profile`, {
            clientType,
            clientName,
            clientNameEn,
            phoneNumber,
            email,
            password,
            gender,
            governorate,
            distrect,
            streetName,
            homeNumber,
            alley,
            floorNumber,
            appartment,
            appartmentNo,
            landmark,
            dislikedMeals: dislikedMeals.length > 0 ? dislikedMeals.join(',') : '',
            clientId: id
        }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(_ => {
                toast.success(lang === 'en' ? 'Client Updated Successfully' : 'تمت تعديل العميل بنجاح');
            })
            .catch(err => {
                console.log(err);
                toast(lang === 'en' ? 'Error Updating Client' : 'خطأ فى تعديل العميل', { icon: 'error' });
            });
    };

    // GET THE CLIENT DATA HANDLER
    const getClientData = () => {
        axios.get(`${process.env.API_URL}/get/client?clientId=${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(res => {
                const client = res.data?.client;
                // SET THE CLIENT DATA
                setClientType(client.clientType);
                setClientName(client.clientName);
                setClientNameEn(client.clientNameEn);
                setPhoneNumber(client.phoneNumber);
                setEmail(client.email);
                setGender(client.gender);
                setGovernorate(client.governorate);
                setDistrect(client.distrect);
                setStreetName(client.streetName);
                setHomeNumber(client.homeNumber);
                setAlley(client.alley);
                setFloorNumber(client.floorNumber);
                setAppartment(client.appartment);
                setAppartmentNo(client.appartmentNo);
                setLandmark(client.landmark);

                // SET THE DISLIKED MEALS
                if(client.dislikedMeals) {
                    setDislikedMeals(client.dislikedMeals.split(','));
                }

            })
            .catch(err => {
                console.log(err);
            });
    };

    // EFFECT TO GET THE CLIENT DATA
    React.useEffect(() => {
        getClientData();
    }, []);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className={`card`}>
                    <h1 className={'text-2xl mb-5 uppercase'}>
                        {lang === 'en' ? 'Update Client' : 'تعديل عميل'}
                    </h1>

                    <h3 className={'text-lg mb-3'}>
                        {lang === 'en' ? 'Client Information' : 'معلومات العميل'}
                    </h3>

                    <div className={'p-fluid formgrid grid'}>
                        <div className={'field col-12'}>
                            <label htmlFor={'clientType'}>{lang === 'en' ? 'Client Type' : 'نوع العميل'}</label>
                            <Dropdown
                                id={'clientType'}
                                placeholder={lang === 'en' ? 'Select Client Type' : 'اختر نوع العميل'}
                                options={[
                                    { label: lang === 'en' ? 'Online' : 'أونلاين', value: 'online' },
                                    { label: lang === 'en' ? 'Offline' : 'أوفلاين', value: 'offline' }
                                ]}
                                value={clientType}
                                onChange={(e) => {
                                    setClientType(e.value);
                                }}
                            />
                        </div>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor={'name'}>{lang === 'en' ? 'Client Name' : 'اسم العميل'}</label>
                            <InputText
                                id={'name'}
                                type={'text'}
                                placeholder={lang === 'en' ? 'Enter Name' : 'أدخل الاسم'}
                                required
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                            />
                        </div>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor={'nameEn'}>{lang === 'en' ? 'Client Name (EN)' : 'اسم العميل (EN)'}</label>
                            <InputText
                                id={'nameEn'}
                                type={'text'}
                                placeholder={lang === 'en' ? 'Enter Name (EN)' : 'أدخل الاسم (EN)'}
                                required
                                value={clientNameEn}
                                onChange={(e) => setClientNameEn(e.target.value)}
                            />
                        </div>
                        <div className={`field col-12 ${clientType === "offline" ? "md:col-12" : 'md:col-6'}`}>
                            <label htmlFor={'phone'}>{lang === 'en' ? 'Phone Number' : 'رقم الهاتف'}</label>
                            <InputMask
                                id={'phone'}
                                mask={'99999999'}
                                placeholder={lang === 'en' ? 'Enter Phone Number' : 'أدخل رقم الهاتف'}
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        {clientType === "online" && (<div className={'field col-12 md:col-6'}>
                            <label htmlFor={'email'}>{lang === 'en' ? 'Email' : 'البريد الالكتروني'}</label>
                            <InputText
                                id={'email'}
                                type={'email'}
                                placeholder={lang === 'en' ? 'Enter Email' : 'أدخل البريد الالكتروني'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>)}
                        {clientType === "online" && (<div className={'field col-12'}>
                            <label htmlFor={'password'}>{lang === 'en' ? 'Password' : 'كلمة المرور'}</label>
                            <Password
                                id={'password'}
                                type={'password'}
                                placeholder={lang === 'en' ? 'Enter Password' : 'أدخل كلمة المرور'}
                                toggleMask={true}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>)}

                        {/*DISLIKED MEALS*/}
                        <div className={'field col-12'}>
                            <label
                                htmlFor={'dislikedMeals'}>{lang === 'en' ? 'Disliked Meals' : 'الوجبات المكروهة'}</label>
                            <Chips
                                id={'dislikedMeals'}
                                placeholder={lang === 'en' ? 'Enter Disliked Meals' : 'أدخل الوجبات المكروهة'}
                                value={dislikedMeals}
                                onChange={(e) => setDislikedMeals(e.value)}
                            />
                        </div>

                        <div className={'field col-12'}>
                            <label htmlFor={'gender'}>{lang === 'en' ? 'Gender' : 'الجنس'}</label>
                            <div className="flex flex-wrap gap-3">
                                <div className="flex align-items-center">
                                    <RadioButton inputId="male" name="gender" value="male"
                                                 onChange={(e) => setGender(e.value)} checked={gender === 'male'} />
                                    <label htmlFor="male" className="ml-2">Male</label>
                                </div>
                                <div className="flex align-items-center">
                                    <RadioButton inputId="female" name="gender" value="female"
                                                 onChange={(e) => setGender(e.value)} checked={gender === 'female'} />
                                    <label htmlFor="female" className="ml-2">Female</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`card mt-5`}>
                    <h3 className={'text-lg mb-3'}>
                        {lang === 'en' ? 'address Information' : 'معلومات العنوان'}
                    </h3>
                    <div className={'p-fluid formgrid grid'}>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor={'governorate'}>{lang === 'en' ? 'Governorate' : 'المحافظة'}</label>
                            <Dropdown
                                id={'governorate'}
                                placeholder={lang === 'en' ? 'Select Governorate' : 'اختر المحافظة'}
                                value={governorate}
                                options={governoratesAndRegions}
                                onChange={(e) => setGovernorate(e.value)}
                                optionValue={lang === 'en' ? 'englishName' : 'arabicName'}
                                optionLabel={lang === 'en' ? 'englishName' : 'arabicName'}
                            />
                        </div>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor={'distrect'}>{lang === 'en' ? 'Region' : 'المنطقة'}</label>
                            <Dropdown
                                id={'distrect'}
                                placeholder={lang === 'en' ? 'Select Region' : 'اختر المنطقة'}
                                options={governorate ? getCitiesByGovernorate(governorate, governoratesAndRegions) : []}
                                value={distrect}
                                onChange={(e) => setDistrect(e.value)}
                                optionValue={lang === 'en' ? 'englishName' : 'arabicName'}
                                optionLabel={lang === 'en' ? 'englishName' : 'arabicName'}
                            />
                        </div>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor={'street'}>{lang === 'en' ? 'Block' : 'اسم القطعة'}</label>
                            <InputText
                                id={'street'}
                                type={'text'}
                                placeholder={lang === 'en' ? 'Enter Block Name' : 'أدخل اسم القطعة'}
                                required
                                value={streetName}
                                onChange={(e) => setStreetName(e.target.value)}
                            />
                        </div>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor={'home'}>{lang === 'en' ? 'Street Name' : 'اسم الشارع'}</label>
                            <InputText
                                id={'home'}
                                type={'text'}
                                placeholder={lang === 'en' ? 'Enter Street Name' : 'أدخل اسم الشارع'}
                                required
                                value={homeNumber}
                                onChange={(e) => setHomeNumber(e.target.value)}
                            />
                        </div>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor={'alley'}>{lang === 'en' ? 'Alley' : 'الجادة'}</label>
                            <InputText
                                id={'alley'}
                                type={'text'}
                                placeholder={lang === 'en' ? 'Enter Alley' : 'أدخل الجادة'}
                                value={alley}
                                onChange={(e) => setAlley(e.target.value)}
                            />
                        </div>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor={'floor'}>{lang === 'en' ? 'House' : 'رقم المنزل'}</label>
                            <InputText
                                id={'floor'}
                                type={'text'}
                                placeholder={lang === 'en' ? 'Enter House' : 'أدخل المنزل'}
                                value={floorNumber}
                                onChange={(e) => setFloorNumber(e.target.value)}
                            />
                        </div>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor={'appartment'}>{lang === 'en' ? 'Floor' : 'الطابق'}</label>
                            <InputText
                                id={'appartment'}
                                type={'text'}
                                placeholder={lang === 'en' ? 'Enter Floor' : 'أدخل الطابق'}
                                value={appartment}
                                onChange={(e) => setAppartment(e.target.value)}
                            />
                        </div>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor={'appartmentNo'}>{lang === 'en' ? 'Apartment' : 'الشقة'}</label>
                            <InputText
                                id={'appartmentNo'}
                                type={'text'}
                                placeholder={lang === 'en' ? 'Enter Apartment' : 'أدخل الشقة'}
                                value={appartmentNo}
                                onChange={(e) => setAppartmentNo(e.target.value)}
                            />
                        </div>
                        <div className={'field col-12'}>
                            <label htmlFor={'landmark'}>{lang === 'en' ? 'Landmark' : 'العلامة المميزة'}</label>
                            <InputText
                                id={'landmark'}
                                type={'text'}
                                placeholder={lang === 'en' ? 'Enter Landmark' : 'أدخل العلامة المميزة'}
                                value={landmark}
                                onChange={(e) => setLandmark(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className={'mt-5'}>
                    <Button
                        type={'submit'}
                        label={lang === 'en' ? 'Update Client' : 'تعديل عميل'}
                        style={{ width: '100%' }}
                        severity={'primary'}
                        icon={'pi pi-plus'}
                    />
                </div>
            </form>
        </>
    );
};