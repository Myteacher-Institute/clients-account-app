import { useApi } from '@/hooks';
import { fonts, colors } from '@/theme';
import OTPTextView from 'react-native-otp-textinput';
import { useState, useEffect, useCallback } from 'react';
import { ClientsButton, ClientsLayout } from '@/components';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const OTPScreen = ({ route, navigation }) => {
  const { post, loading } = useApi();
  const [code, setCode] = useState('');
  const { email, password } = route.params;

  // Auto-send OTP when page loads
  useEffect(() => {
    sendOtp();
  }, [sendOtp]);

  const sendOtp = useCallback(async () => {
    try {
      await post({
        data: { email },
        endpoint: 'sendOtp',
        requiresAuth: false,
        onSuccessMessage: 'OTP sent!',
      });
    } catch (error) {
      console.error(error);
    }
  }, [post, email]);

  const verifyOtp = async () => {
    try {
      const response = await post({
        endpoint: 'emailOtp',
        requiresAuth: false,
        data: { email, otp: code },
        onSuccessMessage: 'Email verified',
      });

      if (response) {
        navigation.replace('SigninScreen', {
          prefill: { email, password },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ClientsLayout title="OTP Verification">
      <View style={styles.container}>
        <Text style={styles.label}>Enter the code sent to {email}</Text>

        <OTPTextView
          inputCount={6}
          handleTextChange={setCode}
          tintColor={colors.black}
          textInputStyle={styles.otpInput}
        />

        <ClientsButton loading={loading} onPress={verifyOtp} text="Verify Email" />

        <TouchableOpacity onPress={sendOtp}>
          <Text style={styles.resend}>Resend Code</Text>
        </TouchableOpacity>
      </View>
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
