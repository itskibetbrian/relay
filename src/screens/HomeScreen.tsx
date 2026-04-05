// src/screens/HomeScreen.tsx
//
// Primary screen. Renders the snippet grid with search and category filtering.
// All copy logic lives in useSnippets; this component is pure presentation.

import React, { useCallback, useLayoutEffect, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, Settings, Crown } from 'lucide-react-native';

import { SnippetCard } from '../components/cards/SnippetCard';
import { CategoryChipBar } from '../components/common/CategoryChipBar';
import { SearchBar } from '../components/common/SearchBar';
import { useSnippets } from '../hooks/useSnippets';
import { useCategories } from '../hooks/useCategories';
import { COLORS } from '../constants';
import { RootStackParamList, Snippet } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = SCREEN_WIDTH > 420 ? 3 : 2;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const {
    snippets,
    isLoading,
    copiedId,
    copySnippet,
    toggleFavorite,
    deleteSnippet,
    filterByCategory,
    activeCategory,
    searchQuery,
    setSearchQuery,
    refresh,
  } = useSnippets();
  const { categories } = useCategories();

  // ── Navigation header buttons ─────────────────────────────────────────

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>CB</Text>
        </View>
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Paywall')}
            style={styles.headerBtn}
          >
            <Crown size={20} color="#7C3AED" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ManageCategories')}
            style={styles.headerBtn}
          >
            <Settings size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  // ── Handlers ─────────────────────────────────────────────────────────

  const handleEdit = useCallback(
    (snippet: Snippet) => {
      navigation.navigate('AddSnippet', { snippetId: snippet.id });
    },
    [navigation]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteSnippet(id);
    },
    [deleteSnippet]
  );

  // ── Render helpers ────────────────────────────────────────────────────

  const renderItem = useCallback(
    ({ item }: { item: Snippet }) => (
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        layout={Layout.springify()}
      >
        <SnippetCard
          snippet={item}
          isCopied={copiedId === item.id}
          onCopy={copySnippet}
          onFavorite={toggleFavorite}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Animated.View>
    ),
    [copiedId, copySnippet, toggleFavorite, handleEdit, handleDelete]
  );

  const keyExtractor = useCallback((item: Snippet) => item.id, []);

  const EmptyState = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No results found' : 'No snippets yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'Try a different search term'
          : 'Tap + to save your first snippet'}
      </Text>
    </View>
  );

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDE9F6" />

      <FlatList
        data={snippets}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={NUM_COLUMNS > 1 ? styles.row : undefined}
        contentContainerStyle={styles.list}
        onRefresh={refresh}
        refreshing={isLoading && snippets.length > 0}
        ListHeaderComponent={
          <>
            {/* Search bar */}
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            {/* Category filter chips */}
            <CategoryChipBar
              categories={categories}
              activeId={activeCategory}
              onSelect={filterByCategory}
            />

            {/* Results count */}
            {!isLoading && (
              <Text style={styles.count}>
                {snippets.length} snippet{snippets.length !== 1 ? 's' : ''}
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator
              style={styles.loader}
              color={COLORS.primary}
              size="large"
            />
          ) : (
            <EmptyState />
          )
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddSnippet', {})}
        activeOpacity={0.85}
      >
        <Plus size={26} color={COLORS.white} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE9F6',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Platform.OS === 'android' ? 12 : 0,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: Platform.OS === 'android' ? 4 : 0,
  },
  headerBtn: {
    padding: 8,
  },
  list: {
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
  count: {
    fontSize: 12,
    color: '#6B7280',
    paddingHorizontal: 20,
    paddingBottom: 4,
    fontWeight: '500',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E1B2E',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 21,
  },
  loader: {
    marginTop: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default HomeScreen;
