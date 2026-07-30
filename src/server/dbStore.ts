import fs from 'fs';
import path from 'path';
import { FullAppDatabase } from '../types';
import { INITIAL_DATABASE } from '../data/initialData';

const DB_FILE_PATH = path.join(process.cwd(), 'database.json');

export class DatabaseStore {
  private static instance: DatabaseStore;
  private data: FullAppDatabase;

  private constructor() {
    this.data = this.loadData();
  }

  public static getInstance(): DatabaseStore {
    if (!DatabaseStore.instance) {
      DatabaseStore.instance = new DatabaseStore();
    }
    return DatabaseStore.instance;
  }

  private loadData(): FullAppDatabase {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent) as FullAppDatabase;
        if (parsed && parsed.settings && parsed.products) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Warning loading database.json, initializing default seed:', err);
    }

    // Save default seed
    this.saveDataDirect(INITIAL_DATABASE);
    return JSON.parse(JSON.stringify(INITIAL_DATABASE));
  }

  private saveDataDirect(dataToSave: FullAppDatabase): void {
    try {
      dataToSave.updatedAt = new Date().toISOString();
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database.json:', err);
    }
  }

  public getData(): FullAppDatabase {
    return this.data;
  }

  public updateData(updater: (current: FullAppDatabase) => FullAppDatabase, userLog = 'Admin'): FullAppDatabase {
    this.data = updater(this.data);
    this.data.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: userLog,
      action: 'UPDATE_DATABASE',
      ip: '127.0.0.1',
      details: 'Actualización realizada desde el Panel de Administración',
    });
    // Keep max 100 logs
    if (this.data.auditLogs.length > 100) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 100);
    }
    this.saveDataDirect(this.data);
    return this.data;
  }

  public resetToSeed(): FullAppDatabase {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATABASE));
    this.saveDataDirect(this.data);
    return this.data;
  }

  public restoreBackup(importedData: FullAppDatabase): FullAppDatabase {
    this.data = importedData;
    this.saveDataDirect(this.data);
    return this.data;
  }
}

export const dbStore = DatabaseStore.getInstance();
