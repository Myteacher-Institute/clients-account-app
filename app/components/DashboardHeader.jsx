import { fonts, colors } from '@/theme';
import { kycMeta } from '@/utils/kycMeta';
import { useUser } from '@/context/UserContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text, View, Image, Pressable, StyleSheet } from 'react-native';

const DashboardHeader = () => {
    const { user } = useUser();
    const navigation = useNavigation();
    const { icon, color } = kycMeta(useUser().user?.kyc);

    return (
        <View style={styles.container}>
            <Pressable style={styles.profile} onPress={() => navigation.navigate('Account')}>
                <Image
                    style={styles.profileImg}
                    source={user?.avatar ? { uri: user.avatar } : require('@/assets/images/profile.png')}
                />
                <Text style={styles.profileName}>
                    Hi, {user?.fullName?.split(' ')[0] || 'Guest'}
                    {' '}<Icon name={icon} size={20} color={color} />
                </Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate('Account')}>
                <Icon name="bell-badge-outline" size={24} color={colors.black} />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 60,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: '5%',
        backgroundColor: colors.white,
        justifyContent: 'space-between',
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
    },
    profile: {
        gap: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    profileImg: {
        width: 40,
        height: 40,
        borderRadius: 50,
        resizeMode: 'cover',
    },
    profileName: {
        color: colors.grey5,
        ...fonts.medium(18),
    },
});

export default DashboardHeader;
