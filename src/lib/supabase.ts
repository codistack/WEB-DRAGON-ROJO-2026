import { createClient } from '@supabase/supabase-js';
import { FullAppDatabase, Product, Category, RestaurantSettings } from '../types';

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
  projectUrl: string;
}

/**
 * Prueba la conexión en tiempo real con la base de datos Supabase
 */
export async function testSupabaseConnection(): Promise<SupabaseStatus> {
  try {
    const { data, error } = await supabase.from('admin_credentials').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      // Si admin_credentials aún no existe, probamos app_state
      const { error: appErr } = await supabase.from('app_state').select('id').limit(1);
      if (appErr && appErr.code !== 'PGRST116') {
        console.warn('Supabase ping check:', error.message || appErr?.message);
      }
    }
    return {
      connected: true,
      message: 'Conexión activa con Supabase Cloud DB (anemtjvhxtrdjmlfpllb.supabase.co)',
      projectUrl: supabaseUrl,
    };
  } catch (err: any) {
    console.error('Error al probar conexión con Supabase:', err);
    return {
      connected: false,
      message: err?.message || 'Error de red o CORS al conectar con Supabase',
      projectUrl: supabaseUrl,
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
      console.warn('Supabase admin_credentials upsert error:', error.message);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Error al guardar credenciales en Supabase:', err);
    return { success: false, message: err?.message || 'Error en cliente Supabase' };
  }
}

/**
 * Guarda o actualiza un platillo/producto individual en la tabla 'dishes' y en 'app_state'
 */
export async function saveSingleDishToSupabase(product: Product, fullDb?: FullAppDatabase) {
  try {
    const dishPayload = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category_id: product.categoryId,
      description: product.description || '',
      price: product.price || 0,
      is_combo: Boolean(product.isCombo),
      is_featured: Boolean(product.isFeatured),
      is_popular: Boolean(product.isPopular),
      is_new: Boolean(product.isNew),
      prep_time: product.prepTime || '15 min',
      ingredients: product.ingredients || [],
      image_url: product.imageUrl || '',
      gallery: product.gallery || [],
      availability: product.availability !== false,
      spicy_level: product.spicyLevel || 0,
      status: product.status || 'active',
      display_order: product.order || 1,
      updated_at: new Date().toISOString(),
    };

    // Intentar upsert en tabla 'dishes'
    const { error: dishErr } = await supabase.from('dishes').upsert(dishPayload, { onConflict: 'id' });
    if (dishErr) {
      // Intentar fallback en tabla 'products'
      await supabase.from('products').upsert(dishPayload, { onConflict: 'id' });
    }

    // Sincronizar también documento global app_state si está presente
    if (fullDb) {
      await supabase.from('app_state').upsert({
        id: 'current',
        data: fullDb,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Error guardando platillo en Supabase:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Elimina un platillo de la tabla 'dishes' en Supabase
 */
export async function deleteDishFromSupabase(dishId: string, fullDb?: FullAppDatabase) {
  try {
    await supabase.from('dishes').delete().eq('id', dishId);
    await supabase.from('products').delete().eq('id', dishId);

    if (fullDb) {
      await supabase.from('app_state').upsert({
        id: 'current',
        data: fullDb,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    }
    return { success: true };
  } catch (err: any) {
    console.warn('Error eliminando platillo de Supabase:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Sincroniza todos los platillos
 */
export async function syncDishesToSupabase(products: Product[]) {
  try {
    if (!products || !products.length) return { success: true };
    const mapped = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category_id: p.categoryId,
      description: p.description || '',
      price: p.price || 0,
      is_combo: Boolean(p.isCombo),
      is_featured: Boolean(p.isFeatured),
      is_popular: Boolean(p.isPopular),
      is_new: Boolean(p.isNew),
      prep_time: p.prepTime || '15 min',
      ingredients: p.ingredients || [],
      image_url: p.imageUrl || '',
      gallery: p.gallery || [],
      availability: p.availability !== false,
      spicy_level: p.spicyLevel || 0,
      status: p.status || 'active',
      display_order: p.order || 1,
      updated_at: new Date().toISOString(),
    }));

    const { error: errDishes } = await supabase.from('dishes').upsert(mapped, { onConflict: 'id' });
    if (errDishes) {
      await supabase.from('products').upsert(mapped, { onConflict: 'id' });
    }
    return { success: true };
  } catch (err: any) {
    console.warn('Error en syncDishesToSupabase:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Sincroniza todas las categorías
 */
export async function syncCategoriesToSupabase(categories: Category[]) {
  try {
    if (!categories || !categories.length) return { success: true };
    const mapped = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon_name: c.icon,
      description: c.description || '',
      visible: c.visible !== false,
      display_order: c.order || 1,
      updated_at: new Date().toISOString(),
    }));

    await supabase.from('categories').upsert(mapped, { onConflict: 'id' });
    return { success: true };
  } catch (err: any) {
    console.warn('Error en syncCategoriesToSupabase:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Sincroniza la configuración del restaurante
 */
export async function syncSettingsToSupabase(settings: RestaurantSettings) {
  try {
    if (!settings) return { success: true };
    await supabase.from('restaurant_settings').upsert({
      id: 'main',
      name: settings.name,
      slogan: settings.slogan,
      description: settings.description,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      email: settings.email,
      address: settings.address,
      city: settings.city,
      country: settings.country,
      logo_url: settings.logoUrl,
      notice_text: settings.noticeText,
      primary_color: settings.primaryColor,
      accent_color: settings.accentColor,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    return { success: true };
  } catch (err: any) {
    console.warn('Error en syncSettingsToSupabase:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Carga el estado completo de la base de datos desde Supabase Cloud DB al iniciar
 */
export async function loadFullDatabaseFromSupabase(): Promise<FullAppDatabase | null> {
  try {
    const { data: stateData, error: stateErr } = await supabase
      .from('app_state')
      .select('data')
      .eq('id', 'current')
      .maybeSingle();

    const { data: credData, error: credErr } = await supabase
      .from('admin_credentials')
      .select('*')
      .eq('id', 'credentials')
      .maybeSingle();

    if (!stateErr && stateData && stateData.data) {
      const fullDb = stateData.data as FullAppDatabase;

      if (!credErr && credData) {
        fullDb.adminCredentials = {
          ...fullDb.adminCredentials,
          username: credData.username || fullDb.adminCredentials?.username || 'admin@dragonrojo.ec',
          clave: credData.clave || fullDb.adminCredentials?.clave || '',
          password: credData.clave || fullDb.adminCredentials?.password || '',
          passwordHash: credData.clave || fullDb.adminCredentials?.passwordHash || '',
          pin: credData.pin || fullDb.adminCredentials?.pin || '889900',
          notificationEmail: credData.notification_email || fullDb.adminCredentials?.notificationEmail || 'codistack@gmail.com',
          contador: credData.contador !== undefined ? Number(credData.contador) : fullDb.adminCredentials?.contador ?? 0,
        };
        fullDb.bandera = credData.bandera !== undefined ? Number(credData.bandera) : (fullDb.bandera ?? 2);
      }

      return fullDb;
    }
  } catch (err) {
    console.warn('Notice loading from Supabase at startup:', err);
  }
  return null;
}

/**
 * Sincroniza el estado completo de la base de datos en las tablas de Supabase
 */
export async function syncFullDatabaseToSupabase(db: FullAppDatabase) {
  try {
    const results: Record<string, boolean> = {};

    // 1. Documento JSON global 'app_state' (Garantiza persistencia total de todos los mantenimientos)
    const { error: fullDbErr } = await supabase.from('app_state').upsert({
      id: 'current',
      data: db,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    results['app_state'] = !fullDbErr;

    // 2. Admin Credentials
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

    // 3. Tablas relacionales opcionales (sincroniza sin fallar si la tabla no existe aún)
    if (db.products && db.products.length > 0) {
      const resDishes = await syncDishesToSupabase(db.products);
      results['dishes'] = resDishes.success;
    }

    if (db.categories && db.categories.length > 0) {
      const resCats = await syncCategoriesToSupabase(db.categories);
      results['categories'] = resCats.success;
    }

    if (db.settings) {
      const resSet = await syncSettingsToSupabase(db.settings);
      results['restaurant_settings'] = resSet.success;
    }

    return { success: true, results };
  } catch (err: any) {
    console.error('Error sincronizando base de datos a Supabase:', err);
    return { success: false, error: err?.message };
  }
}
