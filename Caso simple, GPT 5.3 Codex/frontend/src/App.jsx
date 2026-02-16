import { useMemo, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/story";

const initialForm = {
  nombre_nino: "",
  edad: 7,
  tema: "",
  personaje_principal: "",
  vocabulario: "simple",
};

function App() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [story, setStory] = useState(null);
  const [mode, setMode] = useState("frases");
  const [step, setStep] = useState(0);

  const items = useMemo(() => {
    if (!story) return [];
    return mode === "frases" ? story.frases : story.parrafos;
  }, [story, mode]);

  const totalSteps = items.length;
  const currentText = items[step] || "";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "edad" ? Number(value) : value,
    }));
  };

  const validateForm = () => {
    if (!formData.nombre_nino.trim()) return "El nombre del nino es obligatorio.";
    if (!formData.tema.trim()) return "El tema es obligatorio.";
    if (!formData.personaje_principal.trim()) return "El personaje principal es obligatorio.";
    if (!Number.isInteger(formData.edad) || formData.edad < 5 || formData.edad > 9) {
      return "La edad debe estar entre 5 y 9.";
    }
    if (!["simple", "medio"].includes(formData.vocabulario)) {
      return "El vocabulario debe ser simple o medio.";
    }
    return "";
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    setError("");

    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setStory(null);
        setStep(0);
        setError(data.error || "No se pudo generar el cuento.");
        return;
      }

      setStory(data);
      setMode("frases");
      setStep(0);
    } catch {
      setError("No se pudo conectar con el backend.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => setStep((prev) => Math.max(0, prev - 1));
  const handleNext = () => setStep((prev) => Math.min(totalSteps - 1, prev + 1));
  const handleReset = () => setStep(0);
  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setStep(0);
  };

  return (
    <main className="app">
      <section className="card">
        <h1>Cuentos personalizados</h1>
        <p className="subtitle">Lectura infantil progresiva sin persistencia (M0).</p>

        <form onSubmit={handleGenerate} className="form-grid">
          <label>
            Nombre del nino
            <input
              name="nombre_nino"
              type="text"
              value={formData.nombre_nino}
              onChange={handleChange}
              placeholder="Ej. Mateo"
              required
            />
          </label>

          <label>
            Edad (5 a 9)
            <input
              name="edad"
              type="number"
              min="5"
              max="9"
              value={formData.edad}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Tema
            <input
              name="tema"
              type="text"
              value={formData.tema}
              onChange={handleChange}
              placeholder="Ej. amistad en el bosque"
              required
            />
          </label>

          <label>
            Personaje principal
            <input
              name="personaje_principal"
              type="text"
              value={formData.personaje_principal}
              onChange={handleChange}
              placeholder="Ej. una tortuga valiente"
              required
            />
          </label>

          <label>
            Vocabulario
            <select name="vocabulario" value={formData.vocabulario} onChange={handleChange}>
              <option value="simple">simple</option>
              <option value="medio">medio</option>
            </select>
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Generando..." : "Generar cuento"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
      </section>

      {story && (
        <section className="card reading-card">
          <h2>{story.titulo}</h2>

          <div className="mode-selector">
            <span>Modo de lectura:</span>
            <button
              type="button"
              className={mode === "frases" ? "active" : ""}
              onClick={() => handleModeChange("frases")}
            >
              Frases
            </button>
            <button
              type="button"
              className={mode === "parrafos" ? "active" : ""}
              onClick={() => handleModeChange("parrafos")}
            >
              Parrafos
            </button>
          </div>

          <p className="step-indicator">Paso {totalSteps === 0 ? 0 : step + 1} de {totalSteps}</p>

          <article className="reading-box">{currentText}</article>

          <div className="actions">
            <button type="button" onClick={handlePrev} disabled={step === 0}>
              Anterior
            </button>
            <button type="button" onClick={handleNext} disabled={step >= totalSteps - 1}>
              Siguiente
            </button>
            <button type="button" onClick={handleReset}>
              Reiniciar
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
