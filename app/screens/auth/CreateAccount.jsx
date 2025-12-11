import { fonts, colors } from '@/theme';
import { useApi, useForm } from '@/hooks';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { ClientsInput, ClientsButton, ClientsLayout } from '@/components';

const CreateAccount = ({ navigation }) => {
  const { post, loading } = useApi();
  const { bind, values, validate, setField } = useForm({
    nin: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    fullName: '',
    hasChamber: '',
    chamberName: '',
    enrolleeNumber: '',
  });

  const addChambers = name => name.trim() ? name.replace(/\s+and\s+/gi, ' & ').replace(/\s+Chambers?$/i, '').trim() + ' Chambers' : '';

  const onSubmit = async () => {
    if (!validate()) {return;}

    try {
      const response = await post({
        requiresAuth: false,
        endpoint: 'register',
        onErrorMessage: 'Network error!',
        onSuccessMessage: 'User registered successfully!',
        data: { ...values, chamberName: addChambers(values.chamberName) },
      });

      if (response) {
        navigation.navigate('OTPScreen', { email: values.email, password: values.password });
      }
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  const genderOptions = [
    { key: 'male', label: 'Male', icon: 'male', color: colors.blue4 },
    { key: 'female', label: 'Female', icon: 'female', color: colors.red2 },
    {
      key: 'other',
      label: 'Other',
      color: colors.grey4,
      icon: 'ellipse-outline',
    },
  ];

  return (
    <ClientsLayout title="Create Account">
      <View style={styles.section}>
        <ClientsInput darkLabel="Full Name" placeholder="Enter full name" {...bind('fullName')} />

        <Text style={styles.text}>Do you have an already registered chambers?</Text>
        <View style={styles.gender}>
          {['yes', 'no'].map(option => (
            <Pressable
              key={option}
              onPress={() => setField('hasChamber', option)}
              style={[styles.genderOption, values.hasChamber === option && styles.genderOptionSelected]}
            >
              <Text style={[styles.genderLabel, values.hasChamber === option && styles.genderLabelSelected]}>
                {option[0].toUpperCase() + option.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {values.hasChamber && (
          <ClientsInput
            {...bind('chamberName')}
            placeholder="Enter chambers name"
            onBlur={() => setField('chamberName', addChambers(values.chamberName))}
            darkLabel={values.hasChamber === 'yes' ? 'Existing Registered Chambers' : 'Create a New Chambers'}
          />
        )}

        <ClientsInput type="scn" darkLabel="SCN" placeholder="SCN Number" {...bind('enrolleeNumber')} />

        <Text style={styles.text}>Gender</Text>
        <View style={styles.gender}>
          {genderOptions.map(({ key, icon, label, color }) => {
            const selected = values.gender === key;
            return (
              <Pressable
                key={key}
                onPress={() => setField('gender', key)}
                style={[
                  styles.genderOption,
                  selected && styles.genderOptionSelected,
                ]}>
                <Icon name={icon} size={15} color={color} />
                <Text
                  style={[
                    styles.genderLabel,
                    selected && styles.genderLabelSelected,
                  ]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <ClientsInput type="nin" darkLabel="NIN" {...bind('nin')} placeholder="Enter NIN" />
        <ClientsInput type="email" darkLabel="Email" {...bind('email')} placeholder="Enter email" />
        <ClientsInput type="phone" darkLabel="Phone" {...bind('phone')} placeholder="Enter phone" />
        <ClientsInput isPassword darkLabel="Password" {...bind('password')} placeholder="Create password" />

        <ClientsButton space={20} text="Continue" loading={loading} onPress={onSubmit} />
      </View>
    </ClientsLayout>
  );
};

const styles = StyleSheet.create({
  section: { gap: 15, paddingBottom: '10%' },
  text: { ...fonts.medium(), marginBottom: -15, color: colors.grey1 },
  gender: { gap: 15, flexDirection: 'row', justifyContent: 'space-between' },
  genderOption: {
    gap: 5,
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: colors.grey2,
  },
  genderOptionSelected: {
    borderColor: colors.black,
    backgroundColor: colors.black,
  },
  genderLabel: {
    marginTop: 4,
    ...fonts.regular(),
    color: colors.grey1,
  },
  genderLabelSelected: {
    color: colors.white,
  },
});

export default CreateAccount;
