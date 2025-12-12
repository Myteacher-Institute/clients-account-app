import ClientsLayout from '@/components/ClientsLayout';
import AccountBalance from './components/AccountBalance';
import AccountDetails from './components/AccountDetails';
import AccountUpdates from './components/AccountUpdates';
import RecentTransactions from './components/RecentTransactions';

const HomeScreen = () => {
    return (
        <ClientsLayout enableRefresh>
            <AccountBalance />
            <AccountDetails />
            <AccountUpdates />
            <RecentTransactions />
        </ClientsLayout>
    );
};

export default HomeScreen;
