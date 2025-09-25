import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export default function MakeMeAdmin() {
  const { user, elevateToBoard, loading } = useAuth();
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState('');

  const handleElevate = async () => {
    setWorking(true);
    const { error } = await elevateToBoard();
    setWorking(false);
    setResult(error ? `Failed: ${error.message}` : 'Success: You are now an admin (board).');
  };

  if (loading) return null;

  if (!user) {
    return (
      <div className="pt-24 pb-12 max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2 font-heading">Make Me Admin</h1>
        <p className="text-light-grey">You must be logged in to use this tool.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 max-w-2xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4 font-heading">Make Me Admin</h1>
      <p className="text-light-grey mb-4">This grants your account the board role.</p>
      <Button onClick={handleElevate} disabled={working} className="sacramento-gradient font-body">
        {working ? 'Granting…' : 'Grant me admin access'}
      </Button>
      {result && <div className="mt-4 text-sm text-light-grey">{result}</div>}
    </div>
  );
}
