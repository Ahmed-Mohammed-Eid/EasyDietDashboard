'use client';

import React from 'react';
import ContentContainer from '../../../components/Main/Branches/ContentContainer';

export default function BranchManagerPage({params: {lang}}) {
    return (
        <ContentContainer lang={lang} />
    );
}