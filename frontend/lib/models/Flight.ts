import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';

export class Flight {
  private static collectionName = 'flights';

  /**
   * Busca voos por aeronave
   */
  static async findByAircraftId(aircraftId: string, filters: any = {}) {
    try {
      // Firestore requer índices compostos para múltiplos where
      // Vamos fazer a query básica e filtrar em memória quando necessário
      let q = query(
        collection(db, this.collectionName),
        where('aircraft_id', '==', aircraftId)
      );

      const querySnapshot = await getDocs(q);
      
      let flights = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Tratar flight_date - pode ser string ISO ou Timestamp
        let flightDate = data.flight_date;
        if (flightDate?.toDate) {
          flightDate = flightDate.toDate().toISOString();
        } else if (typeof flightDate === 'string' && flightDate.includes('T')) {
          // Já é string ISO, manter
          flightDate = flightDate;
        } else if (typeof flightDate === 'string') {
          // String no formato YYYY-MM-DD, converter para ISO
          flightDate = new Date(flightDate + 'T00:00:00').toISOString();
        }
        
        return {
          id: doc.id,
          ...data,
          flight_type: data.flight_type || 'planned',
          flight_date: flightDate,
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
          updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
        } as any;
      });
      
      // Ordenar por data em memória (mais recente primeiro)
      flights.sort((a: any, b: any) => {
        const dateA = new Date(a.flight_date || 0).getTime();
        const dateB = new Date(b.flight_date || 0).getTime();
        return dateB - dateA;
      });

      // Aplicar filtros em memória
      if (filters.flight_type) {
        flights = flights.filter((f: any) => f.flight_type === filters.flight_type);
      }

      if (filters.start_date) {
        flights = flights.filter((f: any) => f.flight_date >= filters.start_date);
      }

      if (filters.end_date) {
        flights = flights.filter((f: any) => f.flight_date <= filters.end_date);
      }

      // Aplicar limite se especificado
      if (filters.limit) {
        flights = flights.slice(0, filters.limit);
      }
      
      return flights;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca voo por ID
   */
  static async findById(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        flight_date: data.flight_date?.toDate?.()?.toISOString() || data.flight_date,
        created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
        updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
      };
    } catch (error) {
      console.error('[Flight.findById] Erro:', error);
      throw error;
    }
  }

  /**
   * Cria um novo voo
   */
  static async create(flightData: any) {
    try {
      const docRef = doc(collection(db, this.collectionName));
      const now = new Date().toISOString();
      
      await setDoc(docRef, {
        ...flightData,
        created_at: now,
        updated_at: now,
      });
      
      return {
        id: docRef.id,
        ...flightData,
        created_at: now,
        updated_at: now,
      };
    } catch (error) {
      console.error('[Flight.create] Erro:', error);
      throw error;
    }
  }

  /**
   * Atualiza um voo
   */
  static async update(id: string, flightData: any) {
    try {
      const docRef = doc(db, this.collectionName, id);
      
      await updateDoc(docRef, {
        ...flightData,
        updated_at: new Date().toISOString(),
      });
      
      const updatedDoc = await getDoc(docRef);
      const data = updatedDoc.data();
      
      return {
        id: updatedDoc.id,
        ...data,
        flight_date: data?.flight_date?.toDate?.()?.toISOString() || data?.flight_date,
        created_at: data?.created_at?.toDate?.()?.toISOString() || data?.created_at,
        updated_at: data?.updated_at?.toDate?.()?.toISOString() || data?.updated_at,
      };
    } catch (error) {
      console.error('[Flight.update] Erro:', error);
      throw error;
    }
  }

  /**
   * Remove um voo
   */
  static async delete(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('[Flight.delete] Erro:', error);
      throw error;
    }
  }

  /**
   * Marca voo como completado
   */
  static async markAsCompleted(id: string, actualLegTime: number | null = null, costCalculated: number | null = null) {
    try {
      const docRef = doc(db, this.collectionName, id);
      
      const updateData: any = {
        flight_type: 'completed',
        updated_at: new Date().toISOString()
      };

      if (actualLegTime !== null) {
        updateData.actual_leg_time = actualLegTime;
      }

      if (costCalculated !== null) {
        updateData.cost_calculated = costCalculated;
      }

      await updateDoc(docRef, updateData);
      
      const updatedDoc = await getDoc(docRef);
      const data = updatedDoc.data();
      
      return {
        id: updatedDoc.id,
        ...data,
        flight_date: data?.flight_date?.toDate?.()?.toISOString() || data?.flight_date,
        created_at: data?.created_at?.toDate?.()?.toISOString() || data?.created_at,
        updated_at: data?.updated_at?.toDate?.()?.toISOString() || data?.updated_at,
      };
    } catch (error) {
      console.error('[Flight.markAsCompleted] Erro:', error);
      throw error;
    }
  }

  /**
   * Busca estatísticas de voos
   */
  static async getStatistics(aircraftId: string, startDate?: string, endDate?: string) {
    try {
      // Buscar todos os voos da aeronave e filtrar em memória
      let q = query(
        collection(db, this.collectionName),
        where('aircraft_id', '==', aircraftId)
      );

      const querySnapshot = await getDocs(q);
      let flights = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          flight_date: data.flight_date?.toDate?.()?.toISOString() || data.flight_date,
        };
      });

      // Aplicar filtros de data em memória
      if (startDate) {
        flights = flights.filter((f: any) => f.flight_date >= startDate);
      }
      if (endDate) {
        flights = flights.filter((f: any) => f.flight_date <= endDate);
      }

      const planned = flights.filter((f: any) => f.flight_type === 'planned').length;
      const completed = flights.filter((f: any) => f.flight_type === 'completed').length;
      const totalHoursCompleted = flights
        .filter((f: any) => f.flight_type === 'completed')
        .reduce((sum: number, f: any) => sum + (f.actual_leg_time || f.leg_time || 0), 0);
      const totalCost = flights
        .filter((f: any) => f.flight_type === 'completed')
        .reduce((sum: number, f: any) => sum + (f.total_cost || 0), 0);

      return {
        planned,
        completed,
        totalHoursCompleted,
        totalCost,
      };
    } catch (error) {
      console.error('[Flight.getStatistics] Erro:', error);
      throw error;
    }
  }
}
