const fs = require('fs');

// Read the parsed games data
const parsedData = JSON.parse(fs.readFileSync('parsed-games.json', 'utf8'));
const { games, uniqueElements } = parsedData;

// Read the current component file
const componentFile = fs.readFileSync('src/board-game-recommender-v7.jsx', 'utf8');

// Extract current TRAITS
const traitsMatch = componentFile.match(/const TRAITS = \{([\s\S]*?)\};/);
const currentTraitsText = traitsMatch[1];
const currentTraits = new Set();
const traitLines = currentTraitsText.split('\n');
traitLines.forEach(line => {
  const match = line.match(/'([^']+)':/);
  if (match) currentTraits.add(match[1]);
});

// Extract current game IDs
const gamesMatch = componentFile.match(/const GAMES = \[([\s\S]*?)\n\];/);
const currentGamesText = gamesMatch[1];
const currentGameIds = new Set();
const gameIdMatches = currentGamesText.matchAll(/id: '([^']+)'/g);
for (const match of gameIdMatches) {
  currentGameIds.add(match[1]);
}

console.log(`Current TRAITS count: ${currentTraits.size}`);
console.log(`Current GAMES count: ${currentGameIds.size}`);
console.log(`Unique elements in new data: ${uniqueElements.length}`);
console.log(`Total games in new data: ${games.length}`);

// Find new elements
const newElements = uniqueElements.filter(e => !currentTraits.has(e));
console.log(`\nNew elements to add: ${newElements.length}`);
console.log(newElements);

// Find new games
const newGames = games.filter(g => !currentGameIds.has(g.id));
console.log(`\nNew games to add: ${newGames.length}`);

// Generate TRAITS entries for new elements
const elementCategories = {
  // Mechanics
  'abstract': { label: 'Abstract', emoji: '🔷', category: 'mechanic' },
  '4x': { label: '4X Strategy', emoji: '🌌', category: 'mechanic' },
  'action-points': { label: 'Action Points', emoji: '⚡', category: 'mechanic' },
  'app-driven': { label: 'App-Driven', emoji: '📱', category: 'mechanic' },
  'app-required': { label: 'App Required', emoji: '📲', category: 'mechanic' },
  'asymmetric': { label: 'Asymmetric Powers', emoji: '⚖️', category: 'mechanic' },
  'betting': { label: 'Betting', emoji: '💰', category: 'mechanic' },
  'bidding': { label: 'Bidding', emoji: '🔨', category: 'mechanic' },
  'campaign': { label: 'Campaign', emoji: '📖', category: 'mechanic' },
  'card-drafting': { label: 'Card Drafting', emoji: '🎴', category: 'mechanic' },
  'cat-and-mouse': { label: 'Cat and Mouse', emoji: '🐱', category: 'mechanic' },
  'character-building': { label: 'Character Building', emoji: '👤', category: 'mechanic' },
  'climbing': { label: 'Climbing', emoji: '⛰️', category: 'mechanic' },
  'combat': { label: 'Combat', emoji: '⚔️', category: 'mechanic' },
  'communication': { label: 'Communication', emoji: '💬', category: 'mechanic' },
  'deck-building': { label: 'Deck Building', emoji: '🃏', category: 'mechanic' },
  'deduction': { label: 'Deduction', emoji: '🔍', category: 'mechanic' },
  'dexterity': { label: 'Dexterity', emoji: '🎯', category: 'mechanic' },
  'drafting': { label: 'Drafting', emoji: '📋', category: 'mechanic' },
  'dungeon-crawler': { label: 'Dungeon Crawler', emoji: '🏰', category: 'mechanic' },
  'economic': { label: 'Economic', emoji: '💹', category: 'mechanic' },
  'engine-building': { label: 'Engine Building', emoji: '⚙️', category: 'mechanic' },
  'exploration': { label: 'Exploration', emoji: '🗺️', category: 'mechanic' },
  'hand-management': { label: 'Hand Management', emoji: '✋', category: 'mechanic' },
  'hidden-information': { label: 'Hidden Information', emoji: '🔒', category: 'mechanic' },
  'hidden-traitor': { label: 'Hidden Traitor', emoji: '🕵️', category: 'mechanic' },
  'legacy': { label: 'Legacy', emoji: '📜', category: 'mechanic' },
  'memory': { label: 'Memory', emoji: '🧠', category: 'mechanic' },
  'network-building': { label: 'Network Building', emoji: '🕸️', category: 'mechanic' },
  'party': { label: 'Party Game', emoji: '🎉', category: 'mechanic' },
  'pattern-recognition': { label: 'Pattern Recognition', emoji: '👁️', category: 'mechanic' },
  'pick-up-and-deliver': { label: 'Pick-up & Deliver', emoji: '📦', category: 'mechanic' },
  'programming': { label: 'Programming', emoji: '💻', category: 'mechanic' },
  'racing': { label: 'Racing', emoji: '🏁', category: 'mechanic' },
  'real-time': { label: 'Real-Time', emoji: '⏱️', category: 'mechanic' },
  'resource-conversion': { label: 'Resource Conversion', emoji: '🔄', category: 'mechanic' },
  'roll-and-write': { label: 'Roll & Write', emoji: '✍️', category: 'mechanic' },
  'route-building': { label: 'Route Building', emoji: '🛤️', category: 'mechanic' },
  'rpg': { label: 'RPG Elements', emoji: '🎲', category: 'mechanic' },
  'simultaneous-action': { label: 'Simultaneous Action', emoji: '⏲️', category: 'mechanic' },
  'social-deduction': { label: 'Social Deduction', emoji: '🔍', category: 'mechanic' },
  'spatial-puzzle': { label: 'Spatial Puzzle', emoji: '🧩', category: 'mechanic' },
  'storytelling': { label: 'Storytelling', emoji: '📚', category: 'mechanic' },
  'tableau-building': { label: 'Tableau Building', emoji: '🖼️', category: 'mechanic' },
  'take-that': { label: 'Take That', emoji: '👊', category: 'mechanic' },
  'tile-laying': { label: 'Tile Laying', emoji: '🧩', category: 'mechanic' },
  'trick-taking': { label: 'Trick Taking', emoji: '🃏', category: 'mechanic' },
  'variable-player-powers': { label: 'Variable Player Powers', emoji: '⚡', category: 'mechanic' },
  'wargame': { label: 'Wargame', emoji: '🪖', category: 'mechanic' },
  'word-game': { label: 'Word Game', emoji: '📝', category: 'mechanic' },
  'worker-placement': { label: 'Worker Placement', emoji: '👷', category: 'mechanic' },

  // Vibes
  'accessible': { label: 'Accessible', emoji: '♿', category: 'vibe' },
  'adventure': { label: 'Adventure', emoji: '🗺️', category: 'vibe' },
  'beautiful': { label: 'Beautiful', emoji: '✨', category: 'vibe' },
  'brain-burn': { label: 'Brain Burner', emoji: '🧠', category: 'vibe' },
  'challenging': { label: 'Challenging', emoji: '💪', category: 'vibe' },
  'chaotic': { label: 'Chaotic', emoji: '🌪️', category: 'vibe' },
  'colorblind-friendly': { label: 'Colorblind Friendly', emoji: '👁️', category: 'vibe' },
  'colorful': { label: 'Colorful', emoji: '🌈', category: 'vibe' },
  'competitive': { label: 'Competitive', emoji: '🏆', category: 'vibe' },
  'confrontational': { label: 'Confrontational', emoji: '⚔️', category: 'vibe' },
  'cooperative': { label: 'Cooperative', emoji: '🤝', category: 'vibe' },
  'cozy': { label: 'Cozy', emoji: '🛋️', category: 'vibe' },
  'creative': { label: 'Creative', emoji: '🎨', category: 'vibe' },
  'crunchy': { label: 'Crunchy', emoji: '🔢', category: 'vibe' },
  'cutthroat': { label: 'Cutthroat', emoji: '🗡️', category: 'vibe' },
  'deep': { label: 'Deep Strategy', emoji: '🌊', category: 'vibe' },
  'dramatic': { label: 'Dramatic', emoji: '🎬', category: 'vibe' },
  'elegant': { label: 'Elegant', emoji: '💎', category: 'vibe' },
  'epic-scope': { label: 'Epic Scope', emoji: '🌌', category: 'vibe' },
  'family-friendly': { label: 'Family Friendly', emoji: '👨‍👩‍👧‍👦', category: 'vibe' },
  'fast-paced': { label: 'Fast-Paced', emoji: '⚡', category: 'vibe' },
  'funny': { label: 'Funny', emoji: '😄', category: 'vibe' },
  'goofy': { label: 'Goofy', emoji: '🤪', category: 'vibe' },
  'horror': { label: 'Horror', emoji: '😱', category: 'vibe' },
  'immersive': { label: 'Immersive', emoji: '🎭', category: 'vibe' },
  'interactive': { label: 'Interactive', emoji: '🔗', category: 'vibe' },
  'intricate': { label: 'Intricate', emoji: '🕸️', category: 'vibe' },
  'light': { label: 'Light', emoji: '🪶', category: 'vibe' },
  'luck': { label: 'Luck-Based', emoji: '🍀', category: 'vibe' },
  'meditative': { label: 'Meditative', emoji: '🧘', category: 'vibe' },
  'meaty': { label: 'Meaty', emoji: '🥩', category: 'vibe' },
  'minimalist': { label: 'Minimalist', emoji: '⬜', category: 'vibe' },
  'narrative': { label: 'Narrative', emoji: '📖', category: 'vibe' },
  'nostalgic': { label: 'Nostalgic', emoji: '🕰️', category: 'vibe' },
  'optimization': { label: 'Optimization', emoji: '📊', category: 'vibe' },
  'political': { label: 'Political', emoji: '🏛️', category: 'vibe' },
  'punishing': { label: 'Punishing', emoji: '💀', category: 'vibe' },
  'puzzle': { label: 'Puzzle', emoji: '🧩', category: 'vibe' },
  'quick': { label: 'Quick', emoji: '⚡', category: 'vibe' },
  'relaxing': { label: 'Relaxing', emoji: '😌', category: 'vibe' },
  'replayable': { label: 'Highly Replayable', emoji: '🔄', category: 'vibe' },
  'rewarding': { label: 'Rewarding', emoji: '🏆', category: 'vibe' },
  'sandbox': { label: 'Sandbox', emoji: '🏖️', category: 'vibe' },
  'satisfying': { label: 'Satisfying', emoji: '😊', category: 'vibe' },
  'scalable': { label: 'Scalable', emoji: '📏', category: 'vibe' },
  'sci-fi': { label: 'Sci-Fi', emoji: '🚀', category: 'vibe' },
  'silly': { label: 'Silly', emoji: '🤡', category: 'vibe' },
  'simple': { label: 'Simple', emoji: '➡️', category: 'vibe' },
  'social': { label: 'Social', emoji: '🗣️', category: 'vibe' },
  'solo-friendly': { label: 'Solo Friendly', emoji: '🧘', category: 'vibe' },
  'streamlined': { label: 'Streamlined', emoji: '➡️', category: 'vibe' },
  'strategic': { label: 'Strategic', emoji: '♟️', category: 'vibe' },
  'tactical': { label: 'Tactical', emoji: '🎯', category: 'vibe' },
  'tense': { label: 'Tense', emoji: '😰', category: 'vibe' },
  'thematic': { label: 'Thematic', emoji: '🎭', category: 'vibe' },
  'unforgiving': { label: 'Unforgiving', emoji: '⚠️', category: 'vibe' },

  // Negatives
  'analysis-paralysis': { label: 'Analysis Paralysis', emoji: '🤯', category: 'negative' },
  'downtime': { label: 'Too Much Downtime', emoji: '⏳', category: 'negative' },
  'fiddly': { label: 'Fiddly', emoji: '🔧', category: 'negative' },
  'kingmaking': { label: 'Kingmaking', emoji: '👑', category: 'negative' },
  'luck-dependent': { label: 'Too Luck-Dependent', emoji: '🎰', category: 'negative' },
  'mean-spirited': { label: 'Mean-Spirited', emoji: '😈', category: 'negative' },
  'opaque': { label: 'Opaque Rules', emoji: '❓', category: 'negative' },
  'player-count-dependent': { label: 'Player Count Sensitive', emoji: '👥', category: 'negative' },
  'player-elimination': { label: 'Player Elimination', emoji: '💀', category: 'negative' },
  'quarterbacking': { label: 'Quarterbacking', emoji: '🏈', category: 'negative' },
  'repetitive': { label: 'Repetitive', emoji: '🔁', category: 'negative' },
  'resource-scarcity': { label: 'Harsh Resource Scarcity', emoji: '😤', category: 'negative' },
  'runaway-leader': { label: 'Runaway Leader', emoji: '🏃', category: 'negative' },
  'setup-heavy': { label: 'Setup Heavy', emoji: '📦', category: 'negative' },
  'solvable': { label: 'Solvable', emoji: '🔓', category: 'negative' },
  'swingy': { label: 'Swingy', emoji: '🎢', category: 'negative' },
  'too-complex': { label: 'Too Complex', emoji: '🤯', category: 'negative' },
  'too-long': { label: 'Too Long', emoji: '⏰', category: 'negative' },
  'too-random': { label: 'Too Random', emoji: '🎰', category: 'negative' },
  'too-simple': { label: 'Too Simple', emoji: '😴', category: 'negative' },
  'unclear-strategy': { label: 'Unclear Strategy', emoji: '🤷', category: 'negative' },
};

// Generate new TRAITS code
const newTraitsCode = newElements.map(element => {
  const config = elementCategories[element];
  if (!config) {
    console.warn(`Warning: No config for element "${element}"`);
    return `  '${element}': { label: '${element}', emoji: '❓', category: 'vibe' },`;
  }
  return `  '${element}': { label: '${config.label}', emoji: '${config.emoji}', category: '${config.category}' },`;
}).join('\n');

console.log(`\n=== New TRAITS to add ===\n${newTraitsCode}\n`);

// Generate new games code
const newGamesCode = newGames.map(game => {
  const [minPlayers, maxPlayers] = game.players.split('-').map(Number);
  const [minTime, maxTime] = game.time.split('-').map(Number);

  const elementsCode = game.elements.map(e =>
    `      { name: '${e.name}', sentiment: '${e.sentiment}', note: ${JSON.stringify(e.note)} }`
  ).join(',\n');

  const antiElementsCode = game.antiElements.map(ae =>
    `      { name: '${ae.name}', note: ${JSON.stringify(ae.note)} }`
  ).join(',\n');

  return `  {
    id: '${game.id}', name: ${JSON.stringify(game.name)}, bggId: ${game.bggId}, year: ${game.year},
    bggRating: ${game.bggRating}, complexity: ${game.complexity},
    minPlayers: ${minPlayers}, maxPlayers: ${maxPlayers},
    minTime: ${minTime}, maxTime: ${maxTime},
    elements: [
${elementsCode}
    ],
    antiElements: [
${antiElementsCode}
    ]
  }`;
}).join(',\n');

// Write outputs
fs.writeFileSync('new-traits.txt', newTraitsCode);
fs.writeFileSync('new-games.txt', newGamesCode);

console.log(`\nWrote ${newElements.length} new TRAITS to new-traits.txt`);
console.log(`Wrote ${newGames.length} new GAMES to new-games.txt`);
console.log(`\nYou can now manually add these to board-game-recommender-v7.jsx`);
