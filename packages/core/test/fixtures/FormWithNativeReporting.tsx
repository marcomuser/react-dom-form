import { useActionState, useRef } from "react";
import { parse } from "../../src/parse.js";
import { FormProvider } from "../../src/FormProvider.js";
import { useForm } from "../../src/useForm.js";

interface FormValues {
  name: string;
  animal: "birds" | "cats" | "dogs" | "other";
  color: string;
  comment?: string;
  agreement?: string;
}

interface ActionState {
  defaultValues?: FormValues | undefined;
  meta?:
    | { isSuccess: boolean; errorMessage?: string; successMessage?: string }
    | undefined;
}

async function submit(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const formValues = parse<FormValues>(formData);

  // arbitrary validation
  if (formValues.name === "John Doe") {
    return {
      defaultValues: formValues,
      meta: {
        isSuccess: false,
        errorMessage: "John Doe is already registered",
      },
    };
  }

  return {
    defaultValues: formValues,
    meta: { isSuccess: true, successMessage: "Submitted successfully" },
  };
}

export function FormWithNativeReporting({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [actionState, formAction, isPending] = useActionState(submit, {});

  return (
    <FormProvider
      ref={formRef}
      defaultValues={actionState.defaultValues}
      meta={actionState.meta}
      disabled={disabled}
    >
      {({ getFieldProps, defaultValues }) => (
        <form
          ref={formRef}
          action={formAction}
          style={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <label>
            Name
            <input
              defaultValue={defaultValues?.name}
              {...getFieldProps({ name: "name", required: true })}
            />
          </label>

          <label>
            Favorite Animal
            <select
              key={defaultValues?.animal} // Bug in react: https://github.com/facebook/react/issues/30580#issuecomment-2537962675
              defaultValue={defaultValues?.animal}
              {...getFieldProps({ name: "animal", required: true })}
            >
              <option value=""></option>
              <option value="birds">Birds</option>
              <option value="cats">Cats</option>
              <option value="dogs">Dogs</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label>
            Favorite Color
            <input
              defaultValue={defaultValues?.color}
              {...getFieldProps({
                name: "color",
                pattern: {
                  value: new RegExp("(green|blue|red|yellow)"),
                  message: "This is not a color we like",
                },
                required: true,
              })}
            />
          </label>

          <label>
            Comment
            <textarea
              defaultValue={defaultValues?.comment}
              {...getFieldProps({
                name: "comment",
                minLength: {
                  value: 20,
                  message: "We want to hear more",
                },
              })}
            />
          </label>

          <label>
            Agreement
            <input
              type="checkbox"
              defaultChecked={Boolean(defaultValues?.agreement)}
              {...getFieldProps({ name: "agreement", required: true })}
            />
          </label>

          <SubmitMessage />

          <button type="reset" disabled={isPending}>
            Reset
          </button>
          <button type="submit" disabled={isPending}>
            Submit
          </button>
        </form>
      )}
    </FormProvider>
  );
}

function SubmitMessage() {
  const { meta } = useForm<FormValues, ActionState["meta"]>();

  return (
    <>
      {meta?.isSuccess === true && (
        <div role="status">{meta?.successMessage}</div>
      )}
      {meta?.isSuccess === false && (
        <div role="alert">{meta?.errorMessage}</div>
      )}
    </>
  );
}
