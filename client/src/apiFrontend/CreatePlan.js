import axios from "axios";

const axiosPlan = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3004/api/v1/lesson",
  withCredentials: true,
});

const genereatePlan = async ({ subject, topic, grade, duration }) => {
  try {
    const username = localStorage.getItem("username");
    // console.log(username);

    const response = await axiosPlan.post(
      "/createPlan",
      {
        subject,
        topic,
        grade,
        duration,
        username,
      },
      { responseType: "blob" }
    );

    return response;
  } catch (error) {
    console.log(`error while creating the user : ${error}`);
  }
};

export { genereatePlan };
