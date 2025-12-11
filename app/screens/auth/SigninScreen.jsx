import { setToken } from '@/auth/token';
import { fonts, colors } from '@/theme';
import { useApi, useForm } from '@/hooks';
import { useUser } from '@/context/UserContext';
import { ClientsInput, ClientsButton } from '@/components';
import { Text, View, Image, Keyboard, Platform, ScrollView, StyleSheet, ImageBackground, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';

const SigninScreen = ({ route, navigation }) => {
  const { fetchUser } = useUser();
  const { post, loading } = useApi();

  const prefill = route.params?.prefill || { email: '', password: '' };
  const { bind, values, validate } = useForm({ email: prefill.email, password: prefill.password });

  const onSubmit = async () => {
    if (!validate()) { return; }

    try {
      const response = await post({
        data: values,
        endpoint: 'login',
        requiresAuth: false,
        onSuccessMessage: 'Sign in successful!',
      });

      if (response?.token) {
        await setToken(response.token);
        const fetchedUser = await fetchUser();
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground source={require('@/assets/images/advocate.png')} style={styles.container}>
        <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.section}>
            <Image source={require('@/assets/images/brand.png')} style={styles.brand} />

            <ClientsInput type="email" {...bind('email')} label="Email Address" leftIcon="mail-outline" placeholder="you@email.com" />
            <ClientsInput isPassword label="Password" {...bind('password')} leftIcon="lock-closed" placeholder="Enter your password" />

            <Text style={styles.forgot}>Forgot Password?</Text>

            <ClientsButton isLight text="Sign In" loading={loading} onPress={onSubmit} />
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Text style={styles.signText} onPress={() => navigation.navigate('CreateAccount')}>Sign Up</Text>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  footer: {
    gap: 5,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  section: {
    gap: 20,
    flexGrow: 1,
    marginTop: 80,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  brand: { marginBottom: 80, alignSelf: 'center' },
  forgot: { ...fonts.medium(12), color: colors.white },
  signText: { color: colors.white, ...fonts.regular(12) },
  footerText: { ...fonts.light(12), color: colors.grey4 },
});

export default SigninScreen;
