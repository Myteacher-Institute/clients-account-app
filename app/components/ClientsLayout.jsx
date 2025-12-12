import { colors } from '@/theme';
import ClientsHeader from '@/components/ClientsHeader';
import { View, StyleSheet, ScrollView, useColorScheme, RefreshControl } from 'react-native';
import { useUser } from '@/context/UserContext';

const ClientsLayout = ({
  children,
  title = null,
  rightIcon = null,
  showHeader = false,
  onBackPress = null,
  onRightPress = null,
  customHeader = null,
  enableRefresh = false,
}) => {
  const { fetchUser, loading } = useUser();
  const isDark = useColorScheme() === 'dark';
  const shouldShowBack = showHeader || Boolean(title);
  const backgroundColor = isDark ? colors.offWhite0 : colors.offWhite0;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {customHeader
        ? customHeader
        : shouldShowBack && (
          <ClientsHeader
            title={title}
            rightIcon={rightIcon}
            onBackPress={onBackPress}
            onRightPress={onRightPress}
            backgroundColor={backgroundColor}
          />
        )}

      <ScrollView
        style={styles.content}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          enableRefresh ? (
            <RefreshControl refreshing={loading} onRefresh={fetchUser} />
          ) : null
        }
      >
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: '5%' },
});

export default ClientsLayout;
