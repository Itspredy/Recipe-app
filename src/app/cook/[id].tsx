import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { GradientButton, PhotoSlot } from '../../components/ui';
import { getRecipe, markCooked } from '../../db/store';
import { useTheme } from '../../lib/ThemeProvider';
import { parseStepMinutes, stepIngredients } from '../../lib/cook';
import { fonts, gradientProps, radius } from '../../lib/theme';
import { totalMinutes, type Recipe } from '../../lib/types';

export default function CookScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<'cook' | 'done'>('cook');
  const [rating, setRating] = useState(0);
  const [secs, setSecs] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    getRecipe(id).then(setRecipe);
  }, [id]);

  useEffect(() => {
    timer.current = setInterval(() => {
      setSecs((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    if (secs === 0) setRunning(false);
  }, [secs]);

  if (!recipe) return <View style={{ flex: 1, backgroundColor: theme.bg }} />;

  const steps = recipe.steps;
  // Clamp so a fast double-tap can never run the index past the last step.
  const safeStep = Math.min(Math.max(step, 0), steps.length - 1);
  const current = steps[safeStep];
  const mins = current ? parseStepMinutes(current.text) : null;
  const ings = current ? stepIngredients(current.text, recipe.ingredients) : [];
  const isLast = safeStep === steps.length - 1;
  const progress = Math.round(((safeStep + 1) / steps.length) * 100);
  const mm = Math.floor(secs / 60);
  const ss = String(secs % 60).padStart(2, '0');

  const resetTimer = () => { setSecs(0); setRunning(false); };
  const next = () => {
    setStep((s) => {
      if (s >= steps.length - 1) return s; // already last — Done handled below
      return s + 1;
    });
    if (safeStep >= steps.length - 1) setPhase('done');
    resetTimer();
  };
  const prev = () => { setStep((s) => Math.max(0, s - 1)); resetTimer(); };
  const startTimer = () => {
    if (secs > 0) { resetTimer(); return; }
    if (mins) { setSecs(mins * 60); setRunning(true); }
  };

  if (phase === 'done') {
    return (
      <DoneScreen
        recipe={recipe}
        rating={rating}
        onRate={setRating}
        onSave={async () => { await markCooked(recipe.id, rating); router.replace('/library'); }}
        onNote={() => router.replace(`/recipe/${recipe.id}`)}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top + 10, paddingHorizontal: 24, paddingBottom: insets.bottom + 16 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', color: theme.dim2 }}>
          Step {safeStep + 1} of {steps.length}
        </Text>
        <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: radius.pill, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" size={17} color={theme.txt} />
        </Pressable>
      </View>

      {/* Progress */}
      <View style={{ height: 6, borderRadius: radius.pill, backgroundColor: theme.card2, overflow: 'hidden', marginBottom: 40 }}>
        <LinearGradient colors={[theme.accsFrom, theme.accsTo]} {...gradientProps} style={{ height: '100%', width: `${progress}%`, borderRadius: radius.pill }} />
      </View>

      {/* Step body */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 26 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontFamily: fonts.heading, fontSize: 40, lineHeight: 46, color: theme.txt }}>{current?.text}</Text>

        {ings.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {ings.map((g, i) => (
              <View key={i} style={{ backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, paddingVertical: 9, paddingHorizontal: 14, borderRadius: radius.pill }}>
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 14, color: theme.dim }}>{g}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {mins ? (
          <Pressable
            onPress={startTimer}
            style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 11, height: 56, paddingHorizontal: 22, borderRadius: radius.md, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.acc }}
          >
            <Icon name="clock" size={20} color={theme.acc} />
            <Text style={{ fontFamily: fonts.heading, fontSize: 19, color: theme.acc }}>
              {secs > 0 ? `${mm}:${ss} left` : `Start ${mins} min timer`}
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>

      {/* Nav */}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
        <Pressable onPress={prev} disabled={step === 0} style={{ width: 76, height: 66, borderRadius: radius.lg, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, alignItems: 'center', justifyContent: 'center', opacity: step === 0 ? 0.4 : 1 }}>
          <Icon name="chevronLeft" size={22} color={theme.txt} />
        </Pressable>
        <GradientButton label={isLast ? 'Finish' : 'Next step'} iconRight="arrowRight" height={66} onPress={next} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

function DoneScreen({
  recipe,
  rating,
  onRate,
  onSave,
  onNote,
}: {
  recipe: Recipe;
  rating: number;
  onRate: (n: number) => void;
  onSave: () => void;
  onNote: () => void;
}) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const total = totalMinutes(recipe);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top + 60, paddingHorizontal: 26, paddingBottom: insets.bottom + 16, alignItems: 'center', gap: 22 }}>
      <View style={{ width: 150, height: 150, borderRadius: radius.pill, overflow: 'hidden', borderWidth: 1, borderColor: theme.line }}>
        {recipe.imageUrl ? null : <PhotoSlot title={recipe.title} icon="flame" />}
      </View>
      <Text style={{ fontFamily: fonts.heading, fontSize: 36, lineHeight: 38, color: theme.txt, textAlign: 'center' }}>
        Enjoy your <Text style={{ color: theme.acc }}>meal</Text>
      </Text>
      <Text style={{ fontFamily: fonts.body, fontSize: 15.5, lineHeight: 23, color: theme.dim, textAlign: 'center', maxWidth: 280 }}>
        {recipe.title}
        {total ? ` · ${total} minutes, start to plate.` : '.'} Rate it so future-you remembers.
      </Text>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => onRate(n)} hitSlop={4}>
            <Icon name={n <= rating ? 'starFilled' : 'star'} size={34} color={n <= rating ? theme.acc : theme.dim2} />
          </Pressable>
        ))}
      </View>

      <View style={{ flex: 1 }} />

      <View style={{ width: '100%', gap: 10 }}>
        <GradientButton label="Save to cooked" onPress={onSave} />
        <Pressable onPress={onNote} style={{ height: 52, borderRadius: radius.md, borderWidth: 1, borderColor: theme.line, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: theme.txt }}>Add a note</Text>
        </Pressable>
      </View>
    </View>
  );
}
