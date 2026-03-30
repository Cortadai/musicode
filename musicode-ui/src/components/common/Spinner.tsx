import { Loader2 } from 'lucide-react';

export default function Spinner({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-zinc-500 py-8">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
