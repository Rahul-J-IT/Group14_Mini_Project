
import React, { useState } from "react";
import { createQuiz } from "../api/QuizApi";
import type { Question } from "../types/quiz";
 
const CreateQuiz: React.FC = () => {
 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(1800);
  const [passingScore, setPassingScore] = useState(70);
 
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
 
  const [quiz, setQuiz] = useState<Question[]>([]);
 
  const handleOptionChange = (value: string, index: number) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };
  var qid=1;
  const addQuestion = () => {
 
    const newQuestion: Question = {
      id: quiz.length + 1,
      question: questionText,
      options: options,
      correctAnswer: correctAnswer,
      
    };
    qid+=1
    setQuiz([...quiz, newQuestion]);
 
    setQuestionText("");
    setOptions(["", "", ""]);
    setCorrectAnswer(0);
  };
 
  const handleSubmit = async () => {
 
    const data = {
      sectionId: 1,
      title: title,
      description: description,
      duration: duration,
      passingScore: passingScore,
      questions: quiz
    };
    console.log(data)
    try {
      const response = await createQuiz(data);
      console.log(response);
      alert("Quiz created successfully");
    } catch (error) {
      console.error(error);
      alert("Error creating quiz");
    }
  };

  return (
    <div>
 
      <h2>Create Quiz</h2>
 
      <div>
        <label> Title </label>
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
 
      <div>
        <label> Description </label>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
 
      <div>
        <label> Duration </label>
        <input
          type="number"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </div>
 
      <div>
        <label> Passing Score </label>
        <input
          type="number"
          placeholder="Passing Score"
          value={passingScore}
          onChange={(e) => setPassingScore(Number(e.target.value))}
        />
      </div>
 
      <hr />
 
      <h3>Add Question</h3>
     <label>Question: </label>
      <input
        type="text"
        placeholder="Question"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
      />
 
      {options.map((opt, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder={`Option ${index + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(e.target.value, index)}
          />
 
          <input
            type="radio"
            name="correctAnswer"
            checked={correctAnswer === index}
            onChange={() => setCorrectAnswer(index)}
          />
 
          Correct
        </div>
      ))}
 
      <button onClick={addQuestion}>
        Add Question
      </button>
 
      <hr />
 
      <h3>Questions Added</h3>
 
      {quiz.map((q,qIndex) => (
        <div key={q.id} style={{margin: "20px"}}>
          <p>
            <strong>Question{qIndex+1}: </strong>
          </p>
          <ul>
            {q.options.map((o,i)=>(
                <li key={i}>
                    Option {i+1}:{o}
                    {q.correctAnswer === i && "(Correct Answer)"}
                </li>
            ))}
          </ul>
        </div>
      ))}
 
      <button onClick={handleSubmit}>
        Submit Quiz
      </button>
 
    </div>
  );
};
 
export default CreateQuiz;
