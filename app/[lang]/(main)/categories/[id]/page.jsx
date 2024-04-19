import EditCategoryForm from '../../../../components/Main/category/EditCategoryForm/EditCategoryForm';


export default function EditCategoryPage({params: {lang, id}}) {
    return (
        <EditCategoryForm lang={lang} id={id} />
    );
}