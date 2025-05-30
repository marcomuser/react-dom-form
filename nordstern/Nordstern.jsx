const personalSoundtrackSchema = z.object({
  mood: z.enum(["energetic", "chill", "reflective", "productive"]),
  activity: z.enum(["working", "exercising", "cooking", "reading"]),
  genres: z.enum(["pop", "indie", "electronic", "hiphop"]).array().min(1),
  artist: z.string().trim().max(100).optional(),
  song: z.string().trim().max(150).optional(),
  email: z.string().email(),
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

function SoundtrackForm() {
  return (
    <Form
      id="personal-soundtrack"
      schema={personalSoundtrackSchema}
      schemaResolver={(schema) => schema.shape}
      action={personalSoundtrackAction}
      defaultValues={personalSoundtrackDefaultValues}
      disabled={false}
    >
      {({
        register,
        defaultValues,
        lastResult,
        schema,
        formId,
        formRef,
        update,
      }) => (
        <>
          <wa-input
            // spreads name, disabled and constraints
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

          <MoodSelect />

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
            clearable
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

          <SubmitButton />
        </>
      )}
    </Form>
  );
}

function Select({ name, disabled, required, label, options }) {
  // useField without schema generic makes value + defaultValue unknown and require type assertions
  const { defaultValue, state } = useField(name, (state) => ({
    valid: state.valid,
    validiationMessage: state.validiationMessage,
  }));

  return (
    <>
      <wa-select
        name={name}
        disabled={disabled}
        required={required}
        defaultValue={defaultValue}
        label={label}
      >
        {options.map((opt) => (
          <wa-option value={opt.value}>{opt.label}</wa-option>
        ))}
      </wa-select>
      {!state.valid ? <em role="alert">{state.validationMessage}</em> : null}
    </>
  );
}

function SubmitButton() {
  // useForm cannot be used without schema generic
  const {
    register,
    defaultValues,
    lastResult,
    schema,
    formId,
    formRef,
    update,
    state,
  } = useForm((state) => ({
    pending: state.pending,
    valid: state.valid,
    dirty: state.dirty,
    disabled: state.disabled,
    submitted: state.submitted,
    values: state.values,
  }));

  return (
    <wa-button type="submit" disabled={state.disabled} loading={state.pending}>
      Submit
    </wa-button>
  );
}

function Windows() {
  const { register, defaultValues, state } = useForm((state) => ({
    disabled: state.disabled,
  }));
  const { items, insert, remove, reorder } = useFieldArray("windows");

  return (
    <div>
      {items.map((item, i) => (
        <li key={item.key}>
          <wa-input
            {...register(`${item.name}.width`)}
            defaultValue={defaultValues?.windows[i]?.width}
            label="Window width"
            type="number"
          ></wa-input>

          <wa-input
            {...register(`${item.name}.height`)}
            defaultValue={defaultValues?.windows[i]?.height}
            label="Window height"
            type="number"
          ></wa-input>

          <wa-button
            disabled={state.disabled}
            onClick={() => remove({ index: i })}
          >
            Remove
          </wa-button>
        </li>
      ))}

      <wa-button disabled={state.disabled} onClick={() => insert()}>
        Insert
      </wa-button>
    </div>
  );
}

function MoodSelect() {
  const { register } = useForm();

  // useField with schema generic infers value and defaultValue type
  const { defaultValue, schema, state } = useField("mood", (state) => ({
    value: state.value,
    valid: state.valid,
    dirty: state.dirty,
    validationMessage: state.validationMessage,
  }));

  const { chill, energetic, productive, reflective } =
    schema.shape["mood"].Enum;

  return (
    <>
      <wa-select
        {...register("mood")}
        defaultValue={defaultValue}
        label="Current mood"
      >
        <wa-option value={energetic}>Energetic</wa-option>
        <wa-option value={chill}>Chill</wa-option>
        <wa-option value={reflective}>Reflective</wa-option>
        <wa-option value={productive}>Productive</wa-option>
      </wa-select>
      {!state.valid ? <em role="alert">{state.validationMessage}</em> : null}
    </>
  );
}
