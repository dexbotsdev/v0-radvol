/**
 * Utility functions for file operations
 */

/**
 * Downloads data as a file
 * @param data The data to download
 * @param filename The name of the file
 * @param type The MIME type of the file
 */
export function downloadAsFile(data: string, filename: string, type = "application/json"): void {
  // Create a blob with the data
  const blob = new Blob([data], { type })

  // Create a URL for the blob
  const url = URL.createObjectURL(blob)

  // Create a temporary anchor element
  const a = document.createElement("a")
  a.href = url
  a.download = filename

  // Append the anchor to the body
  document.body.appendChild(a)

  // Trigger a click on the anchor
  a.click()

  // Clean up
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 0)
}

/**
 * Reads a file as text
 * @param file The file to read
 * @returns A promise that resolves with the file contents
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string)
      } else {
        reject(new Error("Failed to read file"))
      }
    }

    reader.onerror = () => {
      reject(new Error("Error reading file"))
    }

    reader.readAsText(file)
  })
}

/**
 * Validates a JSON string
 * @param jsonString The JSON string to validate
 * @returns Whether the string is valid JSON
 */
export function isValidJson(jsonString: string): boolean {
  try {
    JSON.parse(jsonString)
    return true
  } catch (e) {
    return false
  }
}
