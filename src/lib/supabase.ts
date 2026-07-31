import { createClient } from '@supabase/supabase-js';
import { FullAppDatabase } from '../types';

const supabaseUrl = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL)
  || ((import.meta as any).env && (import.meta as any).env.VITE_SUPABASE_URL)
  || 'https://anemtjvhxtrdjmlfpllb.supabase.co';

const supabaseKey = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY)
  || ((import.meta as any).env && (import.meta as any).env.VITE_SUPABASE_ANON_KEY)
  || 'sb_publishable_i70qLQSp2ufrjNZr0xJ5IA_yUfmjh2a';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Interface para probar conexión y estado de Supabase
 */
export interface SupabaseStatus {
  connected: boolean;
  message: string;
}

/**
 * Prueba la conexión con la base de datos Supabase
 */
export async function testSupabaseConnection(): Promise<SupabaseStatus> {
  try {
    const { data, error } = await supabase.from('admin_credentials').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      // Si la tabla no existe aún, intentamos consultar otra o devolvemos true con indicación
      console.warn('Supabase test table error:', error.message);
      return {
        connected: true,
        message: 'Cliente Supabase inicializado correctamente (requiere ejecutar script SQL en Supabase).'
      };
    }
    return {
      connected: true,
      message: 'Conexión exitosa con la base de datos Supabase'
    };
  } catch (err: any) {
    console.error('Error al probar conexión con Supabase:', err);
    return {
      connected: false,
      message: err?.message || 'Error de red al conectar con Supabase'
    };
  }
}

/**
 * Guarda o actualiza las credenciales de administrador en la tabla 'admin_credentials' de Supabase
 */
export async function saveAdminCredentialsToSupabase(
  username: string,
  clave: string,
  pin: string,
  notificationEmail: string,
  contador: number = 2,
  bandera: number = 2
) {
  try {
    const payload = {
      id: 'credentials',
      username,
      clave,
      pin,
      notification_email: notificationEmail,
      contador,
      bandera,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('admin_credentials')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Advertencia guardando en Supabase admin_credentials:', error.message);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Error al guardar credenciales en Supabase:', err);
    return { success: false, message: err?.message || 'Error en cliente Supabase' };
  }
}

/**
 * Sincroniza el estado completo de la base de datos en las tablas de Supabase
 */
export async function syncFullDatabaseToSupabase(db: FullAppDatabase) {
  try {
    const results: Record<string, boolean> = {};

    // 1. Admin Credentials
    if (db.adminCredentials) {
      const res = await saveAdminCredentialsToSupabase(
        db.adminCredentials.username || 'admin@dragonrojo.ec',
        db.adminCredentials.clave || db.adminCredentials.passwordHash || 'sha256-encrypted',
        db.adminCredentials.pin || '889900',
        db.adminCredentials.notificationEmail || 'codistack@gmail.com',
        db.adminCredentials.contador ?? 2,
        db.bandera ?? 2
      );
      results['admin_credentials'] = res.success;
    }

    // 2. Restaurant Settings
    if (db.settings) {
      const { error } = await supabase.from('restaurant_settings').upsert({
        id: 'main',
        name: db.settings.name,
        slogan: db.settings.slogan,
        description: db.settings.description,
        phone: db.settings.phone,
        whatsapp: db.settings.whatsapp,
        email: db.settings.email,
        address: db.settings.address,
        city: db.settings.city,
        country: db.settings.country,
        logo_url: db.settings.logoUrl,
        notice_text: db.settings.noticeText,
        primary_color: db.settings.primaryColor,
        accent_color: db.settings.accentColor,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
      results['restaurant_settings'] = !error;
    }

    // 3. Documento JSON global 'full_app_state'
    const { error: fullDbErr } = await supabase.from('app_state').upsert({
      id: 'current',
      data: db,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    results['app_state'] = !fullDbErr;

    return { success: true, results };
  } catch (err: any) {
    console.error('Error sincronizando base de datos a Supabase:', err);
    return { success: false, error: err?.message };
  }
}
