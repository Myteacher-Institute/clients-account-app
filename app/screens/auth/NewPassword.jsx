import { fonts, colors } from '@/theme';
import { useApi, useForm } from '@/hooks';
import { useToast } from '@/hooks/useToast';
import { Text, StyleSheet } from 'react-native';
import { ClientsInput, ClientsButton, ClientsLayout } from '@/components';

const NewPassword = ({ route, navigation }) => {
    const { showWarning } = useToast();
    const { post, loading } = useApi();
    const preEmail = route.params?.email || '';
    const { bind, values, validate } = useForm({ email: preEmail, password: '', confirmPassword: '' }, ['email', 'password', 'confirmPassword']);

    const onSubmit = async () => {
        if (!validate()) {
            return;
        }

        if (values.password !== values.confirmPassword) {
            showWarning('Passwords do not match');
            return;
        }

        try {
            const codeFromParams = route.params?.code;
            await post({
                requiresAuth: false,
                endpoint: 'resetPassword',
                onSuccessMessage: 'Password updated successfully',
                data: { email: values.email, code: codeFromParams, password: values.password },
            });
            navigation.replace('SigninScreen', { prefill: { email: values.email, password: values.password } });
        } catch (err) {
            console.error('Reset password failed', err);
        }
    };

    return (
        <ClientsLayout title="Create New Password">
            <Text style={styles.title}>Create New Password</Text>
            <Text style={styles.sub}>Create your new password.</Text>

            <ClientsInput isPassword label="New Password" {...bind('password')} leftIcon="lock-closed" placeholder="Enter new password" />
            <ClientsInput isPassword label="Confirm Password" {...bind('confirmPassword')} leftIcon="lock-closed" placeholder="Confirm new password" />

            <ClientsButton space={18} text="Update Password" loading={loading} onPress={onSubmit} />
        </ClientsLayout>
    );
};

const styles = StyleSheet.create({
    title: { ...fonts.regular(20), color: colors.black, paddingBottom: 8 },
    sub: { ...fonts.regular(14), color: colors.grey3, paddingBottom: 12 },
});

export default NewPassword;
