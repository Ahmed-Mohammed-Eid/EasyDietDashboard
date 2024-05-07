/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { getDictionary } from '../../dictionaries/dictionaries';

import Content from '../../components/Main/Home/Content/Content';

const Dashboard = async ({params: {lang}}) => {

    const dictionary = await getDictionary(lang);

    return (
        <Content dictionary={dictionary} lang={lang} />
    );
};

export default Dashboard;
