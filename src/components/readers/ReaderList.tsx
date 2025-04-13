import { useState, useEffect } from "react";
import { ReaderCard } from "./ReaderCard";
import { Loader2 } from "lucide-react";
import { getReaders } from "@/lib/db-service";

type Reader = {
  id: string | number;
  name: string;
  specialties?: string;
  rate: number;
  isOnline: boolean;
  rating: number;
  imageUrl?: string;
};

interface ReaderListProps {
  onlineOnly?: boolean;
  limit?: number;
  title?: string;
}

export function ReaderList({ onlineOnly = false, limit, title = "Featured Readers" }: ReaderListProps) {
  const [readers, setReaders] = useState<Reader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReaders() {
      try {
        setLoading(true);
        
        const readersData = await getReaders({ 
          onlineOnly, 
          limit 
        });
        
        // Ensure the data matches our Reader type
        const typedReaders: Reader[] = readersData.map(reader => ({
          id: reader.id,
          name: reader.name || "Unknown Reader",
          specialties: reader.specialties,
          rate: reader.rate,
          isOnline: Boolean(reader.isOnline),
          rating: reader.rating || 5.0,
          imageUrl: reader.imageUrl
        }));
        
        setReaders(typedReaders);
      } catch (err) {
        console.error("Error fetching readers:", err);
        setError("Failed to load readers. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchReaders();
  }, [onlineOnly, limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (readers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {onlineOnly ? "No readers are currently online." : "No readers found."}
        </p>
      </div>
    );
  }

  return (
    <div className="py-6">
      {title && <h2 className="text-3xl alex-brush pink-text mb-6">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {readers.map((reader) => (
          <ReaderCard
            key={reader.id}
            id={typeof reader.id === 'string' ? parseInt(reader.id) || 0 : reader.id}
            name={reader.name}
            specialties={reader.specialties}
            rate={reader.rate}
            isOnline={reader.isOnline}
            rating={reader.rating}
            imageUrl={reader.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}