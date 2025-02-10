import * as Yup from "yup";

export const subjectSchema = Yup.object({
  subject_name: Yup.string()
    .min(2, "Atleast 2 characters are required")
    .required("Subject Name is required"),
  subject_codename: Yup.string().required("Subject codename is required"),
});
