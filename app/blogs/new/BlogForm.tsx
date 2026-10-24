"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { useNotification } from "@/components/NotificationContext";
import { buttonClass, inputClass } from "@/lib/styles";
import { createBlog, type BlogFormState } from "../actions";

const initialState: BlogFormState = {};

const fieldClass = "flex flex-col gap-1";
const labelClass = "text-sm font-medium";
const errorClass = "m-0 text-sm text-red-600";

export default function BlogForm() {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [state, formAction, isPending] = useActionState(
    async (prevState: BlogFormState, formData: FormData) => {
      const result = await createBlog(prevState, formData);

      if (result.success) {
        showNotification(
          `A new blog "${result.values?.title}" by ${result.values?.author} was added.`,
        );
        router.push("/blogs");
      } else {
        showNotification(result.error ?? "Please fix the errors below.", "error");
      }

      return result;
    },
    initialState,
  );

  return (
    <form
      action={formAction}
      noValidate
      className="my-4 flex max-w-sm flex-col gap-4"
    >
      <div className={fieldClass}>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={state.values?.title}
          aria-invalid={Boolean(state.errors?.title)}
          aria-describedby={state.errors?.title ? "title-error" : undefined}
          className={inputClass}
        />
        {state.errors?.title && (
          <p id="title-error" className={errorClass}>
            {state.errors.title}
          </p>
        )}
      </div>
      <div className={fieldClass}>
        <label htmlFor="author" className={labelClass}>
          Author
        </label>
        <input
          id="author"
          name="author"
          type="text"
          defaultValue={state.values?.author}
          aria-invalid={Boolean(state.errors?.author)}
          aria-describedby={state.errors?.author ? "author-error" : undefined}
          className={inputClass}
        />
        {state.errors?.author && (
          <p id="author-error" className={errorClass}>
            {state.errors.author}
          </p>
        )}
      </div>
      <div className={fieldClass}>
        <label htmlFor="url" className={labelClass}>
          URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          defaultValue={state.values?.url}
          aria-invalid={Boolean(state.errors?.url)}
          aria-describedby={state.errors?.url ? "url-error" : undefined}
          className={inputClass}
        />
        {state.errors?.url && (
          <p id="url-error" className={errorClass}>
            {state.errors.url}
          </p>
        )}
      </div>
      <button type="submit" disabled={isPending} className={buttonClass}>
        {isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
