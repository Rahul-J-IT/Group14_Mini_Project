import React, { useEffect, useState } from "react";
import { getQuiz } from "../api/GetQuiz";
 
interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}
 
const ViewQuiz: React.FC = () => {
 
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [score, setScore] = useState<number | null>(null);
 
  const quizId = 3;
 
  useEffect(() => {
    fetchQuiz();
  }, []);
 
  const fetchQuiz = async () => {
    try {
      const data = await getQuiz(quizId);
      setQuiz(data);
    } catch (error) {
      console.error(error);
    }
  };
 
  const handleAnswerChange = (questionId: number, optionIndex: number) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex
    });
  };
 
  const handleSubmit = () => {
 
    let correctCount = 0;
 
    quiz.questions.forEach((q: Question) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
 
    setScore(correctCount);
  };
 
  if (!quiz) {
    return <p>Loading quiz...</p>;
  }
 
  return (
    <div>
 
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>
 
      {quiz?.questions?.map((q: Question, index: number) => (
 
        <div key={q.id} style={{ marginBottom: "20px" }}>
 
          <p>
            <strong>
              Q{index + 1}. {q.question}
            </strong>
          </p>
 
          {q.options.map((opt, i) => (
 
            <div key={i}>
              <label>
 
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  disabled={score !== null}
                  onChange={() => handleAnswerChange(q.id, i)}
                />
 
                Option {i + 1}: {opt}
 
              </label>
            </div>
 
          ))}
 
        </div>
 
      ))}
 
      <button onClick={handleSubmit}>
        Submit Quiz
      </button>
 
      {score !== null && (
        <div style={{ marginTop: "20px" }}>
          <h3>
            Your Score: {score} / {quiz.questions.length}
          </h3>
        </div>
      )}
 
    </div>
  );
};
 
export default ViewQuiz;

 