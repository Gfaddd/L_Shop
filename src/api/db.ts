export class DatabaseAPI {
  private baseUrl = '/data';

  async get<T>(filename: string): Promise<T[]> {
    const response = await fetch(`${this.baseUrl}/${filename}`);
    if (!response.ok) throw new Error(`Failed to fetch ${filename}`);
    return response.json();
  }

  async getById<T extends { id: string }>(filename: string, id: string): Promise<T | undefined> {
    const items = await this.get<T>(filename);
    return items.find((item) => item.id === id);
  }

  async saveLocal<T>(filename: string, data: T[]): Promise<void> {
    localStorage.setItem(`db_${filename}`, JSON.stringify(data));
  }

  async getLocal<T>(filename: string): Promise<T[]> {
    const stored = localStorage.getItem(`db_${filename}`);
    if (stored) return JSON.parse(stored);
    return this.get<T>(filename);
  }
}

export const db = new DatabaseAPI();