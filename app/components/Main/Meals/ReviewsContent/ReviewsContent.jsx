'use client';

import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';

import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ReviewsContent({ lang }) {

    // STATES
    const [mealId, setMealId] = useState('');
    const [reviews, setReviews] = useState([]);
    const [meals, setMeals] = useState([]);

    // EFFECT TO GET THE MEAL REVIEWS
    useEffect(() => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE
        if (!mealId) {
            return;
        }

        // GET THE REVIEWS
        axios.get(`${process.env.API_URL}/meal/reviews?mealId=${mealId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }

        })
            .then(res => {
                const mealReviews = res.data?.mealReviews?.reviews || [];
                setReviews(mealReviews);
            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Failed to get the reviews' : 'فشل في جلب التقييمات');
            });
    }, [lang, mealId]);

    // HANDLER TO GET THE MEALS
    function getMeals() {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // GET THE MEALS
        axios.get(`${process.env.API_URL}/get/all/meals?page=1`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                const meals = res.data?.data?.meals || [];

                // LOOP THROUGH THE MEALS TO MAKE A CUSTOM OBJECT FOR THE DROPDOWN
                const mealsOptions = meals.map(meal => {
                    return {
                        value: meal._id,
                        label: lang === 'en' ? meal.mealTitleEn : meal.mealTitle
                    };
                });

                // SET THE MEALS
                setMeals(mealsOptions);
            })
            .catch(err => {
                console.log(err);
                toast.error(lang === 'en' ? 'Failed to get the meals' : 'فشل في جلب الوجبات');
            });
    }

    // EFFECT TO GET THE MEALS
    useEffect(() => {
        getMeals();
    }, []);

    return (
        <>
            <div className={'card mb-2'} dir={
                lang === 'en' ? 'ltr' : 'rtl'
            }>
                <div className={'p-fluid formgrid grid'}>
                    <div className={'field col-12'}>
                        <label htmlFor="mealId" className={'mb-2'}>{lang === 'en' ? 'Meal' : 'الوجبة'}</label>
                        <Dropdown
                            id="mealId"
                            value={mealId}
                            filter={true}
                            options={meals || []}
                            onChange={(e) => setMealId(e.value)}
                            placeholder={lang === 'en' ? 'Select a meal' : 'اختر وجبة'}
                        />
                    </div>
                </div>
            </div>

            <div className={'card mb-0'} dir={lang === 'en' ? 'ltr' : 'rtl'}>
                <h1 className={'text-xl'}>{lang === 'en' ? 'Reviews List' : 'قائمة التقييمات'}</h1>
                <div className={'p-fluid formgrid grid gap-1'}>
                    {reviews.length > 0 && reviews.map(review => (
                        <div className={'card bg-gray-100 p-5 border col-12'} key={review._id}>
                            <div className={'flex items-center justify-between'}>
                                <div>
                                    {/*USER INFO*/}
                                    {(review?.clientId?.clientName && review?.clientId?.phoneNumber) && (<div className={'flex flex-column mb-3'}>
                                        <h3 className={'mb-0 text-lg'}>{review?.clientId?.clientName || ''}</h3>
                                        <span className={'text-gray-700 ml-2'}>{review?.clientId?.phoneNumber || ''}</span>
                                    </div>)}
                                    <p className={'flex flex-column'}><span
                                        className={'font-bold mb-2'}> {lang === 'en' ? 'Rating' : 'التقييم'}:</span>
                                        <Rating value={review?.rating} readOnly cancel={false} /></p>
                                    <p className={'flex flex-column'}><span
                                        className={'font-bold mb-2'}> {lang === 'en' ? 'Comment' : 'التعليق'}:</span> {review?.review}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}