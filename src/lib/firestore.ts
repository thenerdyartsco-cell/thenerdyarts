import { getDb } from "./firebase";
import type {
  Artwork,
  ArtworkInput,
  PaginatedResponse,
  PurchaseRequest,
  SoldOutRequest,
  CustomRequest,
  Review,
} from "@/types";

export async function getArtworks(options: {
  limit?: number;
  startAfter?: string;
  filter?: "all" | "available" | "sold";
  featuredOnly?: boolean;
} = {}): Promise<PaginatedResponse<Artwork>> {
  const { limit = 8, startAfter, filter = "all", featuredOnly = false } = options;

  let query = getDb().collection("artworks").orderBy("order", "asc");

  if (filter !== "all") {
    query = query.where("status", "==", filter);
  }

  if (featuredOnly) {
    query = query.where("featured", "==", true);
  }

  if (startAfter) {
    const lastDoc = await getDb().collection("artworks").doc(startAfter).get();
    if (lastDoc.exists) {
      query = query.startAfter(lastDoc);
    }
  }

  const snapshot = await query.limit(limit + 1).get();
  const docs = snapshot.docs.slice(0, limit);
  const hasMore = snapshot.docs.length > limit;

  const items: Artwork[] = docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Artwork[];

  return {
    items,
    lastDocId: docs.length > 0 ? docs[docs.length - 1].id : null,
    hasMore,
  };
}

export async function getArtworkById(id: string): Promise<Artwork | null> {
  const doc = await getDb().collection("artworks").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Artwork;
}

export async function createPurchaseRequest(data: Record<string, unknown>) {
  const ref = await getDb().collection("purchase_requests").add({
    ...data,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function createSoldOutRequest(data: Record<string, unknown>) {
  const ref = await getDb().collection("soldout_requests").add({
    ...data,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function createCustomRequest(data: Record<string, unknown>) {
  const ref = await getDb().collection("custom_requests").add({
    ...data,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function getApprovedReviews() {
  // Filter on the server, sort in memory — avoids needing a composite
  // Firestore index on (approved, createdAt).
  const snapshot = await getDb()
    .collection("reviews")
    .where("approved", "==", true)
    .get();

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Review)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

// ============================================================
// Admin helpers
// ============================================================

// ----- Artwork CRUD -----

export async function getAllArtworks(): Promise<Artwork[]> {
  const snapshot = await getDb()
    .collection("artworks")
    .orderBy("order", "asc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Artwork[];
}

export async function createArtwork(data: ArtworkInput): Promise<string> {
  const now = new Date().toISOString();
  const ref = await getDb().collection("artworks").add({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function updateArtwork(
  id: string,
  data: Partial<ArtworkInput>
): Promise<void> {
  await getDb()
    .collection("artworks")
    .doc(id)
    .set({ ...data, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function deleteArtwork(id: string): Promise<void> {
  await getDb().collection("artworks").doc(id).delete();
}

// ----- Buyer queue (purchase requests, first-come-first-served) -----

export async function getPurchaseRequests(): Promise<PurchaseRequest[]> {
  const snapshot = await getDb()
    .collection("purchase_requests")
    .orderBy("createdAt", "asc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as PurchaseRequest[];
}

export async function updatePurchaseRequestStatus(
  id: string,
  status: PurchaseRequest["status"]
): Promise<void> {
  await getDb().collection("purchase_requests").doc(id).set({ status }, { merge: true });
}

/**
 * Completes a sale: marks the artwork sold, marks the winning request completed,
 * and marks every other still-open request for that artwork as closed_sold.
 * Returns the list of buyers to notify that the piece is gone.
 */
export async function completeSale(
  artworkId: string,
  winningRequestId: string
): Promise<{ notify: { name: string; email: string; artworkTitle: string }[] }> {
  const db = getDb();

  await db
    .collection("artworks")
    .doc(artworkId)
    .set({ status: "sold", updatedAt: new Date().toISOString() }, { merge: true });
  await db
    .collection("purchase_requests")
    .doc(winningRequestId)
    .set({ status: "completed" }, { merge: true });

  const others = await db
    .collection("purchase_requests")
    .where("artworkId", "==", artworkId)
    .get();

  const notify: { name: string; email: string; artworkTitle: string }[] = [];
  const batch = db.batch();
  others.forEach((doc) => {
    if (doc.id === winningRequestId) return;
    const data = doc.data() as PurchaseRequest;
    if (data.status === "completed" || data.status === "closed_sold") return;
    batch.set(doc.ref, { status: "closed_sold" }, { merge: true });
    notify.push({ name: data.name, email: data.email, artworkTitle: data.artworkTitle });
  });
  await batch.commit();

  return { notify };
}

// ----- Requests tab (sold-out interest + custom commissions) -----

export async function getSoldOutRequests(): Promise<SoldOutRequest[]> {
  const snapshot = await getDb()
    .collection("soldout_requests")
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as SoldOutRequest[];
}

export async function getCustomRequests(): Promise<CustomRequest[]> {
  const snapshot = await getDb()
    .collection("custom_requests")
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as CustomRequest[];
}

export async function updateRequestStatus(
  collection: "soldout_requests" | "custom_requests",
  id: string,
  status: string
): Promise<void> {
  await getDb().collection(collection).doc(id).set({ status }, { merge: true });
}

// ----- Reviews -----

export async function getAllReviews(): Promise<Review[]> {
  const snapshot = await getDb()
    .collection("reviews")
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Review[];
}

export async function createReview(data: {
  name: string;
  rating: number;
  text: string;
  approved: boolean;
}): Promise<string> {
  const ref = await getDb().collection("reviews").add({
    ...data,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateReview(
  id: string,
  data: Partial<{ name: string; rating: number; text: string; approved: boolean }>
): Promise<void> {
  await getDb().collection("reviews").doc(id).set(data, { merge: true });
}

export async function deleteReview(id: string): Promise<void> {
  await getDb().collection("reviews").doc(id).delete();
}
