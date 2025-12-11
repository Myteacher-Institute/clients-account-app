import { fonts, colors } from '@/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, View, Pressable, StyleSheet, ActivityIndicator } from 'react-native';

const ClientsButton = ({
    text,
    space,
    bgColor,
    onPress,
    leftIcon,
    rightIcon,
    textColor,
    textStyle,
    extraStyle,
    iconSize = 18,
    isLight = false,
    loading = false,
    outline = false,
    rounded = false,
    IconComponent = Ionicons,
    ...rest
}) => {
    const finalBg = bgColor ?? (isLight ? colors.white : colors.black);
    const finalText = textColor ?? (isLight ? colors.black : colors.white);

    const containerStyle = [
        {
            marginTop: space?.top ?? (typeof space === 'number' ? space : 0),
            backgroundColor: outline ? 'transparent' : finalBg,
            borderColor: outline ? finalText : 'transparent',
            marginBottom: space?.bottom ?? 0,
            borderRadius: rounded ? 50 : 8,
            borderWidth: outline ? 1 : 0,
            opacity: loading ? 0.6 : 1,
        },
        styles.container,
        extraStyle,
    ];

    const renderIcon = (name) => name ? <IconComponent name={name} size={iconSize} color={finalText} /> : null;

    return (
        <Pressable
            {...rest}
            onPress={loading ? undefined : onPress}
            style={({ pressed }) => [containerStyle, { opacity: pressed && !loading ? 0.85 : containerStyle[0].opacity }]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={finalText} />
            ) : (
                <View style={styles.content}>
                    {renderIcon(leftIcon)}
                    <Text style={[fonts.medium(16), { color: finalText }, textStyle]}>{text}</Text>
                    {renderIcon(rightIcon)}
                </View>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    content: {
        gap: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
});

export default ClientsButton;
