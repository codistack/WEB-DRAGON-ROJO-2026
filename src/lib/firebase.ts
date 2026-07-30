import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  collection,
  getDocs
} from "firebase/firestore";
import { FullAppDatabase } from "../types";

export const firebaseConfig = {
  apiKey: "AIzaSyBh8DpyTzyVCpxTeYsIhX5XtSKXiAHoY9Y",
  authDomain: "proyecto-dragon-rojo-26.firebaseapp.com",
  projectId: "proyecto-dragon-rojo-26",
  storageBucket: "proyecto-dragon-rojo-26.firebasestorage.app",
  messagingSenderId: "1049024793550",
  appId: "1:1049024793550:web:ae27aac4efb8d42f1ff99f"
};

// Initialize Firebase App uniquely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface FirestoreStatus {
  connected: boolean;
  message: string;
  timestamp?: string;
  syncedDocsCount?: number;
}

/**
 * Tests direct connection with the Firestore server
 */
export async function testFirestoreConnection(): Promise<FirestoreStatus> {
  try {
    const healthRef = doc(db, "_health", "status");
    const testPayload = {
      status: "online",
      project: firebaseConfig.projectId,
      checkedAt: new Date().toISOString()
    };
    
    // Write a lightweight health ping
    await setDoc(healthRef, testPayload, { merge: true });

    // Verify read directly from Firestore server (bypassing local cache)
    const snapshot = await getDocFromServer(healthRef);
    
    if (snapshot.exists()) {
      return {
        connected: true,
        message: "Conexión establecida con el servidor Firestore",
        timestamp: new Date().toISOString()
      };
    } else {
      return {
        connected: false,
        message: "No existe conexión con el servidor Firestore"
      };
    }
  } catch (err: any) {
    console.error("Error verificando conexión Firestore:", err);
    return {
      connected: false,
      message: `Error de conexión Firestore: ${err?.message || "Sin respuesta del servidor"}`
    };
  }
}

/**
 * Syncs all app database documents to Firestore collections
 */
export async function syncAllDocumentsToFirestore(appData: FullAppDatabase): Promise<{ success: boolean; syncedCount: number; message: string }> {
  try {
    let syncedCount = 0;

    // 1. Settings Document
    if (appData.settings) {
      await setDoc(doc(db, "settings", "main"), {
        ...appData.settings,
        syncedAt: new Date().toISOString()
      });
      syncedCount++;
    }

    // 2. Social Links Document
    if (appData.socialLinks) {
      await setDoc(doc(db, "socialLinks", "main"), {
        ...appData.socialLinks,
        syncedAt: new Date().toISOString()
      });
      syncedCount++;
    }

    // 3. SEO Metadata Document
    if (appData.seoMetadata) {
      await setDoc(doc(db, "seoMetadata", "main"), {
        items: appData.seoMetadata,
        syncedAt: new Date().toISOString()
      });
      syncedCount++;
    }

    // 4. Categories
    if (appData.categories && appData.categories.length > 0) {
      for (const cat of appData.categories) {
        await setDoc(doc(db, "categories", cat.id), cat);
        syncedCount++;
      }
    }

    // 5. Products
    if (appData.products && appData.products.length > 0) {
      for (const prod of appData.products) {
        await setDoc(doc(db, "products", prod.id), prod);
        syncedCount++;
      }
    }

    // 6. Offers
    if (appData.offers && appData.offers.length > 0) {
      for (const off of appData.offers) {
        await setDoc(doc(db, "offers", off.id), off);
        syncedCount++;
      }
    }

    // 7. Schedules
    if (appData.schedules && appData.schedules.length > 0) {
      for (const sch of appData.schedules) {
        await setDoc(doc(db, "schedules", sch.id), sch);
        syncedCount++;
      }
    }

    // 8. Testimonials
    if (appData.testimonials && appData.testimonials.length > 0) {
      for (const t of appData.testimonials) {
        await setDoc(doc(db, "testimonials", t.id), t);
        syncedCount++;
      }
    }

    // 9. Gallery
    if (appData.gallery && appData.gallery.length > 0) {
      for (const g of appData.gallery) {
        await setDoc(doc(db, "gallery", g.id), g);
        syncedCount++;
      }
    }

    // 10. FAQs
    if (appData.faqs && appData.faqs.length > 0) {
      for (const f of appData.faqs) {
        await setDoc(doc(db, "faqs", f.id), f);
        syncedCount++;
      }
    }

    // 11. System Info
    await setDoc(doc(db, "system", "metadata"), {
      version: appData.version || "1.0.0",
      updatedAt: new Date().toISOString(),
      syncedDocumentsTotal: syncedCount,
      projectId: firebaseConfig.projectId
    });
    syncedCount++;

    return {
      success: true,
      syncedCount,
      message: `¡Sincronización completa! Se enviaron ${syncedCount} documentos/secciones a la base de datos Firestore (${firebaseConfig.projectId}).`
    };
  } catch (err: any) {
    console.error("Error al sincronizar documentos con Firestore:", err);
    return {
      success: false,
      syncedCount: 0,
      message: `Error durante la sincronización: ${err?.message || "Compruebe permisos de Firestore"}`
    };
  }
}
