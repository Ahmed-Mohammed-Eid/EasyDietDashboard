import EmployeeAddForm from '../../../../components/Main/Employee/EmployeeAddForm/EmployeeAddForm';


export default function AddEmployeePage({params: {lang}}) {
    return(
        <>
            <div className="container">
                <EmployeeAddForm lang={lang} />
            </div>
        </>
    )
}