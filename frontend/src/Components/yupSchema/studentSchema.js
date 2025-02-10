/* eslint-disable no-control-regex */
import * as Yup from "yup";

const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const studentSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .matches(emailRegex, "Invalid email format")
    .required("Email is required"),
  student_class: Yup.string().required("Student class is required"),
  age: Yup.number()
    .typeError("Age must be a number")
    .positive("Age must be a positive number")
    .integer("Age must be an integer")
    .required("Age is required"),
  gender: Yup.string().required("Gender is required"),
  guardian: Yup.string().required("Guardian name is required"),
  guardian_phone: Yup.string()
    .matches(/^\d{10}$/, "Guardian phone number must be 10 digits")
    .required("Guardian phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export const studentEditSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .matches(emailRegex, "Invalid email format")
    .required("Email is required"),
  student_class: Yup.string().required("Student class is required"),
  age: Yup.number()
    .typeError("Age must be a number")
    .positive("Age must be a positive number")
    .integer("Age must be an integer")
    .required("Age is required"),
  gender: Yup.string().required("Gender is required"),
  guardian: Yup.string().required("Guardian name is required"),
  guardian_phone: Yup.string()
    .matches(/^\d{10}$/, "Guardian phone number must be 10 digits")
    .required("Guardian phone number is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters"),

  confirm_password: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});
