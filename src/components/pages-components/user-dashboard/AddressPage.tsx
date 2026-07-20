'use client';

import { useDispatch } from 'react-redux';
import { MapPin, Plus, Pencil, Trash2, Phone, Star, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import toast from '@/utils/toast';
import { useGetUserAddressesQuery } from '@/store/rtkQueries/userGetAPI';
import { useSetDefaultUserAddressMutation, useDeleteUserAddressMutation } from '@/store/rtkQueries/userPostAPI';
import { IAddress } from '@/types/user/address';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';

function formatAddressLine(address: IAddress): string {
  return [address.address_line1, address.address_line2, address.landmark].filter(Boolean).join(', ');
}

function formatCityStateLine(address: IAddress): string {
  const cityState = [address.city, address.state].filter(Boolean).join(', ');
  return [cityState, address.postal_code].filter(Boolean).join(' ');
}

export function AddressPage() {
  const dispatch = useDispatch();
  const { data: addressData, isLoading } = useGetUserAddressesQuery();
  const [setDefaultAddress, { isLoading: isSettingDefault }] = useSetDefaultUserAddressMutation();
  const [deleteAddress] = useDeleteUserAddressMutation();

  const addresses = addressData?.data ?? [];

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

  const handleSetDefault = async (address: IAddress) => {
    if (address.isDefault) return;
    try {
      const res = await setDefaultAddress(address._id).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? 'Default address updated!');
      }
    } catch (error) {
      console.error('Failed to set default address. Please try again.', error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-7 w-28 rounded bg-gray-200" />
            <div className="h-4 w-52 rounded bg-gray-100" />
          </div>
          <div className="h-10 w-36 rounded-full bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 rounded-lg border border-gray-200 bg-gray-50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader title="Address" description="Manage the addresses saved to your account">
        <Button
          type="button"
          className="global_btn w-full rounded_full bg_primary sm:w-auto"
          startContent={<Plus className="h-4 w-4" />}
          onPress={openAddModal}
        >
          Add New Address
        </Button>
      </UserDashboardPageHeader>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300"
            >
              {address.isDefault ? (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1 text-[11px] font-medium text-primary">
                  <Star className="h-3 w-3 fill-current" aria-hidden />
                  Default
                </span>
              ) : null}

              <div className="flex items-start gap-3 pr-16">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50/60">
                  <MapPin className="h-4 w-4 text-primary" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-base font-semibold text-gray-900">{address.full_name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
                    {address.phone}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {formatAddressLine(address)}
                <br />
                {formatCityStateLine(address)}
                <br />
                {address.country}
              </p>

              <div className="flex-1" />

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                {!address.isDefault ? (
                  <Button
                    type="button"
                    className="global_btn rounded_full outline_primary"
                    isDisabled={isSettingDefault}
                    onPress={() => handleSetDefault(address)}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Set as Default
                  </Button>
                ) : null}
                <Button
                  type="button"
                  className="global_btn rounded_full outline_primary"
                  onPress={() => openEditModal(address)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  type="button"
                  className="global_btn rounded_full danger_outline"
                  onPress={() => openDeleteModal(address)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50/60 px-6 py-12 text-center">
          <div className="mx-auto max-w-md">
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-gray-200 bg-white">
              <MapPin className="h-5 w-5 text-primary" aria-hidden />
            </span>
            <h3 className="mb-2 text-base font-semibold text-gray-900">No addresses saved yet</h3>
            <p className="mb-6 text-sm text-gray-500">
              Add an address to speed up checkout and keep your delivery details handy.
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
        </div>
      )}
    </div>
  );
}
