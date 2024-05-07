import {Chart} from 'primereact/chart';

export default function ClientsChart({clientsStats, lang}) {
    const data = {
        labels: lang === 'en' ? ['All', 'Active', 'Active Online', 'Froze Online', 'Froze Offline', 'Inactive', 'Inactive Online', 'Inactive Offline'] : ['الكل', 'نشط', 'نشط اونلاين', 'مجمد اونلاين', 'مجمد اوفلاين', 'غير نشط', 'غير نشط اونلاين', 'غير نشط اوفلاين'],

        datasets: [
            {
                data: [
                    clientsStats?.all || 0,
                    clientsStats?.active || 0,
                    clientsStats?.activeOffline || 0,
                    clientsStats?.freezedOnline || 0,
                    clientsStats?.freezedOffline || 0,
                    clientsStats?.inactive || 0,
                    clientsStats?.inactiveOffline || 0
                ],
                backgroundColor: [
                    '#852437',
                    '#36A2EB',
                    '#9e7519',
                    '#5433c8',
                    '#563571',
                    '#41934c',
                    '#FF6384'
                ],
                hoverBackgroundColor: [
                    '#852437',
                    '#36A2EB',
                    '#9e7519',
                    '#5433c8',
                    '#563571',
                    '#41934c',
                    '#FF6384'
                ]
            }
        ]


    };

    return (
        <div className="card">
            <h5>Clients</h5>
            <Chart type="pie" data={data} />
        </div>
    );
}