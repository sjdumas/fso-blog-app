"use client";

import { useActionState } from "react";
import { createBlog, type BlogFormState } from "../actions";

const initialState: BlogFormState = {};

export default function BlogForm() {
  const [state, formAction, isPending] = useActionState(
    createBlog,
    initialState,
  );

  return (
    <form action={formAction} noValidate>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={state.values?.title}
        />
        {state.errors?.title && (
          <p style={{ color: "red" }}>{state.errors.title}</p>
        )}
      </div>
      <div>
        <label htmlFor="author">Author</label>
        <input
          id="author"
          name="author"
          type="text"
          defaultValue={state.values?.author}
        />
        {state.errors?.author && (
          <p style={{ color: "red" }}>{state.errors.author}</p>
        )}
      </div>
      <div>
        <label htmlFor="url">URL</label>
        <input
          id="url"
          name="url"
          type="url"
          defaultValue={state.values?.url}
        />
        {state.errors?.url && (
          <p style={{ color: "red" }}>{state.errors.url}</p>
        )}
      </div>
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
