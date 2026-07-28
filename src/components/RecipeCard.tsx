import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../lib/ThemeProvider';
import { fonts, radius } from '../lib/theme';
import { difficultyLabel, totalMinutes, type RecipeSummary } from '../lib/types';
import { Icon } from './Icon';
import { PhotoSlot } from './ui';

export function RecipeCard({ recipe, onPress }: { recipe: RecipeSummary; onPress: () => void }) {
  const { theme } = useTheme();
  const minutes = totalMinutes(recipe);

  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        borderWidth: 1,
        borderColor: theme.line,
        backgroundColor: theme.card,
        borderRadius: radius.lg,
        overflow: 'hidden',
      }}
    >
      <View style={{ height: 118, width: '100%' }}>
        {recipe.imageUrl ? (
          <Image source={recipe.imageUrl} style={{ flex: 1 }} contentFit="cover" cachePolicy="disk" />
        ) : (
          <PhotoSlot title={recipe.title} />
        )}
        {recipe.isFavorite ? (
          <View
            style={{
              position: 'absolute',
              top: 9,
              right: 9,
              width: 28,
              height: 28,
              borderRadius: radius.pill,
              backgroundColor: 'rgba(14,10,8,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="heartFilled" size={14} color="#ff8f6a" />
          </View>
        ) : null}
      </View>

      <View style={{ padding: 12, gap: 7 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: theme.txt }} numberOfLines={1}>
          {recipe.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Icon name="clock" size={12} color={theme.dim} />
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, color: theme.dim }}>
            {minutes ? `${minutes} min` : '—'}
          </Text>
          <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: theme.sage }} />
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, color: theme.dim }}>
            {difficultyLabel(recipe)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
