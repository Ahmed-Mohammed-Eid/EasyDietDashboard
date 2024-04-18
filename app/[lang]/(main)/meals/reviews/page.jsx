import ReviewsContent from '../../../../components/Main/Meals/ReviewsContent/ReviewsContent';

export default function MealsReviewsPage({ params: { lang } }) {
    return (
        <ReviewsContent lang={lang} />
    );
}