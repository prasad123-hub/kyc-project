import * as React from "react";
import Image from "next/image";
import { useAppDispatch } from "@/hooks";
import type { FileWithPreview } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { nextStep } from "@/slices/StepSlice";
import { toast } from "sonner";
import { type z } from "zod";

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
import { X } from "lucide-react";

type Inputs = z.infer<typeof personalDetailsSchema>;

export const PersonalDetailsForm = () => {
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null);
  const dispatch = useAppDispatch();

  // REACT_HOOK_FORM
  const form = useForm<Inputs>({
    resolver: zodResolver(personalDetailsSchema),
    // defaultValues: {
    //   category: "skateboards",
    // },
  });

  function onSubmit(data: Inputs) {
    console.log(data);
  }

  console.log(" files from paren", files);
  return (
    <>
      <div className="py-6">
        <h2 className="text-2xl font-medium pb-6">Personal Details form</h2>
        <Form {...form}>
          <form
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
                message={form.formState.errors.images?.message}
              />
            </FormItem>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </>
  );
};
