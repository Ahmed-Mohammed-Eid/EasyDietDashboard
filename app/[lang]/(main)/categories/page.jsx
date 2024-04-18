import CategoriesList from '../../../components/Main/category/CategoriesList/CategoriesList';

export default function Categories({params: {lang}}){
    return(
        <CategoriesList lang={lang} />
    )
}