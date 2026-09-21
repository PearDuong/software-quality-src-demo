import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { CartItem } from '../types/product';
import { CustomButton } from '../components/CustomButton';

interface CartScreenProps {
  onBackToShop: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({ onBackToShop }) => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalCount,
    subtotal,
    discountTotal,
    totalPrice,
  } = useCart();

  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  // Xử lý khi bấm nút Đặt hàng
  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setIsCheckoutSuccess(true);
      clearCart();
    }, 1000);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const discountedUnitPrice =
      Math.round(item.product.price * (1 - (item.product.discountPercentage || 0) / 100) * 100) / 100;
    const itemTotal = Math.round(discountedUnitPrice * item.quantity * 100) / 100;

    return (
      <View style={styles.cartCard}>
        {/* Ảnh sản phẩm */}
        <View style={styles.thumbWrapper}>
          <Image source={{ uri: item.product.thumbnail }} style={styles.thumbnail} resizeMode="contain" />
        </View>

        {/* Thông tin sản phẩm */}
        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle} numberOfLines={2}>
              {item.product.title}
            </Text>
            {/* Nút xóa món */}
            <TouchableOpacity
              onPress={() => removeFromCart(item.product.id)}
              style={styles.deleteBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <Text style={styles.unitPrice}>
            Đơn giá: ${discountedUnitPrice.toFixed(2)}{' '}
            {item.product.discountPercentage > 5 ? (
              <Text style={styles.originalPrice}>${item.product.price.toFixed(2)}</Text>
            ) : null}
          </Text>

          {/* Hàng tăng giảm số lượng & Tổng tiền món */}
          <View style={styles.actionRow}>
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                activeOpacity={0.7}
              >
                <Ionicons name={item.quantity === 1 ? 'trash-outline' : 'remove'} size={16} color="#475569" />
              </TouchableOpacity>

              <Text style={styles.qtyText}>{item.quantity}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={16} color="#475569" />
              </TouchableOpacity>
            </View>

            <Text style={styles.itemTotalPrice}>${itemTotal.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToShop} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>Giỏ hàng</Text>
          <Text style={styles.headerSubtitle}>
            {totalCount > 0 ? `${totalCount} sản phẩm đã chọn` : 'Chưa có sản phẩm nào'}
          </Text>
        </View>
        {items.length > 0 ? (
          <TouchableOpacity onPress={clearCart} style={styles.clearBtn} activeOpacity={0.7}>
            <Text style={styles.clearBtnText}>Xóa tất cả</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      {/* Nội dung giỏ hàng */}
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="cart-outline" size={54} color="#94A3B8" />
          </View>
          <Text style={styles.emptyTitle}>Giỏ hàng của bạn đang trống</Text>
          <Text style={styles.emptySubtitle}>
          </Text>
          <CustomButton
            title="Khám phá sản phẩm ngay"
            onPress={onBackToShop}
            iconName="bag-handle-outline"
            style={styles.exploreBtn}
          />
        </View>
      ) : (
        <View style={styles.cartContentWrapper}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id.toString()}
            renderItem={renderCartItem}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          {/* Bảng tổng kết & Thanh toán */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tạm tính:</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>

            {discountTotal > 0 ? (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tiết kiệm / Giảm giá:</Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>
                  -${discountTotal.toFixed(2)}
                </Text>
              </View>
            ) : null}

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí giao hàng:</Text>
              <Text style={[styles.summaryValue, styles.freeShip]}>Miễn phí</Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
              <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
            </View>

            <CustomButton
              title={`Thanh toán ngay • $${totalPrice.toFixed(2)}`}
              onPress={handleCheckout}
              loading={isCheckingOut}
              iconName="card-outline"
              style={styles.checkoutBtn}
            />
          </View>
        </View>
      )}

      {/* Modal Thông báo Đặt hàng thành công */}
      <Modal visible={isCheckoutSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-circle" size={60} color="#10B981" />
            </View>
            <Text style={styles.modalTitle}>Đặt hàng thành công!</Text>
            <Text style={styles.modalText}>
              Cảm ơn bạn đã trải nghiệm tính năng giỏ hàng và thanh toán trên ứng dụng.
            </Text>
            <CustomButton
              title="Tiếp tục mua sắm"
              onPress={() => {
                setIsCheckoutSuccess(false);
                onBackToShop();
              }}
              iconName="arrow-forward-outline"
              style={styles.modalBtn}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitles: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  clearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  clearBtnText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 300,
    lineHeight: 18,
  },
  exploreBtn: {
    marginTop: 24,
    minWidth: 220,
  },
  cartContentWrapper: {
    flex: 1,
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
  },
  cartList: {
    padding: 16,
    paddingBottom: 8,
    gap: 12,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbWrapper: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  deleteBtn: {
    padding: 4,
  },
  unitPrice: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    paddingHorizontal: 10,
  },
  itemTotalPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563EB',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  discountValue: {
    color: '#EF4444',
  },
  freeShip: {
    color: '#10B981',
    fontWeight: '700',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 14,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
  },
  checkoutBtn: {
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    maxWidth: 380,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  successIconCircle: {
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalBtn: {
    width: '100%',
  },
});
