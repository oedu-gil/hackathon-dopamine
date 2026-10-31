import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

export async function extrairTexto(bufferPdf) {
  try {
    const documento = await getDocument({
      data: new Uint8Array(bufferPdf),
      useWorkerFetch: false,
      isEvalSupported: false,
    }).promise

    let texto = ''
    for (let i = 1; i <= documento.numPages; i++) {
      const pagina = await documento.getPage(i)
      const conteudo = await pagina.getTextContent()
      texto += conteudo.items.map((item) => item.str).join(' ') + '\n'
    }
    return texto
  } catch {
    return ''
  }
}
