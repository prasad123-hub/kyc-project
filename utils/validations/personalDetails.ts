import * as z from "zod";
const MAX_FILE_SIZE = 3000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const personalDetailsSchema = z.object({
  firstName: z.string().min(1, {
    message: "FirstName is required field",
  }),
  middleName: z.string().min(1, {
    message: "MiddleName is required field",
  }),
  lastName: z.string().min(1, {
    message: "LastName is required field",
  }),
  email: z.string().min(1, { message: "This field has to be filled." }).email({
    message: "Please enter a valid email address",
  }),
  images: z
    .any()
    .refine((files) => files?.length == 1, "Profile Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 3MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
  dob: z.date(),
  gender: z.string(),
  phone: z
    .string()
    .min(10, {
      message: "Enter 10 Digit Number",
    })
    .refine((value) => /^\d{10}$/.test(value), {
      message: "Must be a 10-digit number.",
    }),
  address: z.string().min(1, { message: "This is required field" }),
  state: z.string().min(1, { message: "This is required field" }),
  district: z.string().min(1, { message: "This is required field" }),
  city: z.string().min(1, { message: "This is required field" }),
  pincode: z.string().refine((value) => /^\d{6}$/.test(value), {
    message: "Must be a 6-digit number.",
  }),
});
