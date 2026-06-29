// Spanish course content.
//
// Translation is incremental: `translated` holds the modules we have already
// rendered in Spanish, keyed by module id. Any module not present here falls
// back to its English version, so the course always works end to end while we
// translate one module at a time.
//
// IMPORTANT: every module id and lesson id MUST stay identical to the English
// ones. Saved progress and lesson URLs are keyed by those ids, so they must
// match across languages for a language switch to be seamless.
//
// Translation rules followed here:
//  - n8n UI labels stay in English (Schedule Trigger, Edit Fields (Set),
//    Execute Step, the fx toggle, Name/Value, field names, node names like
//    Remote Gate / Read Resume) so the instructions match the screen.
//  - Snippet `code` stays verbatim (including the two AI example prompts): it is
//    code/content the learner pastes and adapts. Only `label`s are translated.
//  - Tokens stay verbatim: {role}, $json, {{ }} expressions, JSON, SQL.
//  - "score": the action is "evaluar"; the number the AI assigns is "puntuación".

import { modules as modulesEn } from "./course";
import type { Module } from "./types";

const translated: Record<string, Module> = {
  "m2-first-data": {
    id: "m2-first-data",
    title: "Mueve un dato",
    outcome:
      "Después de esto sabrás ejecutar un nodo, leer los datos que se mueven entre nodos y escribir una expresión básica.",
    lessons: [
      {
        id: "l2-1-items",
        moduleId: "m2-first-data",
        title: "Todo es una lista de items",
        estMinutes: 10,
        device: "laptop",
        why: "n8n pasa los datos entre pasos como una lista de items. Cada item es un pequeño paquete de datos. La mayoría de los nodos se ejecutan una vez por cada item que reciben. Esta sola idea explica casi todo lo que viene después, incluido el peor bug del curso.",
        steps: [
          "Abre n8n y crea un nuevo workflow.",
          "Añade un nodo Schedule Trigger. Así es como una automatización arranca por sí sola, con un temporizador.",
          "Haz clic en Execute Step y abre el panel de salida (output) a la derecha.",
          "Lee la salida. Es un único item, con forma de un pequeño bloque de datos bajo un campo json. Esa forma es lo que fluye entre todos los nodos.",
        ],
        snippets: [
          {
            label: "La forma de un item",
            code: String.raw`{
  "json": {
    "timestamp": "2026-06-09T13:00:00.000Z"
  }
}`,
          },
        ],
        images: [
          {
            src: "/images/trigger-input.png",
            caption:
              "El panel de ajustes de Schedule Trigger. Reproduce esta configuración antes de ejecutar el paso.",
            afterStep: 2,
          },
        ],
        tryIt:
          "Ejecuta el Schedule Trigger una vez y encuentra el timestamp en el panel de salida. Ese panel es donde comprobarás tu trabajo durante el resto del curso.",
        check:
          "Puedes señalar un item en el panel de salida y leer un valor dentro de su json.",
      },
      {
        id: "l2-2-expressions",
        moduleId: "m2-first-data",
        title: "Escribe tu primera expresión",
        estMinutes: 10,
        device: "laptop",
        why: "Una expresión es un pequeño trozo de código entre llaves dobles que extrae un valor de los datos que entran. Es la forma en que un nodo usa lo que produjo otro nodo.",
        steps: [
          "Añade un nodo Edit Fields (Set) después del Schedule Trigger.",
          "Añade un campo. Cada campo tiene dos casillas: un Name a la izquierda y un Value a la derecha. En la casilla Name, escribe greeting.",
          "Ahora mira la casilla Value, justo a la derecha del Name. Haz clic en el pequeño interruptor fx de esa casilla Value para cambiarla de un valor fijo a modo expresión.",
          "Con esa casilla Value en modo expresión, pega dentro la expresión de abajo. Aquí es donde va la expresión: en la casilla Value del campo greeting, no en el Name.",
          "Ejecuta el paso y lee el greeting en el panel de salida. La parte dentro de las llaves se reemplaza por el timestamp real.",
        ],
        images: [
          {
            src: "/images/set-node-expression.png",
            caption:
              "El campo greeting en el nodo Set. El Name (greeting) está a la izquierda; la expresión va en la casilla Value a la derecha, con su interruptor fx activado para el modo expresión.",
            afterStep: 3,
          },
        ],
        snippets: [
          {
            label:
              "Pega esto en la casilla Value del campo greeting (modo expresión)",
            code: String.raw`Hello, this run started at {{ $json.timestamp }}`,
          },
        ],
        tryIt:
          "En esa misma casilla Value, cambia el greeting para que incluya {role} como texto normal y siga conservando el timestamp de la expresión. Confirma que ambos aparecen en la salida.",
        check:
          "La salida muestra un saludo con un valor en vivo traído por la expresión.",
        pitfall: {
          title: "$json es el item actual",
          body: "$json siempre significa los datos que entran a este nodo ahora mismo. Cuando necesites datos de un nodo anterior por su nombre, usas $('Node Name') en su lugar. Lo harás pronto.",
        },
      },
    ],
  },

  "m3-real-data": {
    id: "m3-real-data",
    title: "Trae datos reales",
    outcome:
      "Después de esto sabrás llamar a una API de búsqueda y convertir su respuesta en una lista limpia de enlaces a empleos.",
    lessons: [
      {
        id: "l3-1-search",
        moduleId: "m3-real-data",
        title: "Llama a una API de búsqueda",
        estMinutes: 13,
        device: "laptop",
        why: "Buscar en Google directamente desde un script es frágil y va contra sus términos. Una API de búsqueda lo hace bien y te devuelve resultados limpios. Buscarás {role} y obtendrás una lista de resultados.",
        steps: [
          "Crea una cuenta en SerpApi y copia tu API key. El enlace de registro está abajo.",
          "Añade un nodo HTTP Request después de tu trigger.",
          "Pon Method en GET y la URL en el endpoint de búsqueda de SerpApi: https://serpapi.com/search.json. Deja Authentication en None.",
          "Activa Send Query Parameters y deja Specify Query Parameters en Using Fields Below. Ahora añades cada parámetro como un par Name y Value, usando el signo más de la derecha.",
          "Añade un parámetro llamado engine con el valor google. Esto le dice a SerpApi qué motor de búsqueda usar.",
          "Añade un parámetro llamado q. Esta es la búsqueda en sí. Pega la consulta de abajo como su valor y luego ajústala para buscar {role} en el sitio que elijas.",
          "Añade un parámetro llamado api_key y pega tu propia key de SerpApi como su valor.",
          "Ejecuta el paso y abre la salida. Busca organic_results, la lista de resultados de búsqueda.",
        ],
        images: [
          {
            src: "/images/http-serpapi-config.png",
            caption:
              "La configuración completa del HTTP Request: GET, URL https://serpapi.com/search.json, Authentication None, Send Query Parameters activado y tres parámetros — engine = google, q = tu consulta de búsqueda y api_key = tu propia key de SerpApi.",
            afterStep: 4,
          },
        ],
        links: [{ label: "Abrir SerpApi", href: "https://serpapi.com/" }],
        snippets: [
          {
            label: "Valor del parámetro q (tu consulta de búsqueda)",
            code: String.raw`site:teamedforlearning.com instructional designer remote`,
          },
        ],
        tryIt:
          "Cambia el parámetro q por una búsqueda de {role}. Ejecútalo y confirma que organic_results vuelve con resultados reales.",
        check:
          "El panel de salida contiene una lista organic_results con entradas que parecen anuncios reales.",
        pitfall: {
          title: "Lee la forma antes de confiar en ella",
          body: "Las APIs no siempre devuelven lo que esperas. Antes de construir sobre una respuesta, abre la salida y confirma que el campo que quieres está realmente ahí y tiene la forma que crees.",
        },
      },
      {
        id: "l3-2-parse",
        moduleId: "m3-real-data",
        title: "Filtra hasta los enlaces de empleo reales",
        estMinutes: 12,
        device: "laptop",
        why: "Los resultados de búsqueda incluyen más que páginas de empleo. Un nodo Code te permite quedarte solo con los anuncios reales y reformarlos en items limpios con solo los campos que necesitas.",
        steps: [
          "Añade un nodo Code después del HTTP Request.",
          "Pon su modo en Run Once for All Items, porque vas a devolver una lista nueva.",
          "Pega el fragmento de abajo. Comprueba que la respuesta tiene la forma esperada, conserva solo los enlaces que parecen páginas de empleo y devuelve un item ordenado por cada uno.",
          "Ejecuta el paso y lee la lista limpia en la salida.",
        ],
        images: [
          {
            src: "/images/code-node-mode-all-items.png",
            caption:
              "El Mode del nodo Code puesto en Run Once for All Items — el modo correcto cuando devuelves una lista nueva en lugar de editar un item cada vez.",
            afterStep: 2,
          },
        ],
        snippets: [
          {
            label: "Nodo Code: conserva solo los enlaces de empleo",
            code: [
              "const results = $input.first().json.organic_results;",
              "if (!Array.isArray(results)) {",
              "  throw new Error(`Expected organic_results array, got ${typeof results}. Check the SerpApi response.`);",
              "}",
              "",
              "return results",
              "  .filter((r) => r.link && r.link.includes('/job-post/'))",
              "  .map((r) => ({",
              "    json: {",
              "      title: r.title || '',",
              "      url: r.link || '',",
              "      snippet: r.snippet || '',",
              "    },",
              "  }));",
            ].join("\n"),
          },
        ],
        asides: [
          {
            title: "¿Sabías que...?",
            body: [
              "Un nodo Code se ejecuta en uno de dos modos, y esa elección decide qué recibe tu código y qué debe devolver.",
              "Run Once for All Items ejecuta tu código una sola vez para todo el lote. Lees todos los items que entran de una vez con $input.all() y devuelves un array nuevo de items. Úsalo cuando filtras, reformas o cambias la cantidad de items — justo lo que haces aquí, donde muchos resultados de búsqueda se convierten en una lista más corta de enlaces de empleo limpios.",
              "Run Once for Each Item ejecuta tu código una vez por item. Recibes un único item con $input.item y devuelves un item. Úsalo cuando cada item se transforma por su cuenta y la cantidad se mantiene: uno entra, uno sale.",
              "Regla práctica: si tu código devuelve una lista o cambia la cantidad de items, usa Run Once for All Items. Si edita un item cada vez sin añadir ni quitar ninguno, usa Run Once for Each Item. Pasarle un array al modo Each Item es el error más común del nodo Code, porque ese modo espera exactamente un item.",
            ],
          },
        ],
        tryIt:
          "Busca la línea .filter(...) en el fragmento. Conserva solo los enlaces cuya URL contiene /job-post/, que es como Teamed marca una página de empleo real. Abre un anuncio real en el sitio que elegiste y mira su dirección web: reemplaza /job-post/ por la ruta que use tu sitio para un anuncio. Ejecuta el nodo y confirma que solo quedan anuncios reales, cada uno con un title y una url.",
        check:
          "La salida es una lista limpia donde cada item es un anuncio de empleo real con un title y una url.",
        pitfall: {
          title: "Ajusta el modo del nodo Code a los datos",
          body: "Este nodo devuelve una lista, así que debe ejecutarse en Run Once for All Items. Run Once for Each Item espera un item cada vez y dará error aquí. Elige el modo que coincida con la forma que devuelves.",
        },
      },
    ],
  },

  "m4-messy-pages": {
    id: "m4-messy-pages",
    title: "Lee páginas desordenadas",
    outcome:
      "Después de esto sabrás extraer datos estructurados de una página web en bruto y filtrar por ellos, conservando el matiz en lugar de tirarlo.",
    lessons: [
      {
        id: "l4-1-fetch",
        moduleId: "m4-messy-pages",
        title: "Descarga la página en bruto",
        estMinutes: 10,
        device: "laptop",
        why: "Este es tu segundo HTTP Request, y hace un trabajo distinto del primero. El primero buscó en SerpApi y devolvió una lista donde cada empleo es solo un título, un enlace y un fragmento de una línea — no suficiente para juzgar un puesto. Para leer de verdad un anuncio necesitas la página a la que apunta. Así que este nodo visita la URL propia de cada empleo y descarga la página completa como HTML en bruto, que los siguientes pasos leerán para el modelo de trabajo y la descripción completa.",
        steps: [
          "Añade un segundo nodo HTTP Request después de tu nodo Code. El primero buscaba; este abre cada página de empleo.",
          "Pon Method en GET. En el campo URL, haz clic en el interruptor fx e introduce la expresión de abajo. Como este nodo se ejecuta una vez por item, la expresión resuelve a un enlace de empleo distinto en cada ejecución.",
          "Abre Options, añade la sección Response y pon Response Format en Text. Este es el ajuste que la gente olvida: sin él n8n intenta parsear la página y pierdes el HTML en bruto.",
          "En Put Output in Field, escribe data. Ese es el nombre del campo donde aterriza el HTML en bruto, y por eso los pasos posteriores lo leen de json.data.",
          "Ejecuta el paso y confirma que el HTML en bruto aterriza en el campo data de cada item.",
        ],
        images: [
          {
            src: "/images/http-fetch-response-text.png",
            caption:
              "El segundo HTTP Request: Method GET, URL puesta en la expresión {{ $json.url }} (fíjate en el enlace de empleo real previsualizado debajo) y, en Options → Response, Response Format = Text con Put Output in Field = data.",
            afterStep: 4,
          },
        ],
        snippets: [
          {
            label: "Pon esto en el campo URL (modo expresión)",
            code: String.raw`{{ $json.url }}`,
          },
        ],
        asides: [
          {
            title: "¿Qué es {{ $json.url }}?",
            body: [
              "$json es el item que entra a este nodo ahora mismo. Cada item aquí es un empleo limpio del nodo Code anterior, con forma { url, title, snippet }. Así que $json.url lee el campo url de ese empleo.",
              "Las llaves dobles le dicen a n8n que evalúe el código que hay dentro en lugar de tratarlo como texto normal. {{ $json.url }} se convierte entonces en el enlace de empleo real, por ejemplo https://www.teamedforlearning.com/job-post/....",
              "Como un HTTP Request se ejecuta una vez por cada item que recibe, $json apunta a un empleo distinto en cada ejecución. Una expresión, muchas páginas: el nodo descarga la página de cada empleo por turnos.",
            ],
          },
        ],
        tryIt:
          "Ejecuta la descarga sobre tu propia lista de enlaces y confirma que ves el HTML real de la página en el campo data de cada item.",
        check: "Cada item ahora lleva el HTML en bruto de su página de empleo en json.data.",
        pitfall: {
          title: "Response Format debe ser Text",
          body: "Si dejas el valor por defecto, n8n intenta parsear la respuesta y pierdes el HTML en bruto que necesitas. Pon Response Format en Text para que la página llegue como una cadena de texto plano en data.",
        },
      },
      {
        id: "l4-2-keep-remote",
        moduleId: "m4-messy-pages",
        title: "Conserva solo lo remoto",
        estMinutes: 12,
        device: "laptop",
        why: "Ahora filtras. Teamed muestra el modelo de trabajo como una etiqueta en la página. Lees esa etiqueta y conservas solo los puestos totalmente remotos, descartando híbrido y presencial.",
        steps: [
          "Añade un nodo Code después de la descarga, en modo Run Once for All Items. Nómbralo Remote Gate, el nombre que referenciarán los módulos posteriores.",
          "Por cada item, lee el HTML de json.data.",
          "Encuentra la etiqueta del modelo de trabajo con el fragmento de abajo y conserva el item solo cuando diga Remote.",
          "Ejecuta y confirma que los anuncios híbridos y presenciales han desaparecido.",
        ],
        snippets: [
          {
            label: "Nodo Code: encuentra la etiqueta del modelo de trabajo y conserva lo remoto",
            code: String.raw`const results = [];
for (const item of $input.all()) {
  const html = item.json.data;
  if (typeof html !== 'string') {
    throw new Error('Expected raw HTML in json.data. Set the fetch Response Format to Text.');
  }
  const labelMatch = html.match(/<div class="job-main-detail">[\s\S]*?<label>\s*([\s\S]*?)\s*<\/label>/i);
  if (!labelMatch) throw new Error('Could not find the work-model label.');
  const workModel = labelMatch[1].split('|')[0].trim();
  if (workModel.toLowerCase() !== 'remote') continue; // drop hybrid and on-site
  results.push({ json: { url: item.json.url, work_model: workModel } });
}
return results;`,
          },
        ],
        tryIt:
          "Si tu sitio elegido marca el trabajo remoto de otra forma, encuentra dónde vive en la página y ajusta el match. Ejecútalo y confirma que solo quedan puestos remotos. ¿No estás seguro de dónde vive? Pega un trozo del HTML de tu página de empleo en el asistente de IA de n8n, o abre la pestaña Ask AI en el nodo Code, y pídele que encuentre el marcador del modelo de trabajo para tu sitio y actualice el match — puede leer el HTML y ajustar el selector por ti.",
        check: "Solo sobreviven a este paso los anuncios totalmente remotos.",
        pitfall: {
          title: "Los datos reales no tienen una marca limpia",
          body: "Los datos estructurados de Teamed no tienen un campo remoto legible por máquina, así que lees la etiqueta visible en su lugar. Esto es normal. Extraes lo que de verdad está en la página, no lo que desearías que estuviera.",
        },
      },
      {
        id: "l4-3-flag-dont-drop",
        moduleId: "m4-messy-pages",
        title: "Marca, no descartes",
        estMinutes: 13,
        device: "laptop",
        why: "Algunos empleos remotos quieren en silencio que estés en el sitio, que te reubiques o que viajes a una oficina. Descartarlos pierde buenos puestos. Marcarlos mantiene el puesto visible y te avisa de que lo leas con atención. También extraes los datos limpios del empleo de los datos estructurados de la página.",
        steps: [
          "Reemplaza el cuerpo de tu nodo Remote Gate por el gate completo de abajo. Hace todo lo del paso anterior, más los detalles.",
          "Parsea el JSON-LD de la página para obtener el JobPosting estructurado con el título y la descripción.",
          "Escanea la descripción en busca de lenguaje con salvedades como must be local, relocate o travel to our offices.",
          "Cuando lo encuentra, pone una marca location_caveat y conserva el fragmento que la activó, sin descartar el item.",
          "Ejecuta y lee los resultados: un item limpio por cada empleo remoto, con la marca adjunta.",
        ],
        snippets: [
          {
            label: "Nodo Code: el remote gate completo",
            code: String.raw`// Remote gate — Mode: Run Once for All Items
// Keeps fully-remote jobs, flags location caveats, and exposes the full
// job description so the cover-letter step can use it later.

const results = [];

const caveatPatterns = [
  /candidates?\s+local\s+to/i,
  /local\s+to\s+our/i,
  /top\s+consideration\s+will\s+be\s+given\s+to\s+candidates\s+local/i,
  /preference\s+(?:will\s+be\s+)?given\s+to\s+(?:local|candidates\s+local)/i,
  /must\s+(?:be\s+)?(?:located|based|reside|live)\s+(?:in|within|near)/i,
  /relocat/i,
  /travel\s+to\s+(?:our\s+)?offices?/i,
];

function findCaveat(text) {
  for (const re of caveatPatterns) {
    const m = text.match(re);
    if (m) {
      const start = Math.max(0, m.index - 30);
      return text.slice(start, m.index + m[0].length + 60).trim();
    }
  }
  return null;
}

for (const item of $input.all()) {
  const html = item.json.data;
  if (typeof html !== 'string') {
    throw new Error('Expected raw HTML in json.data. Set the Fetch job page HTTP Request "Response Format" to Text.');
  }

  const labelMatch = html.match(
    /<div class="job-main-detail">[\s\S]*?<label>\s*([\s\S]*?)\s*<\/label>/i
  );
  if (!labelMatch) {
    throw new Error('Could not find the work-model label. Paste the raw HTML so I can adjust the selector.');
  }

  const workModel = labelMatch[1].split('|')[0].trim();
  if (workModel.toLowerCase() !== 'remote') {
    continue;
  }

  const blocks = [...html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  )].map((m) => m[1].trim());

  let job = null;
  for (const block of blocks) {
    let parsed;
    try { parsed = JSON.parse(block); } catch { continue; }
    if (parsed && parsed['@type'] === 'JobPosting') { job = parsed; break; }
  }

  const descText = ((job && job.description) || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const caveat = findCaveat(descText);

  const org = job && job.hiringOrganization;
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/i) || [])[1] || null;

  results.push({
    json: {
      title: (job && job.title) || null,
      company: (org && typeof org === 'object' ? org.name : org) || null,
      url: canonical || item.json.url || null,
      date_posted: (job && job.datePosted) || null,
      work_model: workModel,
      is_remote: true,
      location_caveat: Boolean(caveat),
      caveat_reason: caveat,
      description: descText,   // full job text, used later by the cover-letter step
    },
  });
}

return results;`,
          },
        ],
        tryIt:
          "Ejecuta el gate completo sobre anuncios para {role}. Encuentra uno que sea remoto pero mencione estar en local o viajar, y confirma que se queda en la lista con location_caveat en true. ¿Lo adaptas a otro sitio? El match de la etiqueta y el parseo del JSON-LD son las partes que cambian. Pega una muestra del HTML de tu página en el asistente de IA de n8n, o usa la pestaña Ask AI en el nodo Code, y pídele que localice el modelo de trabajo y los datos JobPosting de tu sitio y reescriba los matches — luego pruébalo en una página antes de confiar en él.",
        check:
          "Tu salida es una lista limpia de empleos remotos, y los que tienen una pega de ubicación quedan marcados en lugar de eliminados.",
        pitfall: {
          title: "Marca, no descartes",
          body: "Un filtro binario de conservar-o-eliminar tira buenos puestos que mencionan viajes ocasionales. Codificar el matiz como una marca deja la decisión en tus manos, que es donde debe estar.",
        },
      },
    ],
  },

  "m5-memory": {
    id: "m5-memory",
    title: "Dale memoria",
    outcome:
      "Después de esto sabrás evitar que un workflow encuentre los mismos empleos cada día, usando una clave natural.",
    lessons: [
      {
        id: "l5-1-table",
        moduleId: "m5-memory",
        title: "Crea un lugar para recordar",
        estMinutes: 12,
        device: "laptop",
        why: "Un workflow sin memoria encuentra los mismos empleos cada mañana y te avisa de todos otra vez. La memoria es una tabla que registra lo que ya has visto, para que solo te enteres de coincidencias nuevas para {role}. La url es la clave natural, el único valor que es único en cada anuncio.",
        steps: [
          "Crea un proyecto gratuito de Supabase. El enlace de registro está abajo.",
          "Abre el SQL editor y ejecuta el fragmento de abajo para crear la tabla job_alerts.",
          "Fíjate en que url está marcada UNIQUE. Eso es lo que permite al workflow distinguir lo nuevo de lo ya visto.",
          "Ahora conecta n8n a ella: añade una credencial de Supabase. Necesita dos valores de tu proyecto — un Host y un Service Role Secret.",
          "En Supabase, abre Project Settings (el engranaje en la barra lateral izquierda), luego la sección API. Copia la Project URL en Host, y copia la key service_role (bajo Project API keys — haz clic para revelarla) en Service Role Secret.",
          "Deja Allowed HTTP Request Domains en All y guarda. n8n muestra Connection tested successfully cuando el Host y el secreto son correctos.",
        ],
        images: [
          {
            src: "/images/supabase-auth.png",
            caption:
              "La credencial de Supabase en n8n: Host es la URL de tu proyecto (termina en .supabase.co) y Service Role Secret es la key service_role. Connection tested successfully significa que ambos son correctos.",
            afterStep: 4,
          },
        ],
        links: [{ label: "Abrir Supabase", href: "https://supabase.com/" }],
        snippets: [
          {
            label: "Crea la tabla job_alerts",
            code: String.raw`create table public.job_alerts (
  id bigint generated always as identity primary key,
  title text,
  url text unique,                                 -- the natural key used for dedup
  score integer,
  reason text,
  found_at timestamp with time zone default now(),
  location_caveat boolean not null default false,
  caveat_reason text
);`,
          },
        ],
        asides: [
          {
            title: "Dónde encontrar el Host y el Service Role Secret",
            body: [
              "En un proyecto nuevo de Supabase, ambos valores viven en el mismo sitio. Haz clic en el engranaje (Project Settings) en la barra lateral izquierda, luego abre la sección API.",
              "La Project URL es tu Host — cópiala tal cual, incluido el https:// y el final .supabase.co. Bajo Project API keys verás más de una key; la que quieres es service_role, marcada como secret. Revélala, cópiala y pégala en Service Role Secret.",
              "La key service_role puede leer y escribir toda tu base de datos, así que trátala como una contraseña: pertenece solo a esta credencial de n8n, nunca a una captura de pantalla ni a un archivo compartido.",
            ],
          },
        ],
        tryIt:
          "Ejecuta el fragmento, luego abre el table editor y confirma que job_alerts existe aún sin filas, lista para llenar.",
        check:
          "La tabla job_alerts existe en tu proyecto de Supabase y tiene una columna url marcada como unique.",
        pitfall: {
          title: "Elige una clave natural a propósito",
          body: "url es única por anuncio, así que es la clave honesta para distinguir nuevo de visto. Elegir la clave correcta aquí es lo que hace fiable la deduplicación más adelante.",
        },
      },
      {
        id: "l5-2-dedup",
        moduleId: "m5-memory",
        title: "Salta lo que ya has visto",
        estMinutes: 18,
        device: "laptop",
        why: "Ahora le enseñas al workflow a saltar los empleos que ya ha guardado. Lee todo lo que ya está en la tabla, luego conserva solo los anuncios remotos que aún no están ahí.",
        steps: [
          "Añade un nodo Supabase. Pon Resource en Row, Operation en Get Many y Table Name or ID en job_alerts — la tabla de memoria que creaste en la lección anterior. Activa Return All y nombra el nodo Get many rows.",
          "Añade un nodo Code después, en modo Run Once for All Items. Nómbralo Check for new alerts.",
          "Pega el fragmento. Lee tres cosas — las urls que ya están en la tabla, las urls que pasaron el Remote Gate y los empleos extraídos que aún llevan su snippet — y luego conserva solo los empleos extraídos que son a la vez remotos y completamente nuevos. Se refiere a esos nodos por su nombre (Get many rows, Remote Gate, Code in JavaScript), así que renómbralos en el código si los tuyos difieren.",
        ],
        images: [
          {
            src: "/images/supabase-config.png",
            caption:
              "El nodo Get many rows. job_alerts es la tabla que creaste en la lección anterior, seleccionada aquí en Table Name or ID. Con Resource Row, Operation Get Many y Return All activado, el nodo devuelve todas las filas ya guardadas — tu lista de ya-vistos.",
            afterStep: 1,
          },
        ],
        snippets: [
          {
            label: "Check for new alerts (nodo Code)",
            code: String.raw`// Jobs already saved in the database.
const existingUrls = $('Get many rows').all().map(item => item.json.url);

// URLs that PASSED the remote filter (Remote Gate output).
const remoteUrls = $('Remote Gate').all().map(item => item.json.url);

// The scraped jobs WITH their snippet (the early parse node).
const scraped = $('Code in JavaScript').all();

// Keep only jobs that are BOTH remote AND brand new.
const newJobs = scraped.filter(item =>
  remoteUrls.includes(item.json.url) &&     // must have survived the Remote Gate
  !existingUrls.includes(item.json.url)     // must not already be in the DB
);

if (newJobs.length === 0) {
  return [{ json: { skip: true } }];
}

return newJobs;`,
          },
        ],
        tryIt:
          "Ejecuta el workflow. Con la tabla aún vacía, cada empleo remoto debería pasar como nuevo. Has construido el mecanismo que los saltará una vez estén guardados.",
        check:
          "El nodo Check for new alerts devuelve tus empleos remotos mientras la tabla está vacía, listo para la guarda que añades a continuación.",
        pitfall: {
          title: "Lee la lista extraída, pero protégela con el gate",
          body: "Esto conserva items del nodo de extracción porque aún llevan el snippet que querrás más adelante. Por sí sola esa lista en bruto incluye empleos presenciales, así que el check remoteUrls.includes la protege: un empleo sobrevive solo si su url también pasó el Remote Gate. Remoto y nuevo — ambos checks juntos.",
        },
      },
      {
        id: "l5-3-guard",
        moduleId: "m5-memory",
        title: "Para cuando no hay nada nuevo",
        estMinutes: 8,
        device: "laptop",
        why: "La mayoría de las mañanas no habrá nada nuevo. Sin una guarda, el workflow ejecutaría igualmente la evaluación con IA y dispararía alertas con las manos vacías — llamadas desperdiciadas, y a veces errores. Así que justo después de Check for new alerts añades un IF que solo deja pasar empleos nuevos reales y detiene la ejecución en silencio cuando no hay nada que hacer.",
        steps: [
          "Añade un nodo IF justo después de Check for new alerts.",
          "Añade una condición. A la izquierda, cambia a modo expresión e introduce {{ $json.skip }}. Pon el operador en is not equal to, y el valor de la derecha en true.",
          "Deja Convert types where required activado, para que el texto true se compare limpiamente.",
          "Conecta la salida true hacia el resto del workflow — la evaluación viene a continuación. Deja la salida false sin conectar: ese es el caso de nada-nuevo, y la ejecución simplemente termina ahí.",
        ],
        images: [
          {
            src: "/images/code-if-setup.png",
            caption:
              "La condición del IF: {{ $json.skip }} is not equal to true, con Convert types where required activado. Los empleos reales (sin campo skip) toman la rama true; la marca de nada-nuevo toma la rama false.",
            afterStep: 2,
          },
        ],
        snippets: [
          {
            label: "La condición del IF (lado izquierdo, modo expresión)",
            code: String.raw`{{ $json.skip }}`,
          },
        ],
        asides: [
          {
            title: "¿Qué es {{ $json.skip }}, y qué está leyendo el IF?",
            body: [
              "El nodo Check for new alerts manda una de dos cosas a este IF. Cuando hay empleos nuevos, manda esos items de empleo extraídos, cada uno con una url, un title y un snippet. Cuando no hay nada nuevo, manda un único item con forma { json: { skip: true } } — una pequeña marca, no un empleo.",
              "{{ $json.skip }} lee el campo skip del item actual. En un empleo real ese campo no existe, así que está vacío; en la marca de nada-nuevo es true. Ese único campo es como el workflow distingue los dos casos.",
              "Así que el IF pregunta: ¿es skip distinto de true? Los empleos reales responden que sí y salen por la rama true hacia la evaluación. La marca responde que no y sale por la rama false, que dejas sin conectar para que la ejecución termine en silencio.",
            ],
          },
        ],
        tryIt:
          "Con tu tabla aún vacía, ejecuta el workflow y observa cómo los empleos reales salen del IF por la rama true. Luego fuerza el otro caso: ejecútalo de nuevo una vez esos empleos estén guardados, o alimenta temporalmente la marca skip, y confirma que la ejecución se detiene en el IF.",
        check:
          "Los empleos nuevos reales continúan más allá del IF por la rama true, y cuando no hay nada nuevo el workflow se detiene en el IF.",
        pitfall: {
          title: "La rama true es la que continúa",
          body: "Es fácil conectar la salida equivocada. Aquí la condición es skip is not equal to true, así que los empleos reales la hacen true y deben salir por la salida true. La salida false es la marca de nada-nuevo, y la dejas sin conectar a propósito.",
        },
      },
    ],
  },

  "m6-ai-score": {
    id: "m6-ai-score",
    title: "Deja que la IA juzgue",
    outcome:
      "Después de esto sabrás usar un modelo para evaluar empleos y leer su salida de forma segura, y luego guardar los resultados.",
    lessons: [
      {
        id: "l6-1-score",
        moduleId: "m6-ai-score",
        title: "Evalúa cada empleo con IA",
        estMinutes: 15,
        device: "laptop",
        why: "Un modelo puede leer un anuncio y dar a cada empleo una puntuación de 0 a 10 con una razón breve. Eso convierte una lista larga en una ordenada, para que dediques atención a las mejores coincidencias para {role}.",
        steps: [
          "Añade un nodo AI Agent después de tu guarda IF.",
          "Adjunta un nodo OpenAI Chat Model al agente como su modelo. El agente usa el modelo para producir la respuesta.",
          "La primera vez, el nodo del modelo pide una credencial de OpenAI. Crea una y pega tu OpenAI API key en el campo API Key — es el único campo obligatorio. Deja Base URL por defecto. n8n muestra Connection tested successfully cuando la key es válida.",
          "En el system prompt del agente, describe cómo se ve una coincidencia fuerte y una débil para {role}, y exige la respuesta como JSON estricto. El ejemplo de abajo es uno real: empieza con los filtros duros, luego las señales para puntuar más alto, y luego la forma JSON exacta.",
          "Ejecuta y lee la salida. Llega como una cadena de JSON en el campo output.",
        ],
        images: [
          {
            src: "/images/openai-config.png",
            caption:
              "La credencial de OpenAI en n8n. Pega tu key en API Key — el único campo obligatorio — y deja Base URL en https://api.openai.com/v1. Connection tested successfully significa que la key funciona.",
            afterStep: 3,
          },
        ],
        links: [
          {
            label: "Consigue una OpenAI API key",
            href: "https://platform.openai.com/api-keys",
          },
        ],
        snippets: [
          {
            label: "Un prompt de evaluación real (adapta la identidad y los filtros a ti)",
            code: String.raw`You are a job-relevance scoring agent for Cristina, a software engineer and curriculum developer looking for remote AI/EdTech instructional design and curriculum development roles in the USA.

Score each job 1-10. Apply these HARD FILTERS first — if any apply, score 1:
- K-12 focused = score 1
- On-site or in-office only = score 1
- Math-specific curriculum = score 1
- Manager or director level = score 1
- Located outside the USA = score 1

Score HIGHER for:
- Contract or part-time = high
- Remote = high
- AI, EdTech, or instructional design focus = high
- Curriculum developer or instructional designer title = high
- Entry to mid level = high

Respond ONLY in this exact JSON format:
{"score": 8, "reason": "Short explanation", "title": "the job title", "url": "the url"}`,
          },
        ],
        asides: [
          {
            title: "Por qué dos nodos: el agente y el modelo",
            tone: "violet",
            after: "steps",
            body: [
              "Añadiste dos nodos para un trabajo, lo que sorprende a la gente. El AI Agent es el orquestador — sostiene el system prompt, ejecuta la petición y puede usar herramientas. El OpenAI Chat Model es el cerebro que enchufas en él: el modelo real que lee el texto y escribe la respuesta.",
              "Conectas el modelo debajo del agente, no en el flujo principal. Piénsalo como darle un motor al agente. Más adelante podrías cambiar el motor por un modelo distinto sin tocar nada más.",
            ],
          },
          {
            title: "Anatomía de un buen prompt de evaluación",
            body: [
              "Quién eres y qué quieres. La primera línea nombra el rol, las áreas de enfoque y la ubicación, para que cada puntuación se juzgue contra ti y no contra un candidato genérico.",
              "Los filtros duros primero. Son los factores eliminatorios que siempre deberían puntuar 1 — nivel equivocado, ubicación equivocada, público equivocado. Listarlos arriba evita que el modelo sea indulgente con un empleo que claramente no es para ti.",
              "Las señales blandas después. Las cosas que suben una puntuación en lugar de descalificarla. Aquí viven tus preferencias reales, así que dedica tu tiempo de edición a esto.",
              "Una forma de salida estricta. Terminar con el JSON exacto, y la palabra ONLY, es lo que permite al siguiente paso parsear la respuesta. Sin ello el modelo añade texto charlatán y el parseo de más abajo se rompe.",
            ],
          },
          {
            title: "Mantén el coste (y las sorpresas) bajo control",
            tone: "emerald",
            body: [
              "Evaluar es barato, pero unos pocos hábitos lo mantienen así. Elige un modelo pequeño y rápido como gpt-4o-mini en el nodo Chat Model — evalúa bien los anuncios de empleo por una fracción del precio de los modelos más grandes.",
              "Pon la temperature del modelo baja, cerca de 0. Quieres puntuaciones consistentes para el mismo empleo, no creatividad, así que una temperature baja hace que el agente responda igual en cada ejecución.",
              "Prueba con un solo empleo antes de ejecutar la lista entera. Evaluar un anuncio cuesta una fracción de céntimo, así que itera el prompt ahí primero, y luego suéltalo sobre el lote completo.",
            ],
          },
        ],
        tryIt:
          "Adapta el prompt de ejemplo a {role} — tu línea de identidad, tus filtros duros, tus señales de mayor puntuación — manteniendo el JSON estricto al final. Ejecútalo y lee tres de las razones para ver si estás de acuerdo.",
        check:
          "Cada empleo sale con una puntuación y una razón de una frase en el campo output.",
        pitfall: {
          title: "La salida es una cadena, no un objeto",
          body: "El modelo devuelve el JSON como texto. Para leer un campo más abajo lo parseas primero con JSON.parse(...). Leerlo como si ya fuera un objeto te da undefined.",
        },
      },
      {
        id: "l6-2-save",
        moduleId: "m6-ai-score",
        title: "Guarda los empleos evaluados",
        estMinutes: 15,
        device: "laptop",
        why: "Ahora escribe cada empleo evaluado en tu tabla para que el workflow lo recuerde. Como el nodo anterior te entregó el JSON como texto, lo parseas a medida que mapeas cada campo.",
        steps: [
          "Añade un nodo Supabase configurado en Create a Row en job_alerts. Nómbralo Create a row.",
          "Mapea cada columna desde la salida parseada de la IA, como en el fragmento.",
          "Para los campos de caveat, búscalos en tu gate emparejando por url, ya que el nodo de IA no arrastra esos datos.",
          "Ejecuta el workflow entero, luego ejecútalo una segunda vez. Esta vez el paso de deduplicación no encuentra nada nuevo, porque los empleos ya están guardados.",
        ],
        images: [
          {
            src: "/images/supabase-create-row-mapping.png",
            caption:
              "El mapeo de Create Row: Operation Create, Table job_alerts, y cada Field Value una expresión. title, url y score parsean la respuesta de la IA con JSON.parse; los campos de caveat (más abajo) tiran del nodo Remote Gate en su lugar.",
            afterStep: 2,
          },
        ],
        snippets: [
          {
            label: "Mapea cada columna desde la salida parseada",
            code: String.raw`title           = {{ JSON.parse($json.output).title }}
url             = {{ JSON.parse($json.output).url }}
score           = {{ Number(JSON.parse($json.output).score) }}
reason          = {{ JSON.parse($json.output).reason }}
location_caveat = {{ $('Remote Gate').all().find(g => g.json.url === JSON.parse($json.output).url)?.json.location_caveat }}
caveat_reason   = {{ $('Remote Gate').all().find(g => g.json.url === JSON.parse($json.output).url)?.json.caveat_reason }}`,
          },
        ],
        asides: [
          {
            title: "Dos tipos de valor: parsearlo, o traerlo de otro nodo",
            body: [
              "Mira el mapeo y verás dos formas de expresión. La primera, como {{ JSON.parse($json.output).title }}, saca un campo de la respuesta del nodo de IA. El agente devuelve su resultado como una cadena JSON en output, así que parseas ese texto con JSON.parse antes de poder leer un campo de él.",
              "La segunda, como {{ $('Remote Gate')...location_caveat }}, trae un valor que la IA nunca vio. location_caveat y caveat_reason se calcularon antes en el nodo Remote Gate, no en el modelo, así que sencillamente no están en la salida de la IA. En lugar de parsear, vuelves a ese nodo por su nombre con $('Remote Gate') y lees el campo directamente — ahí ya es dato real, sin JSON.parse.",
              "Regla práctica: JSON.parse cuando el valor llega como texto (la salida de la IA); referencia el nodo por su nombre cuando el valor vive en otro nodo como dato corriente. Aquí también emparejamos por url, con find(g => g.json.url === ...), en lugar de por posición del item — así el caveat correcto siempre se queda con el empleo correcto incluso después del nodo de IA.",
            ],
          },
        ],
        tryIt:
          "Ejecuta el workflow dos veces. Confirma que la primera ejecución guarda filas en job_alerts, y que el paso de deduplicación de la segunda ejecución no devuelve nada nuevo.",
        check:
          "Tus empleos evaluados aparecen como filas en job_alerts, y una segunda ejecución no añade duplicados.",
        pitfall: {
          title: "Sin backticks alrededor de una expresión",
          body: "Envolver un valor en backticks guarda caracteres backtick literales en la base de datos. La expresión es el valor entero. Escríbela sin adornos.",
        },
      },
    ],
  },

  "m7-deliver": {
    id: "m7-deliver",
    title: "Mándalo a algún sitio útil",
    outcome: "Después de esto sabrás entregar un resultado a varios sitios a la vez.",
    lessons: [
      {
        id: "l7-1-telegram",
        moduleId: "m7-deliver",
        title: "Manda la alerta a tu teléfono",
        estMinutes: 13,
        device: "laptop",
        why: "Una fila guardada no ayuda a nadie si nunca la ves. Un bot de Telegram puede avisar a tu teléfono en cuanto se evalúa un empleo nuevo, con la puntuación, la razón y un enlace.",
        steps: [
          "En Telegram, abre un chat con BotFather (el bot oficial). Envía /newbot, dale un nombre y un username que termine en bot, y BotFather te responde con tu token del bot. Cópialo.",
          "Añade una credencial de Telegram en n8n. Pega el token en Access Token y deja Base URL por defecto. n8n muestra Connection tested successfully cuando el token es válido.",
          "Encuentra tu chat id — la nota de abajo muestra las dos formas más rápidas. Este es el id al que el bot manda tus alertas.",
          "Añade un nodo Telegram Send a Text Message después de Create a row. Pon Chat ID en tu id, y escribe el mensaje de abajo con expresiones para el title, la puntuación y la url.",
          "Ejecútalo y observa cómo la alerta llega a tu teléfono.",
        ],
        images: [
          {
            src: "/images/telegram-auth.png",
            caption:
              "La credencial de Telegram en n8n: pega el token de BotFather en Access Token, deja Base URL en https://api.telegram.org. Connection tested successfully significa que el token funciona.",
            afterStep: 2,
          },
        ],
        links: [
          { label: "Abrir Telegram Web", href: "https://web.telegram.org/" },
          { label: "Abrir BotFather", href: "https://t.me/botfather" },
        ],
        snippets: [
          {
            label: "El mensaje de alerta",
            code: String.raw`New match: {{ $json.title }}
Score: {{ $json.score }}
{{ $json.url }}`,
          },
        ],
        asides: [
          {
            title: "Consigue tu token y tu chat id",
            body: [
              "El token viene de BotFather. En Telegram, abre BotFather, envía /newbot y responde dos preguntas — un nombre para mostrar y un username que termine en bot. BotFather responde con un token largo como 123456:ABC..., y ese token es el que va en Access Token.",
              "El chat id es a quién manda el bot: a ti. La forma más rápida es escribir a @userinfobot en Telegram, que responde con tu id numérico. Si prefieres, manda primero cualquier mensaje a tu propio bot, luego abre https://api.telegram.org/bot<tu token>/getUpdates en un navegador y lee el campo chat.id.",
              "El token es una contraseña de tu bot — guárdalo solo en la credencial de n8n, nunca en una captura de pantalla ni en un archivo compartido.",
            ],
          },
        ],
        tryIt:
          "Conecta la alerta a tu propio bot y chat. Dispara el workflow y confirma que llega un mensaje real a tu teléfono.",
        check:
          "Una alerta de empleo con una puntuación y un enlace que funciona llega a tu Telegram.",
        pitfall: {
          title: "Un nodo puede alimentar a muchos",
          body: "Create a row alimenta la alerta, la hoja de respaldo y la rama de la carta de presentación a la vez. Una sola salida puede ramificarse hacia varios nodos que se ejecutan todos.",
        },
      },
      {
        id: "l7-2-sheet",
        moduleId: "m7-deliver",
        title: "Guarda un respaldo en una hoja",
        estMinutes: 12,
        device: "laptop",
        why: "Una copia en hoja de cálculo te da un sitio para revisar, ordenar y compartir tus coincidencias para {role} fuera de la base de datos.",
        steps: [
          "Añade una credencial de Google Sheets, iniciando sesión con tu cuenta de Google.",
          "Crea una hoja de Google con una fila de encabezados: Title, URL, Score, Reason (añade también Date Found y las columnas de caveat si las quieres).",
          "Añade un nodo Google Sheets después de Create a row. Pon Resource en Sheet Within Document y Operation en Append Row.",
          "Apúntalo a tu hoja: pon Document en By ID y pega el id de tu hoja (la nota de abajo muestra dónde encontrarlo), luego pon Sheet en By Name y elige tu pestaña, como Sheet1.",
          "Pon Mapping Column Mode en Map Each Column Manually. n8n lista las columnas de tu hoja; pon el valor de cada una en una expresión, como en el fragmento.",
          "Ejecuta el workflow y confirma que aparece una fila nueva en la hoja.",
        ],
        images: [
          {
            src: "/images/google-sheets-config.png",
            caption:
              "El nodo Append Row: Document By ID, Sheet por nombre y Mapping Column Mode en Map Each Column Manually — una casilla por columna de la hoja, cada una rellenada con una expresión de la fila guardada.",
            afterStep: 5,
          },
        ],
        snippets: [
          {
            label: "Valores para cada columna (Map Each Column Manually)",
            code: String.raw`Title           = {{ $json.title }}
URL             = {{ $json.url }}
Score           = {{ $json.score }}
Reason          = {{ $json.reason }}
Date Found      = {{ $json.found_at }}
location_caveat = {{ $json.location_caveat }}
Why?            = {{ $json.caveat_reason }}`,
          },
        ],
        asides: [
          {
            title: "Encontrar el id de la hoja, y mapear columnas a mano",
            body: [
              "Document está en By ID, y el id está en la dirección web de tu hoja. Abre la hoja en un navegador y mira la URL: docs.google.com/spreadsheets/d/ESTA_PARTE/edit. La cadena larga entre /d/ y /edit es el id. Cópiala en el campo Document.",
              "Mapping Column Mode en Map Each Column Manually significa que tú decides qué va en cada columna en lugar de dejar que n8n adivine. n8n lee la fila de encabezados de tu hoja y muestra una casilla por columna; rellenas cada una con una expresión que trae el campo correspondiente de la fila guardada, como {{ $json.score }} para la columna Score.",
              "Las etiquetas de columna vienen de la primera fila de tu hoja, así que solo necesitan coincidir con tus propios encabezados, no con los nombres de columna de la base de datos. Por eso una columna que etiquetas Why? puede contener {{ $json.caveat_reason }} — la etiqueta es tuya, el valor es el campo.",
            ],
          },
        ],
        tryIt:
          "Añade tus propias columnas si quieres más detalle, ejecútalo y confirma que la fila aterriza en tu hoja.",
        check: "Cada empleo evaluado también aparece como una fila en tu hoja de Google.",
        pitfall: {
          title: "Tres servicios de Google, un solo inicio de sesión",
          body: "Sheets, Docs y Drive comparten un único inicio de sesión de Google en n8n. No los configuras por separado.",
        },
      },
    ],
  },

  "m8-cover-letter": {
    id: "m8-cover-letter",
    title: "Genera un artefacto real",
    outcome:
      "Después de esto sabrás generar un documento basado solo en datos reales, sin nada inventado.",
    lessons: [
      {
        id: "l8-1-resume",
        moduleId: "m8-cover-letter",
        title: "Trae tu currículum",
        estMinutes: 8,
        device: "laptop",
        why: "Una coincidencia fuerte para {role} merece una carta a medida, y una buena carta se basa en tu experiencia real. Así que el workflow necesita tu currículum. Lo añades cerca del inicio de la cadena para que los pasos posteriores puedan volver a él.",
        steps: [
          "Pon tu currículum en un Google Doc.",
          "Añade un nodo Google Docs justo después de tu trigger, cerca de la parte de arriba del workflow. Pon Resource en Document y Operation en Get, y nombra el nodo Read Resume.",
          "En Doc ID or URL, pega el id de tu doc de currículum o su enlace completo (la nota de abajo muestra dónde está el id). Activa Simplify para que el nodo devuelva texto limpio.",
          "Ejecuta y confirma que el texto de tu currículum aparece en el campo content — sin parseo necesario.",
        ],
        images: [
          {
            src: "/images/google-docs-get-resume.png",
            caption:
              "El nodo Read Resume: Resource Document, Operation Get, el id de tu currículum en Doc ID or URL y Simplify activado para que devuelva el texto completo en un campo content limpio.",
            afterStep: 3,
          },
        ],
        snippets: [
          {
            label: "Cómo lo referenciarás más adelante",
            code: String.raw`{{ $('Read Resume').first().json.content }}`,
          },
        ],
        asides: [
          {
            title: "Dónde está el id del doc, y por qué este nodo va arriba",
            body: [
              "El id está en la dirección web de tu documento. Abre el currículum en un navegador: docs.google.com/document/d/ESTA_PARTE/edit. La cadena larga entre /d/ y /edit es el id. Puedes pegar ese id o la URL entera en Doc ID or URL.",
              "¿Por qué ponerlo cerca del inicio? Un nodo solo puede leer la salida de otro nodo con $('Node Name') cuando ese nodo está antes en el mismo camino. Al leer el currículum justo después del trigger, cada paso posterior puede volver a él con {{ $('Read Resume').first().json.content }}, sin importar lo abajo que esté en la cadena.",
              "Si en cambio leyeras el currículum en una rama lateral o tarde en el flujo, el nodo de la carta de presentación no tendría nada que referenciar, y la carta recurriría a experiencia inventada.",
            ],
          },
        ],
        tryIt:
          "Añade tu propio doc de currículum y confirma que su texto completo aparece en el campo content.",
        check: "El texto de tu currículum está disponible en el workflow, en content.",
        pitfall: {
          title: "Solo puedes referenciar lo que está aguas arriba",
          body: "Un nodo puede leer la salida de otro con $('Name') solo cuando ese nodo está antes en el mismo camino. Por eso el currículum se lee cerca del inicio, no en una rama lateral.",
        },
      },
      {
        id: "l8-2-write",
        moduleId: "m8-cover-letter",
        title: "Escribe una carta de presentación con fundamento",
        estMinutes: 15,
        device: "laptop",
        why: "Para las coincidencias fuertes, un modelo escribe una carta en primera persona usando solo tu currículum real y la descripción real del empleo. Fundamentarla así la mantiene honesta, sin experiencia inventada.",
        steps: [
          "Añade un nodo IF saliendo de Create a row, junto a tu alerta. Añade una condición: {{ $json.score }} is greater than or equal to 7. La rama true lleva las coincidencias fuertes que se ganan una carta de presentación.",
          "En la rama true, añade un nodo OpenAI. Pon Resource en Text y Operation en Message a Model, y elige un modelo.",
          "Añade Message 1 con Role System, y pega el system prompt de abajo — establece las reglas de la carta.",
          "Añade Message 2 con Role User, y pega el user prompt de abajo. Alimenta el título del empleo, la empresa y la descripción (buscados en tu gate por url) más tu currículum, y le dice al modelo cómo despedirse — cambia la firma por la tuya.",
          "Ejecuta y lee la carta.",
        ],
        images: [
          {
            src: "/images/if-score-gate.png",
            caption:
              "El filtro de puntuación: {{ $json.score }} is greater than or equal to 7, como comparación numérica. Solo los empleos con puntuación 7 o más toman la rama true hacia el paso de la carta de presentación.",
            afterStep: 1,
          },
          {
            src: "/images/openai-message-model.png",
            caption:
              "El nodo OpenAI: Resource Text, Operation Message a Model, y dos mensajes — Message 1 con Role System, Message 2 con Role User.",
            afterStep: 4,
          },
        ],
        snippets: [
          {
            label: "Message 1 — System prompt",
            code: String.raw`You are an expert career writer. Write concise, specific, genuine cover letters grounded ONLY in the candidate's real resume and the job description. No clichés, no generic filler, no invented experience. 250–350 words, first person, plain text (no markdown headings).`,
          },
          {
            label: "Message 2 — User prompt (grounded in real data)",
            code: String.raw`Write a tailored cover letter for this job, using only real details from my resume.

JOB TITLE: {{ $('Remote Gate').all().find(g => g.json.url === $json.url)?.json.title }}
COMPANY: {{ $('Remote Gate').all().find(g => g.json.url === $json.url)?.json.company }}

JOB DESCRIPTION:
{{ $('Remote Gate').all().find(g => g.json.url === $json.url)?.json.description }}

MY RESUME:
{{ $('Read Resume').first().json.content }}

Write it in first person, 250–350 words, specific to this role, ending with a short call to action. Plain text only.

ALWAYS sign the letter as:
Cristina Rodriguez
[LinkedIn](https://www.linkedin.com/in/crissrodriguez/) | [Portfolio](https://www.yosola.co/) | [GitHub](https://github.com/Yosolita1978)
[your email] | [your phone]`,
          },
        ],
        tryIt:
          "Usa tu propio currículum y un anuncio real de coincidencia fuerte. Lee la carta y comprueba que cada afirmación en ella se remonta a algo real de tu currículum.",
        check: "Sale una carta fundamentada en tu currículum, sin nada inventado.",
        pitfall: {
          title: "Dale fundamento o adivinará",
          body: "Sin el currículum y la descripción en el prompt, el modelo rellena los huecos con experiencia inventada plausible. Pasar el texto real es lo que mantiene la carta veraz.",
        },
      },
      {
        id: "l8-3-doc",
        moduleId: "m8-cover-letter",
        title: "Guárdala en un Google Doc",
        estMinutes: 12,
        device: "laptop",
        why: "Ahora conviertes la carta en un documento que puedes abrir, editar y enviar, y obtienes un enlace a él en tu teléfono. Esto funciona mientras solo un empleo califica por ejecución. Verás qué pasa con dos, y lo arreglarás, en el siguiente módulo.",
        steps: [
          "Añade un nodo Edit Fields (Set), Mode Manual Mapping, y nómbralo Prep Doc. Sostiene dos campos String que los siguientes nodos reutilizan.",
          "Añade un campo llamado letter y pon su valor en la salida del modelo: {{ $json.output[0].content[0].text }}.",
          "Añade un campo llamado doc_title para el nombre del documento, construido a partir del título del empleo como en el fragmento.",
          "Añade un nodo Google Docs, Resource Document, Operation Create. Pon Title en {{ $json.doc_title }} y la Folder en tu carpeta Cover Letters por id, en modo expresión. Nómbralo Create a document. Create crea un documento vacío y devuelve su id.",
          "Añade un segundo nodo Google Docs, Operation Update. Pon Doc ID or URL en {{ $json.id }} — el id que Create acaba de devolver — luego añade una acción Insert que ponga la carta, {{ $('Prep Doc').first().json.letter }}, en el cuerpo del documento.",
          "Añade un nodo Telegram para enviarte a ti mismo un enlace al doc terminado.",
        ],
        images: [
          {
            src: "/images/google-docs-create-folder.png",
            caption:
              "Paso uno de dos: Google Docs Create. Crea un documento vacío — Title de {{ $json.doc_title }}, Folder puesta por id en modo expresión — y devuelve el id del nuevo documento.",
            afterStep: 4,
          },
          {
            src: "/images/google-docs-update-insert.png",
            caption:
              "Paso dos de dos: Google Docs Update. Doc ID or URL es {{ $json.id }} de Create, y una acción Insert deja caer la carta ({{ $('Prep Doc').first().json.letter }}) en el cuerpo del documento.",
            afterStep: 5,
          },
        ],
        snippets: [
          {
            label: "Sostén la carta y el título (nodo Set)",
            code: String.raw`letter    = {{ $json.output[0].content[0].text }}
doc_title = {{ "Cover Letter - " + $('Create a row').first().json.title }}`,
          },
          {
            label: "Enlace al doc terminado (Telegram)",
            code: String.raw`Cover letter ready for {{ $json.title }}
https://docs.google.com/document/d/{{ $('Create a document').first().json.id }}/edit`,
          },
        ],
        asides: [
          {
            title: "No puedes crear y rellenar un doc en un solo paso",
            body: [
              "Quizá esperes un único nodo que cree un Google Doc con tu carta ya dentro. No existe. Google Docs Create solo crea un documento vacío y devuelve su id; un segundo nodo, Update, es el que escribe la carta dentro.",
              "Por eso estos dos siempre vienen en pareja: Create crea el archivo vacío y devuelve su id, y Update toma ese id (Doc ID or URL = {{ $json.id }}) e inserta el texto. La salida de Create alimenta la entrada de Update.",
              "Es la misma forma que muchas integraciones reales — crea primero la cosa vacía, luego puéblala. Siempre que un nodo Create no acepte tu contenido, busca un nodo Update o Insert que lo siga.",
            ],
          },
        ],
        tryIt:
          "Ejecútalo en una coincidencia fuerte y confirma que aparece un documento real en tu carpeta de Drive, con un enlace que funciona en tu Telegram.",
        check:
          "Una carta de presentación terminada está en tu Drive, y su enlace llega a tu teléfono.",
        pitfall: {
          title: "Create devuelve id, no documentId",
          body: "Google Docs Create devuelve el id del nuevo documento bajo la clave id. Si buscas documentId obtienes un enlace undefined. Además, para poner la carpeta por id debes cambiar ese campo a modo expresión, ya que el desplegable rechaza un id pegado.",
        },
      },
    ],
  },

  "m9-loop": {
    id: "m9-loop",
    title: "La lección difícil",
    outcome:
      "Después de esto sabrás explicar por qué el emparejamiento y el orden se rompen a través de un nodo de IA, y arreglarlo con un loop.",
    lessons: [
      {
        id: "l9-1-break",
        moduleId: "m9-loop",
        title: "Mira cómo se rompe",
        estMinutes: 18,
        device: "laptop",
        why: "Constrúyelo una vez y parece bien. La trampa aparece la primera mañana en que llegan juntas dos coincidencias fuertes para {role}: ambas cartas de presentación salen con el título del primer empleo. Esta lección te pide hacer una cosa — provocar ese bug a propósito, para que lo veas con tus propios ojos. Lo arreglas en la siguiente lección, no en esta.",
        steps: [
          "Fuerza que dos empleos califiquen en una ejecución. La forma más rápida: abre tu IF de filtro de puntuación y bájalo de 7 a 1 por un momento, para que pasen varios empleos. (O borra dos filas de job_alerts para que cuenten como nuevas y se evalúen otra vez.)",
          "Ejecuta el workflow entero una vez. Ahora dos empleos llegan al paso de la carta de presentación en la misma ejecución.",
          "Abre los dos Google Docs que creó y mira solo sus títulos.",
          "Ve el bug: ambos documentos muestran el MISMO título — el del primer empleo — aunque la carta dentro de cada uno es la carta correcta y distinta.",
          "Vuelve a poner el filtro de puntuación en 7 cuando termines. El bug está reproducido; lo arreglas en la siguiente lección.",
        ],
        snippets: [
          {
            label: "Lo que deberías ver",
            code: String.raw`Two strong matches in ONE run:

  Job A  ┐
         ├──►  Write Cover Letter  ──►  Doc 1  →  "Cover Letter - Job A"   (wrong)
  Job B  ┘                              Doc 2  →  "Cover Letter - Job A"   (wrong)

  The letters inside are right (A and B).
  Only the TITLES collapse to the first job, because doc_title uses .first().`,
          },
          {
            label: "Por qué ambos fallan después de un nodo de IA",
            code: String.raw`// .first() always returns the first job, so every letter gets its title
$('Create a row').first().json.title

// $itemIndex looks right, but order is not preserved across the AI node either
$('Create a row').all()[$itemIndex].json.title`,
          },
        ],
        tryIt:
          "Fuerza dos coincidencias fuertes en una ejecución y confirma por ti mismo que ambos documentos comparten el título del primer empleo. Déjalo roto — arreglarlo es la siguiente lección.",
        check: "Reprodujiste el bug: dos cartas, un mismo título equivocado.",
        pitfall: {
          title: "Los nodos de IA rompen el emparejamiento y el orden",
          body: "Cualquier cosa que referencies a través de un nodo de IA por posición o por item emparejado puede mapear a la fila equivocada. El arreglo es un enfoque distinto, no un índice más astuto.",
        },
      },
      {
        id: "l9-2-loop",
        moduleId: "m9-loop",
        title: "Arréglalo con un loop",
        estMinutes: 22,
        device: "laptop",
        why: "El arreglo es dejar de procesar empleos en paralelo y manejar exactamente uno cada vez. Con un solo empleo en circulación, cada referencia vuelve a ser inequívoca.",
        steps: [
          "Añade un nodo Loop Over Items justo después de tu filtro de puntuación, con batch size 1. Nómbralo Loop Over Items.",
          "Mueve la cadena de la carta de presentación dentro del loop, para que se ejecute una vez por empleo.",
          "Cambia el título del documento para que lea del empleo actual en el loop, usando $('Loop Over Items').first().json.url, no .first() de las filas guardadas. El fragmento de abajo también añade la empresa al título.",
          "Conecta el último nodo de la cadena de vuelta al nodo Loop Over Items para que itere. Ejecuta dos coincidencias fuertes y confirma que cada una recibe su propio título correcto.",
        ],
        images: [
          {
            src: "/images/set-field-coverletter.png",
            caption:
              "El nodo Set después del arreglo. doc_title ahora busca el empleo actual por url desde $('Loop Over Items'), así que cada iteración recibe su propio título y empresa — se acabó el título compartido equivocado.",
            afterStep: 3,
          },
        ],
        snippets: [
          {
            label: "Referencia el único empleo en el loop",
            code: String.raw`doc_title = {{ "Cover Letter - " + ($('Remote Gate').all().find(g => g.json.url === $('Loop Over Items').first().json.url)?.json.title || "Job") + " - " + ($('Remote Gate').all().find(g => g.json.url === $('Loop Over Items').first().json.url)?.json.company || "") }}`,
          },
        ],
        tryIt:
          "Ejecuta las mismas dos coincidencias fuertes otra vez, ahora dentro del loop, y confirma que los títulos coinciden con las cartas.",
        check:
          "Dos empleos que califican producen dos documentos, cada uno con su propio título correcto.",
        pitfall: {
          title: "El cable de vuelta al loop es lo que itera",
          body: "Loop Over Items solo repite si el final de la cadena se conecta de vuelta a él. Sin ese cable se ejecuta una vez y para.",
        },
      },
    ],
  },

  "m10-operate": {
    id: "m10-operate",
    title: "Ponlo en marcha",
    outcome: "Después de esto funciona solo, en un horario diario — sin manos.",
    lessons: [
      {
        id: "l10-1-schedule",
        moduleId: "m10-operate",
        title: "Suéltalo con un horario",
        estMinutes: 10,
        device: "laptop",
        why: "El workflow está construido. Ahora debería ejecutarse solo cada mañana, cazando {role} sin ti. El Schedule Trigger con el que empezaste es donde lo configuras.",
        steps: [
          "Abre tu Schedule Trigger y configúralo para ejecutarse una vez al día a una hora que te convenga.",
          "Guarda el workflow.",
          "Actívalo con el interruptor de arriba.",
          "Confirma que aparece como activo. A partir de ahora se ejecuta solo.",
        ],
        tryIt:
          "Pon tu hora diaria, activa el workflow y vuelve mañana a por una alerta.",
        check: "El workflow está activo y programado para ejecutarse solo.",
        pitfall: {
          title: "Activo no es lo mismo que guardado",
          body: "Guardar conserva tus ediciones. Activar es lo que hace que el horario realmente se dispare. Un workflow guardado pero inactivo nunca se ejecuta solo.",
        },
      },
    ],
  },

  "m11-template": {
    id: "m11-template",
    title: "Trabajar desde una plantilla",
    outcome:
      "Después de esto sabrás importar el workflow terminado del curso a tu propio n8n y hacerlo tuyo.",
    lessons: [
      {
        id: "import-workflow",
        moduleId: "m11-template",
        title: "Importa el workflow terminado",
        estMinutes: 10,
        device: "laptop",
        why: "Este es el workflow terminado del curso, exportado a un solo archivo para ti. Aquí no construyes ni exportas nada — descargas este archivo provisto, lo importas a tu propio n8n y lo apuntas a tus cuentas. Úsalo como plantilla lista, como copia limpia para comparar con lo que construiste, o como red de seguridad si el tuyo se rompió. n8n importa la estructura y los ajustes, pero nunca los secretos, así que reconectas tus propias credenciales después.",
        steps: [
          "Descarga el archivo del workflow de abajo. Este es el workflow completo del curso, ya exportado para ti — tú no exportas nada.",
          "En tu propio n8n, abre la lista de Workflows, haz clic en el menú de tres puntos arriba a la derecha y elige Import from File. Elige el archivo que acabas de descargar.",
          "El workflow entero aparece en tu canvas, igual que en la imagen. Abre cada nodo que muestre una advertencia de credencial y reconéctalo a tu propia credencial: SerpApi en el HTTP Request, Supabase, OpenAI, Telegram y Google.",
          "Cambia por tus propios detalles: la consulta de búsqueda, tu prompt de evaluación, el id de tu doc de currículum, el id de tu carpeta Cover Letters y tu chat id de Telegram.",
          "Ejecútalo una vez de principio a fin y confirma que un empleo fluye hasta una fila guardada y una alerta.",
        ],
        images: [
          {
            src: "/images/complete-worlflow.png",
            caption:
              "Todo el buscador de empleo en un solo canvas — lo que obtienes tras importar. Cada nodo del curso, conectado de principio a fin.",
            afterStep: 2,
          },
        ],
        links: [
          { label: "SerpApi — API key de búsqueda de empleo", href: "https://serpapi.com/" },
          {
            label: "Supabase — URL de base de datos + service key",
            href: "https://supabase.com/",
          },
          {
            label: "OpenAI — API key para la evaluación y la carta",
            href: "https://platform.openai.com/api-keys",
          },
          {
            label: "Telegram BotFather — token del bot",
            href: "https://t.me/botfather",
          },
          {
            label: "Google — Docs, Sheets y Drive",
            href: "https://docs.google.com/",
          },
        ],
        asides: [
          {
            title: "Las cinco credenciales que reconectas",
            body: [
              "El workflow importado necesita cinco conexiones, cada una configurada una vez en n8n. Los enlaces de arriba abren cada servicio; la lección nombrada entre paréntesis es donde el curso lo explica al completo.",
              "SerpApi — la búsqueda de empleo. Regístrate, luego copia tu API key en el api_key del nodo HTTP Request. (Llama a una API de búsqueda.)",
              "Supabase — la tabla de memoria. Crea un proyecto, ejecuta el SQL de la tabla y añade una credencial de Supabase con la URL de tu proyecto como Host y tu key service_role. (Crea un lugar para recordar.)",
              "OpenAI — la evaluación y la carta de presentación. Crea una API key y añade una credencial de OpenAI; ambos nodos de IA la comparten. (Evalúa cada empleo con IA.)",
              "Telegram — la alerta al teléfono. Crea un bot con BotFather, añade una credencial de Telegram con el token y pon tu chat id en los nodos de envío. (Manda la alerta a tu teléfono.)",
              "Google — Docs, Sheets y Drive comparten un único inicio de sesión de Google. Añade una credencial de Google y los tres nodos la usan. (Guarda un respaldo en una hoja.)",
            ],
          },
        ],
        download: {
          label:
            "El workflow terminado del curso, listo para importar a tu propio n8n. Reconecta tus propias credenciales después. Úsalo como plantilla, como referencia o como un nuevo comienzo.",
          href: "/job-hunter.workflow.json",
          filename: "job-hunter.workflow.json",
        },
        tryIt:
          "Importa este archivo provisto a tu propio n8n, reconecta tus credenciales y lleva un empleo hasta el final, hasta una alerta.",
        check:
          "El workflow provisto se ejecuta en tu propio n8n, con tus credenciales y tu rol.",
        pitfall: {
          title: "Importar trae ajustes, no secretos",
          body: "Un workflow exportado lleva cada nodo y sus ajustes, pero no tus API keys ni tokens — esos se quedan en tus credenciales de n8n. Tras importar, cada nodo que necesita una credencial muestra una advertencia hasta que lo apuntas al tuyo. Eso es esperado, no un archivo roto.",
        },
      },
    ],
  },

  "m12-advanced": {
    id: "m12-advanced",
    title: "Para constructores avanzados",
    outcome:
      "Opcional. Vuelve a esto cuando quieras re-probar y depurar una automatización en vivo como un constructor.",
    lessons: [
      {
        id: "l10-2-debug",
        moduleId: "m12-advanced",
        title: "Prueba y depura como un constructor",
        estMinutes: 15,
        device: "laptop",
        why: "Las automatizaciones en vivo necesitan trucos de prueba, porque no puedes esperar un día para ver si un cambio funcionó. Unos pocos hábitos te dejan re-ejecutar cualquier parte cuando quieras y encontrar fallos rápido.",
        steps: [
          "Para re-probar un empleo de principio a fin, borra su fila de job_alerts para que la deduplicación lo trate como nuevo otra vez. Ejecuta la query de abajo en el SQL editor de tu proyecto de Supabase — no en n8n.",
          "Para probar la rama de la carta de presentación sin esperar a una puntuación alta real, baja el filtro de puntuación por un momento, luego vuelve a ponerlo.",
          "Cuando algo se vea mal durante una ejecución manual, abre el panel de salida de cada nodo por turnos y lee qué salió de verdad.",
          "Para un workflow que ya está activo, abre la pestaña Executions: n8n registra ahí cada ejecución automática, con éxito o error.",
          "Haz clic en cualquier ejecución para abrirla y ver los datos exactos que fluyeron por cada nodo en esa ejecución — cómo depuras una ejecución que ya ocurrió, sin volver a dispararla.",
        ],
        snippets: [
          {
            label: "Fuerza que un empleo se ejecute otra vez — ejecuta esto en el SQL editor de Supabase, no en n8n",
            code: String.raw`delete from public.job_alerts where url = '<job url>';`,
          },
        ],
        asides: [
          {
            title: "Depurar un workflow en vivo con Executions",
            body: [
              "Una vez un workflow está activo, no lo estás mirando ejecutarse — se dispara según su horario mientras estás fuera. n8n guarda un registro de cada ejecución bajo Executions, para que puedas mirar atrás a qué pasó exactamente.",
              "Abre la pestaña Executions, en el workflow o en la lista global. Cada fila es una ejecución, marcada como éxito o error, con su hora. Una fila roja de error es por donde empezar.",
              "Haz clic en una ejecución para abrirla congelada en el tiempo. El canvas muestra los datos de esa ejecución: abre la salida de cualquier nodo y ves lo que produjo entonces, no ahora. Avanza desde el trigger hasta que la salida de un nodo se vea mal — ese es tu fallo.",
              "Para iterar en un arreglo, fija los datos de una ejecución a un nodo con el icono de pin, para que re-ejecutar use esa entrada exacta hasta que lo quites. Depuras contra los datos reales que se rompieron, no contra una suposición.",
            ],
          },
        ],
        tryIt:
          "Borra una fila en Supabase, ejecuta el workflow y confirma que ese empleo fluye hasta el final otra vez. Luego abre Executions, entra en una ejecución pasada y lee sus datos nodo por nodo.",
        check:
          "Puedes re-ejecutar cualquier parte del workflow cuando quieras, y leer los datos de una ejecución pasada en Executions para encontrar un fallo.",
        pitfall: {
          title: "Lee el panel, no adivines",
          body: "La mayoría de los bugs son un valor en una forma que no esperabas. Abrir la salida del nodo y mirar es más rápido que razonar sobre lo que debería haber ahí.",
        },
      },
    ],
  },
};

// Translated modules where we have them, English everywhere else. Order and
// ids come from the English source so the two languages stay aligned.
export const modulesEs: Module[] = modulesEn.map((m) => translated[m.id] ?? m);
