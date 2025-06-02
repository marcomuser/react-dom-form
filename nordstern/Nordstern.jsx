const personalSoundtrackSchema = z.object({
  activity: z.enum(["working", "exercising", "cooking", "reading"]),
  genres: z.enum(["pop", "indie", "electronic", "hiphop"]).array().min(1),
  artist: z.string().trim().max(100).optional(),
  song: z.string().trim().max(150).optional(),
  email: z.email(),
  confirmEmail: z.email(),
  windows: z.object({ height: z.string(), width: z.string() }).array(),
});

async function personalSoundtrackAction(formData) {
  "use server";
  /**
   * interface Submission {
   *   status: "success" | "error",
   *   value: Output,
   *   issues: Issue[],
   *   reply: ({resetForm, formErrors, fieldErrors}) => ({ status, payload, formErrors, fieldErrors })
   * }
   *
   * reply method transforms StandardSchema Issues to formErrors and fieldErrors
   */
  const submission = parseWithSchema(personalSoundtrackSchema, formData);

  if (submission.status === "error") {
    // same as return { status: "error", payload: submission.value, formErrors: [...], fieldErrors: {...} }
    return submission.reply();
  }

  const response = await computePlaylistAndSendMail(result.data);

  if (!response.ok) {
    return submission.reply({
      formErrors: ["Failed to create the playlist. Please try again later."],
    });
  }

  // same as return { status: "success", payload: undefined, formErrors: [], fieldErrors: {} }
  return submission.reply({ resetForm: true });
}

async function SoundtrackForm() {
  const personalSoundtrackDefaultValues = await getDefaultValues();

  return (
    <Form
      id="personal-soundtrack"
      schema={personalSoundtrackSchema}
      schemaResolver={(schema) => schema.shape}
      strategy="field"
      report="onSubmit"
      action={personalSoundtrackAction}
      defaultValues={personalSoundtrackDefaultValues}
      noNativeErrorReporting
    >
      {({
        register, // spreads name and potentially constraints on inputs
        update, // update form values. Handled internally via form.elements.findByName().value = value
        defaultValues, // Either lastResult.payload or props.defaultValues
        lastResult, // tracked in useActionState. Initially null
        pending, // tracked by useActionState
        formId,
        formRef,
      }) => (
        <>
          <wa-input
            {...register("artist")}
            defaultValue={defaultValues?.artist}
            label="Artist"
            hint="What is one artist you love?"
          ></wa-input>

          <wa-input
            {...register("song")}
            defaultValue={defaultValues?.song}
            label="Song"
            hint="Which one song should definitely be included?"
          ></wa-input>

          <wa-select
            {...register("activity")}
            defaultValue={defaultValues?.activity}
            label="Activity"
          >
            <wa-option value="working">Working</wa-option>
            <wa-option value="exercising">Exercising</wa-option>
            <wa-option value="cooking">Cooking</wa-option>
            <wa-option value="reading">Reading</wa-option>
          </wa-select>

          <Select
            {...register("genre")}
            label="Genre"
            options={[
              { label: "Pop", value: schema.shape["genre"].Enum.pop },
              { label: "Indie", value: schema.shape["genre"].Enum.indie },
              { label: "Hip Hop", value: schema.shape["genre"].Enum.hiphop },
              {
                label: "Electronic",
                value: schema.shape["genre"].Enum.electronic,
              },
            ]}
            multiple
          />

          <Windows />

          <wa-input
            {...register("email")}
            defaultValue={defaultValues?.email}
            label="E-mail"
            hint="Where should we send your playlist to?"
            type="email"
            placeholder="E-mail"
          ></wa-input>

          <AddBohemianRhapsody />
          <SubmitButton />
        </>
      )}
    </Form>
  );
}

function Select({ name, disabled, required, label, options, multiple }) {
  // useField without schema generic makes value + defaultValue unknown and require type assertions
  const { defaultValue, value, showError, valid, dirty, validationMessage } =
    useField(name, (state) => ({
      value: state.value,
      dirty: state.dirty,
      showError: state.showError, // depends on shouldValidate/shouldRevalidate mode. Switches back to false when field becomes valid again.
      valid: state.valid, // always reflects the current validity state of the field. Updated on mount and onChange.
      validationMessage: state.validationMessage,
    }));

  return (
    <>
      <wa-select
        name={name}
        disabled={disabled}
        required={required}
        defaultValue={defaultValue}
        label={label}
        multiple={multiple}
      >
        {options.map((opt) => (
          <wa-option value={opt.value}>{opt.label}</wa-option>
        ))}
      </wa-select>
      {showError ? <em role="alert">{validationMessage}</em> : null}
    </>
  );
}

function SubmitButton() {
  const {
    register,
    update,
    defaultValues,
    lastResult,
    formId,
    formRef,
    submitted,
    pending,
    valid,
    dirty,
    values,
  } = useForm((state) => ({
    valid: state.valid, // Tracking validity form state onChange. Also computed once on mount.
    dirty: state.dirty, // comparing initial dom snapshot from form ref callback with current dom snapshot. Tracked onChange
    submitted: state.submitted, // tracks if onSubmit handler was called. Not the same as lastResult.status!
    values: state.values, // dom snapshot tracked onChange. Subscribe to specific fields or all of them.
  }));

  return (
    <wa-button type="submit" loading={pending}>
      Submit
    </wa-button>
  );
}

function Windows() {
  const { register } = useForm();
  const { items, insert, remove, reorder } = useFieldArray("windows");

  return (
    <div>
      {items.map((item, i) => (
        <li key={item.key}>
          <wa-input
            {...register(`${item.name}.width`)}
            defaultValue={item.defaultValues.width}
            label="Window width"
            type="number"
          ></wa-input>

          <wa-input
            {...register(`${item.name}.height`)}
            defaultValue={item.defaultValues.height}
            label="Window height"
            type="number"
          ></wa-input>

          <wa-button onClick={() => remove({ index: i })}>Remove</wa-button>
        </li>
      ))}

      <wa-button onClick={() => insert()}>Insert</wa-button>
    </div>
  );
}

function AddBohemianRhapsody() {
  const { update } = useForm();

  return (
    <wa-button
      onClick={() => update({ name: "song", value: "Bohemian Rhapsody" })}
    >
      Add Bohemian Rhapsody as your song
    </wa-button>
  );
}
