import { colors, fonts } from '@/theme';
import { kycMeta } from '@/utils/kycMeta';
import { useMedia } from '@/hooks/useMedia';
import { CropView } from 'react-native-image-crop-tools';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { ClientsModal, ClientsButton } from '@/components';
import { Text, View, Image, Pressable, StyleSheet } from 'react-native';

const AccountProfile = () => {
  const {
    user,
    modal,
    cropRef,
    loading,
    photoUri,
    saveCrop,
    tempImage,
    pickImage,
    closeModal,
    openOptions,
    onImageCrop,
    openViewPhoto,
  } = useMedia();
  const { color, state } = kycMeta(user?.kyc);


  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          style={[styles.profileImg, { borderColor: color }]}
          source={photoUri ? { uri: photoUri } : require('@/assets/images/profile.png')}
        />
        <Pressable style={styles.cameraIcon} onPress={openOptions}>
          <Icon name="camera" size={14} color={colors.white} />
        </Pressable>
      </View>

      <Text style={styles.name}>{user?.fullName}</Text>
      <Text numberOfLines={1} style={styles.chamber}>{user?.chamberName}</Text>

      {state === 'verified' && (
        <View style={styles.button}>
          <View style={[styles.pill, styles.button, { backgroundColor: colors.green5 }]}>
            <Icon name="circle-check" solid size={12} color={colors.green4} />
            <Text style={[styles.pillText, { color: colors.green4 }]}>
              Verified Lawyer
            </Text>
          </View>
          <View style={[styles.pill, styles.button, { backgroundColor: colors.blue8 }]}>
            <Icon name="wallet" size={12} color={colors.blue4} />
            <Text style={[styles.pillText, { color: colors.blue4 }]}>
              Active Wallet
            </Text>
          </View>
        </View>
      )}

      <ClientsModal
        visible={!!modal}
        onClose={closeModal}
        footerStyle={styles.cropActions}
        title={modal === 'crop' && 'Crop'}
        mode={modal === 'options' ? 'bottom' : modal === 'crop' ? 'fullscreen' : 'center'}
        footer={modal === 'crop' && (
          <>
            <ClientsButton isLight text="Cancel" onPress={closeModal} extraStyle={styles.modalBtn} />
            <ClientsButton text="Save" loading={loading} onPress={saveCrop} bgColor={colors.yellow1} extraStyle={styles.modalBtn} />
          </>
        )}
      >
        {modal === 'options' && (
          <>
            <Pressable style={styles.modalItem} onPress={() => pickImage('camera')}>
              <Text style={styles.modalText}>Take Photo</Text>
            </Pressable>
            <Pressable style={styles.modalItem} onPress={() => pickImage('gallery')}>
              <Text style={styles.modalText}>Choose from Gallery</Text>
            </Pressable>
            <Pressable style={styles.modalItem} onPress={openViewPhoto}>
              <Text style={styles.modalText}>View Photo</Text>
            </Pressable>
            <Pressable style={styles.modalItem} onPress={closeModal}>
              <Text style={{ ...fonts.medium() }}>Cancel</Text>
            </Pressable>
          </>
        )}

        {modal === 'view' && (
          <Image style={styles.preview} source={photoUri ? { uri: photoUri } : require('@/assets/images/profile.png')} />
        )}

        {modal === 'crop' && tempImage && (
          <CropView
            ref={cropRef}
            keepAspectRatio
            cropShape="circle"
            sourceUrl={tempImage}
            onImageCrop={onImageCrop}
            style={styles.cropPreview}
            aspectRatio={{ width: 1, height: 1 }}
          />
        )}
      </ClientsModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  imageWrapper: { position: 'relative' },
  profileImg: {
    width: 80,
    height: 80,
    borderWidth: 4,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  cameraIcon: {
    right: 3,
    bottom: 3,
    padding: 6,
    borderRadius: 50,
    position: 'absolute',
    backgroundColor: colors.black,
  },
  name: { color: colors.grey3, ...fonts.semiBold(20), marginBottom: -18 },
  chamber: { ...fonts.regular(), color: colors.grey6 },
  button: {
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  pill: {
    gap: 4,
    borderRadius: 50,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  pillText: {
    color: colors.grey6,
    ...fonts.regular(12),
  },
  modalItem: {
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: colors.grey10,
  },
  modalText: { ...fonts.medium(16) },
  preview: { height: 360, width: '100%', resizeMode: 'cover' },
  cropPreview: { aspectRatio: 1 },
  cropActions: {
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: { flex: 1 },
});

export default AccountProfile;
