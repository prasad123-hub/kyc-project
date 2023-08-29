import * as React from "react";
import Image from "next/image";
import { useAppDispatch } from "@/hooks";
import type { FileWithPreview } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { nextStep } from "@/slices/StepSlice";
import { toast } from "sonner";
import { type z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/UI/Popover";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/Select";

// Import Form Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from "@/components/UI/Form";
import { personalDetailsSchema } from "@/utils/validations/personalDetails";
import { FileDialog } from "../FielDialog";
import { Button } from "../Button";
import { CalendarIcon, X } from "lucide-react";
import { Input } from "../UI/Input";
import { useAuth } from "@/context/AuthContext";
import { Calendar } from "@/components/UI/Calender";
import { cn } from "@/utils";
import { format } from "date-fns";

type Inputs = z.infer<typeof personalDetailsSchema>;

export const PersonalDetailsForm = () => {
  const { user } = useAuth();
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null);
  const dispatch = useAppDispatch();

  // REACT_HOOK_FORM
  const form = useForm<Inputs>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      firstName: user?.displayName?.split(" ")[0],
      lastName: user?.displayName?.split(" ")[1],
      email: user?.email as string,
    },
  });

  function onSubmit(data: Inputs) {
    console.log(data);
  }

  return (
    <>
      <div className="py-6">
        <h2 className="text-2xl font-medium pb-6">Personal Details form</h2>
        <Form {...form}>
          <form
            className="grid w-full max-w-2xl gap-5"
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <FormItem className="flex w-full flex-col gap-1.5">
              <FormLabel>Upload Profile Picture</FormLabel>
              {files?.length ? (
                <div className="flex items-center gap-2">
                  {files.map((file, i) => (
                    <div key={i} className="relative">
                      <Image
                        key={i}
                        src={file.preview}
                        alt={file.name}
                        className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                        width={80}
                        height={80}
                      />
                      <span
                        onClick={() => setFiles([])}
                        className="absolute -top-1 -right-1 p-[0.5px] rounded-full bg-red-500 text-white"
                      >
                        <X className="h-3 w-3" />
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
              <FormControl>
                <FileDialog
                  setValue={form.setValue}
                  name="images"
                  maxFiles={1}
                  maxSize={1024 * 1024 * 4}
                  files={files}
                  setFiles={setFiles}
                  disabled={files?.length ? true : false}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.images?.message as string}
              />
            </FormItem>
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <FormItem className="w-full">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    aria-invalid={!!form.formState.errors.firstName}
                    placeholder="Type product name here."
                    {...form.register("firstName")}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.firstName?.message}
                />
              </FormItem>
              <FormItem className="w-full">
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input
                    aria-invalid={!!form.formState.errors.middleName}
                    placeholder="Type product name here."
                    {...form.register("middleName")}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.middleName?.message}
                />
              </FormItem>
            </div>
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <FormItem className="w-full">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    aria-invalid={!!form.formState.errors.lastName}
                    placeholder="Type product name here."
                    {...form.register("lastName")}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.lastName?.message}
                />
              </FormItem>
              <FormItem className="w-full">
                <FormLabel>Email Id</FormLabel>
                <FormControl>
                  <Input
                    aria-invalid={!!form.formState.errors.middleName}
                    placeholder="Type product name here."
                    {...form.register("email")}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.email?.message}
                />
              </FormItem>
            </div>
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col justify-center gap-1">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value as Date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className=" w-auto p-0">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown-buttons"
                          selected={field.value as Date}
                          onSelect={field.onChange}
                          fromYear={1960}
                          toYear={2030}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Select Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full focus:ring-0">
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <FormItem className="w-full">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    aria-invalid={!!form.formState.errors.phone}
                    placeholder="Enter 10 digit number."
                    {...form.register("phone")}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.phone?.message}
                />
              </FormItem>
              <FormItem className="w-full">
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input
                    aria-invalid={!!form.formState.errors.state}
                    placeholder="Enter state"
                    {...form.register("state")}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.state?.message}
                />
              </FormItem>
            </div>
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <FormItem className="w-full">
                <FormLabel>Address Line</FormLabel>
                <FormControl>
                  <Input
                    aria-invalid={!!form.formState.errors.address}
                    placeholder="Enter your address"
                    {...form.register("address")}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.address?.message}
                />
              </FormItem>
              <FormItem className="w-full">
                <FormLabel>District</FormLabel>
                <FormControl>
                  <Input
                    aria-invalid={!!form.formState.errors.district}
                    placeholder="Enter district"
                    {...form.register("district")}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.district?.message}
                />
              </FormItem>
            </div>
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <FormItem className="w-full">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    aria-invalid={!!form.formState.errors.city}
                    placeholder="Enter your city"
                    {...form.register("city")}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.city?.message}
                />
              </FormItem>
              <FormItem className="w-full">
                <FormLabel>Pin Code</FormLabel>
                <FormControl>
                  <Input
                    aria-invalid={!!form.formState.errors.pincode}
                    placeholder="Enter 6 digit pincode"
                    {...form.register("pincode")}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.pincode?.message}
                />
              </FormItem>
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </>
  );
};
