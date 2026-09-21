import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../contexts/AuthContext';

export const LoginScreen: React.FC = () => {
  // Lấy hàm login, isLoading và error từ AuthContext
  const { login, isLoading, error } = useAuth();

  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [localError, setLocalError] = useState('');

  // Xử lý khi bấm nút Đăng nhập
  const handleLogin = async () => {
    if (!username.trim()) {
      setLocalError('Vui lòng nhập tên đăng nhập (Username)');
      return;
    }
    if (!password.trim()) {
      setLocalError('Vui lòng nhập mật khẩu (Password)');
      return;
    }

    setLocalError('');
    // Gọi hàm login từ Context API
    await login(username, password);
  };

  // Nút hỗ trợ điền nhanh tài khoản DummyJSON để học tập & kiểm thử
  const quickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setLocalError('');
  };

  const displayError = localError || error;

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tiêu đề ứng dụng */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="globe-outline" size={40} color="#2563EB" />
          </View>
          <Text style={styles.title}>User Management</Text>
          <Text style={styles.apiTag}>Nguồn dữ liệu: dummyjson.com</Text>
        </View>

        {/* Khung Form Đăng nhập */}
        <View style={styles.card}>
          {displayError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          ) : null}

          {/* Ô nhập Tên đăng nhập */}
          <CustomInput
            label="Tên đăng nhập (Username)"
            leftIconName="person-outline"
            placeholder="Ví dụ: emilys"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (localError) setLocalError('');
            }}
          />

          {/* Ô nhập Mật khẩu */}
          <CustomInput
            label="Mật khẩu (Password)"
            leftIconName="lock-closed-outline"
            placeholder="Ví dụ: emilyspass"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (localError) setLocalError('');
            }}
            isPassword
          />

          {/* Nút Đăng nhập */}
          <CustomButton
            title="Đăng nhập với DummyJSON"
            onPress={handleLogin}
            loading={isLoading}
            iconName="log-in-outline"
            style={styles.loginBtn}
          />
        </View>

        {/* Hộp gợi ý tài khoản mẫu từ dummyjson.com */}
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>💡 Tài khoản mẫu DummyJSON (Chạm để điền):</Text>
          <View style={styles.demoRow}>
            <TouchableOpacity
              style={styles.demoChip}
              onPress={() => quickFill('emilys', 'emilyspass')}
              activeOpacity={0.7}
            >
              <Text style={styles.demoName}>Emily Johnson</Text>
              <Text style={styles.demoUser}>User: emilys</Text>
              <Text style={styles.demoPass}>Pass: emilyspass</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoChip}
              onPress={() => quickFill('michaelw', 'michaelwpass')}
              activeOpacity={0.7}
            >
              <Text style={styles.demoName}>Michael Williams</Text>
              <Text style={styles.demoUser}>User: michaelw</Text>
              <Text style={styles.demoPass}>Pass: michaelwpass</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  apiTag: {
    fontSize: 13,
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
  },
  loginBtn: {
    marginTop: 10,
  },
  demoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoChip: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 2,
  },
  demoUser: {
    fontSize: 11,
    color: '#475569',
  },
  demoPass: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
