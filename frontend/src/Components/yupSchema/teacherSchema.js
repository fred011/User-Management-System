import * as Yup from "yup";

export const teacherSchema = Yup.object({
  name: Yup.string()
    .min(3, "Teacher name must contain 3 characters")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),

  age: Yup.string().required("Age is required"),
  gender: Yup.string().required("Gender is required"),
  qualification: Yup.string().required("Qualification is required"),

  phone_number: Yup.string()
    .min(10, "Must contain 10 characters")
    .max(10, "Cannot extend 10 characters")
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});
export const teacherEditSchema = Yup.object({
  name: Yup.string()
    .min(3, "Teacher name must contain 3 characters")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),

  age: Yup.string().required("Age is required"),
  gender: Yup.string().required("Gender is required"),
  qualification: Yup.string().required("Qualification is required"),
  phone_number: Yup.string()
    .min(10, "Must contain 10 characters")
    .max(10, "Cannot extend 10 characters")
    .required("Phone number is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters"),

  confirm_password: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});
