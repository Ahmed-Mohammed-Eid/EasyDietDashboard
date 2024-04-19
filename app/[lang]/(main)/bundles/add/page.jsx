import BundlesAddForm from '../../../../components/Main/Bundles/BundlesAddForm/BundlesAddForm';

export default function AddBundlePage({params: { lang }}) {
    return (
        <BundlesAddForm lang={lang} />
    );
}