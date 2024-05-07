import EmployeeList from '../../../components/Main/Employee/EmployeeList/EmployeeList';


export default function EmployeePage({params: {lang}}) {
    return(
        <>
            <div className="container">
                <EmployeeList lang={lang} />
            </div>
        </>
    )
}