import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store.js';
import AppNavigator from './AppNavigator.jsx';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { PaperProvider } from 'react-native-paper';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

function App() {
  const toastConfig = {
    // success: props => (
    //   <BaseToast
    //     {...props}
    //     style={{ borderLeftColor: 'pink' }}
    //     contentContainerStyle={{ paddingHorizontal: 15 }}
    //     text1Style={{
    //       fontSize: 15,
    //       fontWeight: '400',
    //     }}
    //   />
    // ),
    // error: props => (
    //   <ErrorToast
    //     {...props}
    //     text1Style={{
    //       fontSize: 17,
    //     }}
    //     text2Style={{
    //       fontSize: 15,
    //     }}
    //   />
    // ),



    customNotificationSuccess: ({ text1 }) => (
      <LinearGradient
        colors={['#EE9AE5', '#7B7ED1']}
        start={{ x: 1, y: 0 }} // Top-left
        end={{ x: 0, y: 1 }}   // Bottom-right
        style={{
          height: 50,
          width: '60%',
          borderRadius: 30,
          padding: 15,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5, // For Android shadow
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
          {text1}
        </Text>
      </LinearGradient>
    ),


    customNotificationError: ({ text1 }) => (
      <LinearGradient
        colors={['#ED5D36', '#DC281E', "#F03B1D"]}
        start={{ x: 0, y: 0 }} // Top-left
        end={{ x: 0, y: 1 }}   // Bottom-right
        style={{
          height: 50,
          width: '60%',
          borderRadius: 30,
          padding: 15,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5, // For Android shadow
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
          {text1}
        </Text>
      </LinearGradient>
    )
  };

  return (
    // <SafeAreaProvider>
    <Provider store={store}>
      <PaperProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppNavigator />
          <Toast config={toastConfig} />
        </GestureHandlerRootView>
      </PaperProvider>
    </Provider>
    // </SafeAreaProvider>
  );
}

export default App;
