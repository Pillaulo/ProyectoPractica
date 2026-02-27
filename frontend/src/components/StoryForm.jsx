const initialForm = {
  nombre_nino: "",
  edad: 5,
  tema: "",
  personaje_principal: "",
  vocabulario: "simple",
};

export const StoryForm = ({ onSubmit, loading }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    onSubmit({
      nombre_nino: String(formData.get("nombre_nino") || ""),
      edad: Number(formData.get("edad")),
      tema: String(formData.get("tema") || ""),
      personaje_principal: String(formData.get("personaje_principal") || ""),
      vocabulario: String(formData.get("vocabulario") || "simple"),
    });
  };

  return (
    <section className="card">
      <h2 className="section-title">Crear cuento ✨</h2>
      <form className="story-form" onSubmit={handleSubmit}>
        <label>
          Nombre del nino
          <input name="nombre_nino" defaultValue={initialForm.nombre_nino} required />
        </label>
        <label>
          Edad (5 a 9)
          <input
            name="edad"
            type="number"
            min="5"
            max="9"
            defaultValue={initialForm.edad}
            required
          />
        </label>
        <label>
          Tema
          <input name="tema" defaultValue={initialForm.tema} required />
        </label>
        <label>
          Personaje principal
          <input
            name="personaje_principal"
            defaultValue={initialForm.personaje_principal}
            required
          />
        </label>
        <label>
          Vocabulario
          <select name="vocabulario" defaultValue={initialForm.vocabulario}>
            <option value="simple">Simple</option>
            <option value="medio">Medio</option>
          </select>
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Generando..." : "Generar cuento"}
        </button>
      </form>
    </section>
  );
};
