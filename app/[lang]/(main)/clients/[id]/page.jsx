import EditClientForm from '../../../../components/Main/Clients/editForm';



export default function EditClientPage({ params: { lang, id } }) {
    return (
        <EditClientForm lang={lang} id={id} />
    );
}
