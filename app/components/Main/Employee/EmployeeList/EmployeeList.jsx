'use client';

import { useEffect, useState } from 'react';
// PRIME REACT
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';

// HELPERS
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import {InputMask} from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import CustomFileUpload from '../../Layout/customFileUpload/customFileUpload';

export default function EmployeeList({ lang }) {

    // STATES
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeToDelete, setSelectedEmployeeToDelete] = useState(null);
    const [selectedEmployeeToChangeStatus, setSelectedEmployeeToChangeStatus] = useState(null);
    const [selectedEmployeeToEdit, setSelectedEmployeeToEdit] = useState(null);
    // STATE FOR EDIT EMPLOYEE
    const [employeeEditData, setEmployeeEditData] = useState({
        fullName: '',
        username: '',
        role: '',
        password: '',
        address: '',
        phoneNumber: '',
        files: '',
        userId: ''
    });

    // EFFECT TO FETCH DATA
    useEffect(() => {
        // API CALL /employees
        getEmployees();
    }, []);

    // GET THE EMPLOYEES HANDLER
    const getEmployees = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // API CALL /employees
        axios.get(`${process.env.API_URL}/get/all/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setEmployees(res.data?.users || []);
            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Failed to fetch employees' : 'فشل في جلب المستخدمين');
            });
    };

    // EDIT EMPLOYEE
    const editEmployee = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATION
        if (!employeeEditData.fullName || !employeeEditData.username || !employeeEditData.role) {
            toast.error(lang === 'en' ? 'Please fill all required fields' : 'يرجى ملء جميع الحقول المطلوبة');
            return toast.error(lang === 'en' ? 'Please fill all required fields' : 'يرجى ملء جميع الحقول المطلوبة');
        }

        // USER ID VALIDATION
        if (!employeeEditData.userId) {
            toast.error(lang === 'en' ? 'User not found' : 'المستخدم غير موجود');
            return;
        }

        // FORM DATA
        const data = new FormData();
        data.append('fullName', employeeEditData.fullName);
        data.append('username', employeeEditData.username);
        data.append('role', employeeEditData.role);
        data.append('password', employeeEditData.password);
        data.append('address', employeeEditData.address);
        data.append('phoneNumber', employeeEditData.phoneNumber);
        data.append('userId', employeeEditData.userId);

        if (employeeEditData?.files?.length) {
            employeeEditData.files.forEach(file => {
                data.append('files', file);
            });
        }

        // API CALL /employees
        axios.put(`${process.env.API_URL}/edit/user`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(_ => {
                setSelectedEmployeeToEdit(null);
                setEmployeeEditData({
                    fullName: '',
                    username: '',
                    role: '',
                    password: '',
                    address: '',
                    phoneNumber: '',
                    files: '',
                    userId: ''
                });
                toast.success(lang === 'en' ? 'Employee edited successfully' : 'تم تعديل المستخدم بنجاح');
                // REFRESH THE EMPLOYEES
                getEmployees();
            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Failed to edit employees' : 'فشل في تعديل المستخدم');
            });
    };

    // DELETE EMPLOYEE
    const deleteEmployee = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // API CALL /employees
        axios.delete(`${process.env.API_URL}/delete/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                userId: selectedEmployeeToDelete._id
            }
        })
            .then(res => {
                setSelectedEmployeeToDelete(null);
                toast.success(lang === 'en' ? 'Employee deleted successfully' : 'تم حذف المستخدم بنجاح');
                // REFRESH THE EMPLOYEES
                getEmployees();
            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Failed to delete employees' : 'فشل في حذف المستخدم');
            });
    };

    // CHANGE STATUS OF EMPLOYEE TO ACTIVE OR INACTIVE
    const changeStatus = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE THE USER ID
        if (!selectedEmployeeToChangeStatus?._id) {
            toast.error(lang === 'en' ? 'User not found' : 'المستخدم غير موجود');
            return;
        }

        // API CALL /employees
        axios.put(`${process.env.API_URL}/set/user/active`, {
            userId: selectedEmployeeToChangeStatus._id,
            isActive: !selectedEmployeeToChangeStatus.isActive
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setSelectedEmployeeToChangeStatus(null);
                toast.success(lang === 'en' ? 'Employee status changed successfully' : 'تم تغيير حالة المستخدم بنجاح');
                // REFRESH THE EMPLOYEES
                getEmployees();
            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Failed to change employee status' : 'فشل في تغيير حالة المستخدم');
            });
    };


    return (
        <>
            <div className="card">
                <DataTable
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                    // value={employees || []}
                    value={employees || []}
                    paginator
                    rows={25}
                    rowsPerPageOptions={[25, 50, 100]}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    header={lang === 'en' ? 'EMPLOYEES' : 'المستخدمين'}
                    emptyMessage={lang === 'en' ? 'No employees found' : 'لم يتم العثور على كوبونات'}
                    className="p-datatable-sm"
                >
                    <Column
                        field="fullName"
                        header={lang === 'en' ? 'Full Name' : 'الاسم الكامل'}
                        style={{ width: '20%' }}
                    />
                    <Column
                        field="username"
                        header={lang === 'en' ? 'Username' : 'اسم المستخدم'}
                        style={{ width: '20%' }}
                        body={(rowData) => {
                            // COPY TO CLIPBOARD
                            const copyToClipboard = (text) => {
                                navigator.clipboard.writeText(text);
                                toast.success(lang === 'en' ? 'Copied to clipboard' : 'تم النسخ إلى الحافظة');
                            };

                            return (
                                <div className={'flex justify-between'}>
                                    <Tag
                                        severity={'info'}
                                        value={rowData.username}
                                        onClick={() => copyToClipboard(rowData.username)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            );

                        }}
                    />

                    <Column
                        field="phoneNumber"
                        header={lang === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                        style={{ width: '20%' }}
                    />
                    <Column
                        field="role"
                        header={lang === 'en' ? 'Role' : 'الدور'}
                        style={{ width: '20%' }}
                    />
                    <Column
                        field="isActive"
                        header={lang === 'en' ? 'Status' : 'الحالة'}
                        style={{ width: '10%' }}
                        body={(rowData) => {
                            return (
                                <Tag
                                    severity={rowData.isActive ? 'success' : 'danger'}
                                    value={rowData.isActive ? 'Active' : 'Inactive'}
                                />
                            );
                        }}
                    />

                    {/*  ACTIONS  */}
                    <Column
                        body={(rowData) => {
                            return (
                                <div className={'flex justify-center'}>
                                    <button
                                        className={'AMB_btn AMB_btn-secondary'}
                                        onClick={() => setSelectedEmployeeToChangeStatus(rowData)}
                                    >
                                        {lang === 'en' ? 'Change Status' : 'تغيير الحالة'}
                                    </button>

                                    <button
                                        className={'AMB_btn AMB_btn-primary'}
                                        onClick={() => {
                                            // SET THE EMPLOYEE DATA
                                            setEmployeeEditData({
                                                fullName: rowData.fullName,
                                                username: rowData.username,
                                                role: rowData.role,
                                                password: '',
                                                address: rowData.address,
                                                phoneNumber: rowData.phoneNumber,
                                                files: rowData.files,
                                                userId: rowData._id
                                            });

                                            setSelectedEmployeeToEdit(rowData);
                                        }}
                                    >
                                        {lang === 'en' ? 'Edit' : 'تعديل'}
                                    </button>

                                    <button
                                        className={'AMB_btn AMB_btn-danger'}
                                        onClick={() => setSelectedEmployeeToDelete(rowData)}
                                    >
                                        {lang === 'en' ? 'Delete' : 'حذف'}
                                    </button>
                                </div>
                            );
                        }}
                        header={lang === 'en' ? 'Actions' : 'الإجراءات'}
                        style={{ width: '10%' }}
                    />
                </DataTable>

                {/* DELETE DIALOG */}
                <Dialog
                    visible={selectedEmployeeToDelete}
                    onHide={() => setSelectedEmployeeToDelete(null)}
                    header={lang === 'en' ? 'Delete Employee' : 'حذف المستخدم'}
                    footer={(
                        <div className={'flex justify-center'}>
                            <button
                                className={'AMB_btn AMB_btn-danger'}
                                onClick={() => deleteEmployee(selectedEmployeeToDelete)}
                            >
                                {lang === 'en' ? 'Delete' : 'حذف'}
                            </button>
                            <button className={'AMB_btn AMB_btn-primary'}
                                    onClick={() => setSelectedEmployeeToDelete(null)}>
                                {lang === 'en' ? 'Cancel' : 'إلغاء'}
                            </button>
                        </div>
                    )}
                    position={'center'}
                    style={{ width: '100%', maxWidth: '500px' }}
                    draggable={false}
                    resizable={false}
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                >
                    <div className={'flex justify-center'}>
                        <p>{lang === 'en' ? 'Are you sure you want to delete this employee?' : 'هل أنت متأكد أنك تريد حذف هذا المستخدم؟'}</p>
                    </div>
                </Dialog>

                {/* CHANGE STATUS DIALOG */}
                <Dialog
                    visible={selectedEmployeeToChangeStatus}
                    onHide={() => setSelectedEmployeeToChangeStatus(null)}
                    header={lang === 'en' ? 'Edit Employee' : 'تعديل المستخدم'}
                    footer={(
                        <div className={'flex justify-center'}>
                            <button
                                className={'AMB_btn AMB_btn-primary'}
                                onClick={() => changeStatus()}
                            >
                                {lang === 'en' ? 'Save' : 'حفظ'}
                            </button>
                            <button className={'AMB_btn AMB_btn-danger'}
                                    onClick={() => setSelectedEmployeeToChangeStatus(null)}>
                                {lang === 'en' ? 'Cancel' : 'إلغاء'}
                            </button>
                        </div>
                    )}
                    position={'center'}
                    style={{ width: '100%', maxWidth: '500px' }}
                    draggable={false}
                    resizable={false}
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                >
                    <div className={'flex justify-center'}>
                        <p>{lang === 'en' ? 'Are you sure you want to change the status of this employee?' : 'هل أنت متأكد أنك تريد تغيير حالة هذا المستخدم؟'}</p>
                    </div>
                </Dialog>

                {/* EDIT EMPLOYEE DIALOG */}
                <Dialog
                    onHide={() => {
                        setSelectedEmployeeToEdit(null);
                        setEmployeeEditData({
                            fullName: '',
                            username: '',
                            role: '',
                            password: '',
                            address: '',
                            phoneNumber: '',
                            files: '',
                            userId: ''
                        });
                    }}
                    visible={selectedEmployeeToEdit}
                    header={lang === 'en' ? 'Edit Employee' : 'تعديل المستخدم'}
                    footer={(
                        <div className={'flex justify-center'}>
                            <button className={'AMB_btn AMB_btn-primary'}
                                    onClick={() => editEmployee(selectedEmployeeToEdit)}>{lang === 'en' ? 'Save' : 'حفظ'}</button>
                            <button className={'AMB_btn AMB_btn-danger'}
                                    onClick={() => {
                                        setSelectedEmployeeToEdit(null);
                                        setEmployeeEditData({
                                            fullName: '',
                                            username: '',
                                            role: '',
                                            password: '',
                                            address: '',
                                            phoneNumber: '',
                                            files: '',
                                            userId: ''
                                        });
                                    }}>{lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                        </div>
                    )}
                    position={'center'}
                    style={{ width: '90%'}}
                    draggable={false}
                    resizable={false}
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                    maximizable={true}
                >
                    <div className={'p-fluid formgrid grid'}>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor="fullName">{lang === 'en' ? 'Full Name' : 'الاسم الكامل'}</label>
                            <InputText id="fullName" value={employeeEditData.fullName}
                                       onChange={(e) => setEmployeeEditData({
                                           ...employeeEditData,
                                           fullName: e.target.value
                                       })}
                                placeholder={lang === 'en' ? 'Full Name' : 'الاسم الكامل'}
                            />
                        </div>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor="username">{lang === 'en' ? 'Username' : 'اسم المستخدم'}</label>
                            <InputText id="username" value={employeeEditData.username}
                                       onChange={(e) => setEmployeeEditData({
                                           ...employeeEditData,
                                           username: e.target.value
                                       })}
                                placeholder={lang === 'en' ? 'Username' : 'اسم المستخدم'}
                            />
                        </div>
                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor="role">{lang === 'en' ? 'Role' : 'الدور'}</label>
                            <Dropdown
                                id="role"
                                value={employeeEditData.role}
                                options={[
                                    { label: 'Admin', value: 'admin' },
                                    { label: 'Manager', value: 'manager' },
                                    { label: 'Diet Specialist', value: 'diet specialist' },
                                ]}
                                onChange={(e) => setEmployeeEditData({ ...employeeEditData, role: e.value })}
                                placeholder={lang === 'en' ? 'Select Role' : 'اختر الدور'}
                            />
                        </div>

                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor="password">{lang === 'en' ? 'Password' : 'كلمة المرور'}</label>
                            <Password
                                id="password"
                                value={employeeEditData.password}
                                onChange={(e) => setEmployeeEditData({ ...employeeEditData, password: e.target.value })}
                                feedback={false}
                                toggleMask={true}
                                placeholder={lang === 'en' ? 'Password' : 'كلمة المرور'}
                            />
                        </div>

                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor="address">{lang === 'en' ? 'Address' : 'العنوان'}</label>
                            <InputText id="address" value={employeeEditData.address}
                                       onChange={(e) => setEmployeeEditData({
                                           ...employeeEditData,
                                           address: e.target.value
                                       })}
                                placeholder={lang === 'en' ? 'Address' : 'العنوان'}
                            />
                        </div>

                        <div className={'field col-12 md:col-6'}>
                            <label htmlFor="phoneNumber">{lang === 'en' ? 'Phone Number' : 'رقم الهاتف'}</label>
                            <InputMask
                                id="phoneNumber"
                                mask="99999999"
                                value={employeeEditData.phoneNumber}
                                       onChange={(e) => setEmployeeEditData({
                                           ...employeeEditData,
                                           phoneNumber: e.target.value
                                       })}
                                placeholder={lang === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                            />
                        </div>

                        <div className={'field col-12'}>
                            <label htmlFor="files">{lang === 'en' ? 'Files' : 'الملفات'}</label>
                            <CustomFileUpload
                                setFiles={(files) => setEmployeeEditData({ ...employeeEditData, files })}
                                removeThisItem={() => setEmployeeEditData({ ...employeeEditData, files: '' })}
                            />
                        </div>

                    </div>
                </Dialog>
            </div>
        </>
    );
}