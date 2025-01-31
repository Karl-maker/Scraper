export function getAgentName(address: string): string {
    const lines = address.split('\n');
    if (lines.length > 1) {
      return lines[1].trim(); // Returns the second line and trims any extra spaces
    }
    return '';
}