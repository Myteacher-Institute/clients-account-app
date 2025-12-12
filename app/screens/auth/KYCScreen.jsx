import { useState } from 'react';
import { fonts, colors } from '@/theme';
import terms from '@/assets/texts/terms';
import { useUser } from '@/context/UserContext';
import { useApi, useForm, useToast } from '@/hooks';
import { FilePicker } from '@/components/FilePicker';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { Text, View, Image, Linking, Pressable, StyleSheet } from 'react-native';
import { ClientsInput, ClientsModal, ClientsButton, ClientsLayout } from '@/components';

const KYCScreen = ({ route, navigation }) => {
  const { showWarning } = useToast();
  const { post, loading } = useApi();
  const { user, fetchUser } = useUser(); // we only need fetchUser now
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [modal, setModal] = useState({ visible: false, type: null });

  const { values, bind, validate, setField } = useForm({
    photo: null,
    cacCert: null,
    cacNumber: '',
    callToBar: null,
  });

  const openModal = (type) => setModal({ visible: true, type });
  const closeModal = () => {
    if (modal.type === 'terms') { setTermsAccepted(true); }
    setModal({ visible: false, type: null });
  };

  const handleCheckboxPress = () => openModal('terms');
  const handleContactSupport = () => openModal('contact');

  const uploadOptions = [
    { key: 'cacCert', label: 'Upload CAC Certificate (PDF, JPG)', icon: 'upload' },
    { key: 'callToBar', label: 'Upload Call to Bar Certificate (PDF)', icon: 'upload' },
    { key: 'photo', label: 'Upload Recent Photo (JPG, PNG)', icon: 'image' },
  ];

  const handleFilePick = async (key) => {
    try {
      const result = await FilePicker(key);
      setField(key, result);
    } catch (err) {
      console.log(`File pick failed for ${key}:`, err);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) { return; }
    if (!termsAccepted) { return showWarning('Accept terms to proceed'); }

    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (val?.uri) {
        const mimeType = key === 'photo' ? val.type || 'image/jpeg' : val.type || 'application/pdf';
        const fileExt = key === 'photo' ? '.jpg' : '.pdf';
        formData.append(key, { uri: val.uri, name: val.name || `${key}${fileExt}`, type: mimeType });
      } else {
        formData.append(key, val || '');
      }
    });

    try {
      await post({
        data: formData,
        dynamicId: user.id,
        requiresAuth: true,
        endpoint: 'uploadKYC',
        onErrorMessage: 'KYC submission failed',
        onSuccessMessage: 'KYC submitted successfully',
      });

      await fetchUser();
      navigation.navigate('Verification');
    } catch (error) {
      console.log('KYC submission failed:', error);
    }
  };

  const handleWhatsAppSupport = () => {
    const phone = '2349033935712';
    const message = encodeURIComponent(
      `Hello, My name is ${user?.fullName} and I need help with my CAC registration. I don't have the required documents yet.`
    );
    Linking.openURL(`https://wa.me/${phone}?text=${message}`).catch(() =>
      showWarning('Unable to open WhatsApp')
    );
  };

  return (
    <ClientsLayout title="KYC Verification">
      <View style={styles.section}>
        <View style={styles.header}>
          <Icon name="briefcase" size={22} color={colors.yellow1} />
          <Text style={styles.headerText}>Verify CAC Documents</Text>
        </View>

        <ClientsInput {...bind('cacNumber')} placeholder="e.g. RC1234567" darkLabel="CAC Registration Number" />

        {uploadOptions.map(({ key, label, icon }) => (
          <View key={key} style={styles.upload}>
            <Text style={styles.uploadText}>{label}</Text>

            <Pressable style={styles.button} onPress={() => handleFilePick(key)}>
              <Icon name={icon} size={15} color={colors.white} />
              <Text style={styles.buttonText}>Choose File</Text>
            </Pressable>

            {values[key]?.name && (
              <Text style={styles.fileName} numberOfLines={1}>
                {values[key].name}
              </Text>
            )}
          </View>
        ))}

        <Pressable onPress={handleCheckboxPress} style={styles.terms}>
          <View style={[styles.termsCircle, termsAccepted && styles.termsChecked]}>
            {termsAccepted && <Icon name="check" size={12} color={colors.white} />}
          </View>
          <Text style={styles.termsText}>I accept the terms and privacy policy</Text>
        </Pressable>

        <ClientsButton
          loading={loading}
          onPress={handleSubmit}
          text="Submit for Verification"
          leftIcon="shield-checkmark-outline"
        />
      </View>

      <Pressable style={styles.footer} onPress={handleContactSupport}>
        <Text style={styles.help}>Need help?</Text>
        <View style={styles.contact}>
          <Icon name="message" size={15} color={colors.black} />
          <Text style={styles.support}>Contact Support</Text>
        </View>
      </Pressable>

      <ClientsModal
        isLight
        scrollable
        onClose={closeModal}
        visible={modal.visible}
        title="Contact Support"
        mode={modal.type === 'terms' ? 'bottom' : 'fullscreen'}
      >
        {modal.type === 'terms' ? (
          terms.map((item, index) => (
            <View key={index} style={styles.container}>
              {item.type === 'section' ? (
                <>
                  <Text style={styles.modalSection}>{item.number}. {item.title}</Text>
                  {item.content.map((line, idx) => (
                    <Text key={idx} style={styles.modalText}>{line}</Text>
                  ))}
                </>
              ) : (
                <Text style={styles.modalText}>{item.text}</Text>
              )}
            </View>
          ))
        ) : (
          <View style={styles.continue}>
            <Image source={require('@/assets/images/support.png')} />
            <View>
              <Text style={{ ...fonts.medium(16), color: colors.grey3 }}>
                Need help with your documents? You can chat with support or continue to your dashboard.
              </Text>

              <ClientsButton space={20} text="Chat on WhatsApp" leftIcon="logo-whatsapp" onPress={handleWhatsAppSupport} />

              <ClientsButton
                space={20}
                leftIcon="home-outline"
                text="Continue to Dashboard"
                style={{ backgroundColor: colors.grey6 }}
                onPress={() => {
                  closeModal();
                  navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
                }}
              />
            </View>
          </View>
        )}
      </ClientsModal>
    </ClientsLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 10,
  },
  section: {
    gap: 10,
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  header: {
    gap: 10,
    marginBottom: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: { ...fonts.medium(18), color: colors.grey3 },
  upload: { gap: 2, marginTop: 10 },
  uploadText: { ...fonts.medium(), color: colors.grey1 },
  fileName: { marginBottom: -10, color: colors.grey2, ...fonts.regular(12) },
  button: {
    gap: 8,
    height: 45,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.grey6,
  },
  buttonText: { ...fonts.medium(), color: colors.white },
  terms: { gap: 6, marginTop: 10, alignItems: 'center', flexDirection: 'row' },
  termsText: { ...fonts.italic(), color: colors.grey3 },
  termsCircle: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: colors.grey2,
  },
  termsChecked: { borderColor: colors.yellow2, backgroundColor: colors.yellow2 },
  modalSection: { ...fonts.bold(16) },
  modalText: { ...fonts.medium(), marginLeft: 15 },
  footer: { marginTop: 20, alignItems: 'center' },
  help: { ...fonts.light(), color: colors.grey6 },
  contact: {
    gap: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  support: { ...fonts.medium(), color: colors.black },
  continue: { gap: 60, marginTop: 60 },
});

export default KYCScreen;
