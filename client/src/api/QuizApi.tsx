import apiClient from "./apiClient";

export const createQuiz = async (quizData: any) => {
  console.log("Token: ",localStorage.getItem("token"));
  const response = await apiClient.post("/quizzes", quizData);
  return response.data;
};
