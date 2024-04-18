import MealsAddForm from '../../../../components/Main/Meals/MealsAddForm/MealsAddForm';


export default function MealsAddPage({ params: { lang } }) {
    return (
        <>
            <div className="container">
                <MealsAddForm lang={lang} />
            </div>
        </>
    );
}