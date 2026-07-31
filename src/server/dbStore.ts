import fs from 'fs';
import path from 'path';
import { FullAppDatabase } from '../types';
import { INITIAL_DATABASE } from '../data/initialData';
import { syncFullDatabaseToSupabase, loadFullDatabaseFromSupabase } from '../lib/supabase';

const DB_FILE_PATH = path.join(process.cwd(), 'database.json');

export class DatabaseStore {
  private static instance: DatabaseStore;
  private data: FullAppDatabase;

  private constructor() {
    this.data = this.loadData();
    this.initFromSupabase().catch((err) => console.warn('Supabase initial sync notice:', err?.message || err));
  }

  public static getInstance(): DatabaseStore {
    if (!DatabaseStore.instance) {
      DatabaseStore.instance = new DatabaseStore();
    }
    return DatabaseStore.instance;
  }

  public async initFromSupabase(): Promise<FullAppDatabase> {
    try {
      const remoteDb = await loadFullDatabaseFromSupabase();
      if (remoteDb && remoteDb.products && remoteDb.settings) {
        this.data = remoteDb;
        this.saveDataDirect(this.data);
        console.log('✅ Base de datos cargada exitosamente desde Supabase Cloud DB.');
      } else {
        await syncFullDatabaseToSupabase(this.data);
      }
    } catch (err) {
      console.warn('Notice al sincronizar con Supabase en inicialización:', err);
    }
    return this.data;
  }

  private loadData(): FullAppDatabase {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent) as any;
        if (parsed && parsed.settings && parsed.products) {
          // El sistema TIENE base de datos: no realiza ningún cambio de reinicialización, mantiene todo igual
          if (parsed.bandera === undefined) {
            parsed.bandera = (parsed.adminCredentials?.contador > 0) ? 2 : 1;
          }
          return parsed as FullAppDatabase;
        }
      }
    } catch (err) {
      console.warn('Warning loading database.json:', err);
    }

    // El sistema NO tiene base de datos (bandera = 0): crea la base de datos e inserta registros iniciales (bandera = 1)
    const initial = JSON.parse(JSON.stringify(INITIAL_DATABASE)) as any;
    initial.bandera = 1;
    if (initial.adminCredentials) {
      initial.adminCredentials.contador = 0;
    }
    this.saveDataDirect(initial);
    return initial;
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
    // Sincronizar automáticamente en tiempo real con Supabase Cloud DB
    syncFullDatabaseToSupabase(this.data).catch((err) => {
      console.warn('Background Supabase sync notice:', err?.message || err);
    });
    return this.data;
  }

  public resetToSeed(): FullAppDatabase {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATABASE));
    this.saveDataDirect(this.data);
    syncFullDatabaseToSupabase(this.data).catch((err) => {
      console.warn('Background Supabase sync notice:', err?.message || err);
    });
    return this.data;
  }

  public restoreBackup(importedData: FullAppDatabase): FullAppDatabase {
    this.data = importedData;
    this.saveDataDirect(this.data);
    syncFullDatabaseToSupabase(this.data).catch((err) => {
      console.warn('Background Supabase sync notice:', err?.message || err);
    });
    return this.data;
  }
}

export const dbStore = DatabaseStore.getInstance();
