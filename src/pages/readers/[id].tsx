import { useParams } from "react-router-dom";

export default function ReaderProfile() {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Reader Profile</h1>
      <p>Reader ID: {id}</p>
      <p>This is a placeholder for the reader profile page.</p>
    </div>
  );
} 