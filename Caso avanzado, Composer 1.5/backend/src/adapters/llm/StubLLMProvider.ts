import { LLMProvider, GenerateStoryParams } from '../../ports/LLMProvider';

const MOCK_STORIES: string[] = [
  `El cuento mágico de {{nombre}}

Había una vez un niño que soñaba con aventuras increíbles.
Un día encontró un mapa escondido en el jardín.
El mapa mostraba el camino hacia una isla misteriosa.

Decidió seguir el mapa sin decir nada a nadie.
Caminó durante horas hasta llegar a la playa.
Allí encontró un barco pequeño con una vela azul.

Navegó hasta la isla y descubrió un tesoro de amigos.
Todos jugaron juntos hasta que llegó la noche.
Y colorín colorado, este cuento se ha acabado.`,
  `La aventura secreta de {{nombre}}

En un pueblo pequeño vivía una niña muy curiosa.
Una noche escuchó un sonido extraño en el bosque.
Decidió investigar con su linterna y su mascota.

Encontró una puerta escondida entre las raíces de un árbol.
Al abrirla, descubrió un mundo de luciérnagas danzantes.
Las luciérnagas la guiaron hasta un castillo de cristal.

Allí conoció a otros niños de diferentes lugares.
Juntos exploraron salas llenas de libros y estrellas.
Al despedirse, prometieron volver a encontrarse.`,
  `El amigo imaginario de {{nombre}}

Había una vez un niño que tenía un amigo muy especial.
Su amigo solo aparecía cuando dibujaba en su cuaderno.
Juntos viajaban a mundos de colores y fantasía.

Un día el amigo le pidió que lo dibujara en el parque.
Otras niñas y niños se acercaron a mirar el dibujo.
De pronto, todos empezaron a ver al amigo mágico.

Fue una tarde llena de risas y juegos inventados.
Al volver a casa, el niño guardó el dibujo con cuidado.
Nunca olvidaría ese día tan mágico y especial.`,
  `El dragón que no sabía volar

{{nombre}} conocía a un dragón pequeño y tímido.
El dragón había nacido sin alas y se sentía triste.
Todos los días intentaba saltar para alcanzar las nubes.

Un día {{nombre}} le construyó unas alas de papel y hilo.
Juntos las ataron con cuidado al lomo del dragón.
Cuando sopló el viento, el dragón ¡por fin pudo volar!

Recorrieron montañas, ríos y bosques desde el cielo.
Al atardecer regresaron cansados pero muy felices.
El dragón nunca olvidaría a quien le creyó desde el inicio.`,
  `La semilla mágica de {{nombre}}

En el huerto de su abuela, {{nombre}} encontró una semilla dorada.
La plantó con cuidado y regó cada mañana con paciencia.
Pasaron semanas hasta que brotó un tallo brillante.

El tallo creció hasta convertirse en una escalera de hojas.
{{nombre}} subió y subió hasta llegar a una nube suave.
En la nube había un jardín de flores que cantaban canciones.

Recogió unas semillas para compartir con sus amigos.
Bajó por la escalera y las plantó en el jardín del colegio.
A partir de ese día, todos pudieron escuchar las flores cantar.`,
  `El tesoro de los piratas buenos

{{nombre}} soñaba con ser pirata desde que era muy pequeño.
Un día despertó en un barco con velas de colores.
La tripulación estaba formada por animales que hablaban.

El capitán era un loro con parche en el ojo.
Navegaron hasta una isla donde escondieron un tesoro especial.
El tesoro eran libros de cuentos para todos los niños.

Regalaron los libros a escuelas de pueblos cercanos.
{{nombre}} aprendió que los mejores tesoros se comparten.
Y así terminó la aventura más bonita del mar.`,
];

/**
 * Proveedor LLM stub para pruebas sin consumir API real.
 * Devuelve cuentos variados eligiendo aleatoriamente de una colección.
 */
export class StubLLMProvider implements LLMProvider {
  private mockResponse?: string;

  constructor(mockResponse?: string) {
    this.mockResponse = mockResponse;
  }

  async generateStory(params: GenerateStoryParams): Promise<string> {
    const template = this.mockResponse ?? MOCK_STORIES[Math.floor(Math.random() * MOCK_STORIES.length)];
    return template.replace(/\{\{nombre\}\}/g, params.readerName);
  }

  setMockResponse(response: string): void {
    this.mockResponse = response;
  }
}

