import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types/product';
import { productService, CategoryItem } from '../services/productService';
import { useCart } from '../contexts/CartContext';

interface ProductsScreenProps {
  onOpenCart: () => void;
}

export const ProductsScreen: React.FC<ProductsScreenProps> = ({ onOpenCart }) => {
  const { addToCart, totalCount } = useCart();
  const { width } = useWindowDimensions();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [addedNoticeId, setAddedNoticeId] = useState<number | null>(null);

  // Tính số cột hiển thị theo chiều rộng màn hình (responsive Web & Mobile)
  const numColumns = width > 1024 ? 4 : width > 640 ? 3 : 2;
  const itemWidth = (width > 500 ? Math.min(width, 1000) : width) / numColumns - 16;

  // Tải danh sách sản phẩm
  const loadProducts = useCallback(async (cat: string = 'all') => {
    setIsLoading(true);
    try {
      const result = await productService.getProducts(30, 0, cat);
      setProducts(result.products);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tải danh mục sản phẩm
  const loadCategories = async () => {
    try {
      const cats = await productService.getCategories();
      setCategories([{ slug: 'all', name: 'Tất cả' }, ...cats]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts('all');
  }, [loadProducts]);

  // Tìm kiếm sản phẩm
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadProducts(selectedCategory);
      return;
    }
    setIsLoading(true);
    try {
      const results = await productService.searchProducts(query.trim());
      setProducts(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Chọn danh mục
  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug);
    setSearchQuery('');
    loadProducts(slug);
  };

  // Kéo xuống để tải lại
  const onRefresh = async () => {
    setIsRefreshing(true);
    if (searchQuery.trim()) {
      await handleSearch(searchQuery);
    } else {
      await loadProducts(selectedCategory);
    }
    setIsRefreshing(false);
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = (item: Product) => {
    addToCart(item, 1);
    setAddedNoticeId(item.id);
    setTimeout(() => {
      setAddedNoticeId((current) => (current === item.id ? null : current));
    }, 1200);
  };

  // Render từng sản phẩm
  const renderProduct = ({ item }: { item: Product }) => {
    const isAdded = addedNoticeId === item.id;
    const finalPrice = Math.round(item.price * (1 - (item.discountPercentage || 0) / 100) * 100) / 100;

    return (
      <View style={[styles.productCard, { width: itemWidth }]}>
        {/* Nhãn giảm giá */}
        {item.discountPercentage > 5 ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{Math.round(item.discountPercentage)}%</Text>
          </View>
        ) : null}

        {/* Ảnh thumbnail */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.thumbnail}
            resizeMode="contain"
          />
        </View>

        {/* Thông tin sản phẩm */}
        <View style={styles.cardContent}>
          <Text style={styles.categoryTag} numberOfLines={1}>
            {item.category.toUpperCase()}
          </Text>

          <Text style={styles.productTitle} numberOfLines={2}>
            {item.title}
          </Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            {item.brand ? (
              <Text style={styles.brandText} numberOfLines={1}>
                • {item.brand}
              </Text>
            ) : null}
          </View>

          {/* Giá tiền */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceText}>${finalPrice.toFixed(2)}</Text>
              {item.discountPercentage > 5 ? (
                <Text style={styles.originalPriceText}>${item.price.toFixed(2)}</Text>
              ) : null}
            </View>

            {/* Nút thêm vào giỏ */}
            <TouchableOpacity
              style={[styles.addBtn, isAdded ? styles.addBtnSuccess : null]}
              onPress={() => handleAddToCart(item)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isAdded ? 'checkmark' : 'cart-outline'}
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Khám phá sản phẩm</Text>

        </View>

        {/* Nút mở giỏ hàng */}
        <TouchableOpacity style={styles.cartButton} onPress={onOpenCart} activeOpacity={0.8}>
          <Ionicons name="bag-handle-outline" size={24} color="#0F172A" />
          {totalCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalCount > 99 ? '99+' : totalCount}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên sản phẩm..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => handleSearch('')} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Danh mục cuộn ngang */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.slug}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.slug;
            return (
              <TouchableOpacity
                style={[styles.categoryChip, isSelected ? styles.categoryChipActive : null]}
                onPress={() => handleSelectCategory(item.slug)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryChipText, isSelected ? styles.categoryChipTextActive : null]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Danh sách sản phẩm */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingLabel}>Đang tải danh sách sản phẩm...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="cube-outline" size={48} color="#94A3B8" />
          <Text style={styles.emptyTitle}>Không tìm thấy sản phẩm nào</Text>
          <Text style={styles.emptySubtitle}>Thử tìm kiếm với từ khóa khác hoặc chọn danh mục "Tất cả"</Text>
          <TouchableOpacity
            style={styles.resetSearchBtn}
            onPress={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              loadProducts('all');
            }}
          >
            <Text style={styles.resetSearchText}>Xem tất cả sản phẩm</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          key={numColumns}
          data={products}
          numColumns={numColumns}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          contentContainerStyle={styles.productsList}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#2563EB']} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    outlineStyle: 'none' as any,
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  categoryChipActive: {
    backgroundColor: '#2563EB',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  productsList: {
    padding: 12,
    paddingBottom: 24,
    maxWidth: 1024,
    alignSelf: 'center',
    width: '100%',
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 2,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  imageContainer: {
    height: 140,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 10,
  },
  categoryTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 2,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    height: 36,
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  brandText: {
    fontSize: 11,
    color: '#94A3B8',
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  originalPriceText: {
    fontSize: 11,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnSuccess: {
    backgroundColor: '#10B981',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingLabel: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 300,
  },
  resetSearchBtn: {
    marginTop: 16,
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetSearchText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
