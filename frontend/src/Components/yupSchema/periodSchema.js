import * as Yup from "yup";

export const periodSchema = Yup.object().shape({
  teacher: Yup.string().required("Teacher is required"),
  subject: Yup.string().required("Subject is required"),
  period: Yup.string().required("Period is required"),
  date: Yup.date().required("Date is required"),
});
