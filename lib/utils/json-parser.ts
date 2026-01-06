/**
 * Robust JSON Parser Utility
 *
 * Handles AI-generated JSON responses with special characters, Unicode, and malformed JSON.
 * Provides fallback extraction strategies when direct parsing fails.
 */

/**
 * Strip markdown code blocks from text
 */
export function stripMarkdownCodeBlocks(text: string): string {
  const codeBlockRegex = /```(?:json|html|xml)?\s*\n?([\s\S]*?)\n?```/g
  const match = codeBlockRegex.exec(text)

  if (match && match[1]) {
    return match[1].trim()
  }

  return text.trim()
}

/**
 * Extract JSON object from text using regex
 */
function extractJsonObject(text: string): string | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  return jsonMatch ? jsonMatch[0] : null
}

/**
 * Attempt to fix common JSON issues
 */
function attemptJsonFix(text: string): string {
  let fixed = text

  // Fix unescaped newlines, tabs, and carriage returns in string values
  fixed = fixed.replace(/"([^"]*?)"/g, (match, content) => {
    if (content.includes(":") || content.includes("{") || content.includes("[")) {
      return match // Skip keys and structural elements
    }
    const escaped = content
      .replace(/\\/g, "\\\\") // Escape backslashes first
      .replace(/\n/g, "\\n") // Escape newlines
      .replace(/\r/g, "\\r") // Escape carriage returns
      .replace(/\t/g, "\\t") // Escape tabs
    return `"${escaped}"`
  })

  return fixed
}

/**
 * Fallback: Extract fields using regex when JSON parsing fails
 */
function extractFieldsWithRegex(text: string): Record<string, any> | null {
  try {
    const result: Record<string, any> = {}

    // Extract title
    const titleMatch = text.match(/"title"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/s)
    if (titleMatch) result.title = titleMatch[1].replace(/\\"/g, '"').replace(/\\n/g, "\n")

    // Extract content
    const contentMatch = text.match(/"content"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/s)
    if (contentMatch) result.content = contentMatch[1].replace(/\\"/g, '"').replace(/\\n/g, "\n")

    // Extract excerpt
    const excerptMatch = text.match(/"excerpt"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/s)
    if (excerptMatch) result.excerpt = excerptMatch[1].replace(/\\"/g, '"').replace(/\\n/g, "\n")

    // Extract metaDescription
    const metaMatch = text.match(/"metaDescription"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/s)
    if (metaMatch) result.metaDescription = metaMatch[1].replace(/\\"/g, '"').replace(/\\n/g, "\n")

    // Extract category
    const categoryMatch = text.match(/"category"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/s)
    if (categoryMatch) result.category = categoryMatch[1].replace(/\\"/g, '"')

    // Extract xPost
    const xPostMatch = text.match(/"xPost"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/s)
    if (xPostMatch) result.xPost = xPostMatch[1].replace(/\\"/g, '"').replace(/\\n/g, "\n")

    // Extract tags array
    const tagsMatch = text.match(/"tags"\s*:\s*\[(.*?)\]/s)
    if (tagsMatch) {
      const tagsStr = tagsMatch[1]
      const tags = tagsStr.match(/"([^"]*(?:\\.[^"]*)*)"/g)
      if (tags) {
        result.tags = tags.map((t) => t.slice(1, -1).replace(/\\"/g, '"'))
      }
    }

    // Return only if we got at least title and content
    if (result.title && result.content) {
      return result
    }

    return null
  } catch (error) {
    console.error("[v0] Regex extraction failed:", error)
    return null
  }
}

/**
 * Parse AI-generated JSON with robust error handling
 *
 * Strategy:
 * 1. Strip markdown code blocks
 * 2. Extract JSON object
 * 3. Try direct JSON.parse
 * 4. Try with common fixes
 * 5. Fallback to regex extraction
 */
export function parseAIResponse(text: string): any {
  // Step 1: Strip markdown code blocks
  let cleanedText = stripMarkdownCodeBlocks(text)

  // Step 2: Extract JSON object
  const jsonText = extractJsonObject(cleanedText)
  if (jsonText) {
    cleanedText = jsonText
  }

  // Step 3: Try direct parsing
  try {
    return JSON.parse(cleanedText)
  } catch (directError) {
    console.error("[v0] Direct JSON parse failed:", directError instanceof Error ? directError.message : directError)
    console.error("[v0] Failed text (first 500 chars):", cleanedText.substring(0, 500))
  }

  // Step 4: Try with fixes
  try {
    const fixedText = attemptJsonFix(cleanedText)
    return JSON.parse(fixedText)
  } catch (fixError) {
    console.error("[v0] Fixed JSON parse failed:", fixError instanceof Error ? fixError.message : fixError)
  }

  // Step 5: Fallback to regex extraction
  console.log("[v0] Attempting regex extraction fallback...")
  const extracted = extractFieldsWithRegex(cleanedText)

  if (extracted) {
    console.log("[v0] Successfully extracted fields with regex")
    return extracted
  }

  // If all strategies fail, throw with detailed error
  throw new Error(`Failed to parse AI response after all strategies. Text length: ${text.length}`)
}
