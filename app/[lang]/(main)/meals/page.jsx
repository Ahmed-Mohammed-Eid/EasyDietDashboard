import MealsList from '../../../components/Main/Meals/MealsList/MealsList';

export default function MealsPage({ params: { lang } }) {
    return (
        <>
            <div className="container">
                <MealsList lang={lang} />
            </div>
        </>
    );
}