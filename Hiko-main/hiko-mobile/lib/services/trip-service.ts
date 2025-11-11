import { Trip, TripMessage, CreateTripInput } from "@/lib/types";
import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { createTripSchema } from "@/lib/schemas";

export class TripService {
  async createTrip(input: CreateTripInput, userId: string): Promise<string> {
    if (!db) {
      throw new Error("Firestore not initialized");
    }
    const validated = createTripSchema.parse(input);

    const gearNeeded = await this.generateGearChecklist(
      validated.hikeId,
      validated.isOvernight
    );

    const tripData = {
      ...validated,
      createdBy: userId,
      participants: [userId, ...validated.participants],
      gearNeeded,
      status: "planning" as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "trips"), tripData);
    return docRef.id;
  }

  async getTrip(id: string): Promise<Trip | null> {
    if (!db) {
      return null;
    }
    const docRef = doc(db, "trips", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Trip;
  }

  async listTrips(userId: string): Promise<Trip[]> {
    if (!db) {
      return [];
    }
    const tripsRef = collection(db, "trips");
    const q = query(
      tripsRef,
      where("participants", "array-contains", userId),
      orderBy("startDate", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate.toDate(),
      endDate: doc.data().endDate.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Trip[];
  }

  async updateTrip(id: string, updates: Partial<Trip>): Promise<void> {
    if (!db) {
      throw new Error("Firestore not initialized");
    }
    const docRef = doc(db, "trips", id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  async postMessage(tripId: string, userId: string, message: string): Promise<string> {
    if (!db) {
      throw new Error("Firestore not initialized");
    }
    const messageData = {
      tripId,
      userId,
      message,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "tripMessages"), messageData);
    return docRef.id;
  }

  async getTripMessages(tripId: string): Promise<TripMessage[]> {
    if (!db) {
      return [];
    }
    const messagesRef = collection(db, "tripMessages");
    const q = query(
      messagesRef,
      where("tripId", "==", tripId),
      orderBy("createdAt", "asc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as TripMessage[];
  }

  private async generateGearChecklist(
    hikeId: string,
    isOvernight: boolean
  ): Promise<string[]> {
    const baseGear = [
      "Water bottle",
      "Snacks",
      "First aid kit",
      "Map",
      "Compass",
      "Headlamp",
    ];

    if (isOvernight) {
      baseGear.push(
        "Sleeping bag",
        "Sleeping pad",
        "Tent",
        "Cooking equipment",
        "Extra food"
      );
    }

    return baseGear;
  }
}

export const tripService = new TripService();
