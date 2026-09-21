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

interface RegisterScreenProps {
  onSwitchToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onSwitchToLogin }) => {
  const { register, isLoading, error } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleRegister = async () => {
    if (!firstName.trim()) {
      setLocalError('Vui lòng nhập Họ (First Name)');
      return;
    }
    if (!lastName.trim()) {
      setLocalError('Vui lòng nhập Tên (Last Name)');
      return;
    }
    if (!username.trim()) {
      setLocalError('Vui lòng nhập Tên đăng nhập (Username)');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setLocalError('Vui lòng nhập Email hợp lệ');
      return;
    }
    if (!password || password.length < 6) {
      setLocalError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLocalError('');
    await register({
      firstName,
      lastName,
      username,
      email,
      password,
    });
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="person-add-outline" size={36} color="#2563EB" />
          </View>
          <Text style={styles.title}>Tạo tài khoản mới</Text>
          <Text style={styles.subtitle}>Điền thông tin bên dưới để đăng ký tài khoản</Text>
        </View>

        {/* Card Form */}
        <View style={styles.card}>
          {displayError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          ) : null}

          {/* Họ và Tên */}
          <View style={styles.nameRow}>
            <View style={styles.nameCol}>
              <CustomInput
                label="Họ"
                leftIconName="person-outline"
                placeholder="Nguyễn"
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  if (localError) setLocalError('');
                }}
              />
            </View>
            <View style={styles.nameCol}>
              <CustomInput
                label="Tên"
                placeholder="Văn An"
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  if (localError) setLocalError('');
                }}
              />
            </View>
          </View>

          {/* Username */}
          <CustomInput
            label="Tên đăng nhập"
            leftIconName="at-outline"
            placeholder="Ví dụ: nguyenvanan"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (localError) setLocalError('');
            }}
          />

          {/* Email */}
          <CustomInput
            label="Địa chỉ Email"
            leftIconName="mail-outline"
            placeholder="an.nguyen@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (localError) setLocalError('');
            }}
          />

          {/* Password */}
          <CustomInput
            label="Mật khẩu"
            leftIconName="lock-closed-outline"
            placeholder="Tối thiểu 6 ký tự"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (localError) setLocalError('');
            }}
            isPassword
          />

          {/* Confirm Password */}
          <CustomInput
            label="Xác nhận mật khẩu"
            leftIconName="shield-checkmark-outline"
            placeholder="Nhập lại mật khẩu ở trên"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (localError) setLocalError('');
            }}
            isPassword
          />

          {/* Submit Button */}
          <CustomButton
            title="Đăng ký tài khoản"
            onPress={handleRegister}
            loading={isLoading}
            iconName="checkmark-circle-outline"
            style={styles.registerBtn}
          />

          {/* Switch to Login */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={onSwitchToLogin} activeOpacity={0.7}>
              <Text style={styles.switchLink}>Đăng nhập ngay</Text>
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
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'center',
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
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
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameCol: {
    flex: 1,
  },
  registerBtn: {
    marginTop: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  switchText: {
    fontSize: 14,
    color: '#64748B',
  },
  switchLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
});
