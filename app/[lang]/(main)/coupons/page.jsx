import CouponsList from '../../../components/Main/Coupons/CouponsList/CouponsList';

export default function CouponsPage({params: {lang}}) {

    return(
        <>
            <div className="container">
                <CouponsList lang={lang} />
            </div>
        </>
    )
}