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
  },,
  {
    id: 'risk', name: "Risk", bggId: 181, year: 1959,
    minPlayers: 2, maxPlayers: 6, minTime: 120, maxTime: 360,
    complexity: 2, bggRating: 5.5,
    traits: ['dice-rolling', 'area-control', 'negotiation', 'dramatic', 'confrontational', 'luck-driven'],
    elements: [
      { id: 'risk-dice', label: "Combat resolved by dice — exciting but swingy", traits: ['dice-rolling', 'luck-driven', 'exciting'] },
      { id: 'risk-conquest', label: "Conquer territories to control continents", traits: ['area-control', 'strategic', 'competitive'] },
      { id: 'risk-alliances', label: "Alliances form and break constantly", traits: ['negotiation', 'social', 'dramatic'] },
      { id: 'risk-swings', label: "Huge swings of fortune, memorable comebacks", traits: ['dramatic', 'exciting'] }
    ],
    antiElements: [
      { id: 'risk-length', label: "Games can drag on for 4-6 hours", traits: ['too-long'] },
      { id: 'risk-random', label: "Dice can override all strategy", traits: ['too-random'] },
      { id: 'risk-elimination', label: "Knocked out players watch for hours", traits: ['player-elimination'] }
    ],
  },
  {
    id: 'game-of-thrones-board-game', name: "A Game of Thrones: The Board Game", bggId: 6472, year: 2003,
    minPlayers: 3, maxPlayers: 6, minTime: 180, maxTime: 300,
    complexity: 3.7, bggRating: 7.3,
    traits: ['negotiation', 'area-control', 'hand-management', 'dramatic', 'thematic', 'variable-powers', 'confrontational'],
    elements: [
      { id: 'got-diplomacy', label: "Diplomacy and betrayal are essential", traits: ['negotiation', 'social', 'dramatic'] },
      { id: 'got-orders', label: "Secret order placement creates tension", traits: ['hand-management', 'tense', 'strategic'] },
      { id: 'got-control', label: "Control castles and strongholds to win", traits: ['area-control', 'strategic'] },
      { id: 'got-theme', label: "Captures the feel of the books/show perfectly", traits: ['thematic', 'epic'] },
      { id: 'got-houses', label: "Each House plays differently", traits: ['variable-powers', 'replayable'] }
    ],
    antiElements: [
      { id: 'got-length', label: "3-5 hour playtime", traits: ['too-long'] },
      { id: 'got-backstab', label: "Backstabbing can feel personal", traits: ['mean-spirited', 'confrontational'] },
      { id: 'got-ap', label: "Many options each round", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'twilight-imperium-3', name: "Twilight Imperium (Third Edition)", bggId: 12493, year: 2005,
    minPlayers: 3, maxPlayers: 6, minTime: 240, maxTime: 480,
    complexity: 4.2, bggRating: 7.9,
    traits: ['area-control', 'negotiation', 'variable-powers', 'epic', 'dramatic', 'thematic', 'strategic'],
    elements: [
      { id: 'ti3-epic', label: "Galaxy-spanning space opera experience", traits: ['epic', 'thematic', 'dramatic'] },
      { id: 'ti3-politics', label: "Political dealing is essential to victory", traits: ['negotiation', 'social', 'strategic'] },
      { id: 'ti3-races', label: "17 unique alien races with different abilities", traits: ['variable-powers', 'replayable'] },
      { id: 'ti3-conquest', label: "Control systems and planets", traits: ['area-control', 'strategic'] },
      { id: 'ti3-stories', label: "Memorable stories emerge every game", traits: ['narrative', 'dramatic'] }
    ],
    antiElements: [
      { id: 'ti3-length', label: "6-10+ hour games", traits: ['too-long'] },
      { id: 'ti3-ap', label: "Overwhelming number of options", traits: ['analysis-paralysis'] },
      { id: 'ti3-conflict', label: "Direct conflict can be brutal", traits: ['confrontational', 'mean-spirited'] }
    ],
  },
  {
    id: 'descent', name: "Descent: Journeys in the Dark", bggId: 17226, year: 2005,
    minPlayers: 2, maxPlayers: 5, minTime: 120, maxTime: 240,
    complexity: 3.3, bggRating: 7.2,
    traits: ['grid-movement', 'dice-rolling', 'thematic', 'campaign', 'cooperative', 'variable-powers'],
    elements: [
      { id: 'descent-dungeon', label: "Classic explore-and-fight dungeon crawling", traits: ['grid-movement', 'thematic', 'exciting'] },
      { id: 'descent-dice', label: "Combat uses custom dice for attacks", traits: ['dice-rolling', 'luck-driven'] },
      { id: 'descent-theme', label: "Rich fantasy adventure feel", traits: ['thematic', 'narrative'] },
      { id: 'descent-campaign', label: "Connected scenarios with character progression", traits: ['campaign', 'satisfying'] },
      { id: 'descent-coop', label: "Heroes work together vs the Overlord player", traits: ['cooperative', 'social'] }
    ],
    antiElements: [
      { id: 'descent-length', label: "Sessions can run 3-4 hours", traits: ['too-long'] },
      { id: 'descent-fiddly', label: "Lots of rules and exceptions to remember", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'hegemony', name: "Hegemony: Lead Your Class to Victory", bggId: 321608, year: 2023,
    minPlayers: 2, maxPlayers: 4, minTime: 90, maxTime: 180,
    complexity: 4.1, bggRating: 8.4,
    traits: ['variable-powers', 'thematic', 'negotiation', 'engine-building', 'strategic', 'thinky'],
    elements: [
      { id: 'hegemony-asymmetric', label: "Each class (Workers, Capitalists, Middle, State) plays completely differently", traits: ['variable-powers', 'replayable'] },
      { id: 'hegemony-theme', label: "Political economy simulation that feels real", traits: ['thematic', 'thinky'] },
      { id: 'hegemony-voting', label: "Policy voting and negotiation between classes", traits: ['negotiation', 'voting', 'social'] },
      { id: 'hegemony-engine', label: "Build economic engine for your class", traits: ['engine-building', 'satisfying', 'strategic'] }
    ],
    antiElements: [
      { id: 'hegemony-length', label: "Can run 3+ hours", traits: ['too-long'] },
      { id: 'hegemony-ap', label: "Many interlocking decisions", traits: ['analysis-paralysis', 'thinky'] },
      { id: 'hegemony-conflict', label: "Classes have opposing interests", traits: ['confrontational'] }
    ],
  },
  {
    id: 'dead-of-winter', name: "Dead of Winter", bggId: 150376, year: 2014,
    minPlayers: 2, maxPlayers: 5, minTime: 60, maxTime: 120,
    complexity: 3, bggRating: 7.4,
    traits: ['hidden-roles', 'cooperative', 'narrative', 'thematic', 'tense', 'dice-rolling'],
    elements: [
      { id: 'dow-traitor', label: "Someone might be sabotaging the colony", traits: ['hidden-roles', 'social-deduction', 'tense'] },
      { id: 'dow-crossroads', label: "Crossroads cards create story moments", traits: ['narrative', 'dramatic', 'thematic'] },
      { id: 'dow-coop', label: "Work together to survive the winter", traits: ['cooperative', 'social'] },
      { id: 'dow-theme', label: "Zombie survival tension", traits: ['thematic', 'tense'] }
    ],
    antiElements: [
      { id: 'dow-luck', label: "Dice and card luck can swing outcomes", traits: ['too-random'] },
      { id: 'dow-accusations', label: "Traitor accusations can feel personal", traits: ['mean-spirited', 'confrontational'] }
    ],
  },
  {
    id: 'betrayal-house-hill', name: "Betrayal at House on the Hill", bggId: 10547, year: 2004,
    minPlayers: 3, maxPlayers: 6, minTime: 60, maxTime: 60,
    complexity: 2.4, bggRating: 7,
    traits: ['narrative', 'hidden-roles', 'tile-placement', 'thematic', 'replayable', 'dramatic'],
    elements: [
      { id: 'betrayal-stories', label: "Different horror story every game", traits: ['narrative', 'replayable', 'thematic'] },
      { id: 'betrayal-haunt', label: "The Haunt reveals the betrayer mid-game", traits: ['hidden-roles', 'dramatic', 'exciting'] },
      { id: 'betrayal-explore', label: "Build the house as you explore it", traits: ['tile-placement', 'thematic'] },
      { id: 'betrayal-horror', label: "B-movie horror atmosphere", traits: ['thematic', 'hilarious'] }
    ],
    antiElements: [
      { id: 'betrayal-random', label: "Haunt trigger and outcome can feel arbitrary", traits: ['too-random'] },
      { id: 'betrayal-balance', label: "Some haunts heavily favor one side", traits: ['too-random'] }
    ],
  },
  {
    id: 'destinies', name: "Destinies", bggId: 285192, year: 2021,
    minPlayers: 1, maxPlayers: 3, minTime: 90, maxTime: 150,
    complexity: 2.3, bggRating: 7.8,
    traits: ['narrative', 'competitive', 'dice-rolling', 'thematic', 'solo-mode'],
    elements: [
      { id: 'destinies-app', label: "App-driven branching stories", traits: ['narrative', 'thematic'] },
      { id: 'destinies-explore', label: "Discover locations and NPCs", traits: ['thematic', 'exciting'] },
      { id: 'destinies-race', label: "Race to fulfill your destiny first", traits: ['competitive', 'tense'] },
      { id: 'destinies-dice', label: "Skill checks with dice", traits: ['dice-rolling', 'exciting'] }
    ],
    antiElements: [
      { id: 'destinies-appreq', label: "Must use companion app", traits: ['analysis-paralysis'] },
      { id: 'destinies-replay', label: "Stories less exciting on replay", traits: ['too-random'] }
    ],
  },
  {
    id: 'cosmic-encounter', name: "Cosmic Encounter", bggId: 39463, year: 2008,
    minPlayers: 3, maxPlayers: 5, minTime: 60, maxTime: 120,
    complexity: 2.5, bggRating: 7.5,
    traits: ['variable-powers', 'negotiation', 'dramatic', 'bluffing', 'replayable', 'hilarious'],
    elements: [
      { id: 'cosmic-powers', label: "50+ aliens with game-breaking abilities", traits: ['variable-powers', 'replayable'] },
      { id: 'cosmic-alliances', label: "Alliances form and break constantly", traits: ['negotiation', 'social', 'dramatic'] },
      { id: 'cosmic-swings', label: "Wild swings and crazy combos", traits: ['dramatic', 'exciting', 'hilarious'] },
      { id: 'cosmic-bluff', label: "Card play involves reads and bluffs", traits: ['bluffing', 'tense'] }
    ],
    antiElements: [
      { id: 'cosmic-imbalance', label: "Alien matchups can be imbalanced", traits: ['too-random'] },
      { id: 'cosmic-chaos', label: "Hard to plan when powers stack", traits: ['too-random', 'analysis-paralysis'] }
    ],
  },
  {
    id: 'mansions-of-madness', name: "Mansions of Madness (Second Edition)", bggId: 205059, year: 2016,
    minPlayers: 1, maxPlayers: 5, minTime: 120, maxTime: 180,
    complexity: 2.7, bggRating: 8,
    traits: ['narrative', 'cooperative', 'thematic', 'puzzly', 'solo-mode'],
    elements: [
      { id: 'mom-stories', label: "App drives immersive horror stories", traits: ['narrative', 'thematic'] },
      { id: 'mom-coop', label: "Work together to solve mysteries", traits: ['cooperative', 'social'] },
      { id: 'mom-horror', label: "Lovecraftian horror atmosphere", traits: ['thematic', 'tense'] },
      { id: 'mom-puzzles', label: "In-app puzzles to solve", traits: ['puzzly', 'satisfying'] }
    ],
    antiElements: [
      { id: 'mom-app', label: "Must use companion app", traits: ['analysis-paralysis'] },
      { id: 'mom-length', label: "Scenarios run 2-3 hours", traits: ['too-long'] }
    ],
  },
  {
    id: 'unfathomable', name: "Unfathomable", bggId: 340466, year: 2021,
    minPlayers: 3, maxPlayers: 6, minTime: 120, maxTime: 240,
    complexity: 3, bggRating: 7.6,
    traits: ['hidden-roles', 'cooperative', 'thematic', 'tense', 'dramatic', 'social-deduction'],
    elements: [
      { id: 'unfath-traitor', label: "Hybrids secretly work against humans", traits: ['hidden-roles', 'social-deduction', 'tense'] },
      { id: 'unfath-coop', label: "Crew must survive the voyage together", traits: ['cooperative', 'social'] },
      { id: 'unfath-theme', label: "Lovecraftian ship horror", traits: ['thematic', 'tense'] },
      { id: 'unfath-tension', label: "Resources drain, paranoia builds", traits: ['tense', 'dramatic'] }
    ],
    antiElements: [
      { id: 'unfath-length', label: "Can run 3-4 hours", traits: ['too-long'] },
      { id: 'unfath-accusations', label: "Traitor accusations get personal", traits: ['mean-spirited', 'confrontational'] }
    ],
  },
  {
    id: 'small-world', name: "Small World", bggId: 40692, year: 2009,
    minPlayers: 2, maxPlayers: 5, minTime: 40, maxTime: 80,
    complexity: 2.4, bggRating: 7.2,
    traits: ['area-control', 'variable-powers', 'confrontational', 'strategic', 'replayable'],
    elements: [
      { id: 'sw-conquest', label: "Conquer regions for points", traits: ['area-control', 'competitive', 'strategic'] },
      { id: 'sw-combos', label: "Race+power combos create endless variety", traits: ['variable-powers', 'replayable'] },
      { id: 'sw-decline', label: "Knowing when to decline your race is key", traits: ['strategic', 'thinky'] },
      { id: 'sw-conflict', label: "Direct conflict, but bouncing back is easy", traits: ['confrontational', 'friendly'] }
    ],
    antiElements: [
      { id: 'sw-targeted', label: "Attacking can feel targeted and personal", traits: ['mean-spirited', 'confrontational'] }
    ],
  },
  {
    id: 'king-of-tokyo', name: "King of Tokyo", bggId: 70323, year: 2011,
    minPlayers: 2, maxPlayers: 6, minTime: 30, maxTime: 30,
    complexity: 1.5, bggRating: 7.1,
    traits: ['dice-rolling', 'push-your-luck', 'exciting', 'confrontational', 'light'],
    elements: [
      { id: 'kot-dice', label: "Yahtzee-style push your luck rolling", traits: ['dice-rolling', 'push-your-luck', 'exciting'] },
      { id: 'kot-fast', label: "Quick turns with lots of action", traits: ['light', 'exciting'] },
      { id: 'kot-monsters', label: "Giant monsters battling for Tokyo", traits: ['confrontational', 'thematic', 'hilarious'] },
      { id: 'kot-easy', label: "Easy to teach anyone in minutes", traits: ['light', 'friendly'] }
    ],
    antiElements: [
      { id: 'kot-luck', label: "Dice luck dominates strategy", traits: ['too-random'] },
      { id: 'kot-elimination', label: "Can get knocked out early", traits: ['player-elimination'] }
    ],
  },
  {
    id: 'horrified', name: "Horrified", bggId: 282524, year: 2019,
    minPlayers: 1, maxPlayers: 5, minTime: 60, maxTime: 60,
    complexity: 2, bggRating: 7.3,
    traits: ['cooperative', 'thematic', 'puzzly', 'solo-mode', 'replayable', 'friendly'],
    elements: [
      { id: 'horrified-coop', label: "Work together against classic monsters", traits: ['cooperative', 'social'] },
      { id: 'horrified-theme', label: "Universal Monsters nostalgia", traits: ['thematic', 'beautiful'] },
      { id: 'horrified-puzzle', label: "Each monster has unique defeat conditions", traits: ['puzzly', 'strategic'] },
      { id: 'horrified-gateway', label: "Great gateway co-op for new gamers", traits: ['light', 'friendly'] }
    ],
    antiElements: [
      { id: 'horrified-easy', label: "Can feel solved with experienced players", traits: ['too-random'] }
    ],
  },
  {
    id: 'cryptid', name: "Cryptid", bggId: 246784, year: 2018,
    minPlayers: 3, maxPlayers: 5, minTime: 30, maxTime: 50,
    complexity: 2.2, bggRating: 7.4,
    traits: ['social-deduction', 'elegant', 'competitive', 'bluffing', 'thinky'],
    elements: [
      { id: 'cryptid-logic', label: "Pure deductive logic puzzle", traits: ['puzzly', 'thinky'] },
      { id: 'cryptid-elegant', label: "Simple rules, deep thinking", traits: ['elegant', 'strategic'] },
      { id: 'cryptid-race', label: "Race to find the cryptid first", traits: ['competitive', 'tense'] },
      { id: 'cryptid-bluff', label: "Mislead opponents about your clue", traits: ['bluffing', 'social'] }
    ],
    antiElements: [
      { id: 'cryptid-ap', label: "Can get brain-burn-y", traits: ['analysis-paralysis', 'thinky'] }
    ],
  },
  {
    id: 'iki', name: "IKI", bggId: 177478, year: 2015,
    minPlayers: 2, maxPlayers: 4, minTime: 60, maxTime: 90,
    complexity: 2.8, bggRating: 7.7,
    traits: ['beautiful', 'worker-placement', 'engine-building', 'thematic', 'strategic'],
    elements: [
      { id: 'iki-art', label: "Gorgeous Edo-period Japanese art", traits: ['beautiful', 'thematic'] },
      { id: 'iki-market', label: "Move around market to activate artisans", traits: ['worker-placement', 'strategic'] },
      { id: 'iki-engine', label: "Level up artisans for better effects", traits: ['engine-building', 'satisfying'] },
      { id: 'iki-timing', label: "Timing and position matter deeply", traits: ['strategic', 'thinky'] }
    ],
    antiElements: [
      { id: 'iki-ap', label: "Many options each turn", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'flamecraft', name: "Flamecraft", bggId: 336986, year: 2022,
    minPlayers: 1, maxPlayers: 5, minTime: 60, maxTime: 60,
    complexity: 1.8, bggRating: 7.6,
    traits: ['beautiful', 'engine-building', 'cozy', 'solo-mode', 'satisfying', 'friendly'],
    elements: [
      { id: 'flamecraft-art', label: "Adorable dragon artwork", traits: ['beautiful', 'cozy'] },
      { id: 'flamecraft-engine', label: "Build shop combos that chain together", traits: ['engine-building', 'satisfying'] },
      { id: 'flamecraft-cozy', label: "Low-conflict, feel-good gameplay", traits: ['cozy', 'friendly', 'relaxing'] },
      { id: 'flamecraft-easy', label: "Easy to teach new players", traits: ['light', 'friendly'] }
    ],
    antiElements: [
      { id: 'flamecraft-light', label: "Experienced gamers may want more depth", traits: ['too-random'] }
    ],
  },
  {
    id: '7-wonders-architects', name: "7 Wonders: Architects", bggId: 346703, year: 2021,
    minPlayers: 2, maxPlayers: 7, minTime: 25, maxTime: 25,
    complexity: 1.4, bggRating: 7.1,
    traits: ['beautiful', 'card-drafting', 'light', 'friendly'],
    elements: [
      { id: '7wa-pieces', label: "3D wonder pieces look amazing", traits: ['beautiful'] },
      { id: '7wa-simple', label: "Streamlined version of 7 Wonders", traits: ['light', 'friendly'] },
      { id: '7wa-fast', label: "Quick 25-minute gameplay", traits: ['light'] },
      { id: '7wa-draft', label: "Simple card selection each turn", traits: ['card-drafting'] }
    ],
    antiElements: [
      { id: '7wa-shallow', label: "Less strategic than the original", traits: ['too-random'] }
    ],
  },
  {
    id: 'zooloretto', name: "Zooloretto", bggId: 27588, year: 2007,
    minPlayers: 2, maxPlayers: 5, minTime: 45, maxTime: 45,
    complexity: 1.8, bggRating: 7,
    traits: ['set-collection', 'push-your-luck', 'thematic', 'friendly', 'light'],
    elements: [
      { id: 'zoo-animals', label: "Collect matching animals for your zoo", traits: ['set-collection', 'satisfying'] },
      { id: 'zoo-trucks', label: "When to take the truck is the key decision", traits: ['push-your-luck', 'tense'] },
      { id: 'zoo-family', label: "Family-friendly gameplay", traits: ['light', 'friendly'] },
      { id: 'zoo-theme', label: "Zoo building theme is delightful", traits: ['thematic', 'cozy'] }
    ],
    antiElements: [
      { id: 'zoo-simple', label: "May feel too simple for experienced gamers", traits: ['too-random'] }
    ],
  },
  {
    id: 'concept', name: "Concept", bggId: 147151, year: 2013,
    minPlayers: 4, maxPlayers: 12, minTime: 40, maxTime: 40,
    complexity: 1.4, bggRating: 6.8,
    traits: ['communication-limits', 'social', 'creative', 'light', 'hilarious'],
    elements: [
      { id: 'concept-icons', label: "Use icons to convey ideas without speaking", traits: ['communication-limits', 'creative'] },
      { id: 'concept-social', label: "Fun group interactions and discussions", traits: ['social', 'hilarious'] },
      { id: 'concept-creative', label: "Many creative ways to give clues", traits: ['creative'] },
      { id: 'concept-easy', label: "Anyone can play immediately", traits: ['light', 'friendly'] }
    ],
    antiElements: [
      { id: 'concept-activity', label: "More party activity than strategic game", traits: ['too-random'] }
    ],
  },
  {
    id: 'stuffed-fables', name: "Stuffed Fables", bggId: 233312, year: 2018,
    minPlayers: 2, maxPlayers: 4, minTime: 60, maxTime: 90,
    complexity: 2.5, bggRating: 7.3,
    traits: ['narrative', 'cooperative', 'beautiful', 'thematic', 'campaign'],
    elements: [
      { id: 'sf-storybook', label: "Storybook adventure unfolds as you play", traits: ['narrative', 'thematic'] },
      { id: 'sf-coop', label: "Stuffed toys work together to protect their child", traits: ['cooperative', 'social'] },
      { id: 'sf-book', label: "Gorgeous book serves as the game board", traits: ['beautiful'] },
      { id: 'sf-heart', label: "Heartwarming story perfect for families", traits: ['thematic', 'friendly'] }
    ],
    antiElements: [
      { id: 'sf-fiddly', label: "Lots of little rules to remember", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'vantage', name: "Vantage", bggId: 420033, year: 2024,
    minPlayers: 1, maxPlayers: 6, minTime: 90, maxTime: 150,
    complexity: 2.4, bggRating: 7.8,
    traits: ['cooperative', 'narrative', 'thematic', 'replayable', 'solo-mode'],
    elements: [
      { id: 'vantage-explore', label: "Open-world planet to discover", traits: ['thematic', 'exciting'] },
      { id: 'vantage-coop', label: "Players scattered but communicating", traits: ['cooperative', 'social'] },
      { id: 'vantage-stories', label: "Stories emerge from exploration", traits: ['narrative', 'dramatic'] },
      { id: 'vantage-800', label: "800+ location cards for huge replayability", traits: ['replayable'] }
    ],
    antiElements: [
      { id: 'vantage-directionless', label: "Can feel directionless without clear goals", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'last-light', name: "Last Light", bggId: 315727, year: 2022,
    minPlayers: 2, maxPlayers: 4, minTime: 60, maxTime: 90,
    complexity: 2.8, bggRating: 7.3,
    traits: ['variable-powers', 'beautiful', 'area-control', 'thematic', 'strategic'],
    elements: [
      { id: 'll-factions', label: "Each alien faction plays differently", traits: ['variable-powers', 'replayable'] },
      { id: 'll-3d', label: "3D planets on rotating board look stunning", traits: ['beautiful'] },
      { id: 'll-simultaneous', label: "All players act at once", traits: ['exciting', 'tense'] },
      { id: 'll-theme', label: "Racing for light before the heat death", traits: ['thematic', 'epic'] }
    ],
    antiElements: [
      { id: 'll-chaos', label: "Hard to plan with simultaneous actions", traits: ['too-random'] }
    ],
  },
  {
    id: 'city-of-horror', name: "City of Horror", bggId: 120217, year: 2012,
    minPlayers: 3, maxPlayers: 6, minTime: 90, maxTime: 90,
    complexity: 2.3, bggRating: 6.8,
    traits: ['negotiation', 'thematic', 'dramatic', 'bluffing', 'voting', 'tense'],
    elements: [
      { id: 'coh-voting', label: "Vote on who gets eaten by zombies", traits: ['voting', 'negotiation', 'dramatic'] },
      { id: 'coh-horror', label: "Zombie survival horror theme", traits: ['thematic', 'tense'] },
      { id: 'coh-tension', label: "Tense voting moments each round", traits: ['dramatic', 'exciting'] },
      { id: 'coh-bluff', label: "Hidden abilities and cards to bluff with", traits: ['bluffing'] }
    ],
    antiElements: [
      { id: 'coh-mean', label: "Sacrificing others feels brutal", traits: ['mean-spirited'] },
      { id: 'coh-elimination', label: "Characters can die", traits: ['player-elimination'] }
    ],
  },
  {
    id: 'talisman', name: "Talisman", bggId: 27627, year: 2007,
    minPlayers: 2, maxPlayers: 6, minTime: 90, maxTime: 240,
    complexity: 2.1, bggRating: 6.1,
    traits: ['dice-rolling', 'thematic', 'narrative', 'luck-driven'],
    elements: [
      { id: 'talisman-adventure', label: "Fantasy quest progression", traits: ['narrative', 'thematic'] },
      { id: 'talisman-dice', label: "Movement and combat based on dice", traits: ['dice-rolling', 'luck-driven'] },
      { id: 'talisman-theme', label: "Classic fantasy adventure feel", traits: ['thematic', 'epic'] },
      { id: 'talisman-nostalgia', label: "Gaming classic with nostalgic appeal", traits: ['thematic'] }
    ],
    antiElements: [
      { id: 'talisman-random', label: "Heavily dice-dependent outcomes", traits: ['too-random'] },
      { id: 'talisman-long', label: "Can drag on for hours", traits: ['too-long'] },
      { id: 'talisman-elimination', label: "Can get knocked out", traits: ['player-elimination'] }
    ],
  },
  {
    id: 'codenames-duet', name: "Codenames: Duet", bggId: 224037, year: 2017,
    minPlayers: 2, maxPlayers: 4, minTime: 15, maxTime: 30,
    complexity: 1.3, bggRating: 7.5,
    traits: ['cooperative', 'communication-limits', 'social-deduction', 'tense', 'light'],
    elements: [
      { id: 'cnd-coop', label: "Work together to find all agents", traits: ['cooperative', 'social'] },
      { id: 'cnd-clues', label: "Give one-word clues to guide your partner", traits: ['communication-limits', 'creative'] },
      { id: 'cnd-deduce', label: "Figure out how your partner thinks", traits: ['social-deduction', 'puzzly'] },
      { id: 'cnd-pressure', label: "Limited turns create tense pressure", traits: ['tense'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'summoner-wars', name: "Summoner Wars (Second Edition)", bggId: 332800, year: 2021,
    minPlayers: 2, maxPlayers: 2, minTime: 40, maxTime: 40,
    complexity: 2.4, bggRating: 7.9,
    traits: ['grid-movement', 'variable-powers', 'hand-management', 'confrontational', 'strategic'],
    elements: [
      { id: 'sw-tactical', label: "Grid-based unit positioning", traits: ['grid-movement', 'strategic'] },
      { id: 'sw-factions', label: "Each faction plays completely differently", traits: ['variable-powers', 'replayable'] },
      { id: 'sw-cards', label: "Cards serve as both units and resources", traits: ['hand-management', 'strategic'] },
      { id: 'sw-combat', label: "Direct tactical combat", traits: ['confrontational', 'tense'] }
    ],
    antiElements: [
      { id: 'sw-conflict', label: "Only direct conflict, no alternative paths", traits: ['confrontational'] }
    ],
  },
  {
    id: 'munchkin', name: "Munchkin", bggId: 1927, year: 2001,
    minPlayers: 3, maxPlayers: 6, minTime: 60, maxTime: 120,
    complexity: 1.8, bggRating: 5.9,
    traits: ['hilarious', 'social', 'light', 'confrontational'],
    elements: [
      { id: 'munchkin-humor', label: "Parodies RPG tropes hilariously", traits: ['hilarious', 'thematic'] },
      { id: 'munchkin-mess', label: "Mess with other players constantly", traits: ['confrontational', 'social'] },
      { id: 'munchkin-easy', label: "Easy to learn rules", traits: ['light', 'friendly'] },
      { id: 'munchkin-casual', label: "Casual fun with friends", traits: ['social', 'hilarious'] }
    ],
    antiElements: [
      { id: 'munchkin-luck', label: "Card luck dominates outcomes", traits: ['too-random'] },
      { id: 'munchkin-long', label: "Can overstay its welcome", traits: ['too-long'] },
      { id: 'munchkin-kingmaking', label: "Winner often decided by ganging up", traits: ['kingmaking'] }
    ],
  },
  {
    id: 'tokyo-highway', name: "Tokyo Highway", bggId: 228762, year: 2016,
    minPlayers: 2, maxPlayers: 4, minTime: 30, maxTime: 50,
    complexity: 1.5, bggRating: 6.6,
    traits: ['beautiful', 'tense', 'light'],
    elements: [
      { id: 'th-dexterity', label: "Physical stacking and balancing challenge", traits: ['exciting', 'tense'] },
      { id: 'th-sculpture', label: "Creates stunning highway sculptures", traits: ['beautiful', 'creative'] },
      { id: 'th-unique', label: "Unlike any other game", traits: ['creative'] },
      { id: 'th-tension', label: "Will it fall? Constant tension", traits: ['tense', 'exciting'] }
    ],
    antiElements: [
      { id: 'th-fiddly', label: "Pieces can be hard to place precisely", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'stella', name: "Stella: Dixit Universe", bggId: 329845, year: 2021,
    minPlayers: 3, maxPlayers: 6, minTime: 30, maxTime: 30,
    complexity: 1.2, bggRating: 7.3,
    traits: ['beautiful', 'social', 'light', 'push-your-luck', 'creative'],
    elements: [
      { id: 'stella-social', label: "See how others interpret images", traits: ['social', 'hilarious'] },
      { id: 'stella-easy', label: "Easy rules for anyone", traits: ['light', 'friendly'] },
      { id: 'stella-risk', label: "Risk picking more cards for bigger rewards", traits: ['push-your-luck', 'exciting'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'mystery-house', name: "Mystery House", bggId: 269537, year: 2019,
    minPlayers: 1, maxPlayers: 5, minTime: 60, maxTime: 60,
    complexity: 2.1, bggRating: 6.7,
    traits: ['puzzly', 'cooperative', 'thematic', 'solo-mode'],
    elements: [
      { id: 'mh-escape', label: "Escape room puzzle experience in a box", traits: ['puzzly', 'tense'] },
      { id: 'mh-coop', label: "Work together to solve and escape", traits: ['cooperative', 'social'] },
      { id: 'mh-3d', label: "Unique 3D house you peer into", traits: ['thematic', 'beautiful'] },
      { id: 'mh-mystery', label: "Immersive mystery atmosphere", traits: ['thematic', 'narrative'] }
    ],
    antiElements: [
      { id: 'mh-oneshot', label: "Can only play each scenario once", traits: ['too-random'] },
      { id: 'mh-app', label: "Requires companion app", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'thunderstone', name: "Thunderstone", bggId: 53953, year: 2009,
    minPlayers: 1, maxPlayers: 5, minTime: 45, maxTime: 60,
    complexity: 2.7, bggRating: 6.9,
    traits: ['deck-building', 'thematic', 'grid-movement', 'strategic'],
    elements: [
      { id: 'thunderstone-deckbuilding', label: "Build deck to fight monsters", traits: ['deck-building'] },
      { id: 'thunderstone-dungeon-crawl', label: "Delve deeper for tougher foes", traits: ['thematic', 'grid-movement'] },
      { id: 'thunderstone-thematic', label: "Fantasy adventure", traits: ['thematic'] },
      { id: 'thunderstone-strategic', label: "Balance village and dungeon", traits: ['strategic'] }
    ],
    antiElements: [
      { id: 'thunderstone-anti-fiddly', label: "Light calculations each turn", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'nmbr9', name: "NMBR 9", bggId: 217449, year: 2017,
    minPlayers: 1, maxPlayers: 4, minTime: 20, maxTime: 20,
    complexity: 1.4, bggRating: 7,
    traits: ['puzzly', 'light', 'exciting', 'satisfying'],
    elements: [
      { id: 'nmbr9-puzzle-solving', label: "Tetris-like tile stacking", traits: ['puzzly'] },
      { id: 'nmbr9-quick', label: "Fast gameplay", traits: ['light'] },
      { id: 'nmbr9-simultaneous', label: "Everyone plays at once", traits: ['exciting'] },
      { id: 'nmbr9-satisfying', label: "Building tall feels good", traits: ['satisfying'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'turing-machine', name: "Turing Machine", bggId: 356123, year: 2022,
    minPlayers: 1, maxPlayers: 4, minTime: 20, maxTime: 20,
    complexity: 2.4, bggRating: 7.7,
    traits: ['social-deduction', 'puzzly', 'creative', 'elegant', 'solo-mode'],
    elements: [
      { id: 'turing-machine-deduction', label: "Logic puzzle with punch cards", traits: ['social-deduction', 'puzzly'] },
      { id: 'turing-machine-unique', label: "Analog computer mechanism", traits: ['creative'] },
      { id: 'turing-machine-elegant', label: "Clever design", traits: ['elegant'] },
      { id: 'turing-machine-solo-friendly', label: "Great solo experience", traits: ['solo-mode'] }
    ],
    antiElements: [
      { id: 'turing-machine-anti-analysis-p', label: "Can get stuck", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'hako-onna', name: "Hako Onna", bggId: 228460, year: 2015,
    minPlayers: 3, maxPlayers: 5, minTime: 30, maxTime: 60,
    complexity: 2, bggRating: 6.5,
    traits: ['hidden-roles', 'tense', 'thematic', 'variable-powers'],
    elements: [
      { id: 'hako-onna-hidden-movement', label: "Ghost hunts invisibly", traits: ['hidden-roles', 'tense'] },
      { id: 'hako-onna-thematic', label: "Japanese horror atmosphere", traits: ['thematic'] },
      { id: 'hako-onna-tense', label: "Dread builds", traits: ['tense'] },
      { id: 'hako-onna-asymmetric', label: "Ghost vs visitors", traits: ['variable-powers'] }
    ],
    antiElements: [
      { id: 'hako-onna-anti-fiddly', label: "Memory element can be tricky", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'star-wars-rebellion', name: "Star Wars: Rebellion", bggId: 187645, year: 2016,
    minPlayers: 2, maxPlayers: 4, minTime: 180, maxTime: 240,
    complexity: 3.7, bggRating: 8.4,
    traits: ['thematic', 'variable-powers', 'epic', 'dramatic', 'tense', 'narrative'],
    elements: [
      { id: 'star-wars-rebellion-thematic', label: "Captures the original trilogy perfectly", traits: ['thematic'] },
      { id: 'star-wars-rebellion-asymmetric', label: "Empire hunts, Rebels hide", traits: ['variable-powers'] },
      { id: 'star-wars-rebellion-epic-scope', label: "Galaxy-spanning conflict", traits: ['epic'] },
      { id: 'star-wars-rebellion-dramatic', label: "Cinematic moments constantly", traits: ['dramatic'] },
      { id: 'star-wars-rebellion-cat-and-mouse', label: "Hidden rebel base creates tension", traits: ['tense', 'dramatic'] },
      { id: 'star-wars-rebellion-narrative', label: "Stories emerge from missions", traits: ['narrative'] }
    ],
    antiElements: [
      { id: 'star-wars-rebellion-anti-too-long', label: "3-4 hour games", traits: ['too-long'] },
      { id: 'star-wars-rebellion-anti-overwhelmi', label: "Lots of systems to learn", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'nemesis', name: "Nemesis", bggId: 167355, year: 2018,
    minPlayers: 1, maxPlayers: 5, minTime: 90, maxTime: 180,
    complexity: 3.4, bggRating: 8.3,
    traits: ['thematic', 'tense', 'hidden-roles', 'narrative', 'dramatic', 'solo-mode'],
    elements: [
      { id: 'nemesis-alien', label: "Alien movie experience in a box", traits: ['thematic', 'tense'] },
      { id: 'nemesis-noise', label: "Every noise draw is terrifying", traits: ['tense', 'dramatic'] },
      { id: 'nemesis-objectives', label: "Hidden objectives may conflict with teammates", traits: ['hidden-roles', 'tense'] },
      { id: 'nemesis-stories', label: "Emergent horror stories every game", traits: ['narrative', 'dramatic'] }
    ],
    antiElements: [
      { id: 'nemesis-long', label: "Can run 3+ hours", traits: ['too-long'] },
      { id: 'nemesis-luck', label: "Dice and card luck can be brutal", traits: ['too-random'] },
      { id: 'nemesis-death', label: "Can die mid-game", traits: ['player-elimination'] }
    ],
  },
  {
    id: 'dune-imperium-uprising', name: "Dune: Imperium Uprising", bggId: 397598, year: 2024,
    minPlayers: 1, maxPlayers: 6, minTime: 60, maxTime: 120,
    complexity: 3, bggRating: 8.7,
    traits: ['deck-building', 'worker-placement', 'thematic', 'strategic', 'engine-building', 'solo-mode'],
    elements: [
      { id: 'diu-deck', label: "Build your deck of powerful cards", traits: ['deck-building', 'satisfying'] },
      { id: 'diu-workers', label: "Place agents to take key actions", traits: ['worker-placement', 'strategic'] },
      { id: 'diu-dune', label: "Dune universe comes alive", traits: ['thematic', 'epic'] },
      { id: 'diu-combat', label: "Conflict track battles for rewards", traits: ['confrontational', 'tense'] }
    ],
    antiElements: [
      { id: 'diu-ap', label: "Many options each turn", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'oath', name: "Oath: Chronicles of Empire and Exile", bggId: 291572, year: 2021,
    minPlayers: 1, maxPlayers: 6, minTime: 45, maxTime: 150,
    complexity: 3.9, bggRating: 7.7,
    traits: ['campaign', 'variable-powers', 'narrative', 'beautiful', 'strategic', 'solo-mode'],
    elements: [
      { id: 'oath-legacy', label: "Game state persists between sessions", traits: ['campaign', 'narrative'] },
      { id: 'oath-asymmetric', label: "Chancellor vs Exiles asymmetry", traits: ['variable-powers'] },
      { id: 'oath-stories', label: "Emergent narratives from play", traits: ['narrative', 'dramatic'] }
    ],
    antiElements: [
      { id: 'oath-learning', label: "Hard to understand initially", traits: ['analysis-paralysis'] },
      { id: 'oath-kingmaking', label: "End-game can feel arbitrary", traits: ['kingmaking'] }
    ],
  },
  {
    id: 'western-legends', name: "Western Legends", bggId: 232405, year: 2018,
    minPlayers: 2, maxPlayers: 6, minTime: 60, maxTime: 90,
    complexity: 2.6, bggRating: 7.6,
    traits: ['creative', 'replayable', 'thematic', 'narrative', 'beautiful'],
    elements: [
      { id: 'western-legends-sandbox', label: "Do whatever you want in the Old West", traits: ['creative', 'replayable'] },
      { id: 'western-legends-thematic', label: "Poker, mining, duels, robbery", traits: ['thematic'] },
      { id: 'western-legends-narrative', label: "Your outlaw story unfolds", traits: ['narrative'] },
      { id: 'western-legends-variable-goals', label: "Many paths to victory", traits: ['thematic'] },
      { id: 'western-legends-beautiful', label: "Gorgeous Western art", traits: ['beautiful'] }
    ],
    antiElements: [
      { id: 'western-legends-anti-chaotic', label: "Can feel directionless", traits: ['too-random'] },
      { id: 'western-legends-anti-too-random', label: "Poker and card luck", traits: ['too-random'] }
    ],
  },
  {
    id: 'arabian-nights', name: "Tales of the Arabian Nights", bggId: 34119, year: 2009,
    minPlayers: 1, maxPlayers: 6, minTime: 120, maxTime: 180,
    complexity: 2, bggRating: 6.8,
    traits: ['narrative', 'thematic', 'hilarious', 'creative'],
    elements: [
      { id: 'arabian-nights-narrative', label: "Massive book of stories", traits: ['narrative'] },
      { id: 'arabian-nights-thematic', label: "1001 Nights atmosphere", traits: ['thematic'] },
      { id: 'arabian-nights-adventure', label: "Journey across the map", traits: ['thematic', 'narrative'] },
      { id: 'arabian-nights-humorous', label: "Ridiculous situations arise", traits: ['hilarious'] },
      { id: 'arabian-nights-unique', label: "Nothing else like it", traits: ['creative'] }
    ],
    antiElements: [
      { id: 'arabian-nights-anti-too-long', label: "Can drag on", traits: ['too-long'] },
      { id: 'arabian-nights-anti-too-random', label: "Outcomes feel arbitrary", traits: ['too-random'] }
    ],
  },
  {
    id: 'near-and-far', name: "Near and Far", bggId: 195049, year: 2017,
    minPlayers: 2, maxPlayers: 4, minTime: 90, maxTime: 120,
    complexity: 2.6, bggRating: 7.4,
    traits: ['narrative', 'thematic', 'exciting', 'campaign', 'worker-placement'],
    elements: [
      { id: 'near-and-far-narrative', label: "Story encounters on map", traits: ['narrative'] },
      { id: 'near-and-far-exploration', label: "Discover new locations", traits: ['thematic', 'exciting'] },
      { id: 'near-and-far-campaign', label: "Connected scenarios", traits: ['campaign'] },
      { id: 'near-and-far-worker-placemen', label: "Town actions", traits: ['worker-placement'] }
    ],
    antiElements: [
      { id: 'near-and-far-anti-fiddly', label: "Lots of small rules", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'above-and-below', name: "Above and Below", bggId: 172818, year: 2015,
    minPlayers: 2, maxPlayers: 4, minTime: 90, maxTime: 90,
    complexity: 2.5, bggRating: 7.2,
    traits: ['narrative', 'engine-building', 'beautiful', 'thematic', 'exciting', 'push-your-luck'],
    elements: [
      { id: 'above-and-below-narrative', label: "Cave exploration stories", traits: ['narrative'] },
      { id: 'above-and-below-engine-building', label: "Build your village", traits: ['engine-building'] },
      { id: 'above-and-below-beautiful', label: "Ryan Laukat art", traits: ['beautiful'] },
      { id: 'above-and-below-exploration', label: "Delve into caverns", traits: ['thematic', 'exciting'] },
      { id: 'above-and-below-push-your-luck', label: "Risk in encounters", traits: ['push-your-luck'] }
    ],
    antiElements: [
      { id: 'above-and-below-anti-too-random', label: "Encounter luck varies", traits: ['too-random'] }
    ],
  },
  {
    id: 'arkham-horror', name: "Arkham Horror", bggId: 15987, year: 2005,
    minPlayers: 1, maxPlayers: 8, minTime: 120, maxTime: 240,
    complexity: 3.6, bggRating: 7.2,
    traits: ['thematic', 'cooperative', 'narrative', 'dice-rolling', 'epic'],
    elements: [
      { id: 'arkham-horror-thematic', label: "Lovecraftian horror", traits: ['thematic'] },
      { id: 'arkham-horror-cooperative', label: "Fight Ancient Ones together", traits: ['cooperative'] },
      { id: 'arkham-horror-narrative', label: "Encounter stories", traits: ['narrative'] },
      { id: 'arkham-horror-dice-rolling', label: "Skill checks", traits: ['dice-rolling'] },
      { id: 'arkham-horror-epic-scope', label: "Save the world", traits: ['epic'] }
    ],
    antiElements: [
      { id: 'arkham-horror-anti-too-long', label: "3-4+ hour games", traits: ['too-long'] },
      { id: 'arkham-horror-anti-fiddly', label: "Many tokens and rules", traits: ['analysis-paralysis'] },
      { id: 'arkham-horror-anti-too-random', label: "Dice and cards can crush you", traits: ['too-random'] }
    ],
  },
  {
    id: 'ghost-stories', name: "Ghost Stories", bggId: 37046, year: 2008,
    minPlayers: 1, maxPlayers: 4, minTime: 60, maxTime: 60,
    complexity: 2.9, bggRating: 7.3,
    traits: ['cooperative', 'thematic', 'tense', 'dice-rolling'],
    elements: [
      { id: 'ghost-stories-cooperative', label: "Defend village from ghosts", traits: ['cooperative'] },
      { id: 'ghost-stories-difficult', label: "Brutally hard", traits: ['thematic'] },
      { id: 'ghost-stories-thematic', label: "Chinese supernatural theme", traits: ['thematic'] },
      { id: 'ghost-stories-tense', label: "Always on the edge", traits: ['tense'] },
      { id: 'ghost-stories-dice-rolling', label: "Combat resolution", traits: ['dice-rolling'] }
    ],
    antiElements: [
      { id: 'ghost-stories-anti-too-hard', label: "Can feel impossible", traits: ['too-random'] },
      { id: 'ghost-stories-anti-too-random', label: "Bad luck = loss", traits: ['too-random'] }
    ],
  },
  {
    id: 'ticket-to-ride-europe', name: "Ticket to Ride: Europe", bggId: 14996, year: 2005,
    minPlayers: 2, maxPlayers: 5, minTime: 30, maxTime: 60,
    complexity: 1.9, bggRating: 7.5,
    traits: ['light', 'friendly', 'set-collection', 'route-building', 'satisfying', 'beautiful'],
    elements: [
      { id: 'ticket-to-ride-europe-accessible', label: "Perfect gateway game", traits: ['light', 'friendly'] },
      { id: 'ticket-to-ride-europe-set-collection', label: "Collect train cards", traits: ['set-collection'] },
      { id: 'ticket-to-ride-europe-network-buildin', label: "Connect cities", traits: ['route-building'] },
      { id: 'ticket-to-ride-europe-satisfying', label: "Completing routes feels great", traits: ['satisfying'] },
      { id: 'ticket-to-ride-europe-beautiful', label: "Nice map and trains", traits: ['beautiful'] }
    ],
    antiElements: [
      { id: 'ticket-to-ride-europe-anti-too-light', label: "Experienced gamers may want more", traits: ['too-random'] }
    ],
  },
  {
    id: 'lotr-lcg', name: "The Lord of the Rings: The Card Game", bggId: 77423, year: 2011,
    minPlayers: 1, maxPlayers: 2, minTime: 30, maxTime: 90,
    complexity: 3.4, bggRating: 7.6,
    traits: ['cooperative', 'deck-building', 'thematic', 'solo-mode'],
    elements: [
      { id: 'lotr-lcg-cooperative', label: "Quest together through Middle-earth", traits: ['cooperative'] },
      { id: 'lotr-lcg-deckbuilding', label: "Construct your deck before play", traits: ['deck-building'] },
      { id: 'lotr-lcg-thematic', label: "Tolkien lore throughout", traits: ['thematic'] },
      { id: 'lotr-lcg-challenging', label: "Tough scenarios", traits: ['thematic'] },
      { id: 'lotr-lcg-solo-friendly', label: "Great solo experience", traits: ['solo-mode'] }
    ],
    antiElements: [
      { id: 'lotr-lcg-anti-expensive', label: "Many expansions needed", traits: ['too-random'] },
      { id: 'lotr-lcg-anti-too-random', label: "Encounter deck can be brutal", traits: ['too-random'] }
    ],
  },
  {
    id: 'sheriff-of-nottingham', name: "Sheriff of Nottingham", bggId: 157969, year: 2014,
    minPlayers: 3, maxPlayers: 5, minTime: 60, maxTime: 60,
    complexity: 1.7, bggRating: 7,
    traits: ['bluffing', 'negotiation', 'social', 'hilarious', 'light', 'friendly'],
    elements: [
      { id: 'sheriff-of-nottingham-bluffing', label: "Lie about your goods", traits: ['bluffing'] },
      { id: 'sheriff-of-nottingham-negotiation', label: "Bribe the Sheriff", traits: ['negotiation'] },
      { id: 'sheriff-of-nottingham-social', label: "Reading other players", traits: ['social'] },
      { id: 'sheriff-of-nottingham-humorous', label: "Funny moments guaranteed", traits: ['hilarious'] },
      { id: 'sheriff-of-nottingham-accessible', label: "Easy to teach", traits: ['light', 'friendly'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'deception-murder-hk', name: "Deception: Murder in Hong Kong", bggId: 156129, year: 2014,
    minPlayers: 4, maxPlayers: 12, minTime: 20, maxTime: 20,
    complexity: 1.5, bggRating: 7.4,
    traits: ['hidden-roles', 'social-deduction', 'puzzly', 'social', 'light', 'friendly'],
    elements: [
      { id: 'deception-murder-hk-hidden-traitor', label: "Murderer among you", traits: ['hidden-roles', 'social-deduction'] },
      { id: 'deception-murder-hk-deduction', label: "Interpret forensic clues", traits: ['social-deduction', 'puzzly'] },
      { id: 'deception-murder-hk-social', label: "Discussion and accusation", traits: ['social'] },
      { id: 'deception-murder-hk-accessible', label: "Easy to teach", traits: ['light', 'friendly'] },
      { id: 'deception-murder-hk-quick', label: "20 minute games", traits: ['light'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'chronicles-of-crime', name: "Chronicles of Crime", bggId: 239188, year: 2018,
    minPlayers: 1, maxPlayers: 4, minTime: 60, maxTime: 90,
    complexity: 2, bggRating: 7.5,
    traits: ['social-deduction', 'puzzly', 'cooperative', 'thematic', 'narrative'],
    elements: [
      { id: 'chronicles-of-crime-deduction', label: "Solve crime mysteries", traits: ['social-deduction', 'puzzly'] },
      { id: 'chronicles-of-crime-cooperative', label: "Work together", traits: ['cooperative'] },
      { id: 'chronicles-of-crime-app-driven', label: "App enhances experience", traits: ['thematic'] },
      { id: 'chronicles-of-crime-thematic', label: "Detective noir", traits: ['thematic'] },
      { id: 'chronicles-of-crime-narrative', label: "Unfolding story", traits: ['narrative'] }
    ],
    antiElements: [
      { id: 'chronicles-of-crime-anti-app-requir', label: "Must use app", traits: ['analysis-paralysis'] },
      { id: 'chronicles-of-crime-anti-one-shot', label: "Cases only played once", traits: ['too-random'] }
    ],
  },
  {
    id: 'dice-forge', name: "Dice Forge", bggId: 194594, year: 2017,
    minPlayers: 2, maxPlayers: 4, minTime: 45, maxTime: 45,
    complexity: 1.8, bggRating: 7.2,
    traits: ['thematic', 'engine-building', 'creative', 'beautiful', 'satisfying'],
    elements: [
      { id: 'dice-forge-dice-crafting', label: "Upgrade your dice faces", traits: ['thematic'] },
      { id: 'dice-forge-engine-building', label: "Better dice = more resources", traits: ['engine-building'] },
      { id: 'dice-forge-unique', label: "Physical dice modification", traits: ['creative'] },
      { id: 'dice-forge-beautiful', label: "Gorgeous production", traits: ['beautiful'] },
      { id: 'dice-forge-satisfying', label: "Rolling upgraded dice feels great", traits: ['satisfying'] }
    ],
    antiElements: [
      { id: 'dice-forge-anti-too-random', label: "Still dice luck", traits: ['too-random'] }
    ],
  },
  {
    id: 'celestia', name: "Celestia", bggId: 175117, year: 2015,
    minPlayers: 2, maxPlayers: 6, minTime: 30, maxTime: 30,
    complexity: 1.2, bggRating: 7,
    traits: ['push-your-luck', 'beautiful', 'light', 'friendly'],
    elements: [
      { id: 'celestia-push-your-luck', label: "Stay on airship or bail?", traits: ['push-your-luck'] },
      { id: 'celestia-beautiful', label: "Gorgeous airship art", traits: ['beautiful'] },
      { id: 'celestia-accessible', label: "Simple rules", traits: ['light', 'friendly'] },
      { id: 'celestia-quick', label: "Fast games", traits: ['light'] }
    ],
    antiElements: [
      { id: 'celestia-anti-too-random', label: "Luck-heavy", traits: ['too-random'] }
    ],
  },
  {
    id: 'runebound', name: "Runebound", bggId: 181530, year: 2015,
    minPlayers: 2, maxPlayers: 4, minTime: 120, maxTime: 180,
    complexity: 2.8, bggRating: 7.1,
    traits: ['thematic', 'narrative', 'exciting', 'dice-rolling'],
    elements: [
      { id: 'runebound-adventure', label: "Fantasy quest experience", traits: ['thematic', 'narrative'] },
      { id: 'runebound-exploration', label: "Discover encounters", traits: ['thematic', 'exciting'] },
      { id: 'runebound-dice-rolling', label: "Combat with custom dice", traits: ['dice-rolling'] },
      { id: 'runebound-thematic', label: "Terrinoth setting", traits: ['thematic'] },
      { id: 'runebound-character-build', label: "Level up your hero", traits: ['thematic'] }
    ],
    antiElements: [
      { id: 'runebound-anti-too-long', label: "Can run 3+ hours", traits: ['too-long'] },
      { id: 'runebound-anti-too-random', label: "Encounter luck varies", traits: ['too-random'] }
    ],
  },
  {
    id: 'tsuro', name: "Tsuro", bggId: 16992, year: 2004,
    minPlayers: 2, maxPlayers: 8, minTime: 15, maxTime: 20,
    complexity: 1.1, bggRating: 6.5,
    traits: ['elegant', 'light', 'friendly', 'beautiful'],
    elements: [
      { id: 'tsuro-elegant', label: "Extremely simple rules", traits: ['elegant'] },
      { id: 'tsuro-quick', label: "Very fast games", traits: ['light'] },
      { id: 'tsuro-accessible', label: "Anyone can play instantly", traits: ['light', 'friendly'] },
      { id: 'tsuro-beautiful', label: "Nice tile art", traits: ['beautiful'] }
    ],
    antiElements: [
      { id: 'tsuro-anti-too-light', label: "Not much strategy", traits: ['too-random'] },
      { id: 'tsuro-anti-player-eli', label: "Can be knocked out early", traits: ['player-elimination'] }
    ],
  },
  {
    id: 'forgotten-waters', name: "Forgotten Waters", bggId: 302723, year: 2020,
    minPlayers: 3, maxPlayers: 7, minTime: 120, maxTime: 240,
    complexity: 2.2, bggRating: 7.6,
    traits: ['narrative', 'hilarious', 'cooperative', 'thematic', 'social'],
    elements: [
      { id: 'forgotten-waters-narrative', label: "App-driven pirate stories", traits: ['narrative'] },
      { id: 'forgotten-waters-humorous', label: "Comedy throughout", traits: ['hilarious'] },
      { id: 'forgotten-waters-cooperative', label: "Crew works together", traits: ['cooperative'] },
      { id: 'forgotten-waters-thematic', label: "Silly pirate adventure", traits: ['thematic'] },
      { id: 'forgotten-waters-social', label: "Great group experience", traits: ['social'] }
    ],
    antiElements: [
      { id: 'forgotten-waters-anti-too-long', label: "Scenarios run 3-4 hours", traits: ['too-long'] },
      { id: 'forgotten-waters-anti-app-requir', label: "Must use app", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'nidavellir', name: "Nidavellir", bggId: 293014, year: 2020,
    minPlayers: 2, maxPlayers: 5, minTime: 45, maxTime: 45,
    complexity: 1.8, bggRating: 7.6,
    traits: ['thematic', 'set-collection', 'engine-building', 'beautiful', 'elegant'],
    elements: [
      { id: 'nidavellir-bidding', label: "Auction for dwarves", traits: ['thematic'] },
      { id: 'nidavellir-set-collection', label: "Collect dwarf classes", traits: ['set-collection'] },
      { id: 'nidavellir-engine-building', label: "Coin values grow", traits: ['engine-building'] },
      { id: 'nidavellir-beautiful', label: "Stunning dwarf art", traits: ['beautiful'] },
      { id: 'nidavellir-elegant', label: "Simple but deep", traits: ['elegant'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'time-stories', name: "T.I.M.E Stories", bggId: 146508, year: 2015,
    minPlayers: 2, maxPlayers: 4, minTime: 90, maxTime: 90,
    complexity: 2.5, bggRating: 7.2,
    traits: ['narrative', 'cooperative', 'puzzly', 'creative', 'thematic'],
    elements: [
      { id: 'time-stories-narrative', label: "Time travel mysteries", traits: ['narrative'] },
      { id: 'time-stories-cooperative', label: "Solve together", traits: ['cooperative'] },
      { id: 'time-stories-puzzle-solving', label: "Decipher clues", traits: ['puzzly'] },
      { id: 'time-stories-unique', label: "Decksploration mechanism", traits: ['creative'] },
      { id: 'time-stories-thematic', label: "Strong scenarios", traits: ['thematic'] }
    ],
    antiElements: [
      { id: 'time-stories-anti-one-shot', label: "Scenarios only played once", traits: ['too-random'] },
      { id: 'time-stories-anti-expensive', label: "Need to buy expansions", traits: ['too-random'] }
    ],
  },
  {
    id: 'legends-of-andor', name: "Legends of Andor", bggId: 127398, year: 2012,
    minPlayers: 2, maxPlayers: 4, minTime: 60, maxTime: 90,
    complexity: 2.7, bggRating: 7.2,
    traits: ['cooperative', 'puzzly', 'thematic', 'narrative', 'beautiful'],
    elements: [
      { id: 'legends-of-andor-cooperative', label: "Defend the castle together", traits: ['cooperative'] },
      { id: 'legends-of-andor-puzzle-solving', label: "Time management puzzle", traits: ['puzzly'] },
      { id: 'legends-of-andor-thematic', label: "Fantasy adventure", traits: ['thematic'] },
      { id: 'legends-of-andor-narrative', label: "Story unfolds", traits: ['narrative'] },
      { id: 'legends-of-andor-beautiful', label: "Gorgeous board", traits: ['beautiful'] }
    ],
    antiElements: [
      { id: 'legends-of-andor-anti-restrictiv', label: "Optimal path feels forced", traits: ['too-random'] }
    ],
  },
  {
    id: 'quoridor', name: "Quoridor", bggId: 624, year: 1997,
    minPlayers: 2, maxPlayers: 4, minTime: 15, maxTime: 15,
    complexity: 1.8, bggRating: 7,
    traits: ['puzzly', 'elegant', 'light', 'strategic'],
    elements: [
      { id: 'quoridor-abstract', label: "Pure strategy", traits: ['puzzly', 'elegant'] },
      { id: 'quoridor-elegant', label: "Simple rules", traits: ['elegant'] },
      { id: 'quoridor-quick', label: "Fast games", traits: ['light'] },
      { id: 'quoridor-strategic', label: "Wall placement matters", traits: ['strategic'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'blokus', name: "Blokus", bggId: 2453, year: 2000,
    minPlayers: 2, maxPlayers: 4, minTime: 20, maxTime: 30,
    complexity: 1.8, bggRating: 7,
    traits: ['puzzly', 'elegant', 'light', 'friendly', 'strategic'],
    elements: [
      { id: 'blokus-abstract', label: "Tetris-like territory", traits: ['puzzly', 'elegant'] },
      { id: 'blokus-elegant', label: "Simple rules", traits: ['elegant'] },
      { id: 'blokus-accessible', label: "Family-friendly", traits: ['light', 'friendly'] },
      { id: 'blokus-strategic', label: "Blocking and expanding", traits: ['strategic'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'onitama', name: "Onitama", bggId: 160477, year: 2014,
    minPlayers: 2, maxPlayers: 2, minTime: 15, maxTime: 20,
    complexity: 1.7, bggRating: 7.4,
    traits: ['puzzly', 'elegant', 'light', 'strategic', 'beautiful'],
    elements: [
      { id: 'onitama-abstract', label: "Chess-like but accessible", traits: ['puzzly', 'elegant'] },
      { id: 'onitama-elegant', label: "Simple, brilliant", traits: ['elegant'] },
      { id: 'onitama-quick', label: "Fast games", traits: ['light'] },
      { id: 'onitama-strategic', label: "Card passing creates depth", traits: ['strategic'] },
      { id: 'onitama-beautiful', label: "Nice components", traits: ['beautiful'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'stardew-valley', name: "Stardew Valley: The Board Game", bggId: 332290, year: 2021,
    minPlayers: 1, maxPlayers: 4, minTime: 45, maxTime: 200,
    complexity: 2.6, bggRating: 7.4,
    traits: ['cooperative', 'thematic', 'cozy', 'engine-building'],
    elements: [
      { id: 'stardew-valley-cooperative', label: "Farm together", traits: ['cooperative'] },
      { id: 'stardew-valley-thematic', label: "Captures the video game feel", traits: ['thematic'] },
      { id: 'stardew-valley-cozy', label: "Relaxing farm life", traits: ['cozy'] },
      { id: 'stardew-valley-engine-building', label: "Develop your farm", traits: ['engine-building'] },
      { id: 'stardew-valley-nostalgic', label: "For video game fans", traits: ['thematic'] }
    ],
    antiElements: [
      { id: 'stardew-valley-anti-too-long', label: "Can run very long", traits: ['too-long'] },
      { id: 'stardew-valley-anti-too-random', label: "Season deck luck", traits: ['too-random'] }
    ],
  },
  {
    id: 'bullet-star', name: "Bullet⭐", bggId: 307040, year: 2021,
    minPlayers: 1, maxPlayers: 4, minTime: 15, maxTime: 15,
    complexity: 2.3, bggRating: 7.4,
    traits: ['exciting', 'tense', 'puzzly', 'creative', 'variable-powers'],
    elements: [
      { id: 'bullet-star-real-time', label: "Frantic simultaneous play", traits: ['exciting', 'tense'] },
      { id: 'bullet-star-puzzle-solving', label: "Clear bullets from board", traits: ['puzzly'] },
      { id: 'bullet-star-unique', label: "Bullet-hell in board game form", traits: ['creative'] },
      { id: 'bullet-star-exciting', label: "Tense and fast", traits: ['exciting'] },
      { id: 'bullet-star-asymmetric', label: "Each heroine plays differently", traits: ['variable-powers'] }
    ],
    antiElements: [
      { id: 'bullet-star-anti-stressful', label: "Time pressure is intense", traits: ['too-random'] }
    ],
  },
  {
    id: 'zombie-15', name: "Zombie 15", bggId: 144826, year: 2014,
    minPlayers: 2, maxPlayers: 4, minTime: 15, maxTime: 15,
    complexity: 2, bggRating: 6.7,
    traits: ['exciting', 'tense', 'cooperative', 'thematic'],
    elements: [
      { id: 'zombie-15-real-time', label: "15-minute timed scenarios", traits: ['exciting', 'tense'] },
      { id: 'zombie-15-cooperative', label: "Escape together", traits: ['cooperative'] },
      { id: 'zombie-15-thematic', label: "Teen zombie survival", traits: ['thematic'] },
      { id: 'zombie-15-exciting', label: "Frantic action", traits: ['exciting'] }
    ],
    antiElements: [
      { id: 'zombie-15-anti-stressful', label: "Time pressure is intense", traits: ['too-random'] }
    ],
  },
  {
    id: 'wings-of-war', name: "Wings of War", bggId: 9203, year: 2004,
    minPlayers: 2, maxPlayers: 4, minTime: 30, maxTime: 60,
    complexity: 1.9, bggRating: 7,
    traits: ['thematic', 'exciting', 'light', 'friendly', 'strategic', 'grid-movement'],
    elements: [
      { id: 'wings-of-war-thematic', label: "WWI dogfighting", traits: ['thematic'] },
      { id: 'wings-of-war-simultaneous', label: "All plan moves together", traits: ['exciting'] },
      { id: 'wings-of-war-accessible', label: "Easy to learn", traits: ['light', 'friendly'] },
      { id: 'wings-of-war-tactical', label: "Maneuver for shots", traits: ['strategic', 'grid-movement'] }
    ],
    antiElements: [
      { id: 'wings-of-war-anti-too-random', label: "Damage deck luck", traits: ['too-random'] }
    ],
  },
  {
    id: 'monster-lands', name: "Monster Lands", bggId: 228899, year: 2018,
    minPlayers: 1, maxPlayers: 4, minTime: 90, maxTime: 120,
    complexity: 3.2, bggRating: 7.2,
    traits: ['worker-placement', 'dice-rolling', 'thematic', 'engine-building'],
    elements: [
      { id: 'monster-lands-worker-placemen', label: "Assign mercenaries", traits: ['worker-placement'] },
      { id: 'monster-lands-dice-rolling', label: "Combat resolution", traits: ['dice-rolling'] },
      { id: 'monster-lands-thematic', label: "Hunt monsters for glory", traits: ['thematic'] },
      { id: 'monster-lands-engine-building', label: "Build your troop", traits: ['engine-building'] }
    ],
    antiElements: [
      { id: 'monster-lands-anti-too-random', label: "Dice combat swings", traits: ['too-random'] }
    ],
  },
  {
    id: 'ahoy', name: "Ahoy", bggId: 350316, year: 2022,
    minPlayers: 2, maxPlayers: 4, minTime: 45, maxTime: 75,
    complexity: 2.2, bggRating: 7.5,
    traits: ['variable-powers', 'beautiful', 'area-control', 'light', 'friendly', 'strategic'],
    elements: [
      { id: 'ahoy-asymmetric', label: "Each faction plays differently", traits: ['variable-powers'] },
      { id: 'ahoy-beautiful', label: "Kyle Ferrin art", traits: ['beautiful'] },
      { id: 'ahoy-area-control', label: "Control sea regions", traits: ['area-control'] },
      { id: 'ahoy-accessible', label: "Lighter than Root", traits: ['light', 'friendly'] },
      { id: 'ahoy-strategic', label: "Meaningful decisions", traits: ['strategic'] }
    ],
    antiElements: [
      { id: 'ahoy-anti-imbalanced', label: "Best at 3-4", traits: ['too-random'] }
    ],
  },
  {
    id: 'illiterati', name: "Illiterati", bggId: 340080, year: 2022,
    minPlayers: 1, maxPlayers: 5, minTime: 30, maxTime: 60,
    complexity: 1.6, bggRating: 7.3,
    traits: ['cooperative', 'exciting', 'tense', 'thematic'],
    elements: [
      { id: 'illiterati-cooperative', label: "Save books together", traits: ['cooperative'] },
      { id: 'illiterati-real-time', label: "Timed word-building", traits: ['exciting', 'tense'] },
      { id: 'illiterati-word-game', label: "Spell words from letters", traits: ['thematic'] },
      { id: 'illiterati-thematic', label: "Fight book-burning villains", traits: ['thematic'] }
    ],
    antiElements: [
      { id: 'illiterati-anti-stressful', label: "Time pressure", traits: ['too-random'] }
    ],
  },
  {
    id: 'twilight-inscription', name: "Twilight Inscription", bggId: 361545, year: 2022,
    minPlayers: 1, maxPlayers: 8, minTime: 90, maxTime: 120,
    complexity: 2.7, bggRating: 7.2,
    traits: ['thematic', 'epic', 'exciting'],
    elements: [
      { id: 'twilight-inscription-roll-and-write', label: "Mark sheets based on dice", traits: ['thematic'] },
      { id: 'twilight-inscription-thematic', label: "Twilight Imperium universe", traits: ['thematic'] },
      { id: 'twilight-inscription-epic-scope', label: "Space empire building", traits: ['epic'] },
      { id: 'twilight-inscription-simultaneous', label: "All play at once", traits: ['exciting'] }
    ],
    antiElements: [
      { id: 'twilight-inscription-anti-too-long', label: "Long for roll-and-write", traits: ['too-long'] }
    ],
  },
  {
    id: 'sherlock-holmes-cd', name: "Sherlock Holmes: Consulting Detective", bggId: 2511, year: 1981,
    minPlayers: 1, maxPlayers: 8, minTime: 60, maxTime: 120,
    complexity: 2.7, bggRating: 7.7,
    traits: ['social-deduction', 'puzzly', 'narrative', 'cooperative', 'thematic', 'creative'],
    elements: [
      { id: 'sherlock-holmes-cd-deduction', label: "Solve mysteries", traits: ['social-deduction', 'puzzly'] },
      { id: 'sherlock-holmes-cd-narrative', label: "Rich Victorian stories", traits: ['narrative'] },
      { id: 'sherlock-holmes-cd-cooperative', label: "Discuss clues together", traits: ['cooperative'] },
      { id: 'sherlock-holmes-cd-thematic', label: "Feel like Sherlock", traits: ['thematic'] },
      { id: 'sherlock-holmes-cd-unique', label: "No board, just casebook", traits: ['creative'] }
    ],
    antiElements: [
      { id: 'sherlock-holmes-cd-anti-one-shot', label: "Cases only once", traits: ['too-random'] },
      { id: 'sherlock-holmes-cd-anti-frustratin', label: "Solutions can feel unfair", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'got-lcg', name: "A Game of Thrones: The Card Game", bggId: 169255, year: 2015,
    minPlayers: 2, maxPlayers: 4, minTime: 60, maxTime: 120,
    complexity: 3.3, bggRating: 7.6,
    traits: ['deck-building', 'thematic', 'strategic', 'competitive'],
    elements: [
      { id: 'got-lcg-deckbuilding', label: "Construct deck before play", traits: ['deck-building'] },
      { id: 'got-lcg-thematic', label: "Westeros politics", traits: ['thematic'] },
      { id: 'got-lcg-strategic', label: "Plot card mind games", traits: ['strategic'] },
      { id: 'got-lcg-competitive', label: "Direct competition", traits: ['competitive'] }
    ],
    antiElements: [
      { id: 'got-lcg-anti-expensive', label: "LCG model requires buying packs", traits: ['too-random'] }
    ],
  },
  {
    id: 'anomia', name: "Anomia", bggId: 67877, year: 2010,
    minPlayers: 3, maxPlayers: 6, minTime: 30, maxTime: 30,
    complexity: 1.1, bggRating: 6.8,
    traits: ['exciting', 'tense', 'thematic', 'social', 'light', 'friendly'],
    elements: [
      { id: 'anomia-real-time', label: "Race to shout answers", traits: ['exciting', 'tense'] },
      { id: 'anomia-word-game', label: "Name things in categories", traits: ['thematic'] },
      { id: 'anomia-social', label: "Hilarious brain freezes", traits: ['social'] },
      { id: 'anomia-accessible', label: "Anyone can play", traits: ['light', 'friendly'] },
      { id: 'anomia-quick', label: "Fast rounds", traits: ['light'] }
    ],
    antiElements: [
      { id: 'anomia-anti-stressful', label: "Pressure to think fast", traits: ['too-random'] }
    ],
  },
  {
    id: 'jungle-speed', name: "Jungle Speed", bggId: 8098, year: 1997,
    minPlayers: 2, maxPlayers: 10, minTime: 10, maxTime: 10,
    complexity: 1.1, bggRating: 6.4,
    traits: ['exciting', 'tense', 'light', 'friendly'],
    elements: [
      { id: 'jungle-speed-dexterity', label: "Grab the totem!", traits: ['exciting'] },
      { id: 'jungle-speed-real-time', label: "React fast to matches", traits: ['exciting', 'tense'] },
      { id: 'jungle-speed-exciting', label: "Chaotic fun", traits: ['exciting'] },
      { id: 'jungle-speed-accessible', label: "Simple rules", traits: ['light', 'friendly'] }
    ],
    antiElements: [
      { id: 'jungle-speed-anti-too-random', label: "Card flip luck", traits: ['too-random'] }
    ],
  },
  {
    id: 'exploding-kittens', name: "Exploding Kittens", bggId: 172225, year: 2015,
    minPlayers: 2, maxPlayers: 5, minTime: 15, maxTime: 15,
    complexity: 1.1, bggRating: 5.9,
    traits: ['push-your-luck', 'hilarious', 'light', 'friendly', 'confrontational', 'mean-spirited'],
    elements: [
      { id: 'exploding-kittens-push-your-luck', label: "Will you draw an explosion?", traits: ['push-your-luck'] },
      { id: 'exploding-kittens-humorous', label: "Silly cat artwork", traits: ['hilarious'] },
      { id: 'exploding-kittens-accessible', label: "Very simple", traits: ['light', 'friendly'] },
      { id: 'exploding-kittens-take-that', label: "Target other players", traits: ['confrontational', 'mean-spirited'] }
    ],
    antiElements: [
      { id: 'exploding-kittens-anti-too-random', label: "Mostly luck", traits: ['too-random'] },
      { id: 'exploding-kittens-anti-player-eli', label: "Get knocked out", traits: ['player-elimination'] }
    ],
  },
  {
    id: 'cat-in-the-box', name: "Cat in the Box", bggId: 345972, year: 2022,
    minPlayers: 2, maxPlayers: 5, minTime: 30, maxTime: 30,
    complexity: 2.2, bggRating: 7.5,
    traits: ['trick-taking', 'creative', 'strategic', 'elegant'],
    elements: [
      { id: 'cat-in-the-box-trick-taking', label: "Cards have no suits until played", traits: ['trick-taking'] },
      { id: 'cat-in-the-box-unique', label: "Quantum superposition theme", traits: ['creative'] },
      { id: 'cat-in-the-box-strategic', label: "Declare suits tactically", traits: ['strategic'] },
      { id: 'cat-in-the-box-elegant', label: "Clever twist on classics", traits: ['elegant'] }
    ],
    antiElements: [
      { id: 'cat-in-the-box-anti-brain-burn', label: "Tracking can be taxing", traits: ['too-random'] }
    ],
  },
  {
    id: 'once-upon-a-time', name: "Once Upon a Time", bggId: 1234, year: 1993,
    minPlayers: 2, maxPlayers: 6, minTime: 30, maxTime: 30,
    complexity: 1.4, bggRating: 6.3,
    traits: ['creative', 'narrative', 'social', 'light', 'friendly'],
    elements: [
      { id: 'once-upon-a-time-creative', label: "Tell fairy tales together", traits: ['creative'] },
      { id: 'once-upon-a-time-narrative', label: "Stories emerge from play", traits: ['narrative'] },
      { id: 'once-upon-a-time-social', label: "Fun with right group", traits: ['social'] },
      { id: 'once-upon-a-time-accessible', label: "No rules really", traits: ['light', 'friendly'] }
    ],
    antiElements: [
      { id: 'once-upon-a-time-anti-requires-c', label: "Not fun if shy", traits: ['too-random'] },
      { id: 'once-upon-a-time-anti-chaotic', label: "Stories get weird", traits: ['too-random'] }
    ],
  },
  {
    id: 'house-of-danger', name: "Choose Your Own Adventure: House of Danger", bggId: 249764, year: 2018,
    minPlayers: 1, maxPlayers: 8, minTime: 60, maxTime: 180,
    complexity: 1.2, bggRating: 5.9,
    traits: ['narrative', 'thematic', 'cooperative', 'light', 'friendly'],
    elements: [
      { id: 'house-of-danger-narrative', label: "Choose your path", traits: ['narrative'] },
      { id: 'house-of-danger-nostalgic', label: "Classic book series", traits: ['thematic'] },
      { id: 'house-of-danger-cooperative', label: "Decide together", traits: ['cooperative'] },
      { id: 'house-of-danger-accessible', label: "No rules", traits: ['light', 'friendly'] }
    ],
    antiElements: [
      { id: 'house-of-danger-anti-no-strateg', label: "Choices feel arbitrary", traits: ['too-random'] }
    ],
  },
  {
    id: 'halli-galli', name: "Halli Galli", bggId: 2944, year: 1990,
    minPlayers: 2, maxPlayers: 6, minTime: 15, maxTime: 15,
    complexity: 1, bggRating: 6,
    traits: ['exciting', 'tense', 'light', 'friendly'],
    elements: [
      { id: 'halli-galli-real-time', label: "Ring bell first!", traits: ['exciting', 'tense'] },
      { id: 'halli-galli-dexterity', label: "Speed reaction", traits: ['exciting'] },
      { id: 'halli-galli-accessible', label: "Kids love it", traits: ['light', 'friendly'] },
      { id: 'halli-galli-exciting', label: "Frantic fun", traits: ['exciting'] }
    ],
    antiElements: [

    ],
  },
  {
    id: '5-minute-dungeon', name: "5 Minute Dungeon", bggId: 207830, year: 2017,
    minPlayers: 2, maxPlayers: 5, minTime: 5, maxTime: 30,
    complexity: 1.2, bggRating: 6.9,
    traits: ['exciting', 'tense', 'cooperative', 'light', 'friendly', 'thematic'],
    elements: [
      { id: '5-minute-dungeon-real-time', label: "Beat the timer!", traits: ['exciting', 'tense'] },
      { id: '5-minute-dungeon-cooperative', label: "Work together frantically", traits: ['cooperative'] },
      { id: '5-minute-dungeon-exciting', label: "Adrenaline rush", traits: ['exciting'] },
      { id: '5-minute-dungeon-accessible', label: "Simple rules", traits: ['light', 'friendly'] },
      { id: '5-minute-dungeon-thematic', label: "Dungeon crawl chaos", traits: ['thematic'] }
    ],
    antiElements: [
      { id: '5-minute-dungeon-anti-stressful', label: "Time pressure is intense", traits: ['too-random'] }
    ],
  },
  {
    id: 'saboteur', name: "Saboteur", bggId: 9220, year: 2004,
    minPlayers: 3, maxPlayers: 10, minTime: 30, maxTime: 30,
    complexity: 1.2, bggRating: 6.3,
    traits: ['hidden-roles', 'social-deduction', 'social', 'light', 'friendly', 'bluffing'],
    elements: [
      { id: 'saboteur-hidden-traitor', label: "Saboteurs among dwarves", traits: ['hidden-roles', 'social-deduction'] },
      { id: 'saboteur-social', label: "Accusations fly", traits: ['social'] },
      { id: 'saboteur-accessible', label: "Simple rules", traits: ['light', 'friendly'] },
      { id: 'saboteur-bluffing', label: "Hide your role", traits: ['bluffing'] }
    ],
    antiElements: [
      { id: 'saboteur-anti-too-random', label: "Card luck dominates", traits: ['too-random'] }
    ],
  },
  {
    id: 'bohnanza', name: "Bohnanza", bggId: 11, year: 1997,
    minPlayers: 2, maxPlayers: 7, minTime: 45, maxTime: 45,
    complexity: 1.7, bggRating: 7,
    traits: ['trading', 'social', 'light', 'friendly', 'hilarious'],
    elements: [
      { id: 'bohnanza-trading', label: "Constant negotiation", traits: ['trading'] },
      { id: 'bohnanza-social', label: "Every turn involves everyone", traits: ['social'] },
      { id: 'bohnanza-accessible', label: "Easy to learn", traits: ['light', 'friendly'] },
      { id: 'bohnanza-humorous', label: "Bean puns everywhere", traits: ['hilarious'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'no-thanks', name: "No Thanks!", bggId: 12942, year: 2004,
    minPlayers: 3, maxPlayers: 7, minTime: 20, maxTime: 20,
    complexity: 1.1, bggRating: 7.1,
    traits: ['push-your-luck', 'elegant', 'light', 'friendly', 'strategic'],
    elements: [
      { id: 'no-thanks-push-your-luck', label: "Take it or pay?", traits: ['push-your-luck'] },
      { id: 'no-thanks-elegant', label: "Simple genius", traits: ['elegant'] },
      { id: 'no-thanks-accessible', label: "Teach in 1 minute", traits: ['light', 'friendly'] },
      { id: 'no-thanks-strategic', label: "Chip management matters", traits: ['strategic'] },
      { id: 'no-thanks-quick', label: "Fast games", traits: ['light'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'timeline', name: "Timeline", bggId: 128664, year: 2012,
    minPlayers: 2, maxPlayers: 8, minTime: 15, maxTime: 15,
    complexity: 1, bggRating: 6.5,
    traits: ['thematic', 'light', 'friendly'],
    elements: [
      { id: 'timeline-trivia', label: "Guess historical dates", traits: ['thematic'] },
      { id: 'timeline-educational', label: "Learn history", traits: ['thematic'] },
      { id: 'timeline-accessible', label: "Anyone can play", traits: ['light', 'friendly'] },
      { id: 'timeline-quick', label: "Fast rounds", traits: ['light'] }
    ],
    antiElements: [
      { id: 'timeline-anti-too-light', label: "Limited replayability", traits: ['too-random'] }
    ],
  },
  {
    id: 'ubongo', name: "Ubongo", bggId: 16986, year: 2003,
    minPlayers: 2, maxPlayers: 4, minTime: 25, maxTime: 25,
    complexity: 1.3, bggRating: 6.8,
    traits: ['puzzly', 'exciting', 'tense', 'light', 'friendly'],
    elements: [
      { id: 'ubongo-puzzle-solving', label: "Fit pieces fast", traits: ['puzzly'] },
      { id: 'ubongo-real-time', label: "Race to solve", traits: ['exciting', 'tense'] },
      { id: 'ubongo-accessible', label: "Family-friendly", traits: ['light', 'friendly'] },
      { id: 'ubongo-exciting', label: "Tense races", traits: ['exciting'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'mint-works', name: "Mint Works", bggId: 200077, year: 2017,
    minPlayers: 1, maxPlayers: 4, minTime: 10, maxTime: 20,
    complexity: 1.5, bggRating: 6.6,
    traits: ['worker-placement', 'thematic', 'elegant', 'light'],
    elements: [
      { id: 'mint-works-worker-placemen', label: "Tiny worker placement", traits: ['worker-placement'] },
      { id: 'mint-works-portable', label: "Fits in mint tin", traits: ['thematic'] },
      { id: 'mint-works-elegant', label: "Streamlined design", traits: ['elegant'] },
      { id: 'mint-works-quick', label: "Very fast games", traits: ['light'] }
    ],
    antiElements: [
      { id: 'mint-works-anti-too-light', label: "Limited depth", traits: ['too-random'] }
    ],
  },
  {
    id: 'get-bit', name: "Get Bit!", bggId: 30539, year: 2007,
    minPlayers: 3, maxPlayers: 6, minTime: 20, maxTime: 20,
    complexity: 1.1, bggRating: 6.2,
    traits: ['bluffing', 'hilarious', 'light', 'friendly'],
    elements: [
      { id: 'get-bit-bluffing', label: "Predict opponent cards", traits: ['bluffing'] },
      { id: 'get-bit-humorous', label: "Removable limbs!", traits: ['hilarious'] },
      { id: 'get-bit-accessible', label: "Very simple", traits: ['light', 'friendly'] },
      { id: 'get-bit-quick', label: "Fast games", traits: ['light'] }
    ],
    antiElements: [
      { id: 'get-bit-anti-player-eli', label: "Get eaten", traits: ['player-elimination'] }
    ],
  },
  {
    id: 'sleeping-queens', name: "Sleeping Queens", bggId: 17053, year: 2005,
    minPlayers: 2, maxPlayers: 5, minTime: 15, maxTime: 15,
    complexity: 1.1, bggRating: 6.2,
    traits: ['light', 'friendly', 'set-collection'],
    elements: [
      { id: 'sleeping-queens-accessible', label: "Great for young kids", traits: ['light', 'friendly'] },
      { id: 'sleeping-queens-family-friendly', label: "All ages can play", traits: ['friendly', 'light'] },
      { id: 'sleeping-queens-quick', label: "Short games", traits: ['light'] },
      { id: 'sleeping-queens-set-collection', label: "Wake up queens", traits: ['set-collection'] }
    ],
    antiElements: [
      { id: 'sleeping-queens-anti-too-light', label: "Adults may be bored", traits: ['too-random'] }
    ],
  },
  {
    id: 'arkham-noir', name: "Arkham Noir", bggId: 218498, year: 2017,
    minPlayers: 1, maxPlayers: 1, minTime: 30, maxTime: 30,
    complexity: 2.2, bggRating: 6.8,
    traits: ['thematic', 'puzzly'],
    elements: [
      { id: 'arkham-noir-solo-only', label: "Designed for solo", traits: ['thematic'] },
      { id: 'arkham-noir-thematic', label: "Noir Lovecraft", traits: ['thematic'] },
      { id: 'arkham-noir-puzzle-solving', label: "Chain clues together", traits: ['puzzly'] },
      { id: 'arkham-noir-portable', label: "Small box", traits: ['thematic'] }
    ],
    antiElements: [
      { id: 'arkham-noir-anti-too-random', label: "Card luck can block solutions", traits: ['too-random'] }
    ],
  },
  {
    id: 'oh-my-goods', name: "Oh My Goods!", bggId: 183840, year: 2015,
    minPlayers: 2, maxPlayers: 4, minTime: 30, maxTime: 30,
    complexity: 2.1, bggRating: 6.9,
    traits: ['engine-building', 'push-your-luck', 'thematic', 'strategic'],
    elements: [
      { id: 'oh-my-goods-engine-building', label: "Build production chains", traits: ['engine-building'] },
      { id: 'oh-my-goods-push-your-luck', label: "Gamble on market cards", traits: ['push-your-luck'] },
      { id: 'oh-my-goods-portable', label: "Small box", traits: ['thematic'] },
      { id: 'oh-my-goods-strategic', label: "Good decisions in small package", traits: ['strategic'] }
    ],
    antiElements: [
      { id: 'oh-my-goods-anti-too-random', label: "Market draw luck", traits: ['too-random'] }
    ],
  },
  {
    id: 'labyrinth', name: "Labyrinth", bggId: 1219, year: 1986,
    minPlayers: 2, maxPlayers: 4, minTime: 20, maxTime: 20,
    complexity: 1.4, bggRating: 6.4,
    traits: ['puzzly', 'light', 'friendly', 'thematic', 'strategic', 'grid-movement'],
    elements: [
      { id: 'labyrinth-puzzle-solving', label: "Shift maze to create paths", traits: ['puzzly'] },
      { id: 'labyrinth-accessible', label: "Family classic", traits: ['light', 'friendly'] },
      { id: 'labyrinth-nostalgic', label: "Many grew up with it", traits: ['thematic'] },
      { id: 'labyrinth-tactical', label: "Plan your route", traits: ['strategic', 'grid-movement'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'pictionary', name: "Pictionary", bggId: 2281, year: 1985,
    minPlayers: 3, maxPlayers: 16, minTime: 90, maxTime: 90,
    complexity: 1.2, bggRating: 5.9,
    traits: ['creative', 'social', 'light', 'friendly', 'hilarious'],
    elements: [
      { id: 'pictionary-creative', label: "Draw clues", traits: ['creative'] },
      { id: 'pictionary-social', label: "Party classic", traits: ['social'] },
      { id: 'pictionary-accessible', label: "Everyone knows it", traits: ['light', 'friendly'] },
      { id: 'pictionary-humorous', label: "Bad drawings are funny", traits: ['hilarious'] }
    ],
    antiElements: [
      { id: 'pictionary-anti-requires-d', label: "Intimidating for some", traits: ['too-random'] }
    ],
  },
  {
    id: 'sequence', name: "Sequence", bggId: 2375, year: 1981,
    minPlayers: 2, maxPlayers: 12, minTime: 10, maxTime: 30,
    complexity: 1.3, bggRating: 5.8,
    traits: ['puzzly', 'elegant', 'light', 'friendly', 'team-based'],
    elements: [
      { id: 'sequence-abstract', label: "Get 5 in a row", traits: ['puzzly', 'elegant'] },
      { id: 'sequence-accessible', label: "Simple to learn", traits: ['light', 'friendly'] },
      { id: 'sequence-team-based', label: "Good for teams", traits: ['team-based'] }
    ],
    antiElements: [
      { id: 'sequence-anti-too-random', label: "Card luck dominates", traits: ['too-random'] }
    ],
  },
  {
    id: 'tiny-epic-zombies', name: "Tiny Epic Zombies", bggId: 244536, year: 2018,
    minPlayers: 1, maxPlayers: 5, minTime: 30, maxTime: 45,
    complexity: 2.4, bggRating: 6.8,
    traits: ['cooperative', 'thematic', 'variable-powers'],
    elements: [
      { id: 'tiny-epic-zombies-cooperative', label: "Survive together", traits: ['cooperative'] },
      { id: 'tiny-epic-zombies-thematic', label: "Zombie survival", traits: ['thematic'] },
      { id: 'tiny-epic-zombies-portable', label: "Tiny box, big game", traits: ['thematic'] },
      { id: 'tiny-epic-zombies-variable-powers', label: "Different survivors", traits: ['variable-powers'] }
    ],
    antiElements: [
      { id: 'tiny-epic-zombies-anti-fiddly', label: "Lots packed in small box", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'tiny-epic-galaxies', name: "Tiny Epic Galaxies", bggId: 163967, year: 2015,
    minPlayers: 1, maxPlayers: 5, minTime: 30, maxTime: 45,
    complexity: 2.2, bggRating: 7.1,
    traits: ['dice-rolling', 'engine-building', 'thematic', 'strategic', 'epic'],
    elements: [
      { id: 'tiny-epic-galaxies-dice-rolling', label: "Roll and select dice", traits: ['dice-rolling'] },
      { id: 'tiny-epic-galaxies-engine-building', label: "Upgrade your empire", traits: ['engine-building'] },
      { id: 'tiny-epic-galaxies-portable', label: "Tiny box", traits: ['thematic'] },
      { id: 'tiny-epic-galaxies-4x', label: "Space empire in small package", traits: ['strategic', 'epic'] }
    ],
    antiElements: [
      { id: 'tiny-epic-galaxies-anti-too-random', label: "Dice luck", traits: ['too-random'] }
    ],
  },
  {
    id: 'century-spice-road', name: "Century: Spice Road", bggId: 209685, year: 2017,
    minPlayers: 2, maxPlayers: 5, minTime: 30, maxTime: 45,
    complexity: 1.8, bggRating: 7.3,
    traits: ['engine-building', 'elegant', 'beautiful', 'light', 'friendly'],
    elements: [
      { id: 'century-spice-road-engine-building', label: "Build spice conversion engine", traits: ['engine-building'] },
      { id: 'century-spice-road-elegant', label: "Simple, satisfying", traits: ['elegant'] },
      { id: 'century-spice-road-beautiful', label: "Gorgeous production", traits: ['beautiful'] },
      { id: 'century-spice-road-accessible', label: "Easy gateway", traits: ['light', 'friendly'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'button-men', name: "Button Men", bggId: 17, year: 1999,
    minPlayers: 2, maxPlayers: 2, minTime: 5, maxTime: 5,
    complexity: 1.5, bggRating: 5.9,
    traits: ['dice-rolling', 'light', 'strategic', 'grid-movement', 'thematic'],
    elements: [
      { id: 'button-men-dice-rolling', label: "Dice combat", traits: ['dice-rolling'] },
      { id: 'button-men-quick', label: "Very fast", traits: ['light'] },
      { id: 'button-men-tactical', label: "Choose which dice to use", traits: ['strategic', 'grid-movement'] },
      { id: 'button-men-portable', label: "Just buttons", traits: ['thematic'] }
    ],
    antiElements: [
      { id: 'button-men-anti-too-random', label: "Dice luck", traits: ['too-random'] }
    ],
  },
  {
    id: 'deadly-doodles', name: "Deadly Doodles", bggId: 268284, year: 2019,
    minPlayers: 1, maxPlayers: 4, minTime: 15, maxTime: 25,
    complexity: 1.2, bggRating: 6.2,
    traits: ['thematic', 'exciting', 'light', 'friendly'],
    elements: [
      { id: 'deadly-doodles-drawing', label: "Draw dungeon paths", traits: ['thematic'] },
      { id: 'deadly-doodles-simultaneous', label: "All play at once", traits: ['exciting'] },
      { id: 'deadly-doodles-accessible', label: "Easy rules", traits: ['light', 'friendly'] },
      { id: 'deadly-doodles-quick', label: "Fast games", traits: ['light'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'funemployed', name: "Funemployed", bggId: 142296, year: 2014,
    minPlayers: 3, maxPlayers: 20, minTime: 30, maxTime: 30,
    complexity: 1, bggRating: 6.2,
    traits: ['hilarious', 'social', 'creative', 'light', 'friendly'],
    elements: [
      { id: 'funemployed-humorous', label: "Absurd job interviews", traits: ['hilarious'] },
      { id: 'funemployed-social', label: "Improv party game", traits: ['social'] },
      { id: 'funemployed-creative', label: "Make up qualifications", traits: ['creative'] },
      { id: 'funemployed-accessible', label: "No rules", traits: ['light', 'friendly'] }
    ],
    antiElements: [
      { id: 'funemployed-anti-requires-i', label: "Need to be comfortable performing", traits: ['too-random'] }
    ],
  },
  {
    id: 'king-of-dice', name: "King of the Dice", bggId: 269153, year: 2019,
    minPlayers: 2, maxPlayers: 5, minTime: 20, maxTime: 20,
    complexity: 1.2, bggRating: 6.5,
    traits: ['dice-rolling', 'push-your-luck', 'light', 'friendly'],
    elements: [
      { id: 'king-of-dice-dice-rolling', label: "Yahtzee-style sets", traits: ['dice-rolling'] },
      { id: 'king-of-dice-push-your-luck', label: "Press for more?", traits: ['push-your-luck'] },
      { id: 'king-of-dice-accessible', label: "Family-friendly", traits: ['light', 'friendly'] },
      { id: 'king-of-dice-quick', label: "Fast games", traits: ['light'] }
    ],
    antiElements: [
      { id: 'king-of-dice-anti-too-random', label: "Dice luck", traits: ['too-random'] }
    ],
  },
  {
    id: 'coloradd', name: "ColorADD", bggId: 169306, year: 2014,
    minPlayers: 2, maxPlayers: 5, minTime: 15, maxTime: 15,
    complexity: 1, bggRating: 6,
    traits: ['thematic', 'light', 'friendly'],
    elements: [
      { id: 'coloradd-educational', label: "Learn color mixing", traits: ['thematic'] },
      { id: 'coloradd-accessible', label: "Very simple", traits: ['light', 'friendly'] },
      { id: 'coloradd-colorblind-frie', label: "Uses symbols", traits: ['thematic'] }
    ],
    antiElements: [
      { id: 'coloradd-anti-too-light', label: "Very simple", traits: ['too-random'] }
    ],
  },
  {
    id: 'jabbas-palace', name: "Jabba", bggId: 352855, year: 2022,
    minPlayers: 2, maxPlayers: 6, minTime: 20, maxTime: 20,
    complexity: 1.3, bggRating: 7.2,
    traits: ['bluffing', 'social-deduction', 'puzzly', 'thematic', 'light', 'friendly'],
    elements: [
      { id: 'jabbas-palace-bluffing', label: "Love Letter mechanism", traits: ['bluffing'] },
      { id: 'jabbas-palace-deduction', label: "Guess opponent cards", traits: ['social-deduction', 'puzzly'] },
      { id: 'jabbas-palace-thematic', label: "Star Wars theme", traits: ['thematic'] },
      { id: 'jabbas-palace-quick', label: "Fast rounds", traits: ['light'] },
      { id: 'jabbas-palace-accessible', label: "Simple rules", traits: ['light', 'friendly'] }
    ],
    antiElements: [
      { id: 'jabbas-palace-anti-too-random', label: "Card draw luck", traits: ['too-random'] }
    ],
  },
  {
    id: 'tiger-dragon', name: "Tiger & Dragon", bggId: 231511, year: 2017,
    minPlayers: 2, maxPlayers: 4, minTime: 30, maxTime: 30,
    complexity: 1.4, bggRating: 7,
    traits: ['thematic', 'elegant', 'light', 'strategic'],
    elements: [
      { id: 'tiger-dragon-climbing', label: "Shed cards by playing higher", traits: ['thematic'] },
      { id: 'tiger-dragon-elegant', label: "Simple tile game", traits: ['elegant'] },
      { id: 'tiger-dragon-quick', label: "Fast rounds", traits: ['light'] },
      { id: 'tiger-dragon-strategic', label: "Hand management", traits: ['strategic'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'gaia-project', name: "Gaia Project", bggId: 220308, year: 2017,
    minPlayers: 1, maxPlayers: 4, minTime: 60, maxTime: 150,
    complexity: 4.3, bggRating: 8.5,
    traits: ['engine-building', 'variable-powers', 'strategic', 'area-control', 'replayable'],
    elements: [
      { id: 'gaia-project-engine-building', label: "Develop your civilization", traits: ['engine-building'] },
      { id: 'gaia-project-asymmetric', label: "14 unique alien factions", traits: ['variable-powers'] },
      { id: 'gaia-project-strategic', label: "Terra Mystica in space", traits: ['strategic'] },
      { id: 'gaia-project-area-control', label: "Colonize planets", traits: ['area-control'] },
      { id: 'gaia-project-replayable', label: "Variable setup and factions", traits: ['replayable'] }
    ],
    antiElements: [
      { id: 'gaia-project-anti-analysis-p', label: "Overwhelming options", traits: ['analysis-paralysis'] },
      { id: 'gaia-project-anti-too-long', label: "Can run 3+ hours", traits: ['too-long'] },
      { id: 'gaia-project-anti-learning-c', label: "Steep learning curve", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'potion-explosion', name: "Potion Explosion", bggId: 180974, year: 2015,
    minPlayers: 2, maxPlayers: 4, minTime: 30, maxTime: 60,
    complexity: 1.7, bggRating: 7.1,
    traits: ['creative', 'thematic', 'light', 'friendly', 'engine-building', 'satisfying'],
    elements: [
      { id: 'potion-explosion-unique', label: "Marble dispenser mechanism", traits: ['creative'] },
      { id: 'potion-explosion-tactile', label: "Fun to grab marbles", traits: ['thematic'] },
      { id: 'potion-explosion-accessible', label: "Easy to learn", traits: ['light', 'friendly'] },
      { id: 'potion-explosion-engine-building', label: "Potion combos", traits: ['engine-building'] },
      { id: 'potion-explosion-satisfying', label: "Chain explosions feel great", traits: ['satisfying'] }
    ],
    antiElements: [
      { id: 'potion-explosion-anti-too-random', label: "Marble luck", traits: ['too-random'] }
    ],
  },
  {
    id: 'survive-atlantis', name: "Survive: Escape from Atlantis", bggId: 2653, year: 1982,
    minPlayers: 2, maxPlayers: 4, minTime: 45, maxTime: 60,
    complexity: 1.5, bggRating: 7.2,
    traits: ['confrontational', 'mean-spirited', 'dramatic', 'light', 'friendly', 'exciting', 'hilarious'],
    elements: [
      { id: 'survive-atlantis-take-that', label: "Send sharks at opponents!", traits: ['confrontational', 'mean-spirited'] },
      { id: 'survive-atlantis-dramatic', label: "Hilarious disasters", traits: ['dramatic'] },
      { id: 'survive-atlantis-accessible', label: "Simple rules", traits: ['light', 'friendly'] },
      { id: 'survive-atlantis-exciting', label: "Tense escapes", traits: ['exciting'] },
      { id: 'survive-atlantis-humorous', label: "Watching friends get eaten", traits: ['hilarious'] }
    ],
    antiElements: [
      { id: 'survive-atlantis-anti-mean-spiri', label: "Very directly attacking", traits: ['mean-spirited'] }
    ],
  },
  {
    id: 'santorini', name: "Santorini", bggId: 194655, year: 2016,
    minPlayers: 2, maxPlayers: 4, minTime: 20, maxTime: 20,
    complexity: 1.8, bggRating: 7.6,
    traits: ['puzzly', 'elegant', 'beautiful', 'variable-powers', 'light'],
    elements: [
      { id: 'santorini-abstract', label: "Pure strategy", traits: ['puzzly', 'elegant'] },
      { id: 'santorini-beautiful', label: "3D building is gorgeous", traits: ['beautiful'] },
      { id: 'santorini-elegant', label: "Simple rules, deep play", traits: ['elegant'] },
      { id: 'santorini-variable-powers', label: "God powers add variety", traits: ['variable-powers'] },
      { id: 'santorini-quick', label: "Fast games", traits: ['light'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'magic-maze', name: "Magic Maze", bggId: 209778, year: 2017,
    minPlayers: 1, maxPlayers: 8, minTime: 15, maxTime: 15,
    complexity: 1.8, bggRating: 7.1,
    traits: ['exciting', 'tense', 'cooperative', 'communication-limits', 'creative'],
    elements: [
      { id: 'magic-maze-real-time', label: "Beat the timer!", traits: ['exciting', 'tense'] },
      { id: 'magic-maze-cooperative', label: "Work together silently", traits: ['cooperative'] },
      { id: 'magic-maze-communication', label: "No talking allowed!", traits: ['communication-limits'] },
      { id: 'magic-maze-unique', label: "Each player controls one direction", traits: ['creative'] },
      { id: 'magic-maze-tense', label: "Silent frustration builds", traits: ['tense'] }
    ],
    antiElements: [
      { id: 'magic-maze-anti-stressful', label: "Can be frustrating", traits: ['too-random'] }
    ],
  },
  {
    id: 'splendor-duel', name: "Splendor Duel", bggId: 364073, year: 2022,
    minPlayers: 2, maxPlayers: 2, minTime: 30, maxTime: 30,
    complexity: 2, bggRating: 8.1,
    traits: ['engine-building', 'elegant', 'strategic', 'grid-movement', 'tense'],
    elements: [
      { id: 'splendor-duel-engine-building', label: "Build gem engine", traits: ['engine-building'] },
      { id: 'splendor-duel-elegant', label: "Improved 2-player Splendor", traits: ['elegant'] },
      { id: 'splendor-duel-tactical', label: "Board adds spatial element", traits: ['strategic', 'grid-movement'] },
      { id: 'splendor-duel-strategic', label: "Multiple win conditions", traits: ['strategic'] },
      { id: 'splendor-duel-tense', label: "Race to victory", traits: ['tense'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'takenoko', name: "Takenoko", bggId: 70919, year: 2011,
    minPlayers: 2, maxPlayers: 4, minTime: 45, maxTime: 45,
    complexity: 1.9, bggRating: 7.2,
    traits: ['beautiful', 'light', 'friendly', 'thematic', 'set-collection'],
    elements: [
      { id: 'takenoko-beautiful', label: "Adorable panda miniature", traits: ['beautiful'] },
      { id: 'takenoko-accessible', label: "Great gateway", traits: ['light', 'friendly'] },
      { id: 'takenoko-tile-laying', label: "Build the garden", traits: ['thematic'] },
      { id: 'takenoko-set-collection', label: "Complete objectives", traits: ['set-collection'] },
      { id: 'takenoko-family-friendly', label: "All ages enjoy it", traits: ['friendly', 'light'] }
    ],
    antiElements: [
      { id: 'takenoko-anti-too-random', label: "Objective card luck", traits: ['too-random'] }
    ],
  },
  {
    id: 'canvas', name: "Canvas", bggId: 290236, year: 2021,
    minPlayers: 1, maxPlayers: 5, minTime: 30, maxTime: 30,
    complexity: 1.6, bggRating: 7.2,
    traits: ['beautiful', 'creative', 'light', 'friendly', 'relaxing'],
    elements: [
      { id: 'canvas-beautiful', label: "Transparent card layering creates art", traits: ['beautiful'] },
      { id: 'canvas-unique', label: "Nothing else like it", traits: ['creative'] },
      { id: 'canvas-creative', label: "Make actual paintings", traits: ['creative'] },
      { id: 'canvas-accessible', label: "Simple rules", traits: ['light', 'friendly'] },
      { id: 'canvas-relaxing', label: "Calm gameplay", traits: ['relaxing'] }
    ],
    antiElements: [
      { id: 'canvas-anti-too-light', label: "Limited strategy", traits: ['too-random'] }
    ],
  },
  {
    id: 'my-city', name: "My City", bggId: 295486, year: 2020,
    minPlayers: 2, maxPlayers: 4, minTime: 30, maxTime: 30,
    complexity: 2, bggRating: 7.5,
    traits: ['thematic', 'light', 'friendly', 'competitive', 'campaign'],
    elements: [
      { id: 'my-city-legacy', label: "24 games that evolve", traits: ['thematic'] },
      { id: 'my-city-tile-laying', label: "Build your city", traits: ['thematic'] },
      { id: 'my-city-accessible', label: "Easy to learn", traits: ['light', 'friendly'] },
      { id: 'my-city-competitive', label: "Same cards, different choices", traits: ['competitive'] },
      { id: 'my-city-campaign', label: "Story unfolds", traits: ['campaign'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'drop-it', name: "Drop It", bggId: 244567, year: 2018,
    minPlayers: 2, maxPlayers: 4, minTime: 20, maxTime: 20,
    complexity: 1.1, bggRating: 6.8,
    traits: ['exciting', 'light', 'friendly'],
    elements: [
      { id: 'drop-it-dexterity', label: "Drop shapes into tower", traits: ['exciting'] },
      { id: 'drop-it-accessible', label: "Anyone can play", traits: ['light', 'friendly'] },
      { id: 'drop-it-exciting', label: "Where will it land?", traits: ['exciting'] },
      { id: 'drop-it-family-friendly', label: "All ages", traits: ['friendly', 'light'] }
    ],
    antiElements: [
      { id: 'drop-it-anti-too-random', label: "Physics luck", traits: ['too-random'] }
    ],
  },
  {
    id: 'kabuto-sumo', name: "Kabuto Sumo", bggId: 332526, year: 2021,
    minPlayers: 2, maxPlayers: 4, minTime: 15, maxTime: 15,
    complexity: 1.1, bggRating: 7.2,
    traits: ['exciting', 'creative', 'light', 'friendly', 'thematic'],
    elements: [
      { id: 'kabuto-sumo-dexterity', label: "Push opponents off the ring", traits: ['exciting'] },
      { id: 'kabuto-sumo-unique', label: "Disc-pushing sumo beetles", traits: ['creative'] },
      { id: 'kabuto-sumo-accessible', label: "Very simple", traits: ['light', 'friendly'] },
      { id: 'kabuto-sumo-tactile', label: "Fun wooden pieces", traits: ['thematic'] },
      { id: 'kabuto-sumo-quick', label: "Fast games", traits: ['light'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'camel-up', name: "Camel Up", bggId: 153938, year: 2014,
    minPlayers: 3, maxPlayers: 8, minTime: 30, maxTime: 30,
    complexity: 1.5, bggRating: 7.1,
    traits: ['thematic', 'exciting', 'light', 'friendly', 'hilarious', 'social'],
    elements: [
      { id: 'camel-up-betting', label: "Bet on camel race", traits: ['thematic'] },
      { id: 'camel-up-exciting', label: "Dramatic race moments", traits: ['exciting'] },
      { id: 'camel-up-accessible', label: "Easy to teach", traits: ['light', 'friendly'] },
      { id: 'camel-up-humorous', label: "Camels stack hilariously", traits: ['hilarious'] },
      { id: 'camel-up-social', label: "Great group game", traits: ['social'] }
    ],
    antiElements: [
      { id: 'camel-up-anti-too-random', label: "Dice determine race", traits: ['too-random'] }
    ],
  },
  {
    id: 'untold', name: "Untold: Adventures Await", bggId: 241421, year: 2017,
    minPlayers: 2, maxPlayers: 4, minTime: 45, maxTime: 60,
    complexity: 1.6, bggRating: 6.6,
    traits: ['creative', 'cooperative', 'light', 'friendly'],
    elements: [
      { id: 'untold-creative', label: "Collaborative storytelling", traits: ['creative'] },
      { id: 'untold-cooperative', label: "Build story together", traits: ['cooperative'] },
      { id: 'untold-accessible', label: "No wrong answers", traits: ['light', 'friendly'] }
    ],
    antiElements: [
      { id: 'untold-anti-requires-c', label: "Need to improvise", traits: ['too-random'] }
    ],
  },
  {
    id: 'letter-tycoon', name: "Letter Tycoon", bggId: 169147, year: 2015,
    minPlayers: 2, maxPlayers: 5, minTime: 30, maxTime: 30,
    complexity: 1.6, bggRating: 6.9,
    traits: ['thematic', 'engine-building', 'light', 'friendly', 'strategic'],
    elements: [
      { id: 'letter-tycoon-word-game', label: "Spell words for money", traits: ['thematic'] },
      { id: 'letter-tycoon-engine-building', label: "Buy letter patents", traits: ['engine-building'] },
      { id: 'letter-tycoon-accessible', label: "Familiar word game feel", traits: ['light', 'friendly'] },
      { id: 'letter-tycoon-strategic', label: "Which letters to patent?", traits: ['strategic'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'horizon-zero-dawn', name: "Horizon Zero Dawn: The Board Game", bggId: 273264, year: 2020,
    minPlayers: 1, maxPlayers: 4, minTime: 60, maxTime: 90,
    complexity: 2.8, bggRating: 7.2,
    traits: ['cooperative', 'thematic', 'strategic', 'grid-movement', 'deck-building'],
    elements: [
      { id: 'horizon-zero-dawn-cooperative', label: "Hunt machines together", traits: ['cooperative'] },
      { id: 'horizon-zero-dawn-thematic', label: "Captures video game feel", traits: ['thematic'] },
      { id: 'horizon-zero-dawn-tactical', label: "Target machine weak points", traits: ['strategic', 'grid-movement'] },
      { id: 'horizon-zero-dawn-deckbuilding', label: "Build your deck mid-hunt", traits: ['deck-building'] }
    ],
    antiElements: [
      { id: 'horizon-zero-dawn-anti-fiddly', label: "Many rules", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'battles-of-westeros', name: "Battles of Westeros", bggId: 67492, year: 2010,
    minPlayers: 2, maxPlayers: 2, minTime: 90, maxTime: 90,
    complexity: 3.1, bggRating: 7,
    traits: ['strategic', 'thematic', 'grid-movement', 'replayable'],
    elements: [
      { id: 'battles-of-westeros-wargame', label: "Tactical medieval battles", traits: ['strategic', 'thematic'] },
      { id: 'battles-of-westeros-thematic', label: "Game of Thrones battles", traits: ['thematic'] },
      { id: 'battles-of-westeros-tactical', label: "Command and Colors system", traits: ['strategic', 'grid-movement'] },
      { id: 'battles-of-westeros-scenarios', label: "Many battle setups", traits: ['replayable'] }
    ],
    antiElements: [
      { id: 'battles-of-westeros-anti-fiddly', label: "Lots of pieces and rules", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'chromino', name: "Chromino", bggId: 11824, year: 2001,
    minPlayers: 1, maxPlayers: 8, minTime: 30, maxTime: 30,
    complexity: 1.3, bggRating: 6.5,
    traits: ['thematic', 'light', 'friendly', 'relaxing'],
    elements: [
      { id: 'chromino-tile-laying', label: "Match colors on dominos", traits: ['thematic'] },
      { id: 'chromino-accessible', label: "Very simple", traits: ['light', 'friendly'] },
      { id: 'chromino-relaxing', label: "Calm gameplay", traits: ['relaxing'] },
      { id: 'chromino-colorful', label: "Pretty patterns emerge", traits: ['thematic'] }
    ],
    antiElements: [
      { id: 'chromino-anti-too-light', label: "Not much strategy", traits: ['too-random'] }
    ],
  },
  {
    id: 'twister', name: "Twister", bggId: 5894, year: 1966,
    minPlayers: 2, maxPlayers: 4, minTime: 10, maxTime: 10,
    complexity: 1, bggRating: 4.7,
    traits: ['exciting', 'social', 'hilarious', 'light', 'friendly'],
    elements: [
      { id: 'twister-dexterity', label: "Physical contortions", traits: ['exciting'] },
      { id: 'twister-social', label: "Party classic", traits: ['social'] },
      { id: 'twister-humorous', label: "Awkward positions", traits: ['hilarious'] },
      { id: 'twister-accessible', label: "Everyone knows it", traits: ['light', 'friendly'] }
    ],
    antiElements: [
      { id: 'twister-anti-physical-d', label: "Need flexibility", traits: ['too-random'] }
    ],
  },
  {
    id: 'turing-tumble', name: "Turing Tumble", bggId: 243668, year: 2017,
    minPlayers: 1, maxPlayers: 2, minTime: 15, maxTime: 60,
    complexity: 2.5, bggRating: 7.8,
    traits: ['puzzly', 'thematic', 'creative', 'solo-mode', 'satisfying'],
    elements: [
      { id: 'turing-tumble-puzzle-solving', label: "Build marble computers", traits: ['puzzly'] },
      { id: 'turing-tumble-educational', label: "Learn computer science", traits: ['thematic'] },
      { id: 'turing-tumble-unique', label: "Mechanical logic gates", traits: ['creative'] },
      { id: 'turing-tumble-solo-friendly', label: "Great solo puzzles", traits: ['solo-mode'] },
      { id: 'turing-tumble-satisfying', label: "Seeing logic work", traits: ['satisfying'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'fossilis', name: "Fossilis", bggId: 300782, year: 2021,
    minPlayers: 2, maxPlayers: 5, minTime: 45, maxTime: 60,
    complexity: 1.8, bggRating: 7,
    traits: ['thematic', 'set-collection', 'friendly', 'light', 'creative'],
    elements: [
      { id: 'fossilis-tactile', label: "Physically dig for fossils", traits: ['thematic'] },
      { id: 'fossilis-set-collection', label: "Complete dinosaurs", traits: ['set-collection'] },
      { id: 'fossilis-thematic', label: "Paleontology theme", traits: ['thematic'] },
      { id: 'fossilis-family-friendly', label: "Kids love digging", traits: ['friendly', 'light'] },
      { id: 'fossilis-unique', label: "3D dig site", traits: ['creative'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'overboss', name: "Overboss", bggId: 304051, year: 2021,
    minPlayers: 1, maxPlayers: 5, minTime: 30, maxTime: 30,
    complexity: 1.6, bggRating: 7,
    traits: ['thematic', 'light', 'friendly'],
    elements: [
      { id: 'overboss-tile-laying', label: "Build your dungeon", traits: ['thematic'] },
      { id: 'overboss-drafting', label: "Pick tiles and monsters", traits: ['thematic'] },
      { id: 'overboss-accessible', label: "Easy to learn", traits: ['light', 'friendly'] },
      { id: 'overboss-thematic', label: "Video game dungeon vibes", traits: ['thematic'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'catamino', name: "Catamino", bggId: 21445, year: 2002,
    minPlayers: 1, maxPlayers: 2, minTime: 15, maxTime: 15,
    complexity: 2.1, bggRating: 6.9,
    traits: ['puzzly', 'solo-mode', 'light', 'friendly', 'thematic'],
    elements: [
      { id: 'catamino-puzzle-solving', label: "Fit pentomino pieces", traits: ['puzzly'] },
      { id: 'catamino-solo-friendly', label: "Great solo puzzler", traits: ['solo-mode'] },
      { id: 'catamino-accessible', label: "Simple concept", traits: ['light', 'friendly'] },
      { id: 'catamino-scalable-diffic', label: "Many challenge levels", traits: ['thematic'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'pathfinder-acg', name: "Pathfinder Adventure Card Game", bggId: 133038, year: 2013,
    minPlayers: 1, maxPlayers: 4, minTime: 90, maxTime: 90,
    complexity: 2.7, bggRating: 7,
    traits: ['cooperative', 'campaign', 'deck-building', 'thematic', 'dice-rolling'],
    elements: [
      { id: 'pathfinder-acg-cooperative', label: "Defeat villains together", traits: ['cooperative'] },
      { id: 'pathfinder-acg-campaign', label: "Characters grow over adventures", traits: ['campaign'] },
      { id: 'pathfinder-acg-deckbuilding', label: "Improve your deck", traits: ['deck-building'] },
      { id: 'pathfinder-acg-thematic', label: "RPG in card form", traits: ['thematic'] },
      { id: 'pathfinder-acg-dice-rolling', label: "Skill checks", traits: ['dice-rolling'] }
    ],
    antiElements: [
      { id: 'pathfinder-acg-anti-fiddly', label: "Lots of setup", traits: ['analysis-paralysis'] },
      { id: 'pathfinder-acg-anti-too-random', label: "Dice and card luck", traits: ['too-random'] }
    ],
  },
  {
    id: 'wandering-galaxy', name: "Wandering Galaxy", bggId: 405618, year: 2024,
    minPlayers: 1, maxPlayers: 4, minTime: 60, maxTime: 90,
    complexity: 2.5, bggRating: 7.5,
    traits: ['engine-building', 'thematic', 'exciting', 'narrative'],
    elements: [
      { id: 'wandering-galaxy-engine-building', label: "Develop your spaceship", traits: ['engine-building'] },
      { id: 'wandering-galaxy-exploration', label: "Discover the galaxy", traits: ['thematic', 'exciting'] },
      { id: 'wandering-galaxy-thematic', label: "Space adventure", traits: ['thematic'] },
      { id: 'wandering-galaxy-narrative', label: "Events tell stories", traits: ['narrative'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'machi-koro', name: "Machi Koro", bggId: 143884, year: 2012,
    minPlayers: 2, maxPlayers: 4, minTime: 30, maxTime: 30,
    complexity: 1.5, bggRating: 6.6,
    traits: ['engine-building', 'dice-rolling', 'light', 'friendly'],
    elements: [
      { id: 'machi-koro-engine-building', label: "Build city for income", traits: ['engine-building'] },
      { id: 'machi-koro-dice-rolling', label: "Roll to activate buildings", traits: ['dice-rolling'] },
      { id: 'machi-koro-accessible', label: "Very simple", traits: ['light', 'friendly'] },
      { id: 'machi-koro-quick', label: "Fast games", traits: ['light'] }
    ],
    antiElements: [
      { id: 'machi-koro-anti-too-random', label: "Dice luck dominates", traits: ['too-random'] }
    ],
  },
  {
    id: 'paper-dungeons', name: "Paper Dungeons", bggId: 291786, year: 2021,
    minPlayers: 1, maxPlayers: 8, minTime: 30, maxTime: 30,
    complexity: 2.1, bggRating: 6.9,
    traits: ['thematic', 'grid-movement', 'exciting', 'light', 'friendly'],
    elements: [
      { id: 'paper-dungeons-roll-and-write', label: "Mark your dungeon sheet", traits: ['thematic'] },
      { id: 'paper-dungeons-dungeon-crawl', label: "Explore and fight", traits: ['thematic', 'grid-movement'] },
      { id: 'paper-dungeons-simultaneous', label: "All play at once", traits: ['exciting'] },
      { id: 'paper-dungeons-accessible', label: "Easy to teach", traits: ['light', 'friendly'] }
    ],
    antiElements: [
      { id: 'paper-dungeons-anti-too-random', label: "Dice luck", traits: ['too-random'] }
    ],
  },
  {
    id: 'dont-get-got', name: "Don", bggId: 262289, year: 2018,
    minPlayers: 2, maxPlayers: 8, minTime: 60, maxTime: 600,
    complexity: 1, bggRating: 6.7,
    traits: ['social', 'hilarious', 'creative', 'thematic'],
    elements: [
      { id: 'dont-get-got-social', label: "Secret missions among friends", traits: ['social'] },
      { id: 'dont-get-got-humorous', label: "Tricking friends is hilarious", traits: ['hilarious'] },
      { id: 'dont-get-got-unique', label: "Plays during other activities", traits: ['creative'] },
      { id: 'dont-get-got-party', label: "Great at gatherings", traits: ['thematic'] }
    ],
    antiElements: [
      { id: 'dont-get-got-anti-requires-g', label: "Needs right social setting", traits: ['too-random'] }
    ],
  },
  {
    id: 'flick-em-up-dead-of-winter', name: "Flick ", bggId: 219288, year: 2017,
    minPlayers: 2, maxPlayers: 10, minTime: 45, maxTime: 45,
    complexity: 2, bggRating: 6.8,
    traits: ['exciting', 'cooperative', 'thematic', 'creative'],
    elements: [
      { id: 'flick-em-up-dead-of-winter-dexterity', label: "Flick discs to fight zombies", traits: ['exciting'] },
      { id: 'flick-em-up-dead-of-winter-cooperative', label: "Survive together", traits: ['cooperative'] },
      { id: 'flick-em-up-dead-of-winter-thematic', label: "Zombie survival", traits: ['thematic'] },
      { id: 'flick-em-up-dead-of-winter-unique', label: "Flicking meets co-op", traits: ['creative'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'spinderella', name: "Spinderella", bggId: 168818, year: 2015,
    minPlayers: 2, maxPlayers: 4, minTime: 20, maxTime: 20,
    complexity: 1.2, bggRating: 6.7,
    traits: ['exciting', 'friendly', 'light', 'creative'],
    elements: [
      { id: 'spinderella-dexterity', label: "Spider descends from above", traits: ['exciting'] },
      { id: 'spinderella-family-friendly', label: "Kinderspiel winner", traits: ['friendly', 'light'] },
      { id: 'spinderella-unique', label: "3D spider mechanism", traits: ['creative'] },
      { id: 'spinderella-accessible', label: "Kids love it", traits: ['light', 'friendly'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'sonic-racing', name: "Sonic the Hedgehog: Battle Racers", bggId: 237528, year: 2019,
    minPlayers: 2, maxPlayers: 5, minTime: 45, maxTime: 45,
    complexity: 2, bggRating: 6.3,
    traits: ['thematic', 'deck-building'],
    elements: [
      { id: 'sonic-racing-racing', label: "Race through loops", traits: ['thematic'] },
      { id: 'sonic-racing-thematic', label: "Sonic video game feel", traits: ['thematic'] },
      { id: 'sonic-racing-deckbuilding', label: "Build move deck", traits: ['deck-building'] },
      { id: 'sonic-racing-nostalgic', label: "For Sonic fans", traits: ['thematic'] }
    ],
    antiElements: [
      { id: 'sonic-racing-anti-fiddly', label: "Track setup takes time", traits: ['analysis-paralysis'] }
    ],
  },
  {
    id: 'crash-octopus', name: "Crash Octopus", bggId: 330097, year: 2021,
    minPlayers: 2, maxPlayers: 4, minTime: 15, maxTime: 15,
    complexity: 1.1, bggRating: 6.9,
    traits: ['exciting', 'light', 'creative', 'friendly'],
    elements: [
      { id: 'crash-octopus-dexterity', label: "Flick tentacles to grab treasure", traits: ['exciting'] },
      { id: 'crash-octopus-quick', label: "Very fast", traits: ['light'] },
      { id: 'crash-octopus-unique', label: "Giant octopus mechanism", traits: ['creative'] },
      { id: 'crash-octopus-family-friendly', label: "All ages", traits: ['friendly', 'light'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'iguazu', name: "Iguazu", bggId: 260514, year: 2018,
    minPlayers: 2, maxPlayers: 4, minTime: 50, maxTime: 50,
    complexity: 1.9, bggRating: 6.7,
    traits: ['area-control', 'hand-management', 'beautiful', 'strategic'],
    elements: [
      { id: 'iguazu-area-control', label: "Place gems on waterfall", traits: ['area-control'] },
      { id: 'iguazu-hand-management', label: "Card play timing", traits: ['hand-management'] },
      { id: 'iguazu-beautiful', label: "Waterfall theme", traits: ['beautiful'] },
      { id: 'iguazu-strategic', label: "When to place matters", traits: ['strategic'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'fits', name: "FITS", bggId: 40393, year: 2009,
    minPlayers: 1, maxPlayers: 4, minTime: 30, maxTime: 30,
    complexity: 1.3, bggRating: 6.5,
    traits: ['puzzly', 'exciting', 'light', 'friendly'],
    elements: [
      { id: 'fits-puzzle-solving', label: "Tetris-like fitting", traits: ['puzzly'] },
      { id: 'fits-simultaneous', label: "All play at once", traits: ['exciting'] },
      { id: 'fits-accessible', label: "Everyone knows Tetris", traits: ['light', 'friendly'] },
      { id: 'fits-quick', label: "Fast rounds", traits: ['light'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'heroscape', name: "HeroScape", bggId: 4371, year: 2004,
    minPlayers: 2, maxPlayers: 4, minTime: 60, maxTime: 240,
    complexity: 2.4, bggRating: 7.4,
    traits: ['strategic', 'grid-movement', 'beautiful', 'thematic', 'dice-rolling'],
    elements: [
      { id: 'heroscape-tactical', label: "Grid-based miniature combat", traits: ['strategic', 'grid-movement'] },
      { id: 'heroscape-beautiful', label: "3D terrain you build yourself", traits: ['beautiful'] },
      { id: 'heroscape-thematic', label: "Heroes from all eras battle", traits: ['thematic'] },
      { id: 'heroscape-customizable', label: "Build any battlefield", traits: ['thematic'] },
      { id: 'heroscape-nostalgic', label: "Beloved cult classic", traits: ['thematic'] },
      { id: 'heroscape-dice-rolling', label: "Combat resolution", traits: ['dice-rolling'] }
    ],
    antiElements: [
      { id: 'heroscape-anti-out-of-pri', label: "Hard to find (until recent reprint)", traits: ['too-random'] },
      { id: 'heroscape-anti-setup-time', label: "Building terrain takes time", traits: ['too-random'] }
    ],
  },
  {
    id: 'heroquest', name: "HeroQuest", bggId: 699, year: 1989,
    minPlayers: 2, maxPlayers: 5, minTime: 90, maxTime: 90,
    complexity: 2, bggRating: 7,
    traits: ['thematic', 'grid-movement', 'cooperative'],
    elements: [
      { id: 'heroquest-dungeon-crawl', label: "Classic dungeon exploration", traits: ['thematic', 'grid-movement'] },
      { id: 'heroquest-nostalgic', label: "Gateway to hobby for many", traits: ['thematic'] },
      { id: 'heroquest-thematic', label: "Fantasy adventure", traits: ['thematic'] },
      { id: 'heroquest-cooperative', label: "Heroes vs Zargon", traits: ['cooperative'] },
      { id: 'heroquest-miniatures', label: "Great figures", traits: ['thematic'] }
    ],
    antiElements: [
      { id: 'heroquest-anti-dated', label: "Rules show their age", traits: ['too-random'] },
      { id: 'heroquest-anti-too-random', label: "Dice luck heavy", traits: ['too-random'] }
    ],
  },
  {
    id: 'dragon-strike', name: "Dragon Strike", bggId: 1149, year: 1993,
    minPlayers: 2, maxPlayers: 5, minTime: 60, maxTime: 60,
    complexity: 1.8, bggRating: 5.8,
    traits: ['thematic', 'grid-movement', 'light', 'friendly'],
    elements: [
      { id: 'dragon-strike-dungeon-crawl', label: "Simplified dungeon game", traits: ['thematic', 'grid-movement'] },
      { id: 'dragon-strike-nostalgic', label: "Famous VHS intro!", traits: ['thematic'] },
      { id: 'dragon-strike-accessible', label: "Entry-level dungeon crawl", traits: ['light', 'friendly'] },
      { id: 'dragon-strike-thematic', label: "Fantasy adventure", traits: ['thematic'] }
    ],
    antiElements: [
      { id: 'dragon-strike-anti-dated', label: "Very simple by modern standards", traits: ['too-random'] },
      { id: 'dragon-strike-anti-too-random', label: "Dice heavy", traits: ['too-random'] }
    ],
  },
  {
    id: 'pokemon-master-trainer', name: "Pokemon Master Trainer", bggId: 5538, year: 1999,
    minPlayers: 2, maxPlayers: 6, minTime: 60, maxTime: 90,
    complexity: 1.5, bggRating: 5.3,
    traits: ['thematic', 'dice-rolling', 'set-collection'],
    elements: [
      { id: 'pokemon-master-trainer-nostalgic', label: "Peak 90s Pokemon", traits: ['thematic'] },
      { id: 'pokemon-master-trainer-thematic', label: "Catch Pokemon, battle rivals", traits: ['thematic'] },
      { id: 'pokemon-master-trainer-dice-rolling', label: "Movement and battles", traits: ['dice-rolling'] },
      { id: 'pokemon-master-trainer-set-collection', label: "Gotta catch em all", traits: ['set-collection'] }
    ],
    antiElements: [
      { id: 'pokemon-master-trainer-anti-too-random', label: "Very luck-based", traits: ['too-random'] },
      { id: 'pokemon-master-trainer-anti-too-long', label: "Can drag", traits: ['too-long'] },
      { id: 'pokemon-master-trainer-anti-dated', label: "Better Pokemon games exist now", traits: ['too-random'] }
    ],
  },
  {
    id: 'not-alone', name: "Not Alone", bggId: 194879, year: 2016,
    minPlayers: 2, maxPlayers: 7, minTime: 30, maxTime: 45,
    complexity: 1.8, bggRating: 7,
    traits: ['hidden-roles', 'tense', 'variable-powers', 'bluffing', 'thematic'],
    elements: [
      { id: 'not-alone-hidden-movement', label: "Creature hunts survivors", traits: ['hidden-roles', 'tense'] },
      { id: 'not-alone-asymmetric', label: "One vs many", traits: ['variable-powers'] },
      { id: 'not-alone-bluffing', label: "Predict where prey will go", traits: ['bluffing'] },
      { id: 'not-alone-thematic', label: "Alien planet survival", traits: ['thematic'] },
      { id: 'not-alone-tense', label: "Cat and mouse tension", traits: ['tense'] }
    ],
    antiElements: [

    ],
  },
  {
    id: '13-dead-end-drive', name: "13 Dead End Drive", bggId: 1899, year: 1993,
    minPlayers: 2, maxPlayers: 4, minTime: 45, maxTime: 45,
    complexity: 1.4, bggRating: 5.6,
    traits: ['confrontational', 'mean-spirited', 'hilarious', 'thematic', 'bluffing', 'exciting'],
    elements: [
      { id: '13-dead-end-drive-take-that', label: "Trigger traps on opponents", traits: ['confrontational', 'mean-spirited'] },
      { id: '13-dead-end-drive-humorous', label: "Cartoon murder mystery", traits: ['hilarious'] },
      { id: '13-dead-end-drive-nostalgic', label: "90s classic", traits: ['thematic'] },
      { id: '13-dead-end-drive-bluffing', label: "Hidden identity", traits: ['bluffing'] },
      { id: '13-dead-end-drive-dexterity', label: "Physical trap mechanisms", traits: ['exciting'] }
    ],
    antiElements: [
      { id: '13-dead-end-drive-anti-too-random', label: "Card luck", traits: ['too-random'] },
      { id: '13-dead-end-drive-anti-dated', label: "Simple by modern standards", traits: ['too-random'] }
    ],
  },
  {
    id: 'game-of-life', name: "The Game of Life", bggId: 2921, year: 1960,
    minPlayers: 2, maxPlayers: 6, minTime: 60, maxTime: 60,
    complexity: 1.2, bggRating: 4.7,
    traits: ['thematic', 'light', 'friendly'],
    elements: [
      { id: 'game-of-life-nostalgic', label: "Childhood classic", traits: ['thematic'] },
      { id: 'game-of-life-accessible', label: "Everyone knows it", traits: ['light', 'friendly'] },
      { id: 'game-of-life-thematic', label: "Life simulation", traits: ['thematic'] }
    ],
    antiElements: [
      { id: 'game-of-life-anti-no-strateg', label: "Almost pure luck", traits: ['too-random'] },
      { id: 'game-of-life-anti-dated', label: "Very simple", traits: ['too-random'] }
    ],
  },
  {
    id: 'mouse-trap', name: "Mouse Trap", bggId: 2687, year: 1963,
    minPlayers: 2, maxPlayers: 4, minTime: 30, maxTime: 30,
    complexity: 1.1, bggRating: 4.3,
    traits: ['thematic', 'light', 'friendly'],
    elements: [
      { id: 'mouse-trap-nostalgic', label: "Iconic Rube Goldberg trap", traits: ['thematic'] },
      { id: 'mouse-trap-tactile', label: "Building the contraption", traits: ['thematic'] },
      { id: 'mouse-trap-accessible', label: "Kids love it", traits: ['light', 'friendly'] }
    ],
    antiElements: [
      { id: 'mouse-trap-anti-no-strateg', label: "Pure luck", traits: ['too-random'] }
    ],
  },
  {
    id: 'operation', name: "Operation", bggId: 3737, year: 1965,
    minPlayers: 1, maxPlayers: 6, minTime: 10, maxTime: 10,
    complexity: 1, bggRating: 4.6,
    traits: ['exciting', 'thematic', 'light', 'friendly', 'tense'],
    elements: [
      { id: 'operation-dexterity', label: "Steady hand required", traits: ['exciting'] },
      { id: 'operation-nostalgic', label: "Classic buzzer game", traits: ['thematic'] },
      { id: 'operation-accessible', label: "Everyone knows it", traits: ['light', 'friendly'] },
      { id: 'operation-tense', label: "Will you buzz?", traits: ['tense'] }
    ],
    antiElements: [
      { id: 'operation-anti-limited', label: "Not much game there", traits: ['too-random'] }
    ],
  },
  {
    id: 'monopoly', name: "Monopoly", bggId: 1406, year: 1933,
    minPlayers: 2, maxPlayers: 8, minTime: 60, maxTime: 180,
    complexity: 1.7, bggRating: 4.4,
    traits: ['thematic', 'trading', 'light', 'friendly'],
    elements: [
      { id: 'monopoly-nostalgic', label: "The classic", traits: ['thematic'] },
      { id: 'monopoly-trading', label: "Deal-making is the real game", traits: ['trading'] },
      { id: 'monopoly-accessible', label: "Everyone knows it", traits: ['light', 'friendly'] }
    ],
    antiElements: [
      { id: 'monopoly-anti-too-long', label: "Games drag on forever", traits: ['too-long'] },
      { id: 'monopoly-anti-too-random', label: "Dice and card luck", traits: ['too-random'] },
      { id: 'monopoly-anti-player-eli', label: "Bankrupt players watch", traits: ['player-elimination'] },
      { id: 'monopoly-anti-kingmaking', label: "Trades decide winner", traits: ['kingmaking'] }
    ],
  },
  {
    id: 'scrabble', name: "Scrabble", bggId: 320, year: 1948,
    minPlayers: 2, maxPlayers: 4, minTime: 90, maxTime: 90,
    complexity: 1.9, bggRating: 6.3,
    traits: ['thematic', 'strategic'],
    elements: [
      { id: 'scrabble-word-game', label: "Classic word building", traits: ['thematic'] },
      { id: 'scrabble-strategic', label: "Board position matters", traits: ['strategic'] },
      { id: 'scrabble-nostalgic', label: "Timeless classic", traits: ['thematic'] },
      { id: 'scrabble-educational', label: "Vocabulary building", traits: ['thematic'] }
    ],
    antiElements: [
      { id: 'scrabble-anti-too-random', label: "Tile draw luck", traits: ['too-random'] },
      { id: 'scrabble-anti-vocabulary', label: "Favors big vocabularies", traits: ['too-random'] }
    ],
  },
  {
    id: 'mastermind', name: "Mastermind", bggId: 2392, year: 1970,
    minPlayers: 2, maxPlayers: 2, minTime: 20, maxTime: 20,
    complexity: 1.8, bggRating: 5.8,
    traits: ['social-deduction', 'puzzly', 'elegant', 'thematic', 'light'],
    elements: [
      { id: 'mastermind-deduction', label: "Logic puzzle", traits: ['social-deduction', 'puzzly'] },
      { id: 'mastermind-elegant', label: "Simple, pure", traits: ['elegant'] },
      { id: 'mastermind-nostalgic', label: "Classic", traits: ['thematic'] },
      { id: 'mastermind-quick', label: "Fast games", traits: ['light'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'slide-quest', name: "Slide Quest", bggId: 279459, year: 2019,
    minPlayers: 1, maxPlayers: 4, minTime: 15, maxTime: 45,
    complexity: 1.2, bggRating: 6.9,
    traits: ['exciting', 'cooperative', 'creative', 'light', 'friendly'],
    elements: [
      { id: 'slide-quest-dexterity', label: "Tilt the board together", traits: ['exciting'] },
      { id: 'slide-quest-cooperative', label: "Work together to guide knight", traits: ['cooperative'] },
      { id: 'slide-quest-unique', label: "Labyrinth meets co-op", traits: ['creative'] },
      { id: 'slide-quest-accessible', label: "Anyone can play", traits: ['light', 'friendly'] },
      { id: 'slide-quest-family-friendly', label: "Great with kids", traits: ['friendly', 'light'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'creationary', name: "Creationary", bggId: 66276, year: 2009,
    minPlayers: 3, maxPlayers: 8, minTime: 30, maxTime: 30,
    complexity: 1.1, bggRating: 6,
    traits: ['creative', 'social', 'thematic', 'friendly', 'light'],
    elements: [
      { id: 'creationary-creative', label: "Build with LEGO for others to guess", traits: ['creative'] },
      { id: 'creationary-social', label: "Pictionary with bricks", traits: ['social'] },
      { id: 'creationary-tactile', label: "LEGO building", traits: ['thematic'] },
      { id: 'creationary-family-friendly', label: "All ages", traits: ['friendly', 'light'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'blokus-trigon', name: "Blokus Trigon", bggId: 21550, year: 2006,
    minPlayers: 2, maxPlayers: 4, minTime: 30, maxTime: 30,
    complexity: 1.9, bggRating: 7,
    traits: ['puzzly', 'elegant', 'strategic', 'light', 'friendly'],
    elements: [
      { id: 'blokus-trigon-abstract', label: "Triangle variant of Blokus", traits: ['puzzly', 'elegant'] },
      { id: 'blokus-trigon-strategic', label: "Blocking and expanding", traits: ['strategic'] },
      { id: 'blokus-trigon-elegant', label: "Simple rules", traits: ['elegant'] },
      { id: 'blokus-trigon-accessible', label: "Easy to learn", traits: ['light', 'friendly'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'uno-stacko', name: "UNO Stacko", bggId: 8137, year: 1994,
    minPlayers: 2, maxPlayers: 10, minTime: 30, maxTime: 30,
    complexity: 1, bggRating: 5.2,
    traits: ['exciting', 'light', 'friendly', 'tense'],
    elements: [
      { id: 'uno-stacko-dexterity', label: "Jenga meets UNO", traits: ['exciting'] },
      { id: 'uno-stacko-accessible', label: "Anyone can play", traits: ['light', 'friendly'] },
      { id: 'uno-stacko-tense', label: "Will it fall?", traits: ['tense'] }
    ],
    antiElements: [
      { id: 'uno-stacko-anti-too-random', label: "Luck of the draw/pull", traits: ['too-random'] }
    ],
  },
  {
    id: 'woolly-bully', name: "Woolly Bully", bggId: 192047, year: 2015,
    minPlayers: 2, maxPlayers: 6, minTime: 15, maxTime: 15,
    complexity: 1, bggRating: 5.9,
    traits: ['exciting', 'friendly', 'light', 'thematic'],
    elements: [
      { id: 'woolly-bully-dexterity', label: "Stack sheep on wolf", traits: ['exciting'] },
      { id: 'woolly-bully-family-friendly', label: "Kids love it", traits: ['friendly', 'light'] },
      { id: 'woolly-bully-quick', label: "Fast games", traits: ['light'] },
      { id: 'woolly-bully-tactile', label: "Cute wooden pieces", traits: ['thematic'] }
    ],
    antiElements: [

    ],
  },
  {
    id: 'mad-magazine-game', name: "The MAD Magazine Game", bggId: 3498, year: 1979,
    minPlayers: 2, maxPlayers: 4, minTime: 60, maxTime: 60,
    complexity: 1.2, bggRating: 5.4,
    traits: ['hilarious', 'thematic', 'creative', 'too-random'],
    elements: [
      { id: 'mad-magazine-game-humorous', label: "Goal is to LOSE all money", traits: ['hilarious'] },
      { id: 'mad-magazine-game-nostalgic', label: "MAD Magazine humor", traits: ['thematic'] },
      { id: 'mad-magazine-game-unique', label: "Reverse Monopoly concept", traits: ['creative'] },
      { id: 'mad-magazine-game-chaotic', label: "Wacky rules", traits: ['too-random'] }
    ],
    antiElements: [
      { id: 'mad-magazine-game-anti-too-random', label: "Pure chaos", traits: ['too-random'] }
    ],
  },
  {
    id: 'shaky-shark', name: "Shaky Shark", bggId: 232952, year: 2017,
    minPlayers: 2, maxPlayers: 4, minTime: 15, maxTime: 15,
    complexity: 1, bggRating: 5.3,
    traits: ['exciting', 'friendly', 'light', 'tense'],
    elements: [
      { id: 'shaky-shark-dexterity', label: "Remove fish without waking shark", traits: ['exciting'] },
      { id: 'shaky-shark-family-friendly', label: "Kids game", traits: ['friendly', 'light'] },
      { id: 'shaky-shark-tense', label: "Will it bite?", traits: ['tense'] }
    ],
    antiElements: [
      { id: 'shaky-shark-anti-too-light', label: "Very simple", traits: ['too-random'] }
    ],
  }
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

  // Footer component used on every screen
  const Footer = () => (
    <div className="mt-8 pt-6 border-t border-white/10 text-center">
      <p className="text-white/60 text-sm md:text-base mb-2">
        Want to add a game to the list?{' '}
        <a
          href="https://wa.me/61423220241?text=Hi!%20I'd%20like%20to%20suggest%20a%20board%20game%20for%20the%20recommender"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-gold hover:text-brand-gold-warm transition-colors underline font-medium">
          Click here to send me a message
        </a>
        {' '}and I'll add it
      </p>
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
          <Footer />
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
                    <span className="text-xs text-yellow-400">⭐ {game.bggRating}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <Footer />
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
          <Footer />
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
          <Footer />
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
                        <span className="text-xs text-yellow-400">⭐ {game.bggRating}</span>
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
          <Footer />
        </div>
      </div>
    );
  }

  return null;
}
