export interface TBQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export const TB_QUESTIONS: TBQuestion[] = [
  {
    id: 1,
    question: "What does TB stand for?",
    options: [
      "Throat Bacteria",
      "Tuberculosis",
      "Typhoid Bacteria",
      "Tubercle Bacillus",
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "Which bacteria causes Tuberculosis?",
    options: [
      "Staphylococcus",
      "Streptococcus",
      "Mycobacterium tuberculosis",
      "E. coli",
    ],
    correctIndex: 2,
  },
  {
    id: 3,
    question: "How does TB primarily spread?",
    options: [
      "Through food",
      "Through water",
      "Through air (droplets)",
      "Through skin contact",
    ],
    correctIndex: 2,
  },
  {
    id: 4,
    question: "Which organ is most commonly affected by TB?",
    options: ["Liver", "Kidney", "Lungs", "Heart"],
    correctIndex: 2,
  },
  {
    id: 5,
    question: "What is the most common symptom of TB?",
    options: [
      "Headache",
      "Cough lasting more than 2 weeks",
      "Stomach pain",
      "Joint pain",
    ],
    correctIndex: 1,
  },
  {
    id: 6,
    question: "Which of these is a symptom of TB?",
    options: ["Yellow eyes", "Rash on skin", "Night sweats", "Hair loss"],
    correctIndex: 2,
  },
  {
    id: 7,
    question: "How long should a cough last to be suspected as TB?",
    options: ["1 day", "1 week", "More than 2 weeks", "1 month"],
    correctIndex: 2,
  },
  {
    id: 8,
    question: "Is TB curable?",
    options: [
      "No, it is not curable",
      "Yes, with proper treatment",
      "Only in children",
      "Only with surgery",
    ],
    correctIndex: 1,
  },
  {
    id: 9,
    question:
      "What is the name of the national TB elimination program in India?",
    options: [
      "DOTS Programme",
      "National Tuberculosis Elimination Programme (NTEP)",
      "TB Free India Mission",
      "Swachh TB Abhiyan",
    ],
    correctIndex: 1,
  },
  {
    id: 10,
    question: "Under NTEP, TB treatment is available:",
    options: [
      "Only in private hospitals",
      "Only for BPL patients",
      "Free of cost at government health centres",
      "At a subsidized cost",
    ],
    correctIndex: 2,
  },
  {
    id: 11,
    question: "What is the duration of standard TB treatment?",
    options: ["1 month", "3 months", "6 months", "1 year"],
    correctIndex: 2,
  },
  {
    id: 12,
    question: "Which of the following helps prevent TB?",
    options: [
      "Eating spicy food",
      "Covering mouth while coughing",
      "Drinking cold water",
      "Avoiding sunlight",
    ],
    correctIndex: 1,
  },
  {
    id: 13,
    question: "Who is at higher risk of getting TB?",
    options: [
      "People with good nutrition",
      "People living in well-ventilated homes",
      "People with weakened immune system",
      "People who exercise regularly",
    ],
    correctIndex: 2,
  },
  {
    id: 14,
    question: "Coughing blood is a sign of:",
    options: ["Common cold", "Asthma", "TB (Advanced)", "Dengue"],
    correctIndex: 2,
  },
  {
    id: 15,
    question: "What test is commonly used to diagnose TB?",
    options: ["Blood sugar test", "Sputum test", "Urine test", "ECG"],
    correctIndex: 1,
  },
  {
    id: 16,
    question: "BCG vaccine is given to protect against:",
    options: ["Malaria", "Dengue", "Tuberculosis", "Typhoid"],
    correctIndex: 2,
  },
  {
    id: 17,
    question: "A person with active TB should:",
    options: [
      "Continue working without precautions",
      "Cover their mouth when coughing/sneezing",
      "Share food with others",
      "Avoid all medicines",
    ],
    correctIndex: 1,
  },
  {
    id: 18,
    question: "Which of these is NOT a symptom of TB?",
    options: ["Weight loss", "Fatigue", "Bright red rash", "Persistent cough"],
    correctIndex: 2,
  },
  {
    id: 19,
    question: "TB can also affect:",
    options: [
      "Only lungs",
      "Only bones",
      "Multiple organs including brain, spine, kidneys",
      "Only the digestive system",
    ],
    correctIndex: 2,
  },
  {
    id: 20,
    question: "Early detection of TB is important because:",
    options: [
      "It increases treatment cost",
      "It prevents spread and improves cure rate",
      "It is required by law",
      "It makes TB worse",
    ],
    correctIndex: 1,
  },
];
