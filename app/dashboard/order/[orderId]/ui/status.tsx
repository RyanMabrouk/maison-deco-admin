'use client';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, PackageSearch } from 'lucide-react';
import CancelReason from './cancelReason';
import { Enums } from '@/types/database.types';
import ConfirmOrder from './cofirmOrder';
import ProcessOrder from './proccessOrder';

type StatusConfig = {
  color: string;
  icon: React.ReactNode;
  text: string;
};

export const statusConfig: Record<Enums<'order_status'>, StatusConfig> = {
  Pending: {
    color: 'bg-yellow-500',
    icon: <Clock className="h-4 w-4" />,
    text: 'En attente'
  },
  Delivered: {
    color: 'bg-green-500',
    icon: <CheckCircle className="h-4 w-4" />,
    text: 'Livré'
  },
  Cancelled: {
    color: 'bg-red-600',
    icon: <XCircle className="h-4 w-4" />,
    text: 'Annulé'
  },
  Processing: {
    color: 'bg-blue-500',
    icon: <PackageSearch className="h-4 w-4" />,
    text: 'En traitement'
  }
};

type StatusProps = {
  status: Enums<'order_status'>;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function Status({ status }: StatusProps) {
  const { color, icon, text } = statusConfig[status] || {
    color: 'bg-gray-500',
    icon: <Clock className="h-4 w-4" />,
    text: status
  };

  return (
    <>
      {status === 'Processing' ? (
        <div className="flex items-center gap-2">
          <CancelReason />
          <ConfirmOrder />
        </div>
      ) : status === 'Pending' ? (
        <ProcessOrder />
      ) : (
        <Badge
          className={`mt-3 flex items-center px-2 py-1 text-lg text-gray-50 hover:${color} w-fit gap-1 hover:opacity-50 ${color} `}
        >
          {icon}
          <span className="font-normal">{text}</span>
        </Badge>
      )}
    </>
  );
}
