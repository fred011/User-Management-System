import * as Yup from "yup";

export const classSchema = Yup.object({
  class_text: Yup.string()
    .min(2, "Atleast 2 characters are required")
    .required("Class Text is required"),
  class_num: Yup.string().required("Class Number is required"),
});
