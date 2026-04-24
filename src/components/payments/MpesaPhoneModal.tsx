'use client';

import { Phone } from 'lucide-react';
import { useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';

export type MpesaPhoneModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (phone: number) => void;
  isLoading?: boolean;
};

function parseKenyaPhone(raw: string): number | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('254') && digits.length === 12) return Number(digits);
  if (digits.startsWith('0') && digits.length === 10) return Number('254' + digits.slice(1));
  if (digits.length === 9) return Number('254' + digits);
  return null;
}

export function MpesaPhoneModal({ isOpen, onClose, onConfirm, isLoading = false }: MpesaPhoneModalProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    const phone = parseKenyaPhone(value);
    if (!phone) {
      setError('Enter a valid Safaricom number (e.g. 0712345678 or 254712345678)');
      return;
    }
    setError('');
    onConfirm(phone);
  };

  const handleClose = () => {
    setValue('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="sm"
      placement="center"
      backdrop="opaque"
      classNames={{
        base: 'max-w-sm rounded-3xl z-[10001]',
        wrapper: 'z-[10000]',
        backdrop: 'z-[9999]',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 border-b border-default-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
              <Phone className="h-4 w-4 text-success" />
            </div>
            <p className="text-lg font-semibold">Enter M-Pesa Number</p>
          </div>
          <p className="text-sm font-normal text-muted-foreground pl-10">
            An STK push will be sent to this number.
          </p>
        </ModalHeader>

        <ModalBody className="py-6 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="mpesa-phone">
              Safaricom Phone Number
            </label>
            <Input
              id="mpesa-phone"
              type="tel"
              placeholder="e.g. 0712 345 678"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirm();
              }}
              aria-invalid={!!error}
              className="h-11 text-base"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <p className="text-xs text-muted-foreground bg-accent/30 rounded-xl px-3 py-2">
            Make sure the number is registered on M-Pesa and has sufficient funds.
          </p>
        </ModalBody>

        <ModalFooter className="flex flex-col gap-2">
          <Button
            className="global_btn rounded_full bg_primary w-full"
            onPress={handleConfirm}
            isLoading={isLoading}
            isDisabled={isLoading || !value.trim()}
          >
            {isLoading ? 'Sending request…' : 'Send M-Pesa Request'}
          </Button>
          <Button
            className="global_btn rounded_full outline_primary w-full"
            onPress={handleClose}
            isDisabled={isLoading}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
