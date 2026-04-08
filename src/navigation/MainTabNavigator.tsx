import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Heart, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { MainTabParamList } from '../types';
import { textFont } from '../constants/typography';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<string, React.ComponentType<any>> = {
  Home,
  Favorites: Heart,
  Settings,
};

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, 10);
  const activeRouteName = state.routes[state.index]?.name;
  const useLightForeground = activeRouteName === 'Settings';
  const inactiveColor = useLightForeground ? 'rgba(255,255,255,0.86)' : '#322B45';
  const activeLabelColor = '#FFFFFF';

  return (
    <View style={[styles.tabBarWrap, { bottom: bottomOffset }]}>
      <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? route.name;
        const isFocused = state.index === index;
        const Icon = TAB_ICONS[route.name] ?? Home;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={[styles.tabItem, isFocused && styles.tabItemActive]}
            onPress={onPress}
            activeOpacity={0.8}
          >
            <View style={styles.tabIconWrap}>
              <Icon
                size={21}
                color={isFocused ? '#FFFFFF' : inactiveColor}
                strokeWidth={isFocused ? 2.5 : 2}
                fill={isFocused && route.name === 'Favorites' ? '#FFFFFF' : 'transparent'}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                { color: inactiveColor },
                isFocused && styles.tabLabelActive,
                isFocused && { color: activeLabelColor },
              ]}
            >
              {String(label)}
            </Text>
          </TouchableOpacity>
        );
      })}
      </View>
    </View>
  );
}

export const MainTabNavigator: React.FC = () => (
  <Tab.Navigator
    tabBar={props => <CustomTabBar {...props} />}
    sceneContainerStyle={{ backgroundColor: '#EDE9F6' }}
    screenOptions={{
      headerStyle: { backgroundColor: '#FFFFFF' },
      headerTintColor: '#1E1B2E',
      headerShadowVisible: false,
      headerTitleStyle: {
        ...textFont(),
        fontWeight: '900',
        color: '#1E1B2E',
        fontSize: 20,
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Qoppy', tabBarLabel: 'Snippets' }}
    />
    <Tab.Screen
      name="Favorites"
      component={FavoritesScreen}
      options={{ title: 'Qoppy', tabBarLabel: 'Favorites' }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: 'Settings', tabBarLabel: 'Settings' }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBarWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 20,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(33, 25, 50, 0.34)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: 28,
    shadowColor: '#140C24',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    gap: 4,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tabItemActive: {
    backgroundColor: '#7C3AED',
  },
  tabIconWrap: {
    width: 32,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    ...textFont(),
    fontSize: 11,
    fontWeight: '900',
  },
  tabLabelActive: {
    fontWeight: '900',
  },
});

export default MainTabNavigator;
