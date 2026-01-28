import fs from 'fs'
import path from 'path'

function simpleMarkdownToHtml(md: string) {
  // Very small markdown to HTML converter for server-side rendering of the one-pager.
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  // headings
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
  // bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
  // unordered lists
  html = html.replace(/^\s*-\s+(.*)$/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)(?:\s*<li>.*<\/li>)*/gim, (match) => {
    if (match.includes('<li>')) return `<ul>${match}</ul>`
    return match
  })
  // paragraphs
  html = html.replace(/^(?!<h|<ul|<li|<pre|<blockquote)([^\n]+)\n?/gim, '<p>$1</p>')
  return html
}

export default function Page() {
  const root = process.cwd()
  const mdPath = path.join(root, 'AGENT_ONE_PAGER.md')
  let md = ''
  try {
    md = fs.readFileSync(mdPath, 'utf8')
  } catch {
    md = '# Agent One-Pager\n\nAGENT_ONE_PAGER.md not found.'
  }

  const html = simpleMarkdownToHtml(md)

  return (
    <div className="prose max-w-4xl mx-auto py-10 px-4">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
