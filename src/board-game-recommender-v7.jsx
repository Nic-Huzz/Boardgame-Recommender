import React, { useState, useMemo, useEffect } from 'react';

// ============================================
// 🎲 BOARD GAME RECOMMENDER V7
// ============================================
// NOW WITH:
// - Persistent storage (saves your preferences!)
// - Search/Browse mode with match percentages
// - Returning user detection
// ============================================

// ============================================
// 🏷️ TRAIT DEFINITIONS
// ============================================

const TRAITS = {
  'trading': { label: 'Trading', emoji: '🤝', category: 'mechanic' },
  'negotiation': { label: 'Negotiation', emoji: '💬', category: 'mechanic' },
  'dice-rolling': { label: 'Dice Rolling', emoji: '🎲', category: 'mechanic' },
  'worker-placement': { label: 'Worker Placement', emoji: '👷', category: 'mechanic' },
  'engine-building': { label: 'Engine Building', emoji: '⚙️', category: 'mechanic' },
  'deck-building': { label: 'Deck Building', emoji: '🃏', category: 'mechanic' },
  'card-drafting': { label: 'Card Drafting', emoji: '🎴', category: 'mechanic' },
  'set-collection': { label: 'Set Collection', emoji: '📦', category: 'mechanic' },
  'tile-placement': { label: 'Tile Placement', emoji: '🧩', category: 'mechanic' },
  'area-control': { label: 'Area Control', emoji: '🗺️', category: 'mechanic' },
  'route-building': { label: 'Route Building', emoji: '🛤️', category: 'mechanic' },
  'pattern-building': { label: 'Pattern Building', emoji: '🎨', category: 'mechanic' },
  'push-your-luck': { label: 'Push Your Luck', emoji: '🎰', category: 'mechanic' },
  'bag-building': { label: 'Bag Building', emoji: '👜', category: 'mechanic' },
  'bluffing': { label: 'Bluffing', emoji: '🎭', category: 'mechanic' },
  'hidden-roles': { label: 'Hidden Roles', emoji: '🕵️', category: 'mechanic' },
  'social-deduction': { label: 'Social Deduction', emoji: '🔍', category: 'mechanic' },
  'cooperative': { label: 'Cooperative', emoji: '🤗', category: 'mechanic' },
  'campaign': { label: 'Campaign/Legacy', emoji: '📖', category: 'mechanic' },
  'variable-powers': { label: 'Variable Powers', emoji: '⚡', category: 'mechanic' },
  'modular-board': { label: 'Modular Board', emoji: '🧱', category: 'mechanic' },
  'resource-management': { label: 'Resource Management', emoji: '💎', category: 'mechanic' },
  'hand-management': { label: 'Hand Management', emoji: '✋', category: 'mechanic' },
  'tableau-building': { label: 'Tableau Building', emoji: '🖼️', category: 'mechanic' },
  'trick-taking': { label: 'Trick Taking', emoji: '🃏', category: 'mechanic' },
  'auction': { label: 'Auction/Bidding', emoji: '🔨', category: 'mechanic' },
  'solo-mode': { label: 'Solo Mode', emoji: '🧘', category: 'mechanic' },
  'grid-movement': { label: 'Grid Movement', emoji: '📍', category: 'mechanic' },
  'team-based': { label: 'Team-Based', emoji: '👥', category: 'mechanic' },
  'voting': { label: 'Voting', emoji: '🗳️', category: 'mechanic' },
  'communication-limits': { label: 'Limited Communication', emoji: '🤐', category: 'mechanic' },
  'social': { label: 'Social', emoji: '🗣️', category: 'vibe' },
  'competitive': { label: 'Competitive', emoji: '🏆', category: 'vibe' },
  'relaxing': { label: 'Relaxing', emoji: '😌', category: 'vibe' },
  'tense': { label: 'Tense', emoji: '😰', category: 'vibe' },
  'exciting': { label: 'Exciting', emoji: '🎢', category: 'vibe' },
  'thinky': { label: 'Brain-Burner', emoji: '🧠', category: 'vibe' },
  'light': { label: 'Light & Quick', emoji: '🪶', category: 'vibe' },
  'puzzly': { label: 'Puzzly', emoji: '🧩', category: 'vibe' },
  'satisfying': { label: 'Satisfying', emoji: '😊', category: 'vibe' },
  'epic': { label: 'Epic', emoji: '🏰', category: 'vibe' },
  'cozy': { label: 'Cozy', emoji: '🛋️', category: 'vibe' },
  'dramatic': { label: 'Dramatic', emoji: '🎬', category: 'vibe' },
  'hilarious': { label: 'Hilarious', emoji: '😂', category: 'vibe' },
  'thematic': { label: 'Thematic', emoji: '🎭', category: 'vibe' },
  'beautiful': { label: 'Beautiful', emoji: '✨', category: 'vibe' },
  'replayable': { label: 'Highly Replayable', emoji: '🔄', category: 'vibe' },
  'luck-driven': { label: 'Luck-Driven', emoji: '🍀', category: 'vibe' },
  'strategic': { label: 'Strategic', emoji: '♟️', category: 'vibe' },
  'friendly': { label: 'Friendly', emoji: '🤗', category: 'vibe' },
  'confrontational': { label: 'Confrontational', emoji: '⚔️', category: 'vibe' },
  'narrative': { label: 'Narrative', emoji: '📖', category: 'vibe' },
  'elegant': { label: 'Elegant', emoji: '💎', category: 'vibe' },
  'creative': { label: 'Creative', emoji: '🎨', category: 'vibe' },
  'resource-scarcity': { label: 'Resource Scarcity', emoji: '😤', category: 'negative' },
  'analysis-paralysis': { label: 'Too Many Options', emoji: '🤯', category: 'negative' },
  'player-elimination': { label: 'Player Elimination', emoji: '💀', category: 'negative' },
  'runaway-leader': { label: 'Runaway Leader', emoji: '🏃', category: 'negative' },
  'kingmaking': { label: 'Kingmaking', emoji: '👑', category: 'negative' },
  'too-long': { label: 'Too Long', emoji: '⏰', category: 'negative' },
  'too-random': { label: 'Too Random', emoji: '🎰', category: 'negative' },
  'mean-spirited': { label: 'Mean/Aggressive', emoji: '😈', category: 'negative' },
};

const COMPLEXITY_TIERS = {
  'light': { label: 'Light', color: 'bg-green-500', textColor: 'text-green-400' },
  'gateway': { label: 'Gateway', color: 'bg-emerald-500', textColor: 'text-emerald-400' },
  'medium': { label: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
  'heavy': { label: 'Heavy', color: 'bg-orange-500', textColor: 'text-orange-400' },
};

function getComplexityTier(c) {
  if (c < 1.5) return 'light';
  if (c < 2.2) return 'gateway';
  if (c < 3.2) return 'medium';
  return 'heavy';
}

// ============================================
// 🎮 GAME DATABASE
// ============================================

const GAMES = [
  {
    id: 'catan', name: 'Catan', bggId: 13, year: 1995,
    minPlayers: 3, maxPlayers: 4, minTime: 60, maxTime: 120,
    complexity: 2.3, bggRating: 7.1,
    traits: ['trading', 'negotiation', 'dice-rolling', 'social', 'competitive', 'luck-driven'],
    elements: [
      { id: 'catan-trading', label: 'Making trades and deals with other players', traits: ['trading', 'negotiation', 'social'] },
      { id: 'catan-dice', label: 'The excitement when dice are rolled', traits: ['dice-rolling', 'luck-driven', 'exciting'] },
      { id: 'catan-building', label: 'Building up your settlements and roads', traits: ['route-building', 'satisfying', 'strategic'] },
      { id: 'catan-variable', label: 'Different board setup each game', traits: ['modular-board', 'replayable'] },
    ],
    antiElements: [
      { id: 'catan-badrolls', label: "Getting stuck when dice don't go your way", traits: ['resource-scarcity', 'too-random'] },
    ],
  },
  {
    id: 'ticket-to-ride', name: 'Ticket to Ride', bggId: 9209, year: 2004,
    minPlayers: 2, maxPlayers: 5, minTime: 30, maxTime: 60,
    complexity: 1.8, bggRating: 7.4,
    traits: ['set-collection', 'route-building', 'relaxing', 'friendly', 'satisfying'],
    elements: [
      { id: 'ttr-collecting', label: 'Collecting matching train cards', traits: ['set-collection', 'satisfying'] },
      { id: 'ttr-routes', label: 'Claiming routes on the map', traits: ['route-building', 'satisfying', 'strategic'] },
      { id: 'ttr-tickets', label: 'Completing destination tickets', traits: ['satisfying', 'strategic'] },
      { id: 'ttr-simple', label: 'Simple rules anyone can learn', traits: ['light', 'friendly'] },
    ],
    antiElements: [
      { id: 'ttr-blocked', label: 'Getting key routes blocked by others', traits: ['confrontational', 'mean-spirited'] },
    ],
  },
  {
    id: 'azul', name: 'Azul', bggId: 230802, year: 2017,
    minPlayers: 2, maxPlayers: 4, minTime: 30, maxTime: 45,
    complexity: 1.8, bggRating: 7.8,
    traits: ['tile-placement', 'pattern-building', 'card-drafting', 'beautiful', 'puzzly', 'elegant'],
    elements: [
      { id: 'azul-drafting', label: 'Drafting tiles from the center', traits: ['card-drafting', 'strategic'] },
      { id: 'azul-patterns', label: 'Completing patterns on your board', traits: ['pattern-building', 'satisfying', 'puzzly'] },
      { id: 'azul-beautiful', label: 'The beautiful tactile tiles', traits: ['beautiful'] },
      { id: 'azul-puzzle', label: 'Optimizing your tile placement', traits: ['puzzly', 'thinky'] },
    ],
    antiElements: [
      { id: 'azul-negative', label: 'Taking tiles you don\'t want (negative points)', traits: ['mean-spirited'] },
    ],
  },
  {
    id: 'cascadia', name: 'Cascadia', bggId: 295947, year: 2021,
    minPlayers: 1, maxPlayers: 4, minTime: 30, maxTime: 45,
    complexity: 1.9, bggRating: 8.0,
    traits: ['tile-placement', 'pattern-building', 'solo-mode', 'relaxing', 'beautiful', 'puzzly', 'cozy', 'friendly'],
    elements: [
      { id: 'cascadia-habitat', label: 'Building your nature habitat', traits: ['tile-placement', 'satisfying', 'cozy'] },
      { id: 'cascadia-animals', label: 'Placing animals in optimal spots', traits: ['pattern-building', 'puzzly', 'strategic'] },
      { id: 'cascadia-theme', label: 'The peaceful nature theme', traits: ['relaxing', 'beautiful', 'thematic'] },
      { id: 'cascadia-solo', label: 'Great solo mode', traits: ['solo-mode'] },
      { id: 'cascadia-friendly', label: 'Low-conflict, everyone builds their own', traits: ['friendly', 'relaxing'] },
    ],
    antiElements: [],
  },
  {
    id: 'wingspan', name: 'Wingspan', bggId: 266192, year: 2019,
    minPlayers: 1, maxPlayers: 5, minTime: 40, maxTime: 70,
    complexity: 2.5, bggRating: 8.1,
    traits: ['engine-building', 'card-drafting', 'tableau-building', 'solo-mode', 'relaxing', 'beautiful', 'satisfying', 'cozy'],
    elements: [
      { id: 'wingspan-engine', label: 'Building card combos that chain together', traits: ['engine-building', 'satisfying', 'strategic'] },
      { id: 'wingspan-birds', label: 'Discovering unique bird powers', traits: ['variable-powers', 'replayable', 'thematic'] },
      { id: 'wingspan-art', label: 'The stunning bird artwork', traits: ['beautiful'] },
      { id: 'wingspan-relaxing', label: 'Relaxing, peaceful gameplay', traits: ['relaxing', 'cozy', 'friendly'] },
      { id: 'wingspan-tableau', label: 'Watching your tableau grow', traits: ['tableau-building', 'satisfying'] },
    ],
    antiElements: [
      { id: 'wingspan-luck', label: 'Luck of the card draw', traits: ['too-random'] },
    ],
  },
  {
    id: 'splendor', name: 'Splendor', bggId: 148228, year: 2014,
    minPlayers: 2, maxPlayers: 4, minTime: 30, maxTime: 30,
    complexity: 1.8, bggRating: 7.4,
    traits: ['engine-building', 'set-collection', 'elegant', 'satisfying', 'thinky', 'competitive'],
    elements: [
      { id: 'splendor-chips', label: 'Collecting gem chips', traits: ['set-collection', 'satisfying'] },
      { id: 'splendor-engine', label: 'Building discounts that snowball', traits: ['engine-building', 'satisfying', 'strategic'] },
      { id: 'splendor-elegant', label: 'Elegant, simple rules', traits: ['elegant', 'light'] },
      { id: 'splendor-race', label: 'Racing to 15 points', traits: ['competitive', 'tense'] },
    ],
    antiElements: [
      { id: 'splendor-quiet', label: 'Quiet, low-interaction gameplay', traits: ['analysis-paralysis'] },
    ],
  },
  {
    id: 'quacks', name: 'The Quacks of Quedlinburg', bggId: 244521, year: 2018,
    minPlayers: 2, maxPlayers: 4, minTime: 45, maxTime: 45,
    complexity: 1.9, bggRating: 7.8,
    traits: ['bag-building', 'push-your-luck', 'exciting', 'hilarious', 'luck-driven', 'dramatic'],
    elements: [
      { id: 'quacks-pushluck', label: 'Pushing your luck drawing from the bag', traits: ['push-your-luck', 'exciting', 'tense'] },
      { id: 'quacks-explosion', label: 'The drama when your pot explodes', traits: ['dramatic', 'hilarious'] },
      { id: 'quacks-upgrade', label: 'Upgrading your bag with better chips', traits: ['bag-building', 'engine-building', 'satisfying'] },
      { id: 'quacks-catchup', label: 'Catch-up mechanism keeps everyone close', traits: ['friendly'] },
    ],
    antiElements: [
      { id: 'quacks-badluck', label: 'Sometimes luck just destroys you', traits: ['too-random'] },
    ],
  },
  {
    id: 'pandemic', name: 'Pandemic', bggId: 30549, year: 2008,
    minPlayers: 2, maxPlayers: 4, minTime: 45, maxTime: 45,
    complexity: 2.4, bggRating: 7.6,
    traits: ['cooperative', 'set-collection', 'hand-management', 'variable-powers', 'tense', 'strategic', 'thematic'],
    elements: [
      { id: 'pandemic-coop', label: 'Working together as a team', traits: ['cooperative', 'social'] },
      { id: 'pandemic-disease', label: 'Fighting spreading diseases', traits: ['thematic', 'tense'] },
      { id: 'pandemic-roles', label: 'Unique role abilities', traits: ['variable-powers'] },
      { id: 'pandemic-tension', label: 'Nail-biting tension', traits: ['tense', 'dramatic'] },
      { id: 'pandemic-victory', label: 'Shared victory/defeat', traits: ['cooperative', 'satisfying'] },
    ],
    antiElements: [
      { id: 'pandemic-qb', label: 'One player can dominate decisions', traits: ['mean-spirited'] },
    ],
  },
  {
    id: 'codenames', name: 'Codenames', bggId: 178900, year: 2015,
    minPlayers: 2, maxPlayers: 8, minTime: 15, maxTime: 15,
    complexity: 1.3, bggRating: 7.7,
    traits: ['team-based', 'social-deduction', 'communication-limits', 'social', 'hilarious', 'light'],
    elements: [
      { id: 'codenames-clues', label: 'Giving clever word clues', traits: ['creative', 'social', 'puzzly'] },
      { id: 'codenames-teams', label: 'Team-based competition', traits: ['team-based', 'social'] },
      { id: 'codenames-aha', label: 'Satisfying "aha!" moments', traits: ['satisfying', 'hilarious'] },
      { id: 'codenames-simple', label: 'Very simple rules', traits: ['light', 'friendly'] },
    ],
    antiElements: [
      { id: 'codenames-pressure', label: 'Pressure as the clue-giver', traits: ['tense'] },
    ],
  },
  {
    id: 'terraforming-mars', name: 'Terraforming Mars', bggId: 167791, year: 2016,
    minPlayers: 1, maxPlayers: 5, minTime: 120, maxTime: 120,
    complexity: 3.2, bggRating: 8.4,
    traits: ['engine-building', 'tile-placement', 'card-drafting', 'tableau-building', 'solo-mode', 'epic', 'thinky', 'satisfying', 'replayable'],
    elements: [
      { id: 'tfm-engine', label: 'Building your card engine', traits: ['engine-building', 'satisfying', 'strategic'] },
      { id: 'tfm-cards', label: 'Huge variety of unique cards', traits: ['replayable', 'variable-powers'] },
      { id: 'tfm-theme', label: 'The epic Mars colonization theme', traits: ['thematic', 'epic'] },
      { id: 'tfm-long', label: 'Epic long-form gameplay', traits: ['epic', 'satisfying'] },
      { id: 'tfm-corps', label: 'Asymmetric corporation powers', traits: ['variable-powers', 'replayable'] },
    ],
    antiElements: [
      { id: 'tfm-toolong', label: 'Games can run very long', traits: ['too-long'] },
      { id: 'tfm-luck', label: 'Card draw luck can be swingy', traits: ['too-random'] },
    ],
  },
  {
    id: 'brass-birmingham', name: 'Brass: Birmingham', bggId: 224517, year: 2018,
    minPlayers: 2, maxPlayers: 4, minTime: 60, maxTime: 120,
    complexity: 3.9, bggRating: 8.6,
    traits: ['route-building', 'hand-management', 'resource-management', 'thinky', 'elegant', 'competitive', 'strategic', 'beautiful'],
    elements: [
      { id: 'brass-networks', label: 'Building canal/rail networks', traits: ['route-building', 'strategic', 'satisfying'] },
      { id: 'brass-economic', label: 'Deep economic decisions', traits: ['thinky', 'strategic', 'resource-management'] },
      { id: 'brass-era', label: 'The dramatic era shift', traits: ['dramatic', 'strategic'] },
      { id: 'brass-cards', label: 'Tight hand management', traits: ['hand-management', 'thinky'] },
      { id: 'brass-beautiful', label: 'Stunning production and art', traits: ['beautiful'] },
    ],
    antiElements: [
      { id: 'brass-ap', label: 'Heavy brain-burn, many options', traits: ['analysis-paralysis', 'thinky'] },
      { id: 'brass-long', label: 'Can run long with analysis', traits: ['too-long'] },
    ],
  },
  {
    id: 'spirit-island', name: 'Spirit Island', bggId: 162886, year: 2017,
    minPlayers: 1, maxPlayers: 4, minTime: 90, maxTime: 120,
    complexity: 4.0, bggRating: 8.4,
    traits: ['cooperative', 'area-control', 'hand-management', 'variable-powers', 'solo-mode', 'thinky', 'thematic', 'epic', 'replayable', 'strategic'],
    elements: [
      { id: 'si-spirits', label: 'Unique spirit powers', traits: ['variable-powers', 'replayable', 'thematic'] },
      { id: 'si-coop', label: 'Cooperative planning', traits: ['cooperative', 'strategic', 'social'] },
      { id: 'si-growth', label: 'Growing more powerful', traits: ['engine-building', 'satisfying', 'epic'] },
      { id: 'si-theme', label: 'Fighting colonization theme', traits: ['thematic'] },
      { id: 'si-puzzle', label: 'Complex, satisfying puzzles', traits: ['thinky', 'puzzly'] },
    ],
    antiElements: [
      { id: 'si-complex', label: 'Very complex rules', traits: ['analysis-paralysis'] },
    ],
  },
  {
    id: 'gloomhaven', name: 'Gloomhaven', bggId: 174430, year: 2017,
    minPlayers: 1, maxPlayers: 4, minTime: 60, maxTime: 120,
    complexity: 3.9, bggRating: 8.6,
    traits: ['cooperative', 'campaign', 'hand-management', 'grid-movement', 'variable-powers', 'solo-mode', 'epic', 'narrative', 'thematic'],
    elements: [
      { id: 'gh-campaign', label: 'Epic campaign story', traits: ['campaign', 'narrative', 'epic'] },
      { id: 'gh-combat', label: 'Unique card-based combat', traits: ['hand-management', 'strategic', 'thinky'] },
      { id: 'gh-progression', label: 'Character progression', traits: ['engine-building', 'satisfying'] },
      { id: 'gh-dungeon', label: 'Tactical dungeon crawling', traits: ['grid-movement', 'thematic'] },
      { id: 'gh-unlock', label: 'Unlocking new content', traits: ['replayable', 'exciting'] },
    ],
    antiElements: [
      { id: 'gh-setup', label: 'Long setup time', traits: ['too-long'] },
      { id: 'gh-rules', label: 'Many rules to track', traits: ['analysis-paralysis'] },
    ],
  },
  {
    id: 'root', name: 'Root', bggId: 237182, year: 2018,
    minPlayers: 2, maxPlayers: 4, minTime: 60, maxTime: 90,
    complexity: 3.7, bggRating: 8.1,
    traits: ['area-control', 'hand-management', 'variable-powers', 'confrontational', 'beautiful', 'replayable', 'strategic', 'dramatic'],
    elements: [
      { id: 'root-asymmetry', label: 'Completely asymmetric factions', traits: ['variable-powers', 'replayable'] },
      { id: 'root-war', label: 'Woodland creature warfare', traits: ['area-control', 'thematic', 'confrontational'] },
      { id: 'root-art', label: 'Adorable art style', traits: ['beautiful'] },
      { id: 'root-political', label: 'Political maneuvering', traits: ['social', 'strategic'] },
      { id: 'root-dramatic', label: 'Dramatic game swings', traits: ['dramatic', 'exciting'] },
    ],
    antiElements: [
      { id: 'root-learning', label: 'Must learn all factions to play well', traits: ['analysis-paralysis'] },
      { id: 'root-kingmaking', label: 'Can have kingmaking', traits: ['kingmaking'] },
    ],
  },
  {
    id: 'everdell', name: 'Everdell', bggId: 199792, year: 2018,
    minPlayers: 1, maxPlayers: 4, minTime: 40, maxTime: 80,
    complexity: 2.8, bggRating: 7.9,
    traits: ['worker-placement', 'tableau-building', 'engine-building', 'solo-mode', 'beautiful', 'thematic', 'satisfying', 'cozy'],
    elements: [
      { id: 'everdell-city', label: 'Building your woodland city', traits: ['tableau-building', 'satisfying', 'thematic'] },
      { id: 'everdell-combos', label: 'Card combos and synergies', traits: ['engine-building', 'satisfying', 'strategic'] },
      { id: 'everdell-art', label: 'Gorgeous art and 3D tree', traits: ['beautiful'] },
      { id: 'everdell-seasons', label: 'Workers through the seasons', traits: ['worker-placement', 'strategic'] },
      { id: 'everdell-theme', label: 'Charming woodland creature theme', traits: ['thematic', 'cozy'] },
    ],
    antiElements: [
      { id: 'everdell-luck', label: 'Sometimes the cards just don\'t come', traits: ['too-random'] },
    ],
  },
  {
    id: 'ark-nova', name: 'Ark Nova', bggId: 342942, year: 2021,
    minPlayers: 1, maxPlayers: 4, minTime: 90, maxTime: 150,
    complexity: 3.7, bggRating: 8.5,
    traits: ['hand-management', 'tile-placement', 'engine-building', 'variable-powers', 'solo-mode', 'thinky', 'satisfying', 'epic', 'replayable'],
    elements: [
      { id: 'arknova-zoo', label: 'Building your unique zoo', traits: ['tile-placement', 'thematic', 'satisfying'] },
      { id: 'arknova-actions', label: 'The action card power-up system', traits: ['hand-management', 'engine-building', 'strategic'] },
      { id: 'arknova-animals', label: 'Collecting diverse animal cards', traits: ['set-collection', 'thematic', 'replayable'] },
      { id: 'arknova-conservation', label: 'Conservation point racing', traits: ['competitive', 'strategic'] },
    ],
    antiElements: [
      { id: 'arknova-long', label: 'Can run very long', traits: ['too-long'] },
      { id: 'arknova-ap', label: 'Many options cause analysis paralysis', traits: ['analysis-paralysis'] },
    ],
  },
  {
    id: 'dune-imperium', name: 'Dune: Imperium', bggId: 316554, year: 2020,
    minPlayers: 1, maxPlayers: 4, minTime: 60, maxTime: 120,
    complexity: 3.0, bggRating: 8.4,
    traits: ['worker-placement', 'deck-building', 'area-control', 'solo-mode', 'thematic', 'strategic', 'competitive', 'tense'],
    elements: [
      { id: 'dune-hybrid', label: 'Deck-building + worker placement combo', traits: ['deck-building', 'worker-placement', 'strategic'] },
      { id: 'dune-theme', label: 'Amazing Dune theme', traits: ['thematic', 'epic'] },
      { id: 'dune-conflict', label: 'Tense conflict battles', traits: ['area-control', 'tense', 'competitive'] },
      { id: 'dune-factions', label: 'Gaining faction influence', traits: ['strategic'] },
    ],
    antiElements: [
      { id: 'dune-combat', label: 'Combat can be swingy', traits: ['too-random', 'confrontational'] },
    ],
  },
  {
    id: 'scythe', name: 'Scythe', bggId: 169786, year: 2016,
    minPlayers: 1, maxPlayers: 5, minTime: 90, maxTime: 115,
    complexity: 3.4, bggRating: 8.2,
    traits: ['area-control', 'engine-building', 'resource-management', 'variable-powers', 'solo-mode', 'epic', 'beautiful', 'thinky', 'strategic'],
    elements: [
      { id: 'scythe-factions', label: 'Unique faction abilities', traits: ['variable-powers', 'replayable'] },
      { id: 'scythe-engine', label: 'Building your economic engine', traits: ['engine-building', 'satisfying', 'strategic'] },
      { id: 'scythe-world', label: 'Stunning alternate-history world', traits: ['beautiful', 'thematic', 'epic'] },
      { id: 'scythe-mechs', label: 'Mechs and area control', traits: ['area-control', 'tense'] },
    ],
    antiElements: [
      { id: 'scythe-combat', label: 'Less combat than expected', traits: ['confrontational'] },
      { id: 'scythe-slow', label: 'Slow early game build-up', traits: ['too-long'] },
    ],
  },
  {
    id: 'the-crew', name: 'The Crew: Quest for Planet Nine', bggId: 284083, year: 2019,
    minPlayers: 2, maxPlayers: 5, minTime: 20, maxTime: 20,
    complexity: 2.0, bggRating: 8.0,
    traits: ['cooperative', 'trick-taking', 'communication-limits', 'campaign', 'tense', 'satisfying', 'replayable'],
    elements: [
      { id: 'crew-tricks', label: 'Cooperative trick-taking', traits: ['trick-taking', 'strategic'] },
      { id: 'crew-limited', label: 'Limited communication challenge', traits: ['communication-limits', 'tense', 'puzzly'] },
      { id: 'crew-missions', label: '50 escalating missions', traits: ['campaign', 'replayable'] },
      { id: 'crew-quick', label: 'Quick individual games', traits: ['light'] },
    ],
    antiElements: [],
  },
  {
    id: 'skull', name: 'Skull', bggId: 92415, year: 2011,
    minPlayers: 3, maxPlayers: 6, minTime: 15, maxTime: 45,
    complexity: 1.1, bggRating: 7.2,
    traits: ['bluffing', 'push-your-luck', 'auction', 'tense', 'social', 'hilarious', 'dramatic'],
    elements: [
      { id: 'skull-bluffing', label: 'Bluffing and reading others', traits: ['bluffing', 'social'] },
      { id: 'skull-bidding', label: 'Escalating bid wars', traits: ['auction', 'tense', 'dramatic'] },
      { id: 'skull-reveal', label: 'Tension flipping cards', traits: ['tense', 'exciting'] },
      { id: 'skull-simple', label: 'Dead simple rules', traits: ['light', 'elegant'] },
    ],
    antiElements: [
      { id: 'skull-elim', label: 'Player elimination', traits: ['player-elimination'] },
    ],
  },
  {
    id: 'the-resistance', name: 'The Resistance', bggId: 41114, year: 2009,
    minPlayers: 5, maxPlayers: 10, minTime: 30, maxTime: 30,
    complexity: 1.6, bggRating: 7.3,
    traits: ['hidden-roles', 'social-deduction', 'voting', 'bluffing', 'tense', 'social', 'dramatic', 'hilarious'],
    elements: [
      { id: 'resistance-traitors', label: 'Finding the hidden traitors', traits: ['hidden-roles', 'social-deduction'] },
      { id: 'resistance-accusations', label: 'Accusations and drama', traits: ['social', 'dramatic', 'confrontational'] },
      { id: 'resistance-lying', label: 'Lying to your friends', traits: ['bluffing', 'hilarious'] },
      { id: 'resistance-votes', label: 'Tense mission voting', traits: ['voting', 'tense'] },
    ],
    antiElements: [
      { id: 'resistance-feelings', label: 'Can cause hurt feelings', traits: ['mean-spirited'] },
    ],
  },
  {
    id: 'wavelength', name: 'Wavelength', bggId: 262543, year: 2019,
    minPlayers: 2, maxPlayers: 12, minTime: 30, maxTime: 45,
    complexity: 1.1, bggRating: 7.5,
    traits: ['team-based', 'voting', 'social', 'hilarious', 'dramatic', 'light'],
    elements: [
      { id: 'wavelength-spectrum', label: 'Guessing on the spectrum', traits: ['social', 'hilarious'] },
      { id: 'wavelength-debate', label: 'Debating where the answer is', traits: ['social', 'dramatic'] },
      { id: 'wavelength-reveal', label: 'The reveal moment', traits: ['exciting', 'dramatic'] },
      { id: 'wavelength-friends', label: 'Learning how friends think', traits: ['social'] },
    ],
    antiElements: [],
  },
  {
    id: 'just-one', name: 'Just One', bggId: 254640, year: 2018,
    minPlayers: 3, maxPlayers: 7, minTime: 20, maxTime: 20,
    complexity: 1.0, bggRating: 7.6,
    traits: ['cooperative', 'communication-limits', 'social', 'hilarious', 'friendly', 'light'],
    elements: [
      { id: 'justone-clues', label: 'Giving one-word clues', traits: ['creative', 'puzzly'] },
      { id: 'justone-duplicates', label: 'Duplicates get removed', traits: ['tense', 'dramatic'] },
      { id: 'justone-coop', label: 'Everyone wins/loses together', traits: ['cooperative', 'friendly'] },
      { id: 'justone-laughs', label: 'Generates instant laughs', traits: ['hilarious', 'social'] },
    ],
    antiElements: [],
  },
  {
    id: 'patchwork', name: 'Patchwork', bggId: 163412, year: 2014,
    minPlayers: 2, maxPlayers: 2, minTime: 15, maxTime: 30,
    complexity: 1.6, bggRating: 7.7,
    traits: ['tile-placement', 'pattern-building', 'puzzly', 'relaxing', 'elegant'],
    elements: [
      { id: 'patchwork-quilt', label: 'Building your quilt', traits: ['tile-placement', 'satisfying', 'cozy'] },
      { id: 'patchwork-tetris', label: 'Tetris-like puzzle', traits: ['puzzly', 'satisfying'] },
      { id: 'patchwork-buttons', label: 'Managing button economy', traits: ['resource-management', 'strategic'] },
      { id: 'patchwork-2p', label: 'Designed for exactly 2', traits: ['competitive'] },
    ],
    antiElements: [],
  },
  {
    id: '7-wonders-duel', name: '7 Wonders Duel', bggId: 173346, year: 2015,
    minPlayers: 2, maxPlayers: 2, minTime: 30, maxTime: 30,
    complexity: 2.2, bggRating: 8.1,
    traits: ['card-drafting', 'set-collection', 'tableau-building', 'competitive', 'tense', 'strategic', 'replayable'],
    elements: [
      { id: '7wd-pyramid', label: 'The card pyramid draft', traits: ['card-drafting', 'strategic', 'tense'] },
      { id: '7wd-victories', label: 'Military/Science instant wins', traits: ['tense', 'dramatic'] },
      { id: '7wd-2p', label: 'Designed specifically for 2', traits: ['competitive'] },
      { id: '7wd-tight', label: 'Every decision matters', traits: ['thinky', 'strategic'] },
    ],
    antiElements: [],
  },
  {
    id: 'jaipur', name: 'Jaipur', bggId: 54043, year: 2009,
    minPlayers: 2, maxPlayers: 2, minTime: 30, maxTime: 30,
    complexity: 1.5, bggRating: 7.6,
    traits: ['set-collection', 'hand-management', 'trading', 'competitive', 'light'],
    elements: [
      { id: 'jaipur-market', label: 'Trading at the market', traits: ['trading', 'strategic'] },
      { id: 'jaipur-pushpull', label: 'Push-pull with opponent', traits: ['competitive', 'tense'] },
      { id: 'jaipur-camels', label: 'Collecting camels', traits: ['set-collection', 'thematic'] },
      { id: 'jaipur-quick', label: 'Quick, punchy game', traits: ['light'] },
    ],
    antiElements: [],
  },
  {
    id: 'parks', name: 'PARKS', bggId: 266524, year: 2019,
    minPlayers: 1, maxPlayers: 5, minTime: 40, maxTime: 60,
    complexity: 2.2, bggRating: 7.6,
    traits: ['set-collection', 'worker-placement', 'resource-management', 'solo-mode', 'beautiful', 'relaxing', 'thematic', 'cozy'],
    elements: [
      { id: 'parks-trail', label: 'Hiking down the trail', traits: ['worker-placement', 'thematic'] },
      { id: 'parks-collection', label: 'Collecting beautiful park cards', traits: ['set-collection', 'beautiful', 'satisfying'] },
      { id: 'parks-art', label: 'Stunning national park artwork', traits: ['beautiful', 'thematic'] },
      { id: 'parks-relaxing', label: 'Peaceful, relaxing theme', traits: ['relaxing', 'cozy'] },
    ],
    antiElements: [],
  },
  {
    id: 'viticulture', name: 'Viticulture Essential Edition', bggId: 183394, year: 2015,
    minPlayers: 1, maxPlayers: 6, minTime: 45, maxTime: 90,
    complexity: 2.9, bggRating: 8.0,
    traits: ['worker-placement', 'hand-management', 'resource-management', 'solo-mode', 'thematic', 'satisfying', 'relaxing'],
    elements: [
      { id: 'viticulture-vineyard', label: 'Running your own vineyard', traits: ['thematic', 'cozy'] },
      { id: 'viticulture-seasons', label: 'Summer and winter worker placement', traits: ['worker-placement', 'strategic'] },
      { id: 'viticulture-wine', label: 'The wine-making process', traits: ['engine-building', 'thematic', 'satisfying'] },
      { id: 'viticulture-visitors', label: 'Powerful visitor cards', traits: ['hand-management', 'variable-powers'] },
    ],
    antiElements: [
      { id: 'viticulture-blocked', label: 'Getting blocked from key spaces', traits: ['confrontational'] },
    ],
  },
  {
    id: 'dominion', name: 'Dominion', bggId: 36218, year: 2008,
    minPlayers: 2, maxPlayers: 4, minTime: 30, maxTime: 30,
    complexity: 2.4, bggRating: 7.6,
    traits: ['deck-building', 'hand-management', 'strategic', 'replayable', 'competitive', 'elegant'],
    elements: [
      { id: 'dominion-deckbuilding', label: 'Building your deck during play', traits: ['deck-building', 'satisfying', 'strategic'] },
      { id: 'dominion-combos', label: 'Finding powerful card combos', traits: ['engine-building', 'satisfying'] },
      { id: 'dominion-variety', label: 'Different cards each game', traits: ['replayable'] },
      { id: 'dominion-elegant', label: 'Elegant core mechanism', traits: ['elegant'] },
    ],
    antiElements: [
      { id: 'dominion-solitaire', label: 'Can feel like multiplayer solitaire', traits: ['friendly'] },
    ],
  },
  {
    id: 'clank', name: 'Clank! A Deck-Building Adventure', bggId: 201808, year: 2016,
    minPlayers: 2, maxPlayers: 4, minTime: 30, maxTime: 60,
    complexity: 2.2, bggRating: 7.7,
    traits: ['deck-building', 'push-your-luck', 'grid-movement', 'thematic', 'exciting', 'dramatic', 'competitive'],
    elements: [
      { id: 'clank-dungeon', label: 'Delving into the dungeon', traits: ['thematic', 'exciting'] },
      { id: 'clank-deckbuilding', label: 'Building your deck', traits: ['deck-building', 'satisfying'] },
      { id: 'clank-pushluck', label: 'Pushing luck going deeper', traits: ['push-your-luck', 'tense', 'exciting'] },
      { id: 'clank-dragon', label: 'Dragon attacks and escaping', traits: ['dramatic', 'tense'] },
    ],
    antiElements: [
      { id: 'clank-elim', label: 'Can get knocked out before escaping', traits: ['player-elimination'] },
    ],
  },
  {
    id: 'dixit', name: 'Dixit', bggId: 39856, year: 2008,
    minPlayers: 3, maxPlayers: 6, minTime: 30, maxTime: 30,
    complexity: 1.2, bggRating: 7.3,
    traits: ['hand-management', 'voting', 'beautiful', 'creative', 'relaxing', 'social'],
    elements: [
      { id: 'dixit-storytelling', label: 'Creative storytelling', traits: ['creative', 'narrative'] },
      { id: 'dixit-art', label: 'Gorgeous surreal artwork', traits: ['beautiful'] },
      { id: 'dixit-guessing', label: 'Guessing others\' clues', traits: ['social', 'puzzly'] },
      { id: 'dixit-relaxed', label: 'Relaxed, friendly pace', traits: ['relaxing', 'friendly'] },
    ],
    antiElements: [],
  },
  {
    id: 'mysterium', name: 'Mysterium', bggId: 181304, year: 2015,
    minPlayers: 2, maxPlayers: 7, minTime: 42, maxTime: 42,
    complexity: 1.9, bggRating: 7.4,
    traits: ['cooperative', 'hand-management', 'beautiful', 'thematic', 'social', 'creative'],
    elements: [
      { id: 'mysterium-ghost', label: 'One player is the ghost', traits: ['variable-powers', 'creative'] },
      { id: 'mysterium-dreams', label: 'Interpreting dream vision cards', traits: ['creative', 'puzzly'] },
      { id: 'mysterium-art', label: 'Surreal, beautiful artwork', traits: ['beautiful'] },
      { id: 'mysterium-discussion', label: 'Group discussion and theorizing', traits: ['social', 'cooperative'] },
    ],
    antiElements: [
      { id: 'mysterium-frustration', label: 'Ghost role can be frustrating', traits: ['mean-spirited'] },
    ],
  },
  {
    id: 'marvel-champions', name: 'Marvel Champions', bggId: 285774, year: 2019,
    minPlayers: 1, maxPlayers: 4, minTime: 45, maxTime: 90,
    complexity: 2.8, bggRating: 8.2,
    traits: ['cooperative', 'deck-building', 'hand-management', 'variable-powers', 'solo-mode', 'thematic', 'exciting', 'replayable'],
    elements: [
      { id: 'marvel-heroes', label: 'Playing as Marvel heroes', traits: ['thematic', 'exciting'] },
      { id: 'marvel-decks', label: 'Customizing hero decks', traits: ['deck-building', 'replayable'] },
      { id: 'marvel-villains', label: 'Fighting iconic villains', traits: ['thematic', 'tense'] },
      { id: 'marvel-solo', label: 'Excellent solo play', traits: ['solo-mode'] },
    ],
    antiElements: [],
  },
  {
    id: 'agricola', name: 'Agricola', bggId: 31260, year: 2007,
    minPlayers: 1, maxPlayers: 5, minTime: 90, maxTime: 150,
    complexity: 3.6, bggRating: 7.9,
    traits: ['worker-placement', 'hand-management', 'resource-management', 'solo-mode', 'thinky', 'tense', 'competitive', 'strategic'],
    elements: [
      { id: 'agricola-farming', label: 'Building your farm', traits: ['thematic', 'satisfying'] },
      { id: 'agricola-wp', label: 'Tight worker placement', traits: ['worker-placement', 'strategic', 'competitive'] },
      { id: 'agricola-feeding', label: 'The tension of feeding your family', traits: ['tense', 'resource-management'] },
      { id: 'agricola-cards', label: 'Occupation and improvement cards', traits: ['hand-management', 'replayable'] },
    ],
    antiElements: [
      { id: 'agricola-stress', label: 'Stressful resource management', traits: ['resource-scarcity', 'tense'] },
    ],
  },
  {
    id: 'lost-ruins-of-arnak', name: 'Lost Ruins of Arnak', bggId: 312484, year: 2020,
    minPlayers: 1, maxPlayers: 4, minTime: 30, maxTime: 120,
    complexity: 2.8, bggRating: 8.1,
    traits: ['deck-building', 'worker-placement', 'resource-management', 'hand-management', 'thematic', 'beautiful', 'satisfying', 'strategic', 'replayable'],
    elements: [
      { id: 'arnak-hybrid', label: 'The deck-building + worker placement combo', traits: ['deck-building', 'worker-placement', 'strategic'] },
      { id: 'arnak-explore', label: 'Exploring new dig sites on the island', traits: ['thematic', 'exciting', 'replayable'] },
      { id: 'arnak-research', label: 'Racing up the research track', traits: ['competitive', 'strategic', 'satisfying'] },
      { id: 'arnak-guardians', label: 'Overcoming temple guardians', traits: ['thematic', 'tense'] },
      { id: 'arnak-artifacts', label: 'Discovering powerful artifacts and items', traits: ['hand-management', 'satisfying', 'replayable'] },
      { id: 'arnak-production', label: 'Beautiful art and component quality', traits: ['beautiful'] },
    ],
    antiElements: [
      { id: 'arnak-luck', label: 'Card draw can feel swingy', traits: ['too-random'] },
      { id: 'arnak-ap', label: 'Many options to evaluate each turn', traits: ['analysis-paralysis'] },
    ],
  },
  {
    id: 'arcs', name: 'Arcs', bggId: 359871, year: 2024,
    minPlayers: 2, maxPlayers: 4, minTime: 60, maxTime: 120,
    complexity: 3.4, bggRating: 8.2,
    traits: ['trick-taking', 'area-control', 'hand-management', 'dice-rolling', 'variable-powers', 'confrontational', 'dramatic', 'tense', 'strategic', 'replayable'],
    elements: [
      { id: 'arcs-tricktaking', label: 'Trick-taking action selection system', traits: ['trick-taking', 'hand-management', 'strategic'] },
      { id: 'arcs-ambitions', label: 'Declaring ambitions to define scoring', traits: ['dramatic', 'strategic', 'competitive'] },
      { id: 'arcs-combat', label: 'Fast, risk-vs-reward dice combat', traits: ['dice-rolling', 'tense', 'exciting'] },
      { id: 'arcs-narrative', label: 'Emergent stories and dramatic twists', traits: ['narrative', 'dramatic', 'thematic'] },
      { id: 'arcs-court', label: 'Building your court of powerful cards', traits: ['tableau-building', 'variable-powers', 'replayable'] },
    ],
    antiElements: [
      { id: 'arcs-chaotic', label: 'Can feel chaotic and hard to plan', traits: ['too-random', 'confrontational'] },
      { id: 'arcs-mean', label: 'Very aggressive player interaction', traits: ['mean-spirited', 'confrontational'] },
    ],
  },
  {
    id: 'seti', name: 'SETI: Search for Extraterrestrial Intelligence', bggId: 418059, year: 2024,
    minPlayers: 1, maxPlayers: 4, minTime: 40, maxTime: 160,
    complexity: 3.5, bggRating: 8.4,
    traits: ['hand-management', 'engine-building', 'area-control', 'solo-mode', 'thematic', 'beautiful', 'thinky', 'satisfying', 'strategic', 'replayable'],
    elements: [
      { id: 'seti-cards', label: 'Multi-use cards with real space projects', traits: ['hand-management', 'strategic', 'thematic'] },
      { id: 'seti-probes', label: 'Launching and landing probes on planets', traits: ['thematic', 'satisfying', 'exciting'] },
      { id: 'seti-engine', label: 'Upgrading your tech and building combos', traits: ['engine-building', 'satisfying', 'strategic'] },
      { id: 'seti-solar', label: 'The rotating solar system board', traits: ['beautiful', 'thematic', 'replayable'] },
      { id: 'seti-aliens', label: 'Discovering alien species unlocks', traits: ['exciting', 'replayable', 'thematic'] },
    ],
    antiElements: [
      { id: 'seti-slow', label: 'Slow, quiet start before things ramp up', traits: ['too-long'] },
      { id: 'seti-ap', label: 'Overwhelming number of options', traits: ['analysis-paralysis'] },
    ],
  },
];

// ============================================
// 🔧 CORE LOGIC
// ============================================

function analyzePrefs(elementPrefs) {
  const liked = {}, disliked = {};
  GAMES.forEach(g => {
    [...g.elements, ...(g.antiElements || [])].forEach(el => {
      const p = elementPrefs[el.id];
      if (p === 'like') el.traits.forEach(t => { liked[t] = (liked[t] || 0) + 1; });
      if (p === 'dislike') el.traits.forEach(t => { disliked[t] = (disliked[t] || 0) + 1; });
    });
  });
  const sort = o => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([t, c]) => ({ trait: t, count: c, info: TRAITS[t] }));
  return { likedTraits: sort(liked), dislikedTraits: sort(disliked) };
}

function scoreGame(game, analysis) {
  let score = 0;
  const reasons = [], warnings = [];
  analysis.likedTraits.forEach(({ trait, count }) => {
    if (game.traits.includes(trait)) {
      score += count * 2;
      const i = TRAITS[trait];
      if (i && reasons.length < 3) reasons.push(`${i.emoji} ${i.label}`);
    }
  });
  analysis.dislikedTraits.forEach(({ trait, count }) => {
    if (game.traits.includes(trait)) {
      score -= count * 1.5;
      const i = TRAITS[trait];
      if (i && warnings.length < 2 && i.category !== 'negative') warnings.push(`⚠️ Has ${i.label}`);
    }
  });
  return { matchScore: Math.max(0, Math.min(99, Math.round(score * 3))), reasons, warnings };
}

function getReadiness(prefs) {
  const likes = Object.values(prefs).filter(p => p === 'like').length;
  const dislikes = Object.values(prefs).filter(p => p === 'dislike').length;
  const total = likes + dislikes;
  let conf = { level: 'low', label: 'Early suggestions', emoji: '🌱', color: 'bg-yellow-500/30 text-yellow-300' };
  if (total >= 10 && likes >= 5) conf = { level: 'high', label: 'Highly personalized', emoji: '🎯', color: 'bg-brand-gold/30 text-brand-gold' };
  else if (total >= 5 && likes >= 3) conf = { level: 'good', label: 'Good recommendations', emoji: '⭐', color: 'bg-blue-500/30 text-blue-300' };
  return { canRecommend: likes >= 2, likes, dislikes, total, ...conf };
}

// ============================================
// 💾 STORAGE HELPERS (localStorage for deploy)
// ============================================

const STORAGE_KEY = 'bgr-profile';

function saveProfile(selectedGames, elementPrefs) {
  try {
    const data = JSON.stringify({
      selectedGames: [...selectedGames],
      elementPrefs,
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, data);
    return true;
  } catch (e) {
    console.error('Save failed:', e);
    return false;
  }
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return {
        selectedGames: new Set(data.selectedGames || []),
        elementPrefs: data.elementPrefs || {},
        savedAt: data.savedAt,
      };
    }
  } catch (e) {
    console.log('No saved profile found');
  }
  return null;
}

function clearProfile() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

// ============================================
// 🎴 COMPONENTS
// ============================================

function MatchBadge({ score, size = 'md' }) {
  let bg, text;
  if (score >= 50) { bg = 'bg-brand-gold/30'; text = 'text-brand-gold'; }
  else if (score >= 25) { bg = 'bg-blue-500/30'; text = 'text-blue-300'; }
  else if (score >= 10) { bg = 'bg-yellow-500/30'; text = 'text-yellow-300'; }
  else { bg = 'bg-white/10'; text = 'text-white/50'; }
  
  const sizeClass = size === 'lg' ? 'text-2xl px-4 py-2' : size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  return <span className={`${bg} ${text} ${sizeClass} rounded-xl font-bold`}>{score}%</span>;
}

function GameCard({ game, scored, showBGG = true }) {
  const tier = getComplexityTier(game.complexity);
  const tierInfo = COMPLEXITY_TIERS[tier];
  const isPerfect = scored.matchScore >= 50;
  
  return (
    <div className={`rounded-2xl p-5 border transition-all ${isPerfect ? 'bg-gradient-to-br from-brand-gold/10 to-brand-gold-warm/10 border-brand-gold/40' : 'bg-white/5 border-white/10'}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{game.name}</h3>
          <div className="text-sm text-purple-300">{game.year}</div>
        </div>
        <MatchBadge score={scored.matchScore} />
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${tierInfo.color}`}>{tierInfo.label}</span>
        <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-white/70">{game.minPlayers}-{game.maxPlayers}p</span>
        <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-white/70">{game.minTime}-{game.maxTime}m</span>
        <span className="px-2 py-0.5 bg-yellow-500/20 rounded text-xs text-yellow-300">⭐ {game.bggRating}</span>
      </div>
      {scored.reasons.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {scored.reasons.map((r, i) => <span key={i} className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/80">{r}</span>)}
        </div>
      )}
      {scored.warnings?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {scored.warnings.map((w, i) => <span key={i} className="px-2 py-1 bg-red-500/20 rounded-lg text-xs text-red-300">{w}</span>)}
        </div>
      )}
      {showBGG && (
        <a href={`https://boardgamegeek.com/boardgame/${game.bggId}`} target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-xs text-orange-300">
          🎲 View on BGG
        </a>
      )}
    </div>
  );
}

function TasteProfile({ analysis, readiness }) {
  return (
    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">📊 Your Taste Profile</h2>
        <span className={`px-3 py-1 rounded-xl text-xs font-medium ${readiness.color}`}>{readiness.emoji} {readiness.label}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm text-brand-gold mb-2">Things You Love ({readiness.likes})</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.likedTraits.slice(0, 8).map(({ trait, count, info }) => (
              <span key={trait} className="px-3 py-1.5 bg-brand-gold/30 rounded-lg text-sm text-white">
                {info?.emoji} {info?.label || trait} <span className="text-white/50">×{count}</span>
              </span>
            ))}
            {analysis.likedTraits.length === 0 && <span className="text-white/40 text-sm">Rate some games to build your profile</span>}
          </div>
        </div>
        <div>
          <h3 className="text-sm text-red-300 mb-2">Things to Avoid ({readiness.dislikes})</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.dislikedTraits.slice(0, 6).map(({ trait, count, info }) => (
              <span key={trait} className="px-3 py-1.5 bg-red-500/20 rounded-lg text-sm text-red-200">
                {info?.emoji} {info?.label || trait} <span className="text-white/50">×{count}</span>
              </span>
            ))}
            {analysis.dislikedTraits.length === 0 && <span className="text-white/40 text-sm">Nothing marked yet</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 🏰 MAIN APP
// ============================================

export default function BoardGameRecommenderV7() {
  const [selectedGames, setSelectedGames] = useState(new Set());
  const [elementPrefs, setElementPrefs] = useState({});
  const [stage, setStage] = useState('loading'); // loading | home | select-games | rate-elements | results | browse
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterComplexity, setFilterComplexity] = useState('all');
  const [saveStatus, setSaveStatus] = useState('');
  const [hasProfile, setHasProfile] = useState(false);
  const [browseSearch, setBrowseSearch] = useState('');
  const [browseSort, setBrowseSort] = useState('match');
  const [browseComplexity, setBrowseComplexity] = useState('all');
  
  // Load saved profile on mount
  useEffect(() => {
    const profile = loadProfile();
    if (profile && Object.keys(profile.elementPrefs).length > 0) {
      setSelectedGames(profile.selectedGames);
      setElementPrefs(profile.elementPrefs);
      setHasProfile(true);
    }
    setStage('home');
  }, []);
  
  const gamesToRate = useMemo(() => GAMES.filter(g => selectedGames.has(g.id)), [selectedGames]);
  const currentGame = gamesToRate[currentGameIndex];
  const readiness = useMemo(() => getReadiness(elementPrefs), [elementPrefs]);
  const analysis = useMemo(() => analyzePrefs(elementPrefs), [elementPrefs]);
  
  // Score ALL games for browse mode
  const allScored = useMemo(() => {
    if (!readiness.canRecommend) return [];
    return GAMES.map(g => ({ ...g, ...scoreGame(g, analysis), complexityTier: getComplexityTier(g.complexity), isRated: selectedGames.has(g.id) }))
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [analysis, readiness.canRecommend, selectedGames]);
  
  // Filtered browse results
  const browseResults = useMemo(() => {
    let results = [...allScored];
    if (browseSearch.trim()) results = results.filter(g => g.name.toLowerCase().includes(browseSearch.toLowerCase()));
    if (browseComplexity !== 'all') results = results.filter(g => g.complexityTier === browseComplexity);
    if (browseSort === 'match') results.sort((a, b) => b.matchScore - a.matchScore);
    else if (browseSort === 'rating') results.sort((a, b) => b.bggRating - a.bggRating);
    else if (browseSort === 'name') results.sort((a, b) => a.name.localeCompare(b.name));
    else if (browseSort === 'complexity') results.sort((a, b) => a.complexity - b.complexity);
    return results;
  }, [allScored, browseSearch, browseComplexity, browseSort]);
  
  const filteredGames = useMemo(() => {
    let r = [...GAMES];
    if (filterComplexity !== 'all') r = r.filter(g => getComplexityTier(g.complexity) === filterComplexity);
    if (searchQuery.trim()) r = r.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return r.sort((a, b) => b.bggRating - a.bggRating);
  }, [filterComplexity, searchQuery]);
  
  const handleSave = () => {
    setSaveStatus('saving');
    const ok = saveProfile(selectedGames, elementPrefs);
    setSaveStatus(ok ? 'saved' : 'error');
    if (ok) setHasProfile(true);
    setTimeout(() => setSaveStatus(''), 2500);
  };
  
  const handleClear = () => {
    clearProfile();
    setSelectedGames(new Set());
    setElementPrefs({});
    setHasProfile(false);
    setStage('home');
  };
  
  const toggleGame = (gameId) => {
    setSelectedGames(prev => {
      const next = new Set(prev);
      if (next.has(gameId)) {
        next.delete(gameId);
        const game = GAMES.find(g => g.id === gameId);
        if (game) {
          const np = { ...elementPrefs };
          [...game.elements, ...(game.antiElements || [])].forEach(e => delete np[e.id]);
          setElementPrefs(np);
        }
      } else next.add(gameId);
      return next;
    });
  };
  
  const setElementPref = (id, pref) => {
    setElementPrefs(prev => prev[id] === pref ? (({ [id]: _, ...rest }) => rest)(prev) : { ...prev, [id]: pref });
  };
  
  const nextGame = () => currentGameIndex < gamesToRate.length - 1 ? setCurrentGameIndex(i => i + 1) : setStage('results');
  const prevGame = () => currentGameIndex > 0 && setCurrentGameIndex(i => i - 1);

  // Nav bar component used on every screen
  const NavBar = ({ current }) => (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      {['home', 'select-games', 'results', 'browse'].map(s => {
        const labels = { home: '🏠 Home', 'select-games': '🎮 Select', results: '🎯 Results', browse: '🔍 Browse' };
        const isActive = current === s;
        const isDisabled = (s === 'results' || s === 'browse') && !readiness.canRecommend;
        return (
          <button key={s} onClick={() => !isDisabled && setStage(s)} disabled={isDisabled}
            className={`px-3 md:px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${isActive ? 'bg-white/20 text-white' : isDisabled ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}>
            {labels[s]}
          </button>
        );
      })}
      <div className="ml-auto flex items-center gap-2">
        {readiness.canRecommend && (
          <button onClick={handleSave} className="px-3 md:px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium bg-brand-purple/30 text-purple-200 hover:bg-brand-purple/50 transition-all whitespace-nowrap">
            {saveStatus === 'saving' ? '💾 Saving...' : saveStatus === 'saved' ? '✅ Saved!' : saveStatus === 'error' ? '❌ Error' : '💾 Save'}
          </button>
        )}
      </div>
    </div>
  );

  // ========== LOADING ==========
  if (stage === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-brand-purple to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🎲</div>
          <p className="text-white/70">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // ========== HOME ==========
  if (stage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-brand-purple to-purple-950 p-4">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">🎲 Board Game Recommender</h1>
            <p className="text-lg md:text-xl text-purple-200 mb-6 md:mb-8">Find your next favorite game</p>
            
            {hasProfile && readiness.canRecommend ? (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <p className="text-emerald-300 text-lg mb-2">Welcome back! 👋</p>
                  <p className="text-white/70 mb-4">
                    Your profile: {readiness.likes} likes, {readiness.dislikes} dislikes across {selectedGames.size} games
                  </p>
                  <span className={`inline-block px-4 py-2 rounded-xl text-sm font-medium ${readiness.color}`}>
                    {readiness.emoji} {readiness.label}
                  </span>
                </div>
                
                <TasteProfile analysis={analysis} readiness={readiness} />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <button onClick={() => setStage('browse')}
                    className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-brand-gold/20 to-brand-gold-warm/20 border border-brand-gold/30 hover:border-brand-gold/50 transition-all text-left">
                    <div className="text-2xl mb-2">🔍</div>
                    <h3 className="text-white font-bold mb-1 text-base md:text-lg">Browse & Search</h3>
                    <p className="text-white/60 text-xs md:text-sm">See match % for all games</p>
                  </button>
                  <button onClick={() => setStage('results')}
                    className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-brand-purple/20 to-brand-purple-light/20 border border-brand-purple/30 hover:border-brand-purple/50 transition-all text-left">
                    <div className="text-2xl mb-2">🎯</div>
                    <h3 className="text-white font-bold mb-1 text-base md:text-lg">Top Picks</h3>
                    <p className="text-white/60 text-xs md:text-sm">See your best matches</p>
                  </button>
                  <button onClick={() => setStage('select-games')}
                    className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all text-left">
                    <div className="text-2xl mb-2">➕</div>
                    <h3 className="text-white font-bold mb-1 text-base md:text-lg">Rate More Games</h3>
                    <p className="text-white/60 text-xs md:text-sm">Improve recommendations</p>
                  </button>
                  <button onClick={handleClear}
                    className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all text-left">
                    <div className="text-2xl mb-2">🗑️</div>
                    <h3 className="text-white font-bold mb-1 text-base md:text-lg">Start Fresh</h3>
                    <p className="text-white/60 text-xs md:text-sm">Clear saved profile</p>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
                  <p className="text-white/70 text-base md:text-lg mb-6">
                    Tell us which games you've played and what you liked about them.
                    We'll find your perfect next game! 🎯
                  </p>
                  <button onClick={() => setStage('select-games')}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base md:text-lg bg-gradient-to-r from-brand-gold to-brand-gold-warm text-gray-900 hover:scale-105 transition-transform shadow-lg hover:shadow-xl">
                    Get Started →
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
                  <div className="bg-white/5 rounded-xl p-3 md:p-4">
                    <div className="text-xl md:text-2xl mb-1">🎮</div>
                    <p className="text-white/70 text-xs md:text-sm">Select games you know</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 md:p-4">
                    <div className="text-xl md:text-2xl mb-1">👍👎</div>
                    <p className="text-white/70 text-xs md:text-sm">Rate what you liked</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 md:p-4">
                    <div className="text-xl md:text-2xl mb-1">🎯</div>
                    <p className="text-white/70 text-xs md:text-sm">Get personalized picks</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========== SELECT GAMES ==========
  if (stage === 'select-games') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-brand-purple to-purple-950 p-4">
        <div className="max-w-6xl mx-auto px-4">
          <NavBar current="select-games" />
          <div className="text-center mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-white">Select Games You've Played</h1>
          </div>
          <div className="sticky top-2 z-20 mb-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 shadow-lg">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="text-white text-lg"><span className="text-brand-gold font-bold text-xl">{selectedGames.size}</span> selected</span>
                <button onClick={() => { if (selectedGames.size > 0) { setStage('rate-elements'); setCurrentGameIndex(0); } }}
                  disabled={selectedGames.size === 0}
                  className={`ml-auto px-6 py-2.5 rounded-xl font-semibold transition-all ${selectedGames.size > 0 ? 'bg-gradient-to-r from-brand-gold to-brand-gold-warm text-gray-900 hover:scale-105 shadow-md hover:shadow-lg' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}>
                  {selectedGames.size === 0 ? 'Select games to rate' : 'Rate Elements →'}
                </button>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/15 rounded-xl text-white placeholder-white/60 border border-white/10 focus:border-brand-gold/50 focus:outline-none transition-all" />
                <select value={filterComplexity} onChange={e => setFilterComplexity(e.target.value)} className="px-4 py-3 bg-white/15 rounded-xl text-white border border-white/10 focus:border-brand-gold/50 focus:outline-none transition-all">
                  <option value="all">All Weights</option>
                  <option value="light">Light</option>
                  <option value="gateway">Gateway</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredGames.map(game => {
              const sel = selectedGames.has(game.id);
              const tier = getComplexityTier(game.complexity);
              return (
                <button key={game.id} onClick={() => toggleGame(game.id)}
                  className={`p-3 rounded-xl text-left transition-all border ${sel ? 'bg-brand-gold/20 border-brand-gold/50 ring-2 ring-brand-gold/50' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-medium text-white text-sm leading-tight">{game.name}</h3>
                    {sel && <span className="text-brand-gold ml-1">✓</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${COMPLEXITY_TIERS[tier].color}`}>{COMPLEXITY_TIERS[tier].label}</span>
                    <span className="text-xs text-yellow-400">⭐{game.bggRating}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ========== RATE ELEMENTS ==========
  if (stage === 'rate-elements' && currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-brand-purple to-purple-950 p-4">
        <div className="max-w-2xl mx-auto px-4">
          <NavBar current="rate-elements" />
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 text-sm">Game {currentGameIndex + 1} of {gamesToRate.length}</span>
              <span className="text-white/70 text-sm">{readiness.likes} 👍 {readiness.dislikes} 👎</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-gold to-brand-gold-warm transition-all" style={{ width: `${((currentGameIndex + 1) / gamesToRate.length) * 100}%` }} />
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">{currentGame.name}</h2>
              <p className="text-purple-300">What did you think about these aspects?</p>
            </div>
            <div className="space-y-3">
              {currentGame.elements.map(el => (
                <div key={el.id} className="bg-white/5 rounded-xl p-4">
                  <p className="text-white mb-3">{el.label}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setElementPref(el.id, 'like')}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all ${elementPrefs[el.id] === 'like' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                      👍 Liked this
                    </button>
                    <button onClick={() => setElementPref(el.id, 'dislike')}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all ${elementPrefs[el.id] === 'dislike' ? 'bg-red-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                      👎 Not for me
                    </button>
                  </div>
                </div>
              ))}
              {currentGame.antiElements?.length > 0 && (
                <>
                  <div className="border-t border-white/10 my-4" />
                  <p className="text-white/50 text-sm mb-2">Common criticisms:</p>
                  {currentGame.antiElements.map(el => (
                    <div key={el.id} className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                      <p className="text-white mb-3">{el.label}</p>
                      <div className="flex gap-2">
                        <button onClick={() => setElementPref(el.id, 'like')}
                          className={`flex-1 py-2 rounded-lg font-medium transition-all ${elementPrefs[el.id] === 'like' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                          👍 Didn't bother me
                        </button>
                        <button onClick={() => setElementPref(el.id, 'dislike')}
                          className={`flex-1 py-2 rounded-lg font-medium transition-all ${elementPrefs[el.id] === 'dislike' ? 'bg-red-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                          👎 This bothered me
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={prevGame} disabled={currentGameIndex === 0}
              className={`px-5 py-3 rounded-xl font-medium ${currentGameIndex === 0 ? 'bg-white/5 text-white/30' : 'bg-white/10 text-white hover:bg-white/20'}`}>←</button>
            <button onClick={() => setStage('select-games')} className="px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 text-sm">+ Games</button>
            <button onClick={nextGame} className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-brand-gold to-brand-gold-warm text-gray-900 hover:scale-[1.02] shadow-md hover:shadow-lg transition-all">
              {currentGameIndex < gamesToRate.length - 1 ? 'Next Game →' : 'See Results →'}
            </button>
          </div>
          {readiness.canRecommend && (
            <button onClick={() => setStage('results')} className="w-full mt-3 py-2 text-purple-300 hover:text-white text-sm">
              Skip to results ({readiness.emoji} {readiness.label})
            </button>
          )}
        </div>
      </div>
    );
  }

  // ========== RESULTS ==========
  if (stage === 'results') {
    const recs = readiness.canRecommend ? (() => {
      const eligible = allScored.filter(g => !g.isRated);
      return {
        perfect: eligible.filter(g => g.matchScore >= 50),
        great: eligible.filter(g => g.matchScore >= 25 && g.matchScore < 50),
        worth: eligible.filter(g => g.matchScore >= 10 && g.matchScore < 25),
      };
    })() : null;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-brand-purple to-purple-950 p-4">
        <div className="max-w-4xl mx-auto px-4">
          <NavBar current="results" />
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">🎯 Your Recommendations</h1>
          </div>
          
          <div className="mb-8"><TasteProfile analysis={analysis} readiness={readiness} /></div>
          
          {recs?.perfect.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg md:text-xl font-bold text-white mb-4">🎯 Perfect For You</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {recs.perfect.slice(0, 6).map(g => <GameCard key={g.id} game={g} scored={g} />)}
              </div>
            </div>
          )}
          {recs?.great.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg md:text-xl font-bold text-white mb-4">⭐ You'd Probably Love</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {recs.great.slice(0, 6).map(g => <GameCard key={g.id} game={g} scored={g} />)}
              </div>
            </div>
          )}
          {recs?.worth.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg md:text-xl font-bold text-white mb-4">🌱 Worth Exploring</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {recs.worth.slice(0, 9).map(g => (
                  <div key={g.id} className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white text-sm truncate">{g.name}</h3>
                      <MatchBadge score={g.matchScore} size="sm" />
                    </div>
                    <a href={`https://boardgamegeek.com/boardgame/${g.bggId}`} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-300 hover:text-orange-200">🎲 BGG →</a>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!recs?.perfect.length && !recs?.great.length && !recs?.worth.length && (
            <div className="text-center py-12 bg-white/5 rounded-2xl">
              <p className="text-white/70 mb-4">Rate more elements to get recommendations!</p>
              <button onClick={() => setStage('select-games')} className="px-6 py-3 bg-brand-purple text-white rounded-xl">Add Games</button>
            </div>
          )}
          
          {readiness.canRecommend && (
            <div className="text-center mt-6">
              <button onClick={() => setStage('browse')} className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium">
                🔍 Browse All Games With Match %
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ========== BROWSE & SEARCH ==========
  if (stage === 'browse') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-brand-purple to-purple-950 p-4">
        <div className="max-w-5xl mx-auto px-4">
          <NavBar current="browse" />
          <div className="text-center mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-white">🔍 Browse All Games</h1>
            <p className="text-purple-300 text-xs md:text-sm">See your match % for every game</p>
          </div>
          
          {/* Search & Filters */}
          <div className="sticky top-2 z-20 mb-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 shadow-lg">
              <div className="flex flex-col md:flex-row gap-3">
                <input type="text" placeholder="Search games..." value={browseSearch} onChange={e => setBrowseSearch(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/15 rounded-xl text-white placeholder-white/60 border border-white/10 focus:border-brand-gold/50 focus:outline-none transition-all text-lg" />
                <select value={browseSort} onChange={e => setBrowseSort(e.target.value)} className="px-4 py-3 bg-white/15 rounded-xl text-white border border-white/10 focus:border-brand-gold/50 focus:outline-none transition-all">
                  <option value="match">Sort: Best Match</option>
                  <option value="rating">Sort: BGG Rating</option>
                  <option value="name">Sort: Name</option>
                  <option value="complexity">Sort: Complexity</option>
                </select>
                <select value={browseComplexity} onChange={e => setBrowseComplexity(e.target.value)} className="px-4 py-3 bg-white/15 rounded-xl text-white border border-white/10 focus:border-brand-gold/50 focus:outline-none transition-all">
                  <option value="all">All Weights</option>
                  <option value="light">Light</option>
                  <option value="gateway">Gateway</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>
              <div className="mt-3 text-sm text-white/50 font-medium">{browseResults.length} games</div>
            </div>
          </div>
          
          {/* Results */}
          <div className="space-y-2">
            {browseResults.map(game => {
              const tier = COMPLEXITY_TIERS[game.complexityTier];
              return (
                <div key={game.id} className={`rounded-xl p-4 border transition-all ${game.isRated ? 'bg-white/5 border-white/5 opacity-60' : game.matchScore >= 50 ? 'bg-brand-gold/10 border-brand-gold/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center gap-4">
                    {/* Match score */}
                    <div className="w-16 text-center shrink-0">
                      <MatchBadge score={game.matchScore} size={game.matchScore >= 50 ? 'md' : 'sm'} />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white truncate">{game.name}</h3>
                        {game.isRated && <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/50">Rated</span>}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${tier.color}`}>{tier.label}</span>
                        <span className="text-xs text-white/50">{game.minPlayers}-{game.maxPlayers}p</span>
                        <span className="text-xs text-white/50">{game.minTime}-{game.maxTime}m</span>
                        <span className="text-xs text-yellow-400">⭐{game.bggRating}</span>
                      </div>
                      {game.reasons.length > 0 && !game.isRated && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {game.reasons.map((r, i) => <span key={i} className="text-xs text-white/60">{r}</span>)}
                        </div>
                      )}
                    </div>
                    
                    {/* BGG link */}
                    <a href={`https://boardgamegeek.com/boardgame/${game.bggId}`} target="_blank" rel="noopener noreferrer"
                       className="px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-xs text-orange-300 shrink-0">
                      🎲 BGG
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          
          {browseResults.length === 0 && (
            <div className="text-center py-12 text-white/50">No games match your search</div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
