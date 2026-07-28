import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
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
import { Chip, GradientButton, ScreenBackground } from '../components/ui';
import { saveManual } from '../db/store';
import { useTheme } from '../lib/ThemeProvider';
import { fonts, radius } from '../lib/theme';
import type { Ingredient, Step } from '../lib/types';

const TAGS = ['Breakfast', 'Dinner', 'Desserts', 'Vegetarian', 'Quick', 'Pescatarian'];
const UNITS = new Set([
  'g', 'kg', 'ml', 'l', 'oz', 'lb', 'lbs', 'tsp', 'tbsp', 'cup', 'cups',
  'clove', 'cloves', 'slice', 'slices', 'can', 'cans', 'pinch',
]);

/** Turns "1 1/2 cups flour" into structured {quantity, unit, name}. */
function parseIngredient(line: string): Ingredient | null {
  const text = line.trim();
  if (!text) return null;
  const parts = text.split(/\s+/);
  let quantity: number | null = null;
  let unit: string | null = null;
  let i = 0;

  const num = parts[0];
  if (num && /^\d+([./]\d+)?$/.test(num)) {
    // Support "1/2" and a mixed "1 1/2".
    const toNum = (s: string) => (s.includes('/') ? Number(s.split('/')[0]) / Number(s.split('/')[1]) : Number(s));
    quantity = toNum(num);
    i = 1;
    if (parts[1] && /^\d+\/\d+$/.test(parts[1])) {
      quantity += toNum(parts[1]);
      i = 2;
    }
  }
  if (parts[i] && UNITS.has(parts[i].toLowerCase())) {
    unit = parts[i].toLowerCase();
    i += 1;
  }
  const name = parts.slice(i).join(' ');
  if (!name) return { quantity, unit, name: text, category: null };
  return { quantity, unit, name, category: null };
}

export default function ManualScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState(2);
  const [prep, setPrep] = useState('');
  const [cook, setCook] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  const [saving, setSaving] = useState(false);

  const toggleTag = (t: string) => setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  const setAt = (list: string[], set: (v: string[]) => void, i: number, v: string) => {
    const next = [...list];
    next[i] = v;
    set(next);
  };
  const removeAt = (list: string[], set: (v: string[]) => void, i: number) =>
    set(list.length > 1 ? list.filter((_, idx) => idx !== i) : ['']);

  const canSave = title.trim().length > 0 && ingredients.some((i) => i.trim()) && steps.some((s) => s.trim());

  const onSave = async () => {
    setSaving(true);
    const parsedIngredients = ingredients.map(parseIngredient).filter((x): x is Ingredient => x !== null);
    const parsedSteps: Step[] = steps.map((s) => s.trim()).filter(Boolean).map((text) => ({ text }));
    const id = await saveManual({
      title: title.trim(),
      description: description.trim(),
      servings,
      prepMinutes: prep ? Number(prep) : null,
      cookMinutes: cook ? Number(cook) : null,
      tags,
      ingredients: parsedIngredients,
      steps: parsedSteps,
    });
    router.replace(`/recipe/${id}`);
  };

  return (
    <ScreenBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, height: 44, paddingHorizontal: 20, paddingTop: insets.top + 8 }}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Icon name="chevronLeft" size={24} color={theme.txt} />
          </Pressable>
          <Text style={{ fontFamily: fonts.heading, fontSize: 22, color: theme.txt }}>New recipe</Text>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 100, gap: 18 }}
          showsVerticalScrollIndicator={false}
        >
          <Field label="Title">
            <Input value={title} onChangeText={setTitle} placeholder="Miso Butter Salmon" />
          </Field>

          <Field label="Description">
            <Input value={description} onChangeText={setDescription} placeholder="One line about it" multiline />
          </Field>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1, gap: 8 }}>
              <Label>Servings</Label>
              <Stepper value={servings} onDec={() => setServings((n) => Math.max(1, n - 1))} onInc={() => setServings((n) => n + 1)} />
            </View>
            <View style={{ flex: 1, gap: 8 }}>
              <Label>Prep (min)</Label>
              <Input value={prep} onChangeText={setPrep} placeholder="10" keyboardType="number-pad" />
            </View>
            <View style={{ flex: 1, gap: 8 }}>
              <Label>Cook (min)</Label>
              <Input value={cook} onChangeText={setCook} placeholder="20" keyboardType="number-pad" />
            </View>
          </View>

          <Field label="Tags">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
              {TAGS.map((t) => (
                <Chip key={t} label={t} active={tags.includes(t)} onPress={() => toggleTag(t)} />
              ))}
            </View>
          </Field>

          <Field label="Ingredients">
            {ingredients.map((v, i) => (
              <Row key={i} onRemove={() => removeAt(ingredients, setIngredients, i)}>
                <Input value={v} onChangeText={(t) => setAt(ingredients, setIngredients, i, t)} placeholder="1 1/2 lb salmon fillet" flex />
              </Row>
            ))}
            <AddRow label="Add ingredient" onPress={() => setIngredients((c) => [...c, ''])} />
          </Field>

          <Field label="Steps">
            {steps.map((v, i) => (
              <Row key={i} onRemove={() => removeAt(steps, setSteps, i)} index={i + 1}>
                <Input value={v} onChangeText={(t) => setAt(steps, setSteps, i, t)} placeholder="Describe this step" multiline flex />
              </Row>
            ))}
            <AddRow label="Add step" onPress={() => setSteps((c) => [...c, ''])} />
          </Field>

          <GradientButton label="Save recipe" icon="check" onPress={onSave} disabled={!canSave} loading={saving} style={{ marginTop: 4 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Label>{label}</Label>
      {children}
    </View>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 0.9, textTransform: 'uppercase', color: theme.dim2 }}>
      {children}
    </Text>
  );
}

function Input({
  flex,
  multiline,
  ...props
}: React.ComponentProps<typeof TextInput> & { flex?: boolean }) {
  const { theme } = useTheme();
  return (
    <TextInput
      {...props}
      multiline={multiline}
      placeholderTextColor={theme.dim2}
      style={{
        flex: flex ? 1 : undefined,
        minHeight: 50,
        borderRadius: radius.md,
        paddingHorizontal: 16,
        paddingTop: multiline ? 14 : 0,
        paddingVertical: multiline ? 12 : 0,
        backgroundColor: theme.card,
        borderWidth: 1,
        borderColor: theme.line,
        fontFamily: fonts.body,
        fontSize: 15.5,
        color: theme.txt,
      }}
    />
  );
}

function Row({ children, onRemove, index }: { children: React.ReactNode; onRemove: () => void; index?: number }) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      {index ? (
        <View style={{ width: 26, height: 26, borderRadius: radius.pill, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: theme.acc }}>{index}</Text>
        </View>
      ) : null}
      {children}
      <Pressable onPress={onRemove} hitSlop={8}>
        <Icon name="close" size={20} color={theme.dim2} />
      </Pressable>
    </View>
  );
}

function AddRow({ label, onPress }: { label: string; onPress: () => void }) {
  const { theme } = useTheme();
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 }}>
      <Icon name="plus" size={18} color={theme.acc} />
      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 15, color: theme.acc }}>{label}</Text>
    </Pressable>
  );
}

function Stepper({ value, onDec, onInc }: { value: number; onDec: () => void; onInc: () => void }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        height: 50,
        borderRadius: radius.md,
        backgroundColor: theme.card,
        borderWidth: 1,
        borderColor: theme.line,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
      }}
    >
      <Pressable onPress={onDec} hitSlop={8}>
        <Icon name="minus" size={18} color={theme.txt} />
      </Pressable>
      <Text style={{ fontFamily: fonts.heading, fontSize: 18, color: theme.txt }}>{value}</Text>
      <Pressable onPress={onInc} hitSlop={8}>
        <Icon name="plus" size={18} color={theme.txt} />
      </Pressable>
    </View>
  );
}
