'use client';
import React, { useState } from 'react';
import classes from './EmployeeAddForm.module.scss';
// PRIME REACT
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { Button } from 'primereact/button';

// HELPERS
import { toast } from 'react-hot-toast';
import axios from 'axios';
import CustomFileUpload from '../../Layout/customFileUpload/customFileUpload';
import { Password } from 'primereact/password';


export default function EmployeeAddForm({ lang }) {

    // STATES
    const [employeeData, setEmployeeData] = useState({
        fullName: '',
        username: '',
        role: '',
        password: '',
        address: '',
        phoneNumber: '',
        files: []
    });

    // HANDLERS
    function handleSubmit(e) {
        // PREVENT DEFAULT
        e.preventDefault();

        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');


        // VALIDATE
        if (!employeeData.fullName || !employeeData.username || !employeeData.role || !employeeData.password) {
            alert(lang === 'en' ? 'Please fill all required fields' : 'يرجى ملء جميع الحقول المطلوبة');
            return toast.error(lang === 'en' ? 'Please fill all required fields' : 'يرجى ملء جميع الحقول المطلوبة');
        }

        // FORM DATA
        const data = new FormData();
        data.append('fullName', employeeData.fullName);
        data.append('username', employeeData.username);
        data.append('role', employeeData.role);
        data.append('password', employeeData.password);
        data.append('address', employeeData.address);
        data.append('phoneNumber', employeeData.phoneNumber);

        if (employeeData.files.length) {
            employeeData.files.forEach(file => {
                data.append('files', file);
            });
        }

        // API CALL /create/employees
        axios.post(`${process.env.API_URL}/create/employee`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(_ => {
                toast.success(lang === 'en' ? 'Employee added successfully' : 'تمت إضافة الموظف بنجاح');
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
                    {lang === 'en' ? 'Add New Employee' : 'إضافة موظف جديد'}
                </h1>

                <div className={'p-fluid formgrid grid'}>
                    <div className={'field col-12 md:col-6'}>
                        <label htmlFor="fullName">{lang === 'en' ? 'Full Name' : 'الاسم بالكامل'}</label>
                        <InputText
                            id="fullName"
                            value={employeeData.fullName}
                            onChange={e => setEmployeeData({ ...employeeData, fullName: e.target.value })}
                            placeholder={lang === 'en' ? 'Full Name' : 'الاسم بالكامل'}
                        />
                    </div>
                    <div className={'field col-12 md:col-6'}>
                        <label htmlFor="phoneNumber">{lang === 'en' ? 'Phone Number' : 'رقم الهاتف'}</label>
                        <InputMask
                            id="phoneNumber"
                            mask="99999999"
                            value={employeeData.phoneNumber}
                            onChange={e => setEmployeeData({ ...employeeData, phoneNumber: e.value })}
                            placeholder={lang === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                        />
                    </div>
                    <div className={'field col-12'}>
                        <label htmlFor="address">{lang === 'en' ? 'Address' : 'العنوان'}</label>
                        <InputText
                            id="address"
                            value={employeeData.address}
                            onChange={e => setEmployeeData({ ...employeeData, address: e.target.value })}
                            placeholder={lang === 'en' ? 'Address' : 'العنوان'}
                        />
                    </div>
                    <div className={'field col-12'}>
                        <label htmlFor="role">{lang === 'en' ? 'Role' : 'الدور'}</label>
                        <Dropdown
                            id="role"
                            value={employeeData.role}
                            options={[
                                { label: 'Admin', value: 'admin' },
                                { label: 'Manager', value: 'manager' },
                                { label: 'Diet Specialist', value: 'diet specialist' },
                            ]}
                            onChange={e => setEmployeeData({ ...employeeData, role: e.value })}
                            placeholder={lang === 'en' ? 'Role' : 'الدور'}
                        />
                    </div>
                    <div className={'field col-12 md:col-6'}>
                        <label htmlFor="username">{lang === 'en' ? 'Username' : 'اسم المستخدم'}</label>
                        <InputText
                            id="username"
                            value={employeeData.username}
                            onChange={e => setEmployeeData({ ...employeeData, username: e.target.value })}
                            placeholder={lang === 'en' ? 'Username' : 'اسم المستخدم'}
                        />
                    </div>

                    <div className={'field col-12 md:col-6'}>
                        <label htmlFor="password">{lang === 'en' ? 'Password' : 'كلمة السر'}</label>
                        <Password
                            id="password"
                            value={employeeData.password}
                            onChange={e => setEmployeeData({ ...employeeData, password: e.target.value })}
                            placeholder={lang === 'en' ? 'Password' : 'كلمة السر'}
                            toggleMask={true}
                            feedback={false}
                        />
                    </div>

                    <div className={'field col-12'}>
                        <label htmlFor="files">{lang === 'en' ? 'Files' : 'الملفات'}</label>
                        <CustomFileUpload
                            id="files"
                            files={employeeData.files}
                            setFiles={files => setEmployeeData({ ...employeeData, files })}
                            removeThisItem={() => {
                                setEmployeeData({ ...employeeData, files: [] });
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className={'flex justify-center mt-5'}>
                <Button
                    label={lang === 'en' ? 'Add Employee' : 'إضافة الموظف'}
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