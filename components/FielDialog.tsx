import * as React from "react";
import type { FileWithPreview } from "@/types";
import Cropper, { type ReactCropperElement } from "react-cropper";
import Compress from "compressorjs";
import {
  useDropzone,
  type Accept,
  type FileRejection,
  type FileWithPath,
} from "react-dropzone";
import type {
  FieldPath,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import { toast } from "sonner";
import Webcam from "react-webcam";

import "cropperjs/dist/cropper.css";

import Image from "next/image";

import { cn } from "@/utils";
import { Button } from "@/components/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/UI/Dialog";
// import { Icons } from "@/components/icons"
import { Crop, RefreshCw, Trash, UploadCloud, X } from "lucide-react";

// FIXME Your proposed upload exceeds the maximum allowed size, this should trigger toast.error too

interface FileDialogProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends React.HTMLAttributes<HTMLDivElement> {
  name: TName;
  setValue: UseFormSetValue<TFieldValues>;
  accept?: Accept;
  maxSize?: number;
  maxFiles?: number;
  files: FileWithPreview[] | null;
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>;
  disabled?: boolean;
}

export function FileDialog<TFieldValues extends FieldValues>({
  name,
  setValue,
  accept = {
    "image/*": [],
  },
  maxSize = 1024 * 1024 * 2,
  maxFiles = 1,
  files,
  setFiles,
  disabled = false,
  className,
  ...props
}: FileDialogProps<TFieldValues>) {
  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      acceptedFiles.forEach((file) => {
        console.log("File from each", file);
        new Compress(file, {
          quality: 0.6,
          success(result) {
            const myNewFile = new File([result], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            const newFileWithPreview = Object.assign(myNewFile, {
              path: file.name,
              preview: URL.createObjectURL(myNewFile),
            });

            console.log("compressed", newFileWithPreview);
            setFiles((prev) => [...(prev ?? []), newFileWithPreview]);
          },
          error(error) {
            console.log(error.message);
          },
        });
      });

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ errors }) => {
          if (errors[0]?.code === "file-too-large") {
            toast.error(`File is too large. Max size is ${maxSize}`);
            return;
          }
          errors[0]?.message && toast.error(errors[0].message);
        });
      }
    },

    [maxSize, setFiles]
  );

  // Register files to react-hook-form
  React.useEffect(() => {
    setValue(name, files as PathValue<TFieldValues, Path<TFieldValues>>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    multiple: maxFiles > 1,
    disabled,
  });

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="w-max">
          Upload Images
          <span className="sr-only">Upload Images</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <p className="absolute left-5 top-4 text-base font-medium text-muted-foreground">
          Upload your images
        </p>
        <div
          {...getRootProps()}
          className={cn(
            "group relative mt-8 grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isDragActive && "border-muted-foreground/50",
            disabled && "pointer-events-none opacity-60",
            className
          )}
          {...props}
        >
          <input {...getInputProps()} />
          <div className="grid place-items-center gap-1 sm:px-5">
            <UploadCloud
              className="h-8 w-8 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="mt-2 text-base font-medium text-muted-foreground">
              Drag {`'n'`} drop file here, or click to select file
            </p>
            <p className="text-sm text-slate-500">
              Please upload file with size less than {maxSize}
            </p>
          </div>
        </div>
        <p className="text-center text-sm font-medium text-muted-foreground">
          You can upload up to {maxFiles} {maxFiles === 1 ? "file" : "files"}
        </p>
        {files?.length ? (
          <div className="grid gap-5">
            {files?.map((file, i) => (
              <FileCard
                key={i}
                i={i}
                files={files}
                setFiles={setFiles}
                file={file}
              />
            ))}
          </div>
        ) : null}
        {files?.length ? (
          <Button
            type="button"
            className="mt-2.5 w-full"
            onClick={() => setFiles(null)}
          >
            <Trash className="mr-2 h-4 w-4" aria-hidden="true" />
            Remove All
            <span className="sr-only">Remove all</span>
          </Button>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

interface FileCardProps {
  i: number;
  file: FileWithPreview;
  files: FileWithPreview[] | null;
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>;
}

function FileCard({ i, file, files, setFiles }: FileCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [cropData, setCropData] = React.useState<string | null>(null);
  const cropperRef = React.useRef<ReactCropperElement>(null);

  const onCrop = React.useCallback(() => {
    if (!files || !cropperRef.current) return;

    const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas();
    setCropData(croppedCanvas.toDataURL());

    croppedCanvas.toBlob((blob) => {
      if (!blob) {
        console.error("Blob creation failed");
        return;
      }

      new Compress(blob, {
        quality: 0.6,
        success(result) {
          const croppedImage = new File([result], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });

          const croppedFileWithPathAndPreview = Object.assign(croppedImage, {
            preview: URL.createObjectURL(croppedImage),
            path: file.name,
          }) satisfies FileWithPreview;

          const newFiles = files.map((file, j) =>
            j === i ? croppedFileWithPathAndPreview : file
          );
          setFiles(newFiles);
        },
      });
    });
  }, [file.name, file.type, files, i, setFiles]);

  React.useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        onCrop();
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [onCrop]);

  return (
    <div className="relative flex items-center justify-between gap-2.5">
      <div className="flex items-center gap-2">
        <Image
          src={cropData ? cropData : file.preview}
          alt={file.name}
          className="h-10 w-10 shrink-0 rounded-md"
          width={40}
          height={40}
          loading="lazy"
        />
        <div className="flex flex-col">
          <p className="line-clamp-1 text-sm font-medium text-muted-foreground">
            {file.name}
          </p>
          <p className="text-xs text-slate-500">
            {(file.size / 1024 / 1024).toFixed(2)}MB
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {file.type.startsWith("image") && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button type="button" className="h-7 w-7">
                <Crop className="h-4 w-4 text-white" aria-hidden="true" />
                <span className="sr-only">Crop image</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <p className="absolute left-5 top-4 text-base font-medium text-muted-foreground">
                Crop image
              </p>
              <div className="mt-8 grid place-items-center space-y-5">
                <Cropper
                  ref={cropperRef}
                  className="h-[450px] w-[450px] object-cover"
                  zoomTo={0.5}
                  initialAspectRatio={1 / 1}
                  preview=".img-preview"
                  src={file.preview}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                  guides={true}
                />
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    aria-label="Crop image"
                    type="button"
                    className="h-8"
                    onClick={() => {
                      onCrop();
                      setIsOpen(false);
                    }}
                  >
                    <Crop className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                    Crop Image
                  </Button>
                  <Button
                    aria-label="Reset crop"
                    type="button"
                    className="h-8"
                    onClick={() => {
                      cropperRef.current?.cropper.reset();
                      setCropData(null);
                    }}
                  >
                    <RefreshCw
                      className="mr-2 h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    Reset Crop
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <Button
          type="button"
          className="h-7 w-7"
          onClick={() => {
            if (!files) return;
            setFiles(files.filter((_, j) => j !== i));
          }}
        >
          <X className="h-4 w-4 text-white" aria-hidden="true" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
    </div>
  );
}

interface WebCamProps {
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>;
}

// function WebCamCapture({ setFiles }: WebCamProps) {
//   function dataURItoBlob(dataURI) {
//     // convert base64/URLEncoded data component to raw binary data held in a string
//     var byteString;
//     if (dataURI.split(",")[0].indexOf("base64") >= 0)
//       byteString = atob(dataURI.split(",")[1]);
//     else byteString = unescape(dataURI.split(",")[1]);

//     // separate out the mime component
//     var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

//     // write the bytes of the string to a typed array
//     var ia = new Uint8Array(byteString.length);
//     for (var i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }

//     return new Blob([ia], { type: mimeString });
//   }

//   const videoConstraints = {
//     width: 1280,
//     height: 720,
//     facingMode: "user",
//   };

//   const webcamRef = React.useRef(null);
//   const capture = React.useCallback(() => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     // var dataURL = canvas.toDataURL('image/jpeg', 0.5);
//     var blob = dataURItoBlob(imageSrc);
//     var fd = new FormData(document.forms[0]);
//     var file = new File([blob], "canvasImage.jpg", { type: "image/jpeg" });
//     fd.append("canvasImage", file);
//     let preview = URL.createObjectURL(file);
//     // const newFile: FileWithPreview = { ...file, preview };
//     const newFile = file as FileWithPreview;
//     newFile.preview = preview;
//     setFiles(newFile);
//   }, [webcamRef]);

//   return (
//     <>
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button>
//             Capture with Webcam
//             <span className="sr-only">Capture with Webcam</span>
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[480px]">
//           <Webcam
//             audio={false}
//             height={720}
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             width={1280}
//             videoConstraints={videoConstraints}
//           />
//           <Button onClick={capture}>Capture Photo</Button>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
