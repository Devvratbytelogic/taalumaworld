'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check, MapPin, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { openModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { useSetDefaultUserAddressMutation, useDeleteUserAddressMutation } from '@/store/rtkQueries/userPostAPI';
import { IAddress, IAddressListAPIResponse } from '@/types/user/address';

function formatCompactAddress(address: IAddress): string {
  return [
    address.address_line1,
    address.address_line2,
    address.landmark,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ]
    .filter(Boolean)
    .join(', ');
}

interface ChapterPurchaseAddressesProps {
  addressData: IAddressListAPIResponse | undefined;
  isLoading: boolean;
}

export default function ChapterPurchaseAddresses({ addressData, isLoading }: ChapterPurchaseAddressesProps) {
  const dispatch = useDispatch();
  const purchaseModalData = useSelector((state: RootState) => state.allModal.data);
  const [setDefaultAddress, { isLoading: isSettingDefault }] = useSetDefaultUserAddressMutation();
  const [deleteAddress] = useDeleteUserAddressMutation();
  const addresses = addressData?.data ?? [];
  const hasAddresses = addresses.length > 0;

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (addresses.length === 0) {
      setSelectedAddressId(null);
      return;
    }

    const stillExists = selectedAddressId && addresses.some((address) => address._id === selectedAddressId);
    if (stillExists) return;

    const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0];
    if (!defaultAddress) return;

    setSelectedAddressId(defaultAddress._id);
  }, [addresses, selectedAddressId]);

  const purchaseReturnTo = {
    componentName: 'ChapterPurchaseModal',
    data: purchaseModalData,
  };

  const openAddAddressModal = () => {
    dispatch(
      openModal({
        componentName: 'AddEditAddressModal',
        data: { returnTo: purchaseReturnTo },
      })
    );
  };

  const openEditAddressModal = (address: IAddress) => {
    dispatch(
      openModal({
        componentName: 'AddEditAddressModal',
        data: { address, returnTo: purchaseReturnTo },
      })
    );
  };

  const openDeleteAddressModal = (address: IAddress) => {
    dispatch(
      openModal({
        componentName: 'DeleteConfirmation',
        data: {
          itemName: address.full_name,
          returnTo: purchaseReturnTo,
          onDelete: async () => {
            try {
              const res = await deleteAddress(address._id).unwrap();
              if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                toast.success(res.message ?? 'Address deleted successfully!');
                dispatch(openModal(purchaseReturnTo));
              }
            } catch (error) {
              console.error('Failed to delete address. Please try again.', error);
            }
          },
        },
      })
    );
  };

  const handleSelectAddress = async (address: IAddress) => {
    if (isSettingDefault || address._id === selectedAddressId) return;

    if (address.isDefault) {
      setSelectedAddressId(address._id);
      return;
    }

    try {
      const res = await setDefaultAddress(address._id).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        setSelectedAddressId(address._id);
        toast.success(res.message ?? 'Default address updated!');
      }
    } catch (error) {
      console.error('Failed to set default address. Please try again.', error);
    }
  };

  return (
    <div className="space-y-2 border-t pt-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold tracking-tight text-muted-foreground">Delivery Address</h3>
        <button
          type="button"
          onClick={openAddAddressModal}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Address
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-1.5">
          {[1, 2].map((i) => (
            <div key={i} className="h-11 animate-pulse rounded-md border border-border bg-muted/40" />
          ))}
        </div>
      ) : hasAddresses ? (
        <div className="space-y-1.5">
          {addresses.map((address) => {
            const isSelected = selectedAddressId === address._id;
            return (
              <div
                key={address._id}
                className={`flex items-center gap-1 rounded-md border transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-white hover:border-primary/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleSelectAddress(address)}
                  disabled={isSettingDefault}
                  className="flex min-w-0 flex-1 items-center gap-2.5 px-2.5 py-2 text-left disabled:opacity-60"
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isSelected ? 'border-primary bg-primary text-white' : 'border-border bg-white'
                    }`}
                    aria-hidden
                  >
                    {isSelected ? <Check className="h-2.5 w-2.5" /> : null}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-medium text-foreground">{address.full_name}</p>
                      {address.isDefault && (
                        <span className="inline-flex shrink-0 items-center gap-0.5 text-[10px] font-medium text-primary">
                          <Star className="h-2.5 w-2.5 fill-current" aria-hidden />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      {address.phone} · {formatCompactAddress(address)}
                    </p>
                  </div>
                </button>

                <div className="flex shrink-0 items-center gap-0.5 pr-1.5">
                  <button
                    type="button"
                    onClick={() => openEditAddressModal(address)}
                    aria-label={`Edit ${address.full_name}`}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openDeleteAddressModal(address)}
                    aria-label={`Delete ${address.full_name}`}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <button
          type="button"
          onClick={openAddAddressModal}
          className="flex w-full items-center gap-2 rounded-md border border-dashed border-border bg-muted/20 px-3 py-2.5 text-left transition-colors hover:border-primary/40"
        >
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
          <p className="text-xs text-muted-foreground">No addresses saved yet. Tap to add one.</p>
        </button>
      )}
    </div>
  );
}
