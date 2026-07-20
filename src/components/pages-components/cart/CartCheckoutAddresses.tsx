'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Check, MapPin, Pencil, Phone, Plus, Star, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { useGetUserAddressesQuery } from '@/store/rtkQueries/userGetAPI';
import { useDeleteUserAddressMutation, useSetDefaultUserAddressMutation } from '@/store/rtkQueries/userPostAPI';
import { IAddress } from '@/types/user/address';
import toast from '@/utils/toast';

function formatAddressLine(address: IAddress): string {
  return [address.address_line1, address.address_line2, address.landmark].filter(Boolean).join(', ');
}

function formatCityStateLine(address: IAddress): string {
  const cityState = [address.city, address.state].filter(Boolean).join(', ');
  return [cityState, address.postal_code].filter(Boolean).join(' ');
}

interface CartCheckoutAddressesProps {
  selectedAddressId?: string | null;
  onSelectAddress?: (addressId: string) => void;
}

export default function CartCheckoutAddresses({
  selectedAddressId: controlledSelectedId,
  onSelectAddress,
}: CartCheckoutAddressesProps) {
  const dispatch = useDispatch();
  const { data: addressData, isLoading } = useGetUserAddressesQuery();
  const [setDefaultAddress, { isLoading: isSettingDefault }] = useSetDefaultUserAddressMutation();
  const [deleteAddress] = useDeleteUserAddressMutation();
  const addresses = addressData?.data ?? [];

  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const selectedAddressId = controlledSelectedId ?? internalSelectedId;

  useEffect(() => {
    if (addresses.length === 0) return;

    const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
    if (!defaultAddress) return;

    if (selectedAddressId !== defaultAddress._id) {
      if (controlledSelectedId == null) setInternalSelectedId(defaultAddress._id);
      onSelectAddress?.(defaultAddress._id);
    }
  }, [addresses, controlledSelectedId, onSelectAddress, selectedAddressId]);

  const handleSelect = async (address: IAddress) => {
    if (isSettingDefault) return;

    if (address.isDefault) {
      if (controlledSelectedId == null) setInternalSelectedId(address._id);
      onSelectAddress?.(address._id);
      return;
    }

    try {
      const res = await setDefaultAddress(address._id).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        if (controlledSelectedId == null) setInternalSelectedId(address._id);
        onSelectAddress?.(address._id);
        toast.success(res.message ?? 'Default address updated!');
      }
    } catch (error) {
      console.error('Failed to set default address. Please try again.', error);
    }
  };

  const openAddModal = () => dispatch(openModal({ componentName: 'AddEditAddressModal' }));

  const openEditModal = (address: IAddress) =>
    dispatch(openModal({ componentName: 'AddEditAddressModal', data: { address } }));

  const openDeleteModal = (address: IAddress) =>
    dispatch(
      openModal({
        componentName: 'DeleteConfirmation',
        data: {
          itemName: address.full_name,
          onDelete: async () => {
            try {
              const res = await deleteAddress(address._id).unwrap();
              if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                toast.success(res.message ?? 'Address deleted successfully!');
                dispatch(closeModal());
              }
            } catch (error) {
              console.error('Failed to delete address. Please try again.', error);
            }
          },
        },
      })
    );

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex justify-end">
          <div className="h-9 w-36 animate-pulse rounded-full bg-muted" />
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-md border border-border bg-muted/40" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          type="button"
          className="global_btn rounded_full outline_primary w_fit"
          startContent={<Plus className="h-4 w-4" />}
          onPress={openAddModal}
        >
          Add Address
        </Button>
      </div>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {addresses.map((address) => {
            const isSelected = selectedAddressId === address._id || address.isDefault;
            return (
              <div
                key={address._id}
                className={`relative flex flex-col rounded-md border p-4 transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-white hover:border-primary/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleSelect(address)}
                  disabled={isSettingDefault}
                  className="w-full text-left disabled:opacity-60"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        isSelected ? 'border-primary bg-primary text-white' : 'border-border bg-white'
                      }`}
                      aria-hidden
                    >
                      {isSelected ? <Check className="h-3 w-3" /> : null}
                    </span>

                    {address.isDefault ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-white px-2 py-0.5 text-[11px] font-medium text-primary">
                        <Star className="h-3 w-3 fill-current" aria-hidden />
                        Default
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-muted-foreground">Tap to select</span>
                    )}
                  </div>

                  <p className="font-semibold text-foreground">{address.full_name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {address.phone}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {formatAddressLine(address)}
                    <br />
                    {formatCityStateLine(address)}
                    <br />
                    <span className="capitalize">{address.country}</span>
                  </p>
                </button>

                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/70 pt-3">
                  <button
                    type="button"
                    onClick={() => openEditModal(address)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => openDeleteModal(address)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
          <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" aria-hidden />
          </span>
          <h3 className="mb-1 text-base font-semibold">No addresses saved yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Add a billing address to continue with checkout.
          </p>
          <Button
            type="button"
            className="global_btn rounded_full bg_primary m-auto"
            startContent={<Plus className="h-4 w-4" />}
            onPress={openAddModal}
          >
            Add New Address
          </Button>
        </div>
      )}
    </div>
  );
}
