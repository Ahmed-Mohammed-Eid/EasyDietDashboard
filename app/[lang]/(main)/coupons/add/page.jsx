import CouponsAddForm from '../../../../components/Main/Coupons/CouponsAddForm/CouponsAddForm';

export default function AddCouponsPage({params: {lang}}) {
    return (
        <CouponsAddForm lang={lang} />
    );
}