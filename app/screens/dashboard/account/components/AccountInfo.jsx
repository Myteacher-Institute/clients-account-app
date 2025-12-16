import { fonts, colors } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AccountInfo = () => {
    const navigation = useNavigation();

    const infos = [
        {
            color: colors.blue1,
            icon: 'bank-outline',
            screen: 'PayoutMethods',
            title: 'Payment Methods',
            content: 'Add payment method',
        },
        {
            color: colors.green0,
            icon: 'lock-outline',
            screen: 'SecurityScreen',
            title: 'Password & Security',
            content: 'Change password, 2FA',
        },
        {
            color: colors.red0,
            icon: 'bell-outline',
            title: 'Notifications',
            screen: 'NotificationsScreen',
            content: 'Transactions & Activities',
        },
        {
            title: 'About App',
            icon: 'alert-circle',
            color: colors.yellow3,
            screen: 'AboutScreen',
            content: 'Version & Legal',
        },
    ];

    const groups = [infos.slice(0, 2), infos.slice(2)];

    return groups.map((group, idx) => (
        <View key={idx} style={styles.container}>
            {group.map((item, index) => {
                const isLast = index === group.length - 1;
                return (
                    <Pressable
                        key={item.title}
                        style={[styles.info, !isLast && styles.border]}
                        onPress={() => navigation.navigate(item.screen)}>
                        <View style={[styles.info, styles.mark]}>
                            <Icon name={item.icon} size={20} color={item.color} />
                            <View>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.content}>{item.content}</Text>
                            </View>
                        </View>
                        <Icon name="chevron-right" size={20} color={colors.grey4} />
                    </Pressable>
                );
            })}
        </View>
    ));
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        marginBottom: 10,
        backgroundColor: colors.white,
        boxShadow:
            '0px 1px 2px rgba(0, 0, 0, 0.10), 0px 1px 3px rgba(0, 0, 0, 0.10)',
    },
    info: {
        padding: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    border: {
        borderBottomWidth: 1,
        borderColor: colors.grey10,
    },
    title: {
        color: colors.grey3,
        ...fonts.regular(16),
    },
    content: {
        marginTop: -5,
        ...fonts.light(12),
        color: colors.grey6,
    },
    mark: {
        gap: 10,
        padding: 0,
    },
});

export default AccountInfo;
