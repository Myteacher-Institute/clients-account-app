import { useEffect } from 'react';
import baseUrl from '@/api/baseUrl';
import { getToken } from '@/auth/token';
import { WebView } from 'react-native-webview';
import { useUser } from '@/context/UserContext';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Pusher } from '@pusher/pusher-websocket-react-native';

function getQueryParams(url) {
  const params = {};
  const parts = url.split('?');
  if (parts.length === 2) {
    parts[1].split('&').forEach(param => {
      const [key, value] = param.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
  }

  return params;
}

function PaymentScreen({ route, navigation }) {
  const { checkoutURL } = route.params;
  const { user, setUser, setTopUps } = useUser();

  const updateUserAndTopUps = async userAndTopUps => {
    const token = await getToken();
    console.log('token', token);

    try {
      const response = await fetch(
        `${baseUrl}users/${user.id}/updateAfterDeposit`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userAndTopUps),
        },
      );

      const data = await response.json();
      setUser(data.user);
      setTopUps(data.topUps);
    } catch (error) {
      throw new Error('Failed to update user and top-ups:', error);
    }
  };

  const verifyPayment = async paymentReference => {
    const response = await fetch(
      `https://clientsaccount.online/api/v1/transaction/init/${paymentReference}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const data = await response.json();

    const topUpInfo = data.data.paymentData;

    user.wallet.accountBalance = data.data.user.bankDetails.accountBal;

    const userAndTopUps = { user, topUpInfo };
    await updateUserAndTopUps(userAndTopUps);
    navigation.replace('Dashboard');
  };

  function handleUrl(url) {
    //Get query parameter
    const param = getQueryParams(url);
    //checking for payment reference
    if (param?.paymentReference) {
      verifyPayment(param.paymentReference);
      return false;
    }

    return true;
  }

  /*const handleWebViewNavigation = navState => {
    handleUrl(navState.url);
  };*/

  const handleWebViewNavigationIOS = request => {
    return handleUrl(request.url);
  };

  useEffect(() => {
    let pusher;
    let channel;

    const initPusher = async () => {
      try {
        pusher = Pusher.getInstance();
        if (!pusher) {
          pusher = new Pusher();
        }

        await pusher.init({
          apiKey: '4fd1028b9953ef9f3f48', // 👈 make sure this matches your backend app key
          cluster: 'us2', // 👈 must match backend cluster
        });

        await pusher.connect();
        console.log('✅ Connected to Pusher');

        channel = await pusher.subscribe({
          channelName: 'transactions',
          onEvent: event => {
            console.log('📡 Event received:', event);
            console.log('👉 Event name:', event.eventName);
            console.log('👉 Event data:', event.data);
          },
        });

        console.log('✅ Subscribed to channel', channel);
      } catch (error) {
        console.log('🔥 Pusher error:', error);
      }
    };

    initPusher();

    return () => {
      /*if (channel) {
        channel.unsubscribe();
        console.log('👋 Unsubscribed from channel');
      }
      if (pusher) {
        pusher.disconnect();
        console.log('👋 Disconnected from Pusher');
      }*/
    };
  }, []);
  // 👈 empty array → runs once when PaymentScreen mounts

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: checkoutURL }}
        onShouldStartLoadWithRequest={handleWebViewNavigationIOS}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            color="#000"
            style={styles.loader}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default PaymentScreen;
