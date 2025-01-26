import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface SwitchGenericProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export function SwitchGeneric({ label, checked, onChange }: SwitchGenericProps) {
  return (
    <div className="flex items-center gap-1">
      <Label htmlFor={label}>{label}</Label>
      <Switch id={label} dir="ltr" checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
