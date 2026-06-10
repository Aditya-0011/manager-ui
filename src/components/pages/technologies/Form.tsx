import { useForm } from "@tanstack/react-form";

import { Edit2 } from "lucide-react";

import {
  getTechnologyCategoryLabel,
  TechnologyCategory,
  TechnologyCreateRequestSchema,
  TechnologyUpdateRequestSchema,
  type SimpleResponse,
  type Technology,
  type TechnologyCreateRequest,
  type TechnologyUpdateRequest,
} from "@/lib/objects";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormProps =
  | {
      data: Technology;
      isCreating?: undefined;
      isUpdating: boolean;
      mutateAsync: (
        request: TechnologyUpdateRequest,
      ) => Promise<SimpleResponse>;
    }
  | {
      data?: undefined;
      isCreating: boolean;
      isUpdating?: undefined;
      mutateAsync: (
        request: TechnologyCreateRequest,
      ) => Promise<SimpleResponse>;
    };

export function Form({ data, isCreating, isUpdating, mutateAsync }: FormProps) {
  const formId = data ? `technology-form-${data.id}` : "technology-form-create";

  const defaultValues: TechnologyUpdateRequest | TechnologyCreateRequest = data
    ? {
        id: data.id,
        name: data.name,
        image_url: data.image_url,
        fallback_image_url: data.fallback_image_url,
        category: data.category,
      }
    : {
        name: "",
        image_url: "",
        fallback_image_url: "",
        category: 7 as TechnologyCategory,
      };
  const {
    Field: FormField,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues,
    validators: {
      onSubmit: data
        ? TechnologyUpdateRequestSchema.omit({ id: true })
        : TechnologyCreateRequestSchema,
    },
    onSubmit: async ({ value }) => {
      if (data) {
        await mutateAsync({ ...value, id: data.id } as TechnologyUpdateRequest);
      } else {
        await mutateAsync(value as TechnologyCreateRequest);
      }
    },
  });

  return (
    <Dialog>
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        key={data?.id || "create"}
      >
        <DialogTrigger>
          {data ? (
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-blue-500 hover:bg-blue-500/10 hover:text-blue-600 hover:ring hover:ring-blue-500"
            >
              <Edit2 className="size-4" />
            </Button>
          ) : (
            <Button className="bg-sky-500 hover:bg-neutral-950 hover:text-sky-500 hover:ring hover:ring-sky-500">
              Add
            </Button>
          )}
        </DialogTrigger>
        <DialogContent
          className="border-white sm:max-w-106.25"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle>
              {data ? (
                <>
                  Update <span className="text-sky-500">{data.name}</span>
                </>
              ) : (
                <>
                  Add <span className="text-sky-500">technology</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {data
                ? "Let's hope you are not fixing any typos!"
                : "Try not to put any typos!"}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="mt-1">
            <FormField
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      autoComplete="off"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={isCreating || isUpdating}
                      type="text"
                      required
                      className="focus-visible:border-sky-500 focus-visible:ring-0 focus-visible:ring-sky-500"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <FormField
              name="image_url"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      autoComplete="off"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="url"
                      disabled={isCreating || isUpdating}
                      required
                      className="focus-visible:border-sky-500 focus-visible:ring-0 focus-visible:ring-sky-500"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <FormField
              name="fallback_image_url"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Fallback Image URL
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      autoComplete="off"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={isCreating || isUpdating}
                      type="url"
                      required
                      className="focus-visible:border-sky-500 focus-visible:ring-0 focus-visible:ring-sky-500"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <FormField
              name="category"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value.toString()}
                      onValueChange={(value) => {
                        field.handleChange(Number(value) as TechnologyCategory);
                      }}
                      disabled={isCreating || isUpdating}
                      aria-invalid={isInvalid}
                      required
                    >
                      <SelectTrigger id={field.name} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(TechnologyCategory)
                          .filter(
                            ([name]) =>
                              isNaN(Number(name)) && name !== "Invalid",
                          )
                          .map(([name, value]) => (
                            <SelectItem key={name} value={value.toString()}>
                              {getTechnologyCategoryLabel(
                                value as TechnologyCategory,
                              )}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <DialogFooter>
            <Field orientation="horizontal" className="justify-end">
              <DialogClose>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => reset()}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                form={formId}
                type="submit"
                disabled={isCreating || isUpdating}
                className="bg-neutral-950 text-sky-500 hover:bg-sky-500/10 hover:text-sky-600 hover:inset-ring hover:ring-sky-500"
              >
                Save
              </Button>
            </Field>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
