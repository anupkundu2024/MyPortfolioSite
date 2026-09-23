export const SUGGESTED_QUESTIONS = [
  "Who is Anup Kundu?",
  "What are Anup's main skills?",
  "Show me Anup's projects",
  "Is Anup available for internships?",
  "What is KunduStocks?",
  "How can I contact Anup?",
  "Where can I find Anup's GitHub?",
];

export function SuggestedQuestions({ onSelect, disabled }) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Suggested questions">
      {SUGGESTED_QUESTIONS.map((question) => (
        <button
          key={question}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(question)}
          className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:border-primary/60 hover:bg-primary/20 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {question}
        </button>
      ))}
    </div>
  );
}

export default SuggestedQuestions;
