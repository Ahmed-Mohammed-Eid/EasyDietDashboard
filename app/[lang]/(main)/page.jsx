/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { getDictionary } from '../../dictionaries/dictionaries';

const Dashboard = async ({params: {lang}}) => {

    const dictionary = await getDictionary(lang);

    return (
        <div className="grid">
            <h1>{dictionary.home.welcome}</h1>
        </div>
    );
};

export default Dashboard;
