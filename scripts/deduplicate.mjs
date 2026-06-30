import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const termsDir = path.resolve(__dirname, '../src/data/terms')

const CATEGORY_PREFERENCE = [
  'ai', 'technology', 'business-basics', 'finance', 'startup',
  'marketing', 'sales', 'product-management', 'entrepreneurship',
  'investment', 'shark-tank', 'business-models', 'how-things-work',
  'case-studies', 'negotiation', 'new-concepts'
]

function qualityOfEntry(lines, startIdx) {
  let score = 0
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i]
    if (line.includes('definition:') && line.length > 60) score += 5
    if (line.includes('simpleExplanation:') && line.length > 40) score += 3
    if (line.includes('example:') && line.length > 50) score += 3
    if (line.includes('whyItMatters:') && line.length > 50) score += 3
    if (line.includes('realCompanyExample:')) score += 4
    if (line.includes('commonMistakes:')) score += 2
    if (line.includes('sharkTankExample:')) score += 2
    if (line.includes('interviewQuestions:')) score += 2
    if (line.includes('popular:') && line.includes('true')) score += 1
    if (line.includes('featured:') && line.includes('true')) score += 1
    if (line.match(/faqs:\s*\[/) || line.includes('{ question:')) score += 2
    if (line.match(/references:\s*\[/)) score += 1
    if (line.includes('visualDiagram:')) score += 2
    if (line.includes('formula:')) score += 2
    if (line.includes('quickSummary:')) score += 1
    if (line.includes('}') && line.trim() === '},') break
  }
  return score
}

// Read all files and find all entries
const fileEntries = {}

for (const file of fs.readdirSync(termsDir).filter(f => f.endsWith('.ts')).sort()) {
  const filePath = path.join(termsDir, file)
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n')
  
  fileEntries[file] = { path: filePath, content, lines, entries: [] }
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line === '{' || line === '  {') {
      // Check if this is a concept object (has id: and name:)
      let j = i + 1, depth = 1
      let hasId = false, hasName = false, name = '', nameLine = -1
      
      for (; j < lines.length && depth > 0; j++) {
        const l = lines[j]
        if (l.includes('{')) depth++
        if (l.includes('}')) depth--
        
        if (l.includes("id: '")) hasId = true
        const nameMatch = l.match(/name:\s*'([^']+)'/)
        if (nameMatch) { hasName = true; name = nameMatch[1]; nameLine = j }
      }
      
      if (hasId && hasName) {
        fileEntries[file].entries.push({
          name,
          startLine: i,
          endLine: j,
          quality: qualityOfEntry(lines, i),
          nameLine
        })
      }
    }
  }
}

// Build name -> entries map
const nameMap = {}
for (const [file, data] of Object.entries(fileEntries)) {
  for (const entry of data.entries) {
    const cleanName = entry.name.toLowerCase().trim()
    if (!nameMap[cleanName]) nameMap[cleanName] = []
    nameMap[cleanName].push({ ...entry, file })
  }
}

// Find duplicates
const duplicates = Object.entries(nameMap).filter(([k, v]) => v.length > 1)

console.log(`Found ${duplicates.length} duplicate concepts\n`)

const CATEGORY_SCORE = {}
CATEGORY_PREFERENCE.forEach((c, i) => CATEGORY_SCORE[c] = (CATEGORY_PREFERENCE.length - i) * 2)

const removeSet = new Set()

for (const [, entries] of duplicates) {
  // Score each by quality + category preference
  for (const e of entries) {
    const catScore = CATEGORY_SCORE[e.file.replace('.ts', '')] || 0
    e.totalScore = e.quality + catScore
  }
  
  entries.sort((a, b) => b.totalScore - a.totalScore)
  const best = entries[0]
  
  for (let i = 1; i < entries.length; i++) {
    removeSet.add(`${entries[i].file}:${entries[i].startLine}`)
    console.log(`REMOVE ${entries[i].file}:${entries[i].nameLine} "${entries[i].name}" (score ${entries[i].totalScore})`)
    console.log(`  KEEP ${best.file}:${best.nameLine} "${best.name}" (score ${best.totalScore})`)
  }
}

// Now modify each file
const categorizedRemovals = {}
for (const key of removeSet) {
  const [file, lineStr] = key.split(':')
  const line = parseInt(lineStr)
  if (!categorizedRemovals[file]) categorizedRemovals[file] = []
  categorizedRemovals[file].push(line)
}

for (const [file, linesToRemove] of Object.entries(categorizedRemovals)) {
  const data = fileEntries[file]
  const lines = [...data.lines]
  
  // Get entries to remove sorted by endLine descending (so we remove from bottom up)
  const toRemove = data.entries.filter(e => linesToRemove.includes(e.startLine))
    .sort((a, b) => b.endLine - a.endLine)
  
  console.log(`\nModifying ${file}: removing ${toRemove.length} entries`)
  
  for (const entry of toRemove) {
    // The entry includes the trailing comma/whitespace
    let start = entry.startLine
    let end = entry.endLine
    
    // Extend end to include the comma after closing brace
    if (end < lines.length) {
      const trimmed = lines[end].trim()
      if (trimmed === ',' || trimmed === '},' || trimmed === '}' || trimmed === '' || trimmed.startsWith('],')) {
        // Include this line
        end++
      }
    }
    
    // Handle comma on the line before end
    if (end > 0) {
      const prevTrimmed = lines[end - 1].trim()
      if (prevTrimmed === ',' || prevTrimmed === '],') {
        // Already included
      }
    }
    
    // Extend to include empty line after removal
    while (end < lines.length && lines[end].trim() === '') end++
    
    const removed = lines.splice(start, end - start)
    console.log(`  Removed "${entry.name}" (lines ${entry.startLine}-${entry.endLine})`)
  }
  
  // Clean up double blank lines
  const cleaned = []
  for (let i = 0; i < lines.length; i++) {
    if (cleaned.length > 0 && lines[i].trim() === '' && cleaned[cleaned.length - 1].trim() === '') {
      continue // skip duplicate blank lines
    }
    cleaned.push(lines[i])
  }
  
  fs.writeFileSync(data.path, cleaned.join('\n'))
  console.log(`  Written ${data.path}`)
}

console.log(`\nDone! Removed ${removeSet.size} duplicate entries.`)
