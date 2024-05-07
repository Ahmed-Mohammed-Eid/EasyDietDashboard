import AddClientForm from '../../../../components/Main/Clients/addForm';

export default function AddClientPage({ params: { lang } }) {
    return (
        <AddClientForm lang={lang} />
    );
}