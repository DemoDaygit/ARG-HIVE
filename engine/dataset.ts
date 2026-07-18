import { KnowledgeEdge, KnowledgeNode, SemanticField } from './types';

/**
 * The ARG H.I.V.E. semantic field.
 *
 * Three layers share one graph:
 *  - agents (synthesizer / proposers / critics / validators) — the live swarm pipeline
 *  - tasks — external work entering the swarm
 *  - concepts — the learnable knowledge layer, partitioned into domains and
 *    connected by requires/extends/relates edges that the learning engine walks.
 */

const NODES: KnowledgeNode[] = [
  // ── Agents ────────────────────────────────────────────────────────────────
  {
    id: 'syn', kind: 'synthesizer', difficulty: 4,
    label: { en: 'Synthesizer Core', ru: 'Ядро Синтезатора' },
    desc: {
      en: 'Aggregates filtered hypotheses (DeepSeek-V3 / Llama-70B) into the final response.',
      ru: 'Агрегирует отфильтрованные гипотезы (DeepSeek-V3 / Llama-70B) в финальный ответ.',
    },
    tags: ['agent', 'synthesis', 'aggregation', 'moa'],
  },
  {
    id: 'p1', kind: 'proposer', difficulty: 2,
    label: { en: 'Proposer · Mistral-7B', ru: 'Генератор · Mistral-7B' },
    desc: {
      en: 'Lightweight proposer specialised in logical reasoning.',
      ru: 'Лёгкая модель-генератор, специализация — логические рассуждения.',
    },
    tags: ['agent', 'proposer', 'logic', 'mistral'],
  },
  {
    id: 'p2', kind: 'proposer', difficulty: 2,
    label: { en: 'Proposer · Llama-3-8B', ru: 'Генератор · Llama-3-8B' },
    desc: {
      en: 'Generalist proposer for natural-language hypotheses.',
      ru: 'Универсальный генератор гипотез на естественном языке.',
    },
    tags: ['agent', 'proposer', 'nlp', 'llama'],
  },
  {
    id: 'p3', kind: 'proposer', difficulty: 2,
    label: { en: 'Proposer · Qwen-Coder', ru: 'Генератор · Qwen-Coder' },
    desc: {
      en: 'Code-oriented proposer (Qwen-Coder family).',
      ru: 'Кодовый генератор (семейство Qwen-Coder).',
    },
    tags: ['agent', 'proposer', 'code', 'qwen'],
  },
  {
    id: 'c1', kind: 'critic', difficulty: 3,
    label: { en: 'Adversarial Critic α', ru: 'Критик α (Adversarial)' },
    desc: {
      en: 'Adversarial validator searching for hallucinations.',
      ru: 'Adversarial-валидатор, ищет галлюцинации.',
    },
    tags: ['agent', 'critic', 'hallucination', 'adversarial'],
  },
  {
    id: 'c2', kind: 'critic', difficulty: 3,
    label: { en: 'Adversarial Critic β', ru: 'Критик β (Adversarial)' },
    desc: {
      en: 'Second-line critic, factual consistency checks.',
      ru: 'Критик второго эшелона, проверка фактологии.',
    },
    tags: ['agent', 'critic', 'facts', 'adversarial'],
  },
  {
    id: 'v1', kind: 'validator', difficulty: 4,
    label: { en: 'ZK-Proof Validator', ru: 'ZK-Proof Валидатор' },
    desc: {
      en: 'Generates zk-SNARK proofs that the model executed honestly.',
      ru: 'Генерирует zk-SNARK-доказательства честного исполнения модели.',
    },
    tags: ['agent', 'validator', 'zk', 'proof'],
  },
  {
    id: 'v2', kind: 'validator', difficulty: 4,
    label: { en: 'Proof-of-Learning Node', ru: 'Proof-of-Learning Узел' },
    desc: {
      en: 'Confirms Proof-of-Learning and releases on-chain payment.',
      ru: 'Подтверждает Proof-of-Learning, разблокирует ончейн-оплату.',
    },
    tags: ['agent', 'validator', 'proof-of-learning', 'onchain'],
  },

  // ── Tasks ─────────────────────────────────────────────────────────────────
  {
    id: 't1', kind: 'task', difficulty: 1,
    label: { en: 'Task · Inference Query', ru: 'Задача · Inference-Запрос' },
    desc: {
      en: 'Live inference request from an external client.',
      ru: 'Live inference-запрос от внешнего клиента.',
    },
    tags: ['task', 'inference'],
  },
  {
    id: 't2', kind: 'task', difficulty: 1,
    label: { en: 'Task · Code Review', ru: 'Задача · Ревью Кода' },
    desc: {
      en: 'On-chain code review task.',
      ru: 'Задача ончейн-ревью кода.',
    },
    tags: ['task', 'code'],
  },
  {
    id: 't3', kind: 'task', difficulty: 1,
    label: { en: 'Task · Risk Analysis', ru: 'Задача · Анализ Рисков' },
    desc: {
      en: 'Risk assessment for an enterprise pilot.',
      ru: 'Оценка рисков для корпоративного пилота.',
    },
    tags: ['task', 'risk', 'enterprise'],
  },

  // ── Concepts · Foundations ────────────────────────────────────────────────
  {
    id: 'k_llm', kind: 'concept', domain: 'foundations', difficulty: 1,
    label: { en: 'Large Language Models', ru: 'Большие языковые модели' },
    desc: {
      en: 'Transformer-based models that predict tokens — the raw cognitive substrate every swarm agent is built on.',
      ru: 'Трансформерные модели, предсказывающие токены, — когнитивный субстрат, на котором построен каждый агент роя.',
    },
    tags: ['llm', 'transformer', 'foundation', 'model'],
  },
  {
    id: 'k_embed', kind: 'concept', domain: 'foundations', difficulty: 1,
    label: { en: 'Vector Embeddings', ru: 'Векторные эмбеддинги' },
    desc: {
      en: 'Meaning compressed into geometry: texts, code and images mapped to points in a shared vector space.',
      ru: 'Смысл, сжатый в геометрию: тексты, код и изображения как точки общего векторного пространства.',
    },
    tags: ['embedding', 'vector', 'semantics', 'foundation'],
  },
  {
    id: 'k_prompt', kind: 'concept', domain: 'foundations', difficulty: 2,
    label: { en: 'Context Engineering', ru: 'Инженерия контекста' },
    desc: {
      en: 'Structuring instructions, memory and retrieved facts inside the context window to steer model behaviour.',
      ru: 'Структурирование инструкций, памяти и найденных фактов в контекстном окне для управления поведением модели.',
    },
    tags: ['prompt', 'context', 'instruction', 'foundation'],
  },
  {
    id: 'k_infer', kind: 'concept', domain: 'foundations', difficulty: 2,
    label: { en: 'Inference Optimization', ru: 'Оптимизация инференса' },
    desc: {
      en: 'Quantization, KV-cache reuse and speculative decoding — squeezing frontier quality out of commodity GPUs.',
      ru: 'Квантизация, переиспользование KV-кеша и спекулятивное декодирование — фронтирное качество на обычных GPU.',
    },
    tags: ['inference', 'quantization', 'kv-cache', 'gpu', 'foundation'],
  },

  // ── Concepts · Swarm Intelligence ────────────────────────────────────────
  {
    id: 'k_moa', kind: 'concept', domain: 'swarm', difficulty: 2,
    label: { en: 'Mixture of Agents', ru: 'Mixture of Agents' },
    desc: {
      en: 'Heterogeneous model families cooperating in layers — diversity of blind spots beats any single giant model.',
      ru: 'Гетерогенные семейства моделей, работающие слоями: разнообразие слепых зон сильнее одной гигантской модели.',
    },
    tags: ['moa', 'swarm', 'ensemble', 'heterogeneous'],
  },
  {
    id: 'k_adv', kind: 'concept', domain: 'swarm', difficulty: 3,
    label: { en: 'Adversarial Critique', ru: 'Adversarial-критика' },
    desc: {
      en: 'Dedicated critic agents actively try to break each hypothesis, filtering hallucinations before synthesis.',
      ru: 'Агенты-критики целенаправленно «ломают» каждую гипотезу, отфильтровывая галлюцинации до синтеза.',
    },
    tags: ['adversarial', 'critique', 'hallucination', 'swarm'],
  },
  {
    id: 'k_synth', kind: 'concept', domain: 'swarm', difficulty: 3,
    label: { en: 'Hypothesis Synthesis', ru: 'Синтез гипотез' },
    desc: {
      en: 'A large aggregator model merges the surviving hypotheses into one answer stronger than any input.',
      ru: 'Крупная модель-агрегатор сливает выжившие гипотезы в ответ, который сильнее любого из исходных.',
    },
    tags: ['synthesis', 'aggregation', 'swarm'],
  },
  {
    id: 'k_route', kind: 'concept', domain: 'swarm', difficulty: 3,
    label: { en: 'Dynamic Routing', ru: 'Динамическая маршрутизация' },
    desc: {
      en: 'Complexity-aware dispatch: trivial queries stay on edge devices, hard ones escalate to the H100 cluster.',
      ru: 'Диспетчеризация по сложности: простые запросы остаются на edge-устройствах, сложные уходят на кластер H100.',
    },
    tags: ['routing', 'dispatch', 'edge', 'swarm'],
  },
  {
    id: 'k_ciap', kind: 'concept', domain: 'swarm', difficulty: 4,
    label: { en: 'CIAP Semantic Protocol', ru: 'Семантический протокол CIAP' },
    desc: {
      en: 'Agents exchange compressed semantic vectors instead of text — 100:1 compression keeps reasoning alive over satellite links.',
      ru: 'Агенты обмениваются сжатыми семантическими векторами вместо текста — сжатие 100:1 сохраняет рассуждения даже по спутниковым каналам.',
    },
    tags: ['ciap', 'protocol', 'compression', 'vector', 'swarm'],
  },
  {
    id: 'k_vdb', kind: 'concept', domain: 'swarm', difficulty: 2,
    label: { en: 'Vector DB Sharding', ru: 'Шардинг векторных БД' },
    desc: {
      en: 'The swarm’s long-term memory: domain-sharded vector indexes replicated across untrusted nodes.',
      ru: 'Долговременная память роя: векторные индексы, шардированные по доменам и реплицированные по недоверенным узлам.',
    },
    tags: ['vector-db', 'sharding', 'memory', 'swarm'],
  },
  {
    id: 'k_rag', kind: 'concept', domain: 'swarm', difficulty: 3,
    label: { en: 'Retrieval-Augmented Generation', ru: 'RAG-генерация' },
    desc: {
      en: 'Agents ground answers in retrieved evidence instead of parametric memory, cutting hallucination rates.',
      ru: 'Агенты опираются на найденные свидетельства вместо параметрической памяти, снижая уровень галлюцинаций.',
    },
    tags: ['rag', 'retrieval', 'grounding', 'swarm'],
  },
  {
    id: 'k_mem', kind: 'concept', domain: 'swarm', difficulty: 4,
    label: { en: 'Distributed Swarm Memory', ru: 'Распределённая память роя' },
    desc: {
      en: 'Shared short-term context between agents: a hot cache of embeddings every layer reads and writes.',
      ru: 'Общий краткосрочный контекст агентов: горячий кеш эмбеддингов, который читает и пишет каждый слой.',
    },
    tags: ['memory', 'shared-context', 'cache', 'swarm'],
  },
  {
    id: 'k_selfcorr', kind: 'concept', domain: 'swarm', difficulty: 4,
    label: { en: 'Self-Correction Loops', ru: 'Циклы самокоррекции' },
    desc: {
      en: 'When synthesis confidence drops below 0.8 the pipeline recursively re-enters the proposer layer.',
      ru: 'Если уверенность синтеза падает ниже 0.8, конвейер рекурсивно возвращается на слой генераторов.',
    },
    tags: ['self-correction', 'confidence', 'loop', 'swarm'],
  },

  // ── Concepts · Protocol & Trust ──────────────────────────────────────────
  {
    id: 'k_zk', kind: 'concept', domain: 'protocol', difficulty: 4,
    label: { en: 'zk-SNARK Proofs', ru: 'Доказательства zk-SNARK' },
    desc: {
      en: 'Succinct cryptographic proofs that a node ran the model it claims — verification without re-execution.',
      ru: 'Компактные криптодоказательства, что узел выполнил заявленную модель, — верификация без повторного счёта.',
    },
    tags: ['zk', 'snark', 'cryptography', 'trust'],
  },
  {
    id: 'k_pol', kind: 'concept', domain: 'protocol', difficulty: 5,
    label: { en: 'Proof-of-Learning', ru: 'Proof-of-Learning' },
    desc: {
      en: 'Consensus over useful cognitive work: rewards flow only for verifiably correct inference and training.',
      ru: 'Консенсус вокруг полезной когнитивной работы: вознаграждение — только за проверяемо корректный инференс и обучение.',
    },
    tags: ['proof-of-learning', 'consensus', 'reward', 'trust'],
  },
  {
    id: 'k_tee', kind: 'concept', domain: 'protocol', difficulty: 3,
    label: { en: 'TEE Enclaves', ru: 'TEE-анклавы' },
    desc: {
      en: 'Hardware-isolated execution (SGX/SEV): sensitive data is processed where even the node operator cannot look.',
      ru: 'Аппаратно изолированное исполнение (SGX/SEV): чувствительные данные обрабатываются там, куда не заглянет даже оператор узла.',
    },
    tags: ['tee', 'enclave', 'privacy', 'hardware', 'trust'],
  },
  {
    id: 'k_bft', kind: 'concept', domain: 'protocol', difficulty: 4,
    label: { en: 'Byzantine Consensus', ru: 'Византийский консенсус' },
    desc: {
      en: 'Agreement among mutually distrusting nodes even when a third of them lie or fail.',
      ru: 'Согласие между взаимно недоверяющими узлами, даже когда треть из них лжёт или отказывает.',
    },
    tags: ['bft', 'consensus', 'fault-tolerance', 'trust'],
  },
  {
    id: 'k_rep', kind: 'concept', domain: 'protocol', difficulty: 3,
    label: { en: 'Reputation Systems', ru: 'Репутационные системы' },
    desc: {
      en: 'On-chain track record for every node: stake-weighted reliability scores gate access to premium tasks.',
      ru: 'Ончейн-репутация каждого узла: надёжность, взвешенная стейком, открывает доступ к премиальным задачам.',
    },
    tags: ['reputation', 'stake', 'onchain', 'trust'],
  },

  // ── Concepts · Economics ─────────────────────────────────────────────────
  {
    id: 'k_depin', kind: 'concept', domain: 'economics', difficulty: 2,
    label: { en: 'DePIN Economics', ru: 'Экономика DePIN' },
    desc: {
      en: 'Decentralized physical infrastructure: idle global GPUs become a permissionless compute commons.',
      ru: 'Децентрализованная физическая инфраструктура: простаивающие GPU мира превращаются в открытый вычислительный ресурс.',
    },
    tags: ['depin', 'infrastructure', 'gpu', 'economics'],
  },
  {
    id: 'k_tok', kind: 'concept', domain: 'economics', difficulty: 3,
    label: { en: 'Token Incentives', ru: 'Токен-стимулы' },
    desc: {
      en: 'The utility token loop: clients burn for inference, nodes earn for verified work, stakers secure the net.',
      ru: 'Цикл utility-токена: клиенты платят за инференс, узлы зарабатывают за проверенную работу, стейкеры защищают сеть.',
    },
    tags: ['token', 'incentive', 'staking', 'economics'],
  },
  {
    id: 'k_spot', kind: 'concept', domain: 'economics', difficulty: 3,
    label: { en: 'Compute Spot Market', ru: 'Спот-рынок вычислений' },
    desc: {
      en: 'Real-time auction of GPU-seconds: price discovery replaces cloud margins, cutting OpEx up to 80%.',
      ru: 'Аукцион GPU-секунд в реальном времени: рыночная цена вместо облачной маржи — до 80% экономии OpEx.',
    },
    tags: ['spot-market', 'auction', 'pricing', 'economics'],
  },

  // ── Concepts · Learning Layer (how the system teaches its users) ─────────
  {
    id: 'k_mastery', kind: 'concept', domain: 'learning', difficulty: 1,
    label: { en: 'Mastery Learning', ru: 'Обучение до мастерства' },
    desc: {
      en: 'Progress is measured per concept, not per course: you advance when a node is truly internalised.',
      ru: 'Прогресс измеряется по концептам, а не по курсам: движение вперёд — только когда узел действительно усвоен.',
    },
    tags: ['mastery', 'pedagogy', 'learning'],
  },
  {
    id: 'k_srs', kind: 'concept', domain: 'learning', difficulty: 2,
    label: { en: 'Spaced Repetition', ru: 'Интервальные повторения' },
    desc: {
      en: 'Memory decays on a curve — reviews scheduled at expanding intervals lock knowledge into long-term memory.',
      ru: 'Память угасает по кривой — повторения с растущими интервалами закрепляют знание в долговременной памяти.',
    },
    tags: ['srs', 'spaced-repetition', 'memory', 'learning'],
  },
  {
    id: 'k_path', kind: 'concept', domain: 'learning', difficulty: 2,
    label: { en: 'Adaptive Learning Paths', ru: 'Адаптивные траектории' },
    desc: {
      en: 'The graph itself is the curriculum: prerequisite chains are resolved into a personal shortest path to any goal.',
      ru: 'Сам граф и есть учебный план: цепочки пререквизитов разворачиваются в личный кратчайший путь к любой цели.',
    },
    tags: ['path', 'curriculum', 'adaptive', 'learning'],
  },
  {
    id: 'k_xp', kind: 'concept', domain: 'learning', difficulty: 1,
    label: { en: 'Progress Gamification', ru: 'Геймификация прогресса' },
    desc: {
      en: 'XP, levels and streaks convert the effort of learning into a visible, compounding reward loop.',
      ru: 'XP, уровни и стрики превращают усилие обучения в видимый, накапливающийся цикл вознаграждения.',
    },
    tags: ['xp', 'gamification', 'streak', 'learning'],
  },
];

const EDGES: KnowledgeEdge[] = [
  // Pipeline flow: tasks → proposers → critics → synthesizer → validators
  { source: 't1', target: 'p1', relation: 'feeds', weight: 0.8 },
  { source: 't1', target: 'p2', relation: 'feeds', weight: 0.8 },
  { source: 't2', target: 'p2', relation: 'feeds', weight: 0.8 },
  { source: 't2', target: 'p3', relation: 'feeds', weight: 0.9 },
  { source: 't3', target: 'p1', relation: 'feeds', weight: 0.8 },
  { source: 't3', target: 'p3', relation: 'feeds', weight: 0.7 },
  { source: 'p1', target: 'c1', relation: 'feeds', weight: 0.9 },
  { source: 'p2', target: 'c1', relation: 'feeds', weight: 0.9 },
  { source: 'p3', target: 'c2', relation: 'feeds', weight: 0.9 },
  { source: 'p1', target: 'c2', relation: 'feeds', weight: 0.7 },
  { source: 'p2', target: 'c2', relation: 'feeds', weight: 0.7 },
  { source: 'c1', target: 'syn', relation: 'feeds', weight: 1 },
  { source: 'c2', target: 'syn', relation: 'feeds', weight: 1 },
  { source: 'syn', target: 'v1', relation: 'feeds', weight: 1 },
  { source: 'syn', target: 'v2', relation: 'feeds', weight: 1 },

  // Concepts grounding agents
  { source: 'k_prompt', target: 'p1', relation: 'grounds', weight: 0.7 },
  { source: 'k_embed', target: 'p2', relation: 'grounds', weight: 0.7 },
  { source: 'k_infer', target: 'p3', relation: 'grounds', weight: 0.7 },
  { source: 'k_adv', target: 'c1', relation: 'grounds', weight: 0.9 },
  { source: 'k_adv', target: 'c2', relation: 'grounds', weight: 0.9 },
  { source: 'k_selfcorr', target: 'c2', relation: 'grounds', weight: 0.6 },
  { source: 'k_synth', target: 'syn', relation: 'grounds', weight: 0.9 },
  { source: 'k_rag', target: 'syn', relation: 'grounds', weight: 0.7 },
  { source: 'k_mem', target: 'syn', relation: 'grounds', weight: 0.7 },
  { source: 'k_ciap', target: 'syn', relation: 'grounds', weight: 0.6 },
  { source: 'k_route', target: 'syn', relation: 'grounds', weight: 0.5 },
  { source: 'k_zk', target: 'v1', relation: 'grounds', weight: 0.9 },
  { source: 'k_pol', target: 'v2', relation: 'grounds', weight: 0.9 },

  // Prerequisite chains (source requires target)
  { source: 'k_moa', target: 'k_llm', relation: 'requires', weight: 1 },
  { source: 'k_adv', target: 'k_moa', relation: 'requires', weight: 1 },
  { source: 'k_synth', target: 'k_moa', relation: 'requires', weight: 1 },
  { source: 'k_route', target: 'k_moa', relation: 'requires', weight: 0.8 },
  { source: 'k_ciap', target: 'k_embed', relation: 'requires', weight: 1 },
  { source: 'k_vdb', target: 'k_embed', relation: 'requires', weight: 1 },
  { source: 'k_rag', target: 'k_vdb', relation: 'requires', weight: 1 },
  { source: 'k_rag', target: 'k_llm', relation: 'requires', weight: 0.8 },
  { source: 'k_mem', target: 'k_vdb', relation: 'requires', weight: 0.9 },
  { source: 'k_selfcorr', target: 'k_adv', relation: 'requires', weight: 1 },
  { source: 'k_pol', target: 'k_zk', relation: 'requires', weight: 1 },
  { source: 'k_rep', target: 'k_bft', relation: 'requires', weight: 0.9 },
  { source: 'k_tok', target: 'k_depin', relation: 'requires', weight: 1 },
  { source: 'k_path', target: 'k_mastery', relation: 'requires', weight: 1 },

  // Specialisations
  { source: 'k_prompt', target: 'k_llm', relation: 'extends', weight: 0.8 },
  { source: 'k_infer', target: 'k_llm', relation: 'extends', weight: 0.8 },
  { source: 'k_mem', target: 'k_rag', relation: 'extends', weight: 0.7 },
  { source: 'k_spot', target: 'k_depin', relation: 'extends', weight: 0.8 },
  { source: 'k_srs', target: 'k_mastery', relation: 'extends', weight: 0.9 },

  // Associative links
  { source: 'k_embed', target: 'k_llm', relation: 'relates', weight: 0.6 },
  { source: 'k_ciap', target: 'k_route', relation: 'relates', weight: 0.5 },
  { source: 'k_tee', target: 'k_zk', relation: 'relates', weight: 0.6 },
  { source: 'k_rep', target: 'k_tok', relation: 'relates', weight: 0.6 },
  { source: 'k_bft', target: 'k_pol', relation: 'relates', weight: 0.6 },
  { source: 'k_rag', target: 'k_prompt', relation: 'relates', weight: 0.5 },
  { source: 'k_path', target: 'k_srs', relation: 'relates', weight: 0.6 },
  { source: 'k_path', target: 'k_route', relation: 'relates', weight: 0.4 },
  { source: 'k_xp', target: 'k_mastery', relation: 'relates', weight: 0.6 },
  { source: 'k_xp', target: 'k_tok', relation: 'relates', weight: 0.5 },
];

export const SEMANTIC_FIELD: SemanticField = { nodes: NODES, edges: EDGES };
