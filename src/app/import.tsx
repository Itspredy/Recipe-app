import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../components/Icon';
import { GradientButton, PhotoSlot, ScreenBackground, Tag } from '../components/ui';
import { useTheme } from '../lib/ThemeProvider';
import { structureFromText } from '../lib/api';
import { formatDuration, formatQuantity } from '../lib/format';
import { fonts, radius } from '../lib/theme';
import type { ImportedRecipe } from '../lib/types';
import { saveImported, useImportRecipe } from '../lib/useImportRecipe';

export default function ImportScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { run, reset, status, error } = useImportRecipe();
  const [mode, setMode] = useState<'url' | 'text'>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [textBusy, setTextBusy] = useState(false);
  const [textError, setTextError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportedRecipe | null>(null);
  const [saving, setSaving] = useState(false);

  const busy = status === 'importing' || textBusy;

  const onImport = async () => {
    const result = await run(url.trim());
    if (!result) return;
    if ('existingId' in result) router.replace(`/recipe/${result.existingId}`);
    else setPreview(result.imported);
  };

  const onStructure = async () => {
    setTextBusy(true);
    setTextError(null);
    try {
      setPreview(await structureFromText(text.trim()));
    } catch (e) {
      setTextError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setTextBusy(false);
    }
  };

  const goText = () => { reset(); setTextError(null); setMode('text'); };

  const onSave = async () => {
    if (!preview) return;
    setSaving(true);
    const id = await saveImported(preview);
    router.replace(`/recipe/${id}`);
  };

  return (
    <ScreenBackground>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, height: 44 }}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Icon name="chevronLeft" size={24} color={theme.txt} />
          </Pressable>
          <Text style={{ fontFamily: fonts.heading, fontSize: 22, color: theme.txt }}>
            {preview ? 'Check it over' : mode === 'text' ? 'Paste the caption' : 'Paste a link'}
          </Text>
        </View>

        {busy ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <ActivityIndicator size="large" color={theme.acc} />
            <Text style={{ fontFamily: fonts.heading, fontSize: 20, color: theme.txt }}>
              {textBusy ? 'Reading the recipe…' : 'Extracting recipe…'}
            </Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 14, color: theme.dim, textAlign: 'center', maxWidth: 260 }}>
              Pulling out the ingredients and steps.
            </Text>
          </View>
        ) : preview ? (
          <PreviewBody preview={preview} onSave={onSave} onRedo={() => { setPreview(null); reset(); setTextError(null); }} saving={saving} />
        ) : mode === 'text' ? (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, paddingTop: 24, gap: 14 }}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={'Paste the recipe caption or text here — ingredients and steps.'}
              placeholderTextColor={theme.dim2}
              multiline
              autoFocus
              textAlignVertical="top"
              style={{
                height: 220,
                borderRadius: radius.md,
                padding: 16,
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.line,
                fontFamily: fonts.body,
                fontSize: 16,
                lineHeight: 23,
                color: theme.txt,
              }}
            />
            <Text style={{ fontFamily: fonts.body, fontSize: 13.5, color: theme.dim, lineHeight: 19 }}>
              Works when a link is blocked (common for Instagram). Copy the post’s caption and drop it in — Groq turns it into a recipe.
            </Text>
            {textError ? <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 14, color: '#e5776b', lineHeight: 20 }}>{textError}</Text> : null}
            <GradientButton label="Read recipe" icon="sparkles" onPress={onStructure} disabled={text.trim().length < 20} style={{ marginTop: 6 }} />
            <Pressable onPress={() => { setMode('url'); setTextError(null); }} style={{ alignSelf: 'center', paddingVertical: 8 }}>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 15, color: theme.acc }}>Import from a link instead</Text>
            </Pressable>
          </KeyboardAvoidingView>
        ) : (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, paddingTop: 24, gap: 14 }}>
            <TextInput
              value={url}
              onChangeText={setUrl}
              placeholder="https://…"
              placeholderTextColor={theme.dim2}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              autoFocus
              style={{
                height: 56,
                borderRadius: radius.md,
                paddingHorizontal: 18,
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.line,
                fontFamily: fonts.body,
                fontSize: 16,
                color: theme.txt,
              }}
            />
            <Text style={{ fontFamily: fonts.body, fontSize: 13.5, color: theme.dim, lineHeight: 19 }}>
              Works with most recipe blogs, plus Instagram, TikTok and YouTube links.
            </Text>
            {error ? (
              <View style={{ gap: 10 }}>
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 14, color: '#e5776b', lineHeight: 20 }}>{error}</Text>
                <Pressable
                  onPress={goText}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 14, borderRadius: radius.md, borderWidth: 1, borderColor: theme.line, backgroundColor: theme.card }}
                >
                  <Icon name="edit" size={16} color={theme.acc} />
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: theme.acc }}>Paste the caption instead</Text>
                </Pressable>
              </View>
            ) : null}
            <GradientButton label="Import" icon="sparkles" onPress={onImport} disabled={!url.trim()} style={{ marginTop: 6 }} />
            <Pressable onPress={goText} style={{ alignSelf: 'center', paddingVertical: 8 }}>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 15, color: theme.dim }}>Can’t import a link? Paste the caption</Text>
            </Pressable>
          </KeyboardAvoidingView>
        )}
      </View>
    </ScreenBackground>
  );
}

function PreviewBody({
  preview,
  onSave,
  onRedo,
  saving,
}: {
  preview: ImportedRecipe;
  onSave: () => void;
  onRedo: () => void;
  saving: boolean;
}) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const total = (preview.prepMinutes ?? 0) + (preview.cookMinutes ?? 0);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingTop: 18, paddingBottom: 120, gap: 16 }} showsVerticalScrollIndicator={false}>
        <View style={{ height: 180, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: theme.line }}>
          {preview.imageUrl ? <Image source={preview.imageUrl} style={{ flex: 1 }} contentFit="cover" /> : <PhotoSlot title={preview.title} icon="flame" />}
        </View>

        <Text style={{ fontFamily: fonts.heading, fontSize: 28, lineHeight: 30, color: theme.txt }}>{preview.title}</Text>

        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {formatDuration(total) ? <Tag label={`${formatDuration(total)}`} /> : null}
          <Tag label={`${preview.servings} servings`} tone="sage" />
          {preview.sourceAuthor ? <Tag label={preview.sourceAuthor} /> : null}
        </View>

        {preview.description ? (
          <Text style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: theme.dim }}>{preview.description}</Text>
        ) : null}

        <Section title={`Ingredients · ${preview.ingredients.length}`}>
          {preview.ingredients.map((ing, i) => (
            <Text key={i} style={{ fontFamily: fonts.body, fontSize: 15.5, color: theme.txt, paddingVertical: 6 }}>
              {ing.quantity !== null ? (
                <Text style={{ fontFamily: fonts.bodyBold }}>
                  {formatQuantity(ing.quantity)}
                  {ing.unit ? ` ${ing.unit}` : ''}{' '}
                </Text>
              ) : null}
              {ing.name}
              {ing.note ? <Text style={{ color: theme.dim }}>, {ing.note}</Text> : null}
            </Text>
          ))}
        </Section>

        <Section title={`Steps · ${preview.steps.length}`}>
          {preview.steps.map((s, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 12, paddingVertical: 7 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 15, color: theme.acc, width: 20 }}>{i + 1}</Text>
              <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 15.5, lineHeight: 23, color: theme.txt }}>{s.text}</Text>
            </View>
          ))}
        </Section>

        <Pressable onPress={onRedo} style={{ alignSelf: 'center', paddingVertical: 8 }}>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 15, color: theme.acc }}>Try a different link</Text>
        </Pressable>
      </ScrollView>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: insets.bottom + 10 }}>
        <GradientButton label="Save to cookbook" icon="check" onPress={onSave} loading={saving} />
      </View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={{ gap: 2 }}>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 0.9, textTransform: 'uppercase', color: theme.dim2, marginBottom: 6 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}
