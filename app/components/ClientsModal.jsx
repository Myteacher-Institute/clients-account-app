import { fonts, colors } from '@/theme';
import { useRef, useEffect } from 'react';
import { Text, View, Modal, Animated, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const ClientsModal = ({
    onClose,
    children,
    title = '',
    footer = null,
    mode = 'center',
    isLight = false,
    visible = false,
    footerStyle = {},
}) => {
    const backdropClosable = mode !== 'fullscreen';
    const opacity = useRef(new Animated.Value(0)).current;
    const textColor = isLight ? colors.black : colors.white;
    const backgroundColor = isLight ? colors.white : colors.black;

    useEffect(() => {
        Animated.timing(opacity, {
            duration: 200,
            useNativeDriver: true,
            toValue: visible ? 1 : 0,
        }).start();
    }, [visible, opacity]);

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={backdropClosable ? onClose : undefined}>
                <Animated.View style={[styles.fullscreen, styles[`${mode}Overlay`], { opacity }]}>
                    <View style={[{ backgroundColor }, styles[mode]]} onStartShouldSetResponder={() => true}>
                        {mode === 'fullscreen' ? (
                            <>
                                {title ? <Text style={[styles.title, styles.sticky, { color: textColor }]}>{title}</Text> : null}

                                <ScrollView
                                    style={styles.fullscreen}
                                    keyboardDismissMode="on-drag"
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={styles.sticky}
                                >
                                    {children}
                                </ScrollView>

                                {footer ? <View style={[styles.sticky, footerStyle]}>{footer}</View> : null}
                            </>
                        ) : <ScrollView>{children}</ScrollView>}
                    </View>
                </Animated.View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    sticky: { padding: 12 },
    fullscreen: { flex: 1 },
    title: { textAlign: 'center', ...fonts.medium(18) },
    centerOverlay: { justifyContent: 'center', backgroundColor: colors.black },
    bottomOverlay: { justifyContent: 'flex-end', backgroundColor: colors.offWhite6 },
    bottom: {
        width: '100%',
        maxHeight: '80%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: colors.white,
    },
});

export default ClientsModal;
