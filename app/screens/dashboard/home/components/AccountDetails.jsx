import { useToast } from '@/hooks';
import { fonts, colors } from '@/theme';
import { kycMeta } from '@/utils/kycMeta';
import { useUser } from '@/context/UserContext';
import ClientsButton from '@/components/ClientsButton';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Text, View, Linking, StyleSheet } from 'react-native';

const AccountDetails = () => {
    const toast = useToast();
    const { user } = useUser();
    const navigation = useNavigation();
    const { color, state } = kycMeta(useUser().user?.kyc);

    const handlePress = () => {
        if (state === 'verified') {
            Clipboard.setString(user?.wallet?.accountNumber ?? '');
            toast.showSuccess('Copied to clipboard!');
        } else if (state === 'pending') {
            Linking.openURL('mailto:').catch(() =>
                toast.showWarning('Unable to open mail app')
            );
        } else {
            navigation.navigate('KYCScreen', { data: user });
        }
    };

    return (
        <View style={[{ backgroundColor: state === 'verified' ? colors.white : color }, styles.container]}>
            <View>
                {state === 'verified' && <Text style={styles.account}>Account Details</Text>}
                {state === 'verified' && <Text style={styles.number}>{user?.wallet?.accountNumber}</Text>}
                {state === 'verified' && <Text style={styles.name}>{user?.wallet?.accountName}</Text>}
                {state === 'verified' && <Text style={styles.name}>{user?.wallet?.bankName}</Text>}

                {state === 'pending' && <Text style={styles.kyc}>Verification Pending</Text>}
                {state === 'pending' && <Text style={[styles.account, { color: colors.white }]}>
                    {"You'll be notified via email\nonce verified (after 24 hours)."}
                </Text>}

                {state === 'unverified' && <Text style={styles.kyc}>Verification Alert</Text>}
                {state === 'unverified' && <Text style={[styles.account, { color: colors.white }]}>
                    {'Proceed to complete\nyour KYC to be verified.\nThank you!'}
                </Text>}
            </View>
            <ClientsButton
                iconSize={14}
                onPress={handlePress}
                bgColor={state === 'verified' ? colors.grey9 : colors.white}
                text={state === 'verified' ? 'Copy' : state === 'pending' ? 'Email' : 'Verify'}
                leftIcon={state === 'verified' ? 'copy' : state === 'pending' ? 'mail' : 'shield-checkmark'}
                textColor={state === 'verified' ? colors.grey7 : state === 'pending' ? colors.yellow3 : colors.red4}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 16,
        marginBottom: 18,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.10), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)',
    },
    account: {
        color: colors.grey6,
        ...fonts.regular(12),
    },
    number: {
        marginTop: 5,
        marginBottom: -5,
        color: colors.grey5,
        ...fonts.medium(16),
    },
    name: {
        marginBottom: -5,
        color: colors.grey4,
        ...fonts.regular(12),
    },
    kyc: {
        marginBottom: 10,
        color: colors.white,
        ...fonts.medium(16),
    },
});

export default AccountDetails;
