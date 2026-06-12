export default function FieldError({ error, touched }) {
    
  if (!touched || !error) return null;

  return (
    <p className="text-red-500 text-xs mt-1">{error}</p>
  );
}