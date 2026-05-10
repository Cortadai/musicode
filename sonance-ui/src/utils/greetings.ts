interface Greeting {
  id: string;
  text: string;
  subtitle?: string;
}

interface Pool {
  weight: number;
  getEntries: () => Greeting[];
}

const LAST_GREETING_KEY = 'sonance-last-greeting';

const timeAware: Pool = {
  weight: 0.30,
  getEntries() {
    const h = new Date().getHours();
    if (h >= 0 && h < 3) return [
      { id: 't-01', text: 'Still up?' },
      { id: 't-02', text: "It's late. The music can wait." },
      { id: 't-03', text: "Night owl mode activated." },
    ];
    if (h < 5) return [
      { id: 't-04', text: "It's way too late for this." },
      { id: 't-05', text: 'The world sleeps. You don\'t.' },
    ];
    if (h < 7) return [
      { id: 't-06', text: 'Early riser.' },
      { id: 't-07', text: 'Morning. Coffee first, music second.' },
    ];
    if (h < 12) return [
      { id: 't-08', text: 'Good morning.' },
      { id: 't-09', text: 'Morning. Set the tone for the day.' },
      { id: 't-10', text: 'Fresh start. Pick something good.' },
    ];
    if (h < 14) return [
      { id: 't-11', text: 'Good afternoon.' },
      { id: 't-12', text: 'Midday. Halfway there.' },
    ];
    if (h < 18) return [
      { id: 't-13', text: 'Afternoon stretch.' },
      { id: 't-14', text: 'One more push. Music helps.' },
    ];
    if (h < 21) return [
      { id: 't-15', text: 'Good evening.' },
      { id: 't-16', text: 'Evening. The night is yours.' },
      { id: 't-17', text: 'Wind down with something good.' },
    ];
    return [
      { id: 't-18', text: 'Late night session.' },
      { id: 't-19', text: 'Night mode. No judgement.' },
    ];
  },
};

const dayAware: Pool = {
  weight: 0.15,
  getEntries() {
    const day = new Date().getDay();
    const entries: Record<number, Greeting[]> = {
      0: [{ id: 'd-0', text: 'Sunday. Put something good on.' }],
      1: [{ id: 'd-1', text: "Monday. Let's fix that with music." }],
      2: [{ id: 'd-2', text: 'Tuesday. Underrated day for a great album.' }],
      3: [{ id: 'd-3', text: "It's Wednesday somehow." }],
      4: [{ id: 'd-4', text: 'Thursday. Almost there.' }],
      5: [{ id: 'd-5', text: "It's Friday. You made it." }],
      6: [{ id: 'd-6', text: 'Saturday. No rules.' }],
    };
    return entries[day] ?? [];
  },
};

const playful: Pool = {
  weight: 0.25,
  getEntries: () => [
    { id: 'p-01', text: 'The aux is yours.' },
    { id: 'p-02', text: 'No algorithm. Just you.' },
    { id: 'p-03', text: 'Your library. Your rules.' },
    { id: 'p-04', text: 'Press play on something great.' },
    { id: 'p-05', text: 'What are we listening to today?' },
    { id: 'p-06', text: 'Ready when you are.' },
    { id: 'p-07', text: "Let's hear something new." },
    { id: 'p-08', text: 'Pick something you haven\'t heard in a while.' },
    { id: 'p-09', text: 'The queue is empty. Fix that.' },
    { id: 'p-10', text: 'Your music, your mood.' },
    { id: 'p-11', text: 'Welcome back.' },
    { id: 'p-12', text: 'Volume up.' },
    { id: 'p-13', text: 'Shuffle or purpose? Your call.' },
    { id: 'p-14', text: 'Headphones on, world off.' },
  ],
};

const quotes: Pool = {
  weight: 0.30,
  getEntries: () => [
    { id: 'q-01', text: 'Who wants to live forever?', subtitle: 'Queen' },
    { id: 'q-02', text: 'Is this the real life? Is this just fantasy?', subtitle: 'Queen — Bohemian Rhapsody' },
    { id: 'q-03', text: 'Every little thing is gonna be alright.', subtitle: 'Bob Marley' },
    { id: 'q-04', text: "I got my mind set on you.", subtitle: 'George Harrison' },
    { id: 'q-05', text: 'Here comes the sun.', subtitle: 'The Beatles' },
    { id: 'q-06', text: 'We are the champions, my friends.', subtitle: 'Queen' },
    { id: 'q-07', text: "Don't stop me now.", subtitle: 'Queen' },
    { id: 'q-08', text: 'Let it be.', subtitle: 'The Beatles' },
    { id: 'q-09', text: "What a wonderful world.", subtitle: 'Louis Armstrong' },
    { id: 'q-10', text: "I can't get no satisfaction.", subtitle: 'The Rolling Stones' },
    { id: 'q-11', text: 'Imagine all the people living life in peace.', subtitle: 'John Lennon' },
    { id: 'q-12', text: 'Music is the universal language of mankind.', subtitle: 'Henry Wadsworth Longfellow' },
    { id: 'q-13', text: 'Where words fail, music speaks.', subtitle: 'Hans Christian Andersen' },
    { id: 'q-14', text: 'One good thing about music, when it hits you, you feel no pain.', subtitle: 'Bob Marley' },
    { id: 'q-15', text: "Life is what happens when you're busy making other plans.", subtitle: 'John Lennon' },
    { id: 'q-16', text: 'After silence, that which comes nearest to expressing the inexpressible is music.', subtitle: 'Aldous Huxley' },
    { id: 'q-17', text: "I'm still standing.", subtitle: 'Elton John' },
    { id: 'q-18', text: 'The show must go on.', subtitle: 'Queen' },
    { id: 'q-19', text: 'You may say I\'m a dreamer, but I\'m not the only one.', subtitle: 'John Lennon' },
    { id: 'q-20', text: "It's a long way to the top if you wanna rock 'n' roll.", subtitle: 'AC/DC' },
    { id: 'q-21', text: 'Music expresses that which cannot be put into words.', subtitle: 'Victor Hugo' },
    { id: 'q-22', text: 'Without music, life would be a mistake.', subtitle: 'Friedrich Nietzsche' },
    { id: 'q-23', text: 'Just a small town girl, living in a lonely world.', subtitle: "Journey — Don't Stop Believin'" },
    { id: 'q-24', text: 'Hello, is it me you\'re looking for?', subtitle: 'Lionel Richie' },
    { id: 'q-25', text: "I will survive.", subtitle: 'Gloria Gaynor' },
    { id: 'q-26', text: 'We will, we will rock you.', subtitle: 'Queen' },
    { id: 'q-27', text: 'Music is the strongest form of magic.', subtitle: 'Marilyn Manson' },
    { id: 'q-28', text: 'May the Force be with you.', subtitle: 'Star Wars' },
    { id: 'q-29', text: "Here's looking at you, kid.", subtitle: 'Casablanca' },
    { id: 'q-30', text: "I'll be back.", subtitle: 'The Terminator' },
  ],
};

const pools: Pool[] = [timeAware, dayAware, playful, quotes];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function chooseGreeting(): Greeting {
  const lastId = localStorage.getItem(LAST_GREETING_KEY);

  const roll = Math.random();
  let cumulative = 0;

  let selectedPool: Pool | null = null;

  for (const pool of pools) {
    cumulative += pool.weight;
    if (roll < cumulative) {
      selectedPool = pool;
      break;
    }
  }
  if (!selectedPool) selectedPool = pools[pools.length - 1];

  let entries = selectedPool.getEntries();
  if (entries.length === 0) {
    entries = pickRandom(pools.filter(p => p.getEntries().length > 0)).getEntries();
  }

  let candidate = pickRandom(entries);
  if (candidate.id === lastId && entries.length > 1) {
    candidate = pickRandom(entries.filter(e => e.id !== lastId));
  }

  localStorage.setItem(LAST_GREETING_KEY, candidate.id);
  return candidate;
}

export function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
