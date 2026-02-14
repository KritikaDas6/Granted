const DUMMY_MATCHES = [
  {
    id: 'm1',
    professor: {
      name: 'Prof. Jane Chen',
      lab: 'ML Systems Lab',
      institution: 'University XYZ',
      avatar: null
    },
    score: 92,
    maxScore: 100,
    reasons: [
      'Strong overlap in ML and distributed systems',
      'Your Python/PyTorch skills match lab stack',
      'Publication in related venue'
    ],
    tags: ['Machine Learning', 'Distributed Systems', 'Python'],
    researchFocus: 'Large-scale ML systems, model parallelism, efficient training.',
    openPositions: 2
  },
  {
    id: 'm2',
    professor: {
      name: 'Dr. Alex Park',
      lab: 'NLP & Dialogue Lab',
      institution: 'University XYZ',
      avatar: null
    },
    score: 88,
    maxScore: 100,
    reasons: [
      'Your NLP interest aligns with lab focus',
      'Python and PyTorch are core to their projects',
      'Publication in language modeling'
    ],
    tags: ['NLP', 'Dialogue', 'Python', 'PyTorch'],
    researchFocus: 'Conversational AI, language modeling, and multi-turn dialogue.',
    openPositions: 1
  },
  {
    id: 'm3',
    professor: {
      name: 'Prof. Sarah Kim',
      lab: 'HCI & Accessibility Lab',
      institution: 'University XYZ',
      avatar: null
    },
    score: 76,
    maxScore: 100,
    reasons: [
      'Interest in applied ML could fit accessibility projects',
      'Skills transfer to prototyping tools'
    ],
    tags: ['HCI', 'Accessibility', 'User Research'],
    researchFocus: 'Human-computer interaction, assistive technology, inclusive design.',
    openPositions: 2
  },
  {
    id: 'm4',
    professor: {
      name: 'Prof. Michael Torres',
      lab: 'Systems & Networks Lab',
      institution: 'University XYZ',
      avatar: null
    },
    score: 85,
    maxScore: 100,
    reasons: [
      'Systems interest matches lab focus',
      'C++ and Python align with their stack'
    ],
    tags: ['Distributed Systems', 'Networks', 'C++', 'Python'],
    researchFocus: 'Distributed systems, cloud computing, and network protocols.',
    openPositions: 1
  },
  {
    id: 'm5',
    professor: {
      name: 'Prof. Emily Liu',
      lab: 'Computer Vision Lab',
      institution: 'University XYZ',
      avatar: null
    },
    score: 82,
    maxScore: 100,
    reasons: [
      'ML and PyTorch skills relevant for vision tasks',
      'Strong technical foundation'
    ],
    tags: ['Computer Vision', 'Machine Learning', 'PyTorch'],
    researchFocus: 'Object detection, 3D vision, and multimodal learning.',
    openPositions: 2
  }
];

function getDummyMatches() {
  return [...DUMMY_MATCHES];
}
