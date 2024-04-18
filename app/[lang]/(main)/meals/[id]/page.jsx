import MealsEditForm from '../../../../components/Main/Meals/MealsEditForm/MealsEditForm';

export default function EditMealPage({params: {id, lang}}) {
    return (
        <div className="container">
            <MealsEditForm lang={lang} id={id} />
        </div>
    );
}