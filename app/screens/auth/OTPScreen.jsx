import { useApi } from '@/hooks';
import { fonts, colors } from '@/theme';
import { useState, useEffect, useCallback } from 'react';
import { ClientsButton, ClientsLayout } from '@/components';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Cursor, CodeField, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';

const OTPScreen = ({ route, navigation }) => {
  const { post, loading } = useApi();
  const [code, setCode] = useState('');
  const { email, password } = route.params;

  const CELL_COUNT = 6;
  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value: code, setValue: setCode });

  // Auto-send OTP when page loads
  useEffect(() => {
    sendOtp();
  }, [sendOtp]);

  const sendOtp = useCallback(async () => {
    try {
      // Clear any existing code in the input before requesting a new OTP
      setCode('');

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
        requiresAuth: false,
        endpoint: 'emailOtp',
        data: { email, otp: code },
        onSuccessMessage: 'Email verified',
      });

      if (response) {
        if (route.params?.nextScreen) {
          // If OTP was requested as part of another flow (eg. reset password), navigate there
          navigation.replace(route.params.nextScreen, { email, code });
        } else {
          navigation.replace('SigninScreen', {
            prefill: { email, password },
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ClientsLayout title="OTP Verification">
      <Text style={styles.label}>Enter the code sent to {email}</Text>

      <CodeField
        ref={ref}
        {...props}
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        rootStyle={styles.codeFieldRoot}
        renderCell={({ index, symbol, isFocused }) => (
          <Text key={index} style={[styles.cell, isFocused && { borderColor: colors.black }]} onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
      <ClientsButton space={{ bottom: 12 }} loading={loading} onPress={verifyOtp} text="Verify Email" />

      <TouchableOpacity onPress={sendOtp} activeOpacity={0.7}>
        <Text style={styles.resend}>Resend Code</Text>
      </TouchableOpacity>
    </ClientsLayout>
  );
};

const styles = StyleSheet.create({
  label: {
    paddingBottom: 10,
    color: colors.black,
    ...fonts.regular(20),
  },
  codeFieldRoot: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  cell: {
    width: 44,
    height: 44,
    lineHeight: 44,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    ...fonts.regular(16),
    borderColor: colors.grey2,
  },
  resend: {
    ...fonts.light(16),
    color: colors.black,
  },
});

export default OTPScreen;
