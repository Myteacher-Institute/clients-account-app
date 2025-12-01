import { useApi } from '@/hooks';
import { setToken } from '@/auth/token';
import { fonts, colors } from '@/theme';
import { useUser } from '@/context/UserContext';
import OTPTextView from 'react-native-otp-textinput';
import { Text, View, StyleSheet } from 'react-native';
import { ClientsButton, ClientsLayout } from '@/components';

const OTPScreen = ({ navigation }) => {
  const { fetchUser } = useUser();
  const { post, loading } = useApi();

  const onSubmit = async () => {
    try {
      const response = await post({
        endpoint: 'login',
        requiresAuth: false,
        onSuccessMessage: 'Sign in successful!',
      });

      if (response?.token) {
        await setToken(response.token);
        console.log('[OTPScreen] Token stored.');

        let fetchedUser = await fetchUser();
        const kycStatus = fetchedUser?.kyc;

        !kycStatus
          ? navigation.navigate('KYCScreen', { data: fetchedUser })
          : navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
      }
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  return (
    <ClientsLayout title="OTP Verification">
      <View style={styles.container}>
        <Text style={styles.label}>Enter the 6-digit code sent to you at user@gmail.com</Text>
        <OTPTextView inputCount={6} tintColor={colors.black} textInputStyle={styles.otpInput} />
        <Text style={styles.resend}>I haven&apos;t received a code (0.09)</Text>
      </View>

      <ClientsButton
        space={20}
        text="Continue"
        loading={loading}
        onPress={() => navigation.navigate('SigninScreen')}
      />
    </ClientsLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    paddingBottom: 10,
    color: colors.black,
    ...fonts.regular(20),
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    borderBottomWidth: 1,
    ...fonts.regular(12),
  },
  resend: {
    marginTop: 50,
    ...fonts.light(16),
    color: colors.black,
  },
});

export default OTPScreen;
