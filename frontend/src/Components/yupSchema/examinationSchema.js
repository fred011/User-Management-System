import * as Yup from "yup";

export const examinationSchema = Yup.object({
  date: Yup.date().required("Date is required"),
  subject: Yup.string().required("Subject is required"),
  examType: Yup.string().required("Exam Type is required"),
});
