'use client';

import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { InputMask } from 'primereact/inputmask';
import { Calendar } from 'primereact/calendar';
import { Chips } from 'primereact/chips';
import { InputSwitch } from 'primereact/inputswitch';
import { Checkbox } from 'primereact/checkbox';
import governoratesAndRegions from '../../../../json/governoratesAndRegions.json';
import { getCitiesByGovernorate } from '../../../../helpers/getTheCites';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Dialog } from 'primereact/dialog';

export default function AddClientForm({ lang }) {

    // BUNDLES
    const [bundles, setBundles] = React.useState([]);

    // STATE
    const [mealsNumber, setMealsNumber] = React.useState('');
    const [breakfast, setBreakfast] = React.useState('');
    const [lunch, setLunch] = React.useState('');
    const [dinner, setDinner] = React.useState('');
    const [snacksNumber, setSnacksNumber] = React.useState('');
    const [bundlePeriod, setBundlePeriod] = React.useState('');
    const [fridayOption, setFridayOption] = React.useState(false);
    const [bundlePrice, setBundlePrice] = React.useState('');
    const [carb, setCarb] = React.useState('');
    const [protine, setProtine] = React.useState('');
    const [customBundle, setCustomBundle] = React.useState(false);
    const [clientName, setClientName] = React.useState('');
    const [clientNameEn, setClientNameEn] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [email, setEmail] = React.useState('');
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
    const [clientType, setClientType] = React.useState('');
    const [dislikedMeals, setDislikedMeals] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [bundleId, setBundleId] = React.useState('');
    const [startingDate, setStartingDate] = React.useState('');

    // Client signing in state
    const [clientSigningIn, setClientSigningIn] = React.useState({
        username: '',
        password: '',
        dialogVisible: false
    });


    // SUBMIT HANDLER
    const handleSubmit = (e) => {
        e.preventDefault();

        // VALIDATION
        // # CLIENT INFORMATION
        if (!clientType || !clientName || !clientNameEn || !phoneNumber || !gender || (!email && clientType === 'online') || (!password && clientType === 'online')) {
            toast.error(lang === 'en' ? 'Please fill all client information fields' : 'يرجى ملء جميع حقول معلومات العميل');
            return;
        }

        // # ADDRESS INFORMATION
        if (!governorate || !distrect || !streetName || !homeNumber) {
            toast.error(lang === 'en' ? 'Please fill all address information fields' : 'يرجى ملء جميع حقول معلومات العنوان');
            return;
        }

        // # BUNDLE INFORMATION
        if (!customBundle && (!bundleId || !startingDate)) {
            toast.error(lang === 'en' ? 'Please fill all bundle information fields' : 'يرجى ملء جميع حقول معلومات الباقة');
            return;
        }

        if (customBundle && (!mealsNumber || !snacksNumber || !bundlePeriod || !bundlePrice || !carb || !protine || !startingDate)) {
            toast.error(lang === 'en' ? 'Please fill all bundle information fields' : 'يرجى ملء جميع حقول معلومات الباقة');
            return;
        }

        // if Bundle is custom and period must be 5 days or  bigger
        if (customBundle && bundlePeriod < 5) {
            toast.error(lang === 'en' ? 'Bundle Period must be 5 days or bigger' : 'مدة الباقة يجب أن تكون 5 أيام أو أكثر');
            return;
        }

        // FORMAT THE DATE TO BE IN THE FORMAT OF DD-MM-YYYY
        const date = new Date(startingDate);
        const formattedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;


        // AXIOS REQUEST
        axios.post(`${process.env.API_URL}/admin/create/client`, {
            mealsNumber,
            breakfast: breakfast ? 'on' : '',
            lunch: lunch ? 'on' : '',
            dinner: dinner ? 'on' : '',
            snacksNumber,
            bundlePeriod,
            fridayOption,
            bundlePrice,
            carb,
            protine,
            customBundle,
            clientName,
            clientNameEn,
            phoneNumber,
            email,
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
            clientType,
            dislikedMeals,
            password,
            bundleId,
            startingDate: formattedDate
        }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(res => {
                toast.success(lang === 'en' ? 'Client Added Successfully' : 'تمت إضافة العميل بنجاح');

                // VALIDATION FOR CLIENT SIGNING IN
                if (clientType === 'offline' && res.data?.credentials?.username === '' && res.data?.credentials?.password === '') {
                    return;
                }

                // SET THE CLIENT SIGNING IN DETAILS
                setClientSigningIn({
                    username: res.data?.credentials?.username,
                    password: res.data?.credentials?.password,
                    dialogVisible: true
                });
            })
            .catch(err => {
                console.log(err);
                toast.error(err.response?.data?.message || lang === 'en' ? 'Something went wrong' : 'حدث خطأ ما');
            });
    };

    // GET ALL BUNDLES
    const getBundles = () => {
        // GET THE TOKEN
        const token = localStorage.getItem('token');

        axios.get(`${process.env.API_URL}/get/bundles`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                const bundles = response.data?.bundles || [];
                setBundles(bundles);
            })
            .catch(error => {
                console.error(error);
            });
    };

    // effect to get the bundles
    React.useEffect(() => {
        getBundles();
    }, []);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className={`card`}>
                    <h1 className={'text-2xl mb-5 uppercase'}>
                        {lang === 'en' ? 'Add New Client' : 'إضافة عميل جديد'}
                    </h1>

                    <h3 className={'text-lg mb-3'}>
                        {lang === 'en' ? 'Client Information' : 'معلومات العميل'}
                    </h3>

                    <div className={'p-fluid formgrid grid'}>
                        <div className={'field col-12 md:col-6'}>
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
                                    // CLEAR STARTING DATE IF CLIENT TYPE IS OFFLINE
                                    setStartingDate('');
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
                        <div className={'field col-12 md:col-6'}>
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
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor={'email'}>{lang === 'en' ? 'Email' : 'البريد الالكتروني'}</label>
                            <InputText
                                id={'email'}
                                type={'email'}
                                placeholder={lang === 'en' ? 'Enter Email' : 'أدخل البريد الالكتروني'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor={'password'}>{lang === 'en' ? 'Password' : 'كلمة المرور'}</label>
                            <InputText
                                id={'password'}
                                type={'password'}
                                placeholder={lang === 'en' ? 'Enter Password' : 'أدخل كلمة المرور'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className={`card mt-5`}>
                    <h3 className={'text-lg mb-3'}>
                        {lang === 'en' ? 'Address Information' : 'معلومات العنوان'}
                    </h3>
                    <div className={'p-fluid formgrid grid'}>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor={'governorate'}>{lang === 'en' ? 'Governorate' : 'المحافظة'}</label>
                            <Dropdown
                                id={'governorate'}
                                placeholder={lang === 'en' ? 'Select Governorate' : 'اختر المحافظة'}
                                options={governoratesAndRegions}
                                value={governorate}
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
                <div className={`card mt-5`}>
                    <h3 className={'text-lg mb-3'}>
                        {lang === 'en' ? 'Bundle Information' : 'معلومات الباقة'}
                    </h3>

                    <div className={'field col-12 flex flex-column'}>
                        <label htmlFor={'customBundle'}>{lang === 'en' ? 'Custom Bundle' : 'باقة مخصصة'}</label>
                        <InputSwitch
                            id={'customBundle'}
                            checked={customBundle}
                            onChange={(e) => setCustomBundle(e.value)}
                        />
                    </div>

                    <div className={'p-fluid formgrid grid'}>
                        {!customBundle && (<div className={'field col-12 md:col-6'}>
                            <label htmlFor={'bundleId'}>{lang === 'en' ? 'Bundle ID' : 'رقم الباقة'}</label>
                            <Dropdown
                                id={'bundleId'}
                                type={'text'}
                                options={bundles}
                                filter={true}
                                value={bundleId}
                                onChange={(e) => setBundleId(e.target.value)}
                                optionLabel={lang === 'en' ? 'bundleNameEn' : 'bundleName'}
                                optionValue={'_id'}
                                placeholder={lang === 'en' ? 'Select Bundle' : 'اختر الباقة'}
                            />
                        </div>)}

                        {/*STARTING DATE*/}
                        <div className={`field col-12 ${!customBundle ? 'md:col-6' : ''}`}>
                            <label htmlFor={'startingDate'}>{lang === 'en' ? 'Starting Date' : 'تاريخ البدء'}</label>
                            <Calendar
                                value={startingDate}
                                onChange={(e) => setStartingDate(e.value)}
                                showIcon
                                dateFormat="yy-mm-dd"
                                placeholder={lang === 'en' ? 'Select Date' : 'اختر التاريخ'}
                                // MIN DATE IS AFTER 48 HOURS
                                minDate={clientType === 'offline' ? new Date() : new Date(new Date().getTime() + 48 * 60 * 60 * 1000)}
                                style={{ width: '100%' }}
                            />
                        </div>
                        {customBundle && (<div className={'field col-12 md:col-6'}>
                            <label htmlFor={'mealsNumber'}>{lang === 'en' ? 'Meals Number' : 'عدد الوجبات'}</label>
                            <InputNumber
                                id={'mealsNumber'}
                                placeholder={lang === 'en' ? 'Enter Meals Number' : 'أدخل عدد الوجبات'}
                                value={mealsNumber}
                                onChange={(e) => setMealsNumber(e.value)}
                            />
                        </div>)}
                        {customBundle && (<div className={'field col-12 md:col-6'}>
                            <label
                                htmlFor={'snacksNumber'}>{lang === 'en' ? 'Snacks Number' : 'عدد الوجبات الخفيفة'}</label>
                            <InputNumber
                                id={'snacksNumber'}
                                placeholder={lang === 'en' ? 'Enter Snacks Number' : 'أدخل عدد الوجبات الخفيفة'}
                                value={snacksNumber}
                                onChange={(e) => setSnacksNumber(e.value)}
                            />
                        </div>)}

                        {customBundle && (<div className={'field col-12 md:col-6'}>
                            <label htmlFor={'bundlePeriod'}>{lang === 'en' ? 'Bundle Period' : 'مدة الباقة'}</label>
                            <InputText
                                id={'bundlePeriod'}
                                type={'text'}
                                placeholder={lang === 'en' ? 'Enter Bundle Period' : 'أدخل مدة الباقة'}
                                value={bundlePeriod}
                                onChange={(e) => setBundlePeriod(e.target.value)}
                            />
                        </div>)}

                        {customBundle && (<div className={'field col-12 md:col-6'}>
                            <label htmlFor={'bundlePrice'}>{lang === 'en' ? 'Bundle Price' : 'سعر الباقة'}</label>
                            <InputNumber
                                id={'bundlePrice'}
                                placeholder={lang === 'en' ? 'Enter Bundle Price' : 'أدخل سعر الباقة'}
                                value={bundlePrice}
                                onChange={(e) => setBundlePrice(e.value)}
                            />
                        </div>)}

                        {customBundle && (<div className={'field col-12 md:col-6'}>
                            <label htmlFor={'carb'}>{lang === 'en' ? 'Carb' : 'الكربوهيدرات'}</label>
                            <InputNumber
                                id={'carb'}
                                placeholder={lang === 'en' ? 'Enter Carb' : 'أدخل الكربوهيدرات'}
                                required
                                value={carb}
                                onChange={(e) => setCarb(e.value)}
                            />
                        </div>)}
                        {customBundle && (<div className={'field col-12 md:col-6'}>
                            <label htmlFor={'protine'}>{lang === 'en' ? 'Protine' : 'البروتين'}</label>
                            <InputNumber
                                id={'protine'}
                                placeholder={lang === 'en' ? 'Enter Protine' : 'أدخل البروتين'}
                                required
                                value={protine}
                                onChange={(e) => setProtine(e.value)}
                            />
                        </div>)}

                        {customBundle && (<div className={'field col-12  formgrid grid'}>
                            <div className={'field col-12'}>
                                <label htmlFor={'mealsAvailability'}>
                                    {lang === 'en' ? 'Bundle Meals' : 'وجبات الباقة'}
                                </label>
                            </div>
                            <div className={'field col-3 flex gap-1'}>
                                <Checkbox
                                    id={'breakfast'}
                                    checked={breakfast}
                                    onChange={(e) => setBreakfast(e.checked)}
                                />
                                <label htmlFor={'breakfast'}>{lang === 'en' ? 'Breakfast' : 'الفطور'}</label>
                            </div>
                            <div className={'field col-3 flex gap-1'}>
                                <Checkbox
                                    id={'lunch'}
                                    checked={lunch}
                                    onChange={(e) => setLunch(e.checked)}
                                />
                                <label htmlFor={'lunch'}>{lang === 'en' ? 'Lunch' : 'الغداء'}</label>
                            </div>
                            <div className={'field col-3 flex gap-1'}>
                                <Checkbox
                                    id={'dinner'}
                                    checked={dinner}
                                    onChange={(e) => setDinner(e.checked)}
                                />
                                <label htmlFor={'dinner'}>{lang === 'en' ? 'Dinner' : 'العشاء'}</label>
                            </div>
                            {/*  FRIDAY  */}
                            <div className={'field col-3 flex gap-1'}>
                                <Checkbox checked={fridayOption} onChange={(e) => setFridayOption(e.checked)} />
                                <label
                                    htmlFor={'fridayOption'}>{lang === 'en' ? 'Friday Option' : 'خيار الجمعة'}</label>
                            </div>
                        </div>)}
                    </div>
                </div>
                <div className={'mt-5'}>
                    <Button
                        type={'submit'}
                        label={lang === 'en' ? 'Add Client' : 'إضافة عميل'}
                        style={{ width: '100%' }}
                        severity={'primary'}
                        icon={'pi pi-plus'}
                    />
                </div>
            </form>
            <Dialog
                header={lang === 'en' ? 'Client Signing In Details' : 'تفاصيل تسجيل الدخول للعميل'}
                visible={clientSigningIn?.dialogVisible}
                style={{ width: '50vw' }}
                onHide={() => setClientSigningIn({ ...clientSigningIn, dialogVisible: false })}
            >
                <div className={'p-fluid formgrid grid'}>
                    <div className={'field col-12 md:col-6'}>
                        <label htmlFor={'username'}>{lang === 'en' ? 'Username' : 'اسم المستخدم'}</label>
                        <p
                            id={'username'}
                            onClick={() => {
                                navigator.clipboard.writeText(clientSigningIn.username);
                                toast.success(lang === 'en' ? 'Copied to clipboard' : 'تم النسخ');
                            }}
                            className={'cursor-pointer'}
                            style={{ color: 'blue' }}
                        >
                            {clientSigningIn.username}
                        </p>
                    </div>
                    <div className={'field col-12 md-6'}>
                        <label htmlFor={'password'}>{lang === 'en' ? 'Password' : 'كلمة المرور'}</label>
                        <p
                            id={'password'}
                            onClick={() => {
                                navigator.clipboard.writeText(clientSigningIn.password);
                                toast.success(lang === 'en' ? 'Copied to clipboard' : 'تم النسخ');
                            }}
                            className={'cursor-pointer'}
                            style={{ color: 'blue' }}
                        >
                            {clientSigningIn.password}
                        </p>
                    </div>
                </div>
            </Dialog>
        </>
    );
};