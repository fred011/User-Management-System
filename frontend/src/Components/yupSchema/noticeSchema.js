import * as Yup from "yup";

export const noticeSchema = Yup.object({
  title: Yup.string()
    .min(2, "Atleast 2 characters are required")
    .required("Notice Text is required"),
  message: Yup.string()
    .min(8, "Atleast 8 characters are required")
    .required("Message is required"),
  audience: Yup.string().required("Audience is required"),
});
