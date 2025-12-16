import { fonts, colors } from '@/theme';
import { useForm } from '@/hooks';
import { Text, StyleSheet } from 'react-native';
import { ClientsButton, ClientsLayout, ClientsInput } from '@/components';

const ForgotPassword = ({ navigation }) => {
    const { bind, values, validate } = useForm({ email: '' });

    const sendCode = () => {
        if (!validate()) {
            return;
        }

        navigation.navigate('OTPScreen', { email: values.email, nextScreen: 'NewPassword' });
    };

    return (
        <ClientsLayout title="Forgot Password">
            <Text style={styles.title}>Forgot Password</Text>

            <Text style={styles.label}>Enter your account email to receive a reset code.</Text>

            <ClientsInput type="email" {...bind('email')} label="Email Address" leftIcon="mail-outline" placeholder="you@email.com" />

            <ClientsButton space={{ top: 18 }} text="Send Reset Code" onPress={sendCode} />
        </ClientsLayout>
    );
};

const styles = StyleSheet.create({
    title: { ...fonts.regular(20), color: colors.black, paddingBottom: 8 },
    label: { ...fonts.regular(14), color: colors.grey3, paddingBottom: 12 },
});

export default ForgotPassword;
