import BundlesList from '../../../components/Main/Bundles/BundlesList/BundlesList';

export default function bundlePage({ params: { lang } }) {
    return (
        <>
            <div className="container">
                <BundlesList lang={lang} />
            </div>
        </>
    );
}