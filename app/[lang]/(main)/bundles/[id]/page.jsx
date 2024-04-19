import BundlesEditForm from '../../../../components/Main/Bundles/BundlesEditForm/BundlesEditForm';
export default function EditBundlePage({params: { lang, id }}) {
    return (
        <BundlesEditForm lang={lang} id={id} />
    );
}