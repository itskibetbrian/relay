// src/screens/FavoritesScreen.tsx
//
// Shows only starred snippets, sorted by use count (most used first).

import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SnippetCard } from '../components/cards/SnippetCard';
import { db } from '../services/database';
import { useSnippets } from '../hooks/useSnippets';
import { Snippet, RootStackParamList } from '../types';
import { COLORS } from '../constants';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = SCREEN_WIDTH > 420 ? 3 : 2;

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [favorites, setFavorites] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    copiedId,
    copySnippet,
    toggleFavorite: toggleFav,
    deleteSnippet,
  } = useSnippets();

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await db.getFavoriteSnippets();
      setFavorites(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reload every time tab is focused
  useFocusEffect(useCallback(() => { loadFavorites(); }, [loadFavorites]));

  const handleToggleFav = useCallback(async (id: string) => {
    await toggleFav(id);
    setFavorites(prev => prev.filter(s => s.id !== id));
  }, [toggleFav]);

  const renderItem = useCallback(
    ({ item }: { item: Snippet }) => (
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} layout={Layout.springify()}>
        <SnippetCard
          snippet={item}
          isCopied={copiedId === item.id}
          onCopy={copySnippet}
          onFavorite={handleToggleFav}
          onEdit={s => navigation.navigate('AddSnippet', { snippetId: s.id })}
            onDelete={async id => {
              await deleteSnippet(id);
              setFavorites(prev => prev.filter(s => s.id !== id));
            }}
          />
        </Animated.View>
      ),
    [copiedId, copySnippet, deleteSnippet, handleToggleFav, navigation]
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={NUM_COLUMNS > 1 ? styles.row : undefined}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.count}>
            {favorites.length} favourite{favorites.length !== 1 ? 's' : ''}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>❤️</Text>
            <Text style={styles.emptyTitle}>No favourites yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart on any snippet to save it here
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background },
  list: { paddingBottom: 80 },
  row: { justifyContent: 'flex-start', paddingHorizontal: 8 },
  count: { fontSize: 12, fontWeight: '500', color: COLORS.textMuted, paddingHorizontal: 20, paddingVertical: 12 },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 32, gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 21 },
});

export default FavoritesScreen;
