import { useForm } from "@tanstack/react-form";

import ReactMarkdown from "react-markdown";

import { toast } from "sonner";

import { useDataMutation } from "@/api/handler";
import {
  UserEditRequestSchema,
  type UserEditRequest,
  type SimpleResponse,
  type UserDetailsResponse,
} from "@/lib/objects";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { UpdatedOn } from "@/components/pages/UpdatedOn";

export function Form({ data }: { data: UserDetailsResponse }) {
  const { mutateAsync, isPending } = useDataMutation<
    UserEditRequest,
    SimpleResponse
  >("manager", "/user/edit", false, {
    onSuccess: (res) => {
      toast.success(res.message);
    },
    invalidateKey: [["userDetails"]],
  });

  const { Field: FormField, handleSubmit } = useForm({
    defaultValues: {
      about: data?.about ?? "",
      cover_image: data?.cover_image ?? "",
    },
    validators: {
      onSubmit: UserEditRequestSchema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value);
    },
  });

  return (
    <div className="mx-auto flex max-h-screen w-full flex-col gap-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">About</h1>
          {data?.updated_at && <UpdatedOn value={data.updated_at} />}
        </div>
        {data?.updated_at && (
          <Button
            form="about-form"
            type="submit"
            className="bg-sky-500 hover:bg-neutral-950 hover:text-sky-500 hover:ring hover:ring-sky-500"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        id="about-form"
        className="flex flex-1 flex-col gap-6"
      >
        <FieldGroup>
          <div className="flex flex-1 flex-col gap-4 rounded-xl bg-neutral-950/70 p-4 md:flex-row md:p-6">
            <FormField
              name="about"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <div className="flex w-full flex-col gap-2 md:w-1/2">
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        autoComplete="off"
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={isInvalid}
                        placeholder="Type markdown here..."
                        className="h-full min-h-90 font-mono focus-visible:border-sky-500 focus-visible:ring-0 focus-visible:ring-sky-500"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  </div>
                );
              }}
            />

            <Separator
              orientation="vertical"
              className="hidden h-auto! w-px bg-white/20 md:block"
            />
            <Separator
              orientation="horizontal"
              className="h-px bg-white/20 md:hidden"
            />

            <FormField
              name="about"
              children={(field) => (
                <div
                  className="flex w-full flex-col gap-2 md:w-1/2"
                  data-color-mode="dark"
                >
                  <Field>
                    <FieldLabel>Preview</FieldLabel>
                    <div className="prose prose-invert prose-p:mt-0 prose-p:mb-5 prose-p:leading-normal prose-headings:font-mono prose-ul:my-5 prose-ol:my-5 prose-li:my-0 border-input h-full min-h-90 w-full max-w-none overflow-y-auto rounded-md border bg-transparent px-3 py-2 font-mono text-sm leading-normal shadow-sm">
                      <div className="rounded-md bg-transparent! text-inherit!">
                        <ReactMarkdown
                          components={{
                            ul: ({ children, className }) => (
                              <ul
                                className={`list-disc pl-4 ${className ?? ""}`}
                              >
                                {children}
                              </ul>
                            ),
                            ol: ({ children, className, start, type }) => (
                              <ol
                                className={`list-decimal pl-4 ${className ?? ""}`}
                                start={start ?? undefined}
                                type={
                                  type as
                                    | "1"
                                    | "a"
                                    | "A"
                                    | "i"
                                    | "I"
                                    | undefined
                                }
                              >
                                {children}
                              </ol>
                            ),
                            a: ({
                              children,
                              className,
                              href,
                              title,
                              target,
                              rel,
                            }) => (
                              <a
                                className={`underline decoration-sky-500 underline-offset-2 hover:text-sky-500 hover:no-underline hover:decoration-white ${className ?? ""}`}
                                href={href}
                                title={title}
                                target={target}
                                rel={rel}
                              >
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {field.state.value ||
                            "Start typing markdown to see a live preview."}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </Field>
                </div>
              )}
            />
          </div>

          <div className="flex flex-1 flex-col gap-4 rounded-xl bg-neutral-950/70 p-4 md:flex-row md:p-6">
            <FormField
              name="cover_image"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <div className="flex w-full flex-col gap-2 md:w-1/2">
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Cover Image URL
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        autoComplete="off"
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={isInvalid}
                        placeholder="Type image URL here..."
                        className="font-mono focus-visible:border-sky-500 focus-visible:ring-0 focus-visible:ring-sky-500"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  </div>
                );
              }}
            />

            <Separator
              orientation="vertical"
              className="hidden h-auto! w-px bg-white/20 md:block"
            />
            <Separator
              orientation="horizontal"
              className="h-px bg-white/20 md:hidden"
            />

            <FormField
              name="cover_image"
              children={(field) => (
                <div
                  className="flex w-full flex-col gap-2 md:w-1/2"
                  data-color-mode="dark"
                >
                  <span className="text-muted-foreground text-sm font-medium">
                    Preview
                  </span>

                  <div className="mx-auto mt-0 h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-neutral-900/70 text-base sm:mt-3 sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-72 lg:w-72">
                    <img
                      src={field.state.value || "https://placehold.co/640x640"}
                      onError={(event) => {
                        const fallback = "https://placehold.co/640x640";
                        if (event.currentTarget.src !== fallback) {
                          event.currentTarget.src = fallback;
                        }
                      }}
                      alt="Preview"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                </div>
              )}
            />
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
