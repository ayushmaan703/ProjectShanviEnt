import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './drawer navigation/DrawerNavigation';
import { initializeAuth } from './store/slice/Auth.slice';
import { useDispatch } from 'react-redux';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, []);


  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}