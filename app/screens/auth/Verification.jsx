import { useEffect } from 'react';
import { fonts, colors } from '@/theme';
import { Text, View, StyleSheet } from 'react-native';
import ClientsLayout from '@/components/ClientsLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Verification = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
    }, 3000);
  }, [navigation]);

  return (
    <ClientsLayout
      title="Verification"
      onBackPress={() =>
        navigation.reset({
          routes: [{ name: 'SplashScreen', params: { skipAnimation: true } }],
        })
      }>
      <View style={styles.shield}>
        <Icon name="shield-half-full" size={30} color={colors.yellow1} />
      </View>
      <View style={styles.section}>
        <Text style={[styles.text, styles.heading]}>Documents Received</Text>
        <Text style={[styles.text, styles.caption]}>
          Your documents have been submitted for verification.
        </Text>
        <Text style={[styles.text, styles.content]}>
          Our team is reviewing your application. Your account will be created
          in <Text style={styles.time}>24 hours.</Text>
        </Text>

        <View style={styles.steps}>
          <View>
            <View style={[styles.stepCircle, styles.stepCurrent]} />
            <Text style={styles.stepText}>Submitted</Text>
          </View>
          <View style={styles.stepLine} />
          <View>
            <View style={styles.stepCircle} />
            <Text style={styles.stepText}>Verified</Text>
          </View>
          <View style={styles.stepLine} />
          <View>
            <View style={styles.stepCircle} />
            <Text style={styles.stepText}>Created</Text>
          </View>
        </View>

        <View style={styles.notify}>
          <Icon name="clock-outline" size={18} color={colors.grey1} />
          <Text style={styles.email}>
            We'll notify you via email when you've been verified.
          </Text>
        </View>
      </View>
      <Text style={styles.copyRight}>
        © 2025 Clients Account. All rights reserved.
      </Text>
    </ClientsLayout>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 15,
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.10), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)',
  },
  shield: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grey6,
  },
  text: { textAlign: 'center' },
  heading: {
    ...fonts.medium(20),
    color: colors.grey3,
  },
  caption: {
    ...fonts.regular(16),
    color: colors.grey1,
  },
  content: {
    ...fonts.light(),
    color: colors.grey6,
  },
  time: {
    ...fonts.medium(),
    color: colors.black,
  },
  steps: {
    gap: 10,
    marginVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stepCircle: {
    width: 15,
    height: 15,
    borderWidth: 2,
    borderRadius: 10,
    alignSelf: 'center',
    borderColor: colors.grey8,
  },
  stepLine: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.black,
  },
  stepText: {
    ...fonts.light(12),
    color: colors.grey1,
  },
  stepCurrent: { backgroundColor: colors.black },
  notify: {
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'center',
    borderColor: colors.grey2,
    backgroundColor: colors.offWhite0,
  },
  email: {
    color: colors.grey7,
    ...fonts.regular(12),
  },
  copyRight: {
    marginTop: 50,
    ...fonts.light(12),
    textAlign: 'center',
    color: colors.grey4,
  },
});

export default Verification;
