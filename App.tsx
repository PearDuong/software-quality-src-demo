import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { CartProvider, useCart } from './src/contexts/CartContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { ProductsScreen } from './src/screens/ProductsScreen';
import { CartScreen } from './src/screens/CartScreen';
import { HomeScreen } from './src/screens/HomeScreen';

type AuthMode = 'login' | 'register';
type MainTab = 'products' | 'cart' | 'profile';

const MainApp = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('products');
  const { totalCount } = useCart();

  return (
    <View style={styles.mainContainer}>
      {/* Nội dung theo Tab đang chọn */}
      <View style={styles.contentArea}>
        {activeTab === 'products' && (
          <ProductsScreen onOpenCart={() => setActiveTab('cart')} />
        )}
        {activeTab === 'cart' && (
          <CartScreen onBackToShop={() => setActiveTab('products')} />
        )}
        {activeTab === 'profile' && <HomeScreen />}
      </View>

      {/* Thanh Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {/* Tab 1: Sản phẩm */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('products')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'products' ? 'storefront' : 'storefront-outline'}
            size={22}
            color={activeTab === 'products' ? '#2563EB' : '#64748B'}
          />
          <Text style={[styles.navLabel, activeTab === 'products' && styles.navLabelActive]}>
            Sản phẩm
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Giỏ hàng */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('cart')}
          activeOpacity={0.7}
        >
          <View style={styles.cartIconWrapper}>
            <Ionicons
              name={activeTab === 'cart' ? 'cart' : 'cart-outline'}
              size={24}
              color={activeTab === 'cart' ? '#2563EB' : '#64748B'}
            />
            {totalCount > 0 && (
              <View style={styles.navBadge}>
                <Text style={styles.navBadgeText}>{totalCount > 99 ? '99+' : totalCount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.navLabel, activeTab === 'cart' && styles.navLabelActive]}>
            Giỏ hàng
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Tài khoản */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={22}
            color={activeTab === 'profile' ? '#2563EB' : '#64748B'}
          />
          <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>
            Tài khoản
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const RootNavigator = () => {
  const { user, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  if (isLoading && !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Đang tải ứng dụng...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {user ? (
        <MainApp />
      ) : authMode === 'login' ? (
        <LoginScreen onSwitchToRegister={() => setAuthMode('register')} />
      ) : (
        <RegisterScreen onSwitchToLogin={() => setAuthMode('login')} />
      )}
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RootNavigator />
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentArea: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 8,
    paddingBottom: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  navLabelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  cartIconWrapper: {
    position: 'relative',
  },
  navBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#EF4444',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  navBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});
