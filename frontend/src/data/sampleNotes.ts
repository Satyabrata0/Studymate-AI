import { SampleNote } from "../types";

export const SAMPLE_NOTES: SampleNote[] = [
  {
    title: "Photosynthesis & Bioenergetics",
    category: "Biology",
    content: `Photosynthesis is the metabolic process by which photoautotrophic organisms (such as green plants, algae, and cyanobacteria) convert light energy into chemical energy stored in glucose molecules.

The overall chemical equation for photosynthesis is:
6CO2 + 6H2O + Light Energy -> C6H12O6 + 6O2

Photosynthesis occurs inside specialized organelles called chloroplasts and consists of two main stages:
1. Light-Dependent Reactions:
   - Location: Thylakoid membranes inside the chloroplast.
   - Requirements: Sunlight and Water (H2O).
   - Mechanism: Chlorophyll pigments absorb photons, exciting electrons in Photosystem II and Photosystem I. Water molecules undergo photolysis, splitting into oxygen gas (released as a byproduct), protons, and electrons.
   - Output: ATP, NADPH, and Oxygen (O2).

2. Light-Independent Reactions (Calvin Cycle):
   - Location: Stroma (fluid inside chloroplast).
   - Requirements: Carbon Dioxide (CO2), ATP, and NADPH.
   - Mechanism: The enzyme RuBisCO catalyzes carbon fixation, attaching CO2 to Ribulose 1,5-bisphosphate (RuBP). Through reduction reactions powered by ATP and NADPH, 3-PGA is converted into G3P (Glyceraldehyde 3-phosphate), which synthesizes glucose.
   - Output: Glucose (C6H12O6), ADP, and NADP+.

Factors affecting photosynthetic rate include light intensity, carbon dioxide concentration, temperature, and availability of water.`,
  },
  {
    title: "Quantum Physics & Wave-Particle Duality",
    category: "Physics",
    content: `Quantum Mechanics is the branch of physics describing the behavior of energy and matter at atomic and subatomic scales, where classical Newtonian physics no longer applies.

Key Principles:
1. Wave-Particle Duality:
   - Light and matter exhibit both wave-like and particle-like properties.
   - Photons display wave behavior (diffraction, interference) while carrying discrete packets of energy E = h * f (where h is Planck's constant and f is frequency).
   - Louis de Broglie hypothesized that matter particles (e.g., electrons) have a wavelength lambda = h / p (where p is momentum).

2. Heisenberg Uncertainty Principle:
   - Formulated by Werner Heisenberg in 1927.
   - States that it is fundamentally impossible to simultaneously measure both the exact position (x) and momentum (p) of a particle with absolute precision: Delta_x * Delta_p >= hbar / 2.

3. Quantum Superposition & Quantum Entanglement:
   - Superposition: A quantum system remains in a linear combination of all possible physical states until a measurement is conducted (e.g., Schrödinger's Cat thought experiment).
   - Entanglement: Quantum state of two or more particles becomes intertwined such that measuring one instantaneously determines the state of another, regardless of physical distance (Einstein called this 'spooky action at a distance').

Applications:
Quantum Computing, Lasers, Semiconductors, MRI machines, and Quantum Cryptography.`,
  },
  {
    title: "Data Structures: Binary Search Trees & Hash Tables",
    category: "Computer Science",
    content: `Data structures organize data in computer memory for efficient storage, retrieval, and modification.

1. Binary Search Tree (BST):
   - A hierarchical tree data structure where each node has at most two children (left and right).
   - BST Property: For any node N, all keys in N's left subtree are strictly smaller than N's key, and all keys in N's right subtree are strictly greater.
   - Time Complexities:
     * Search, Insertion, Deletion: Average O(log N), Worst-case O(N) if the tree becomes unbalanced/skewed into a linked list.
     * Balanced Variants: AVL Trees and Red-Black Trees maintain balance to guarantee O(log N) operations.
   - Traversals: In-Order Traversal (Left, Root, Right) yields elements in sorted ascending order.

2. Hash Table (Hash Map):
   - A key-value storage structure that uses a Hash Function to map keys to numerical array indices (buckets).
   - Time Complexities: Average O(1) time for search, insert, and delete. Worst-case O(N) when severe hash collisions occur.
   - Collision Resolution Techniques:
     * Chaining: Each array bucket holds a linked list or self-balancing tree of colliding key-value pairs.
     * Open Addressing: Linear Probing, Quadratic Probing, or Double Hashing searches for the next open slot in the array.
   - Load Factor (alpha = n / k): Ratio of entries to capacity. When alpha exceeds threshold (~0.75), resizing and rehashing occurs.`,
  },
];
