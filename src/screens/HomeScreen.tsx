import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { CustomButton } from '../components/CustomButton';

export const HomeScreen: React.FC = () => {
  // Lấy dữ liệu và hàm từ Context API
  const { user, usersList, isLoading, fetchUsers, logout } = useAuth();

  if (!user) return null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Thanh tiêu đề trên cùng */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greetingText}>Xin chào,</Text>
          <Text style={styles.nameText}>
            {user.firstName} {user.lastName}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.logoutIconButton}
          onPress={logout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Thẻ hiển thị thông tin User từ DummyJSON */}
      <View style={styles.card}>
        <View style={styles.avatarRow}>
          {user.image ? (
            <Image source={{ uri: user.image }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Ionicons name="person" size={32} color="#2563EB" />
            </View>
          )}
          <View style={styles.infoCol}>
            <Text style={styles.userName}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.userUsername}>@{user.username}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        {/* Mã Token lấy từ DummyJSON */}
        <View style={styles.tokenBox}>
          <Text style={styles.tokenLabel}>Access Token (DummyJSON):</Text>
          <Text style={styles.tokenValue} numberOfLines={2}>
            {user.token || 'Không có token'}
          </Text>
        </View>
      </View>

      {/* 3. Phần thực hành: Lấy danh sách Users từ DummyJSON qua Context API */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Danh sách người dùng (GET /users)</Text>
        <CustomButton
          title={usersList.length > 0 ? 'Tải lại danh sách' : 'Tải danh sách'}
          onPress={fetchUsers}
          loading={isLoading}
          variant="outline"
          iconName="cloud-download-outline"
          style={styles.fetchBtn}
        />
      </View>

      {/* Hiển thị danh sách nếu đã tải */}
      {usersList.length > 0 ? (
        <View style={styles.listContainer}>
          {usersList.map((item) => (
            <View key={item.id} style={styles.userItem}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.itemAvatar} />
              ) : (
                <View style={styles.itemAvatarFallback}>
                  <Ionicons name="person" size={18} color="#2563EB" />
                </View>
              )}
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.itemSub}>
                  @{item.username} • {item.email}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyBox}>
          <Ionicons name="people-outline" size={36} color="#94A3B8" />
          <Text style={styles.emptyText}>
            Bấm nút "Tải danh sách" ở trên để xem Context API lấy dữ liệu từ dummyjson.com/users
          </Text>
        </View>
      )}

      {/* 4. Nút Đăng xuất chính */}
      <View style={styles.footerAction}>
        <CustomButton
          title="Đăng xuất khỏi tài khoản"
          onPress={logout}
          variant="danger"
          iconName="log-out-outline"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 14,
    color: '#64748B',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  logoutIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
  },
  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCol: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  userUsername: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  tokenBox: {
    marginTop: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 10,
  },
  tokenLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  tokenValue: {
    fontSize: 11,
    color: '#334155',
    fontFamily: 'monospace',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  fetchBtn: {
    width: 'auto',
    height: 38,
    paddingHorizontal: 14,
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
  },
  itemAvatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  itemSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    marginBottom: 24,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerAction: {
    marginTop: 10,
  },
});
