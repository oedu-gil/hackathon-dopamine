// Permite importar os manifestos do hub no Node: arquivos que não são JS (svg, css) viram um texto fixo.
export async function load(url, context, nextLoad) {
  if (/\.(svg|css|png|woff2?)$/.test(new URL(url).pathname)) {
    return { format: 'module', source: "export default 'asset'", shortCircuit: true }
  }
  return nextLoad(url, context)
}
