'use client';

import { useMemo } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { Country, State } from 'country-state-city';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { Save, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { fieldInvalidClassName } from '@/components/ui/field-styles';
import { SELECT_STYLES, SelectOption } from '@/constants/selectStyle';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { useAddUserAddressMutation, useEditUserAddressMutation } from '@/store/rtkQueries/userPostAPI';
import { addressSchema } from '@/utils/formValidation';
import toast from '@/utils/toast';
import { IAddress } from '@/types/user/address';

export function AddEditAddressModal() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);
  const address: IAddress | null = data?.address ?? null;
  const isEdit = !!address;

  const [addAddress, { isLoading: isAdding }] = useAddUserAddressMutation();
  const [editAddress, { isLoading: isEditingAddress }] = useEditUserAddressMutation();

  const onClose = () => dispatch(closeModal());

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      full_name: address?.full_name ?? '',
      phone: address?.phone ?? '',
      address_line1: address?.address_line1 ?? '',
      address_line2: address?.address_line2 ?? '',
      landmark: address?.landmark ?? '',
      city: address?.city ?? '',
      state: address?.state ?? '',
      country: address?.country ?? '',
      postal_code: address?.postal_code ?? '',
      isDefault: address?.isDefault ?? false,
    },
    validationSchema: addressSchema,
    onSubmit: async (formValues) => {
      const payload = {
        full_name: formValues.full_name.trim(),
        phone: formValues.phone.trim(),
        address_line1: formValues.address_line1.trim(),
        address_line2: formValues.address_line2?.trim() || undefined,
        landmark: formValues.landmark?.trim() || undefined,
        city: formValues.city.trim(),
        // Persist lowercase so API storage stays consistent; UI match is case-insensitive.
        state: formValues.state.trim().toLowerCase(),
        country: formValues.country.trim().toLowerCase(),
        postal_code: formValues.postal_code.trim(),
        isDefault: formValues.isDefault,
      };

      try {
        const res = isEdit
          ? await editAddress({ id: address!._id, body: payload }).unwrap()
          : await addAddress(payload).unwrap();
        if (res?.http_status_code === 200 || res?.http_status_code === 201) {
          toast.success(res.message ?? `Address ${isEdit ? 'updated' : 'added'} successfully!`);
          onClose();
        }
      } catch (error) {
        console.error('Failed to save address. Please try again.', error);
      }
    },
  });

  const isLoading = isAdding || isEditingAddress || isSubmitting;

  // Country → State → City cascade (country-state-city)
  const countries = useMemo(() => Country.getAllCountries(), []);
  const countryOptions: SelectOption[] = useMemo(
    () => countries.map((c) => ({ value: c.isoCode, label: c.name })),
    [countries]
  );
  
  const selectedCountry = useMemo(() => {
    const saved = values.country.trim().toLowerCase();
    if (!saved) return null;
    return countries.find((c) => c.name.toLowerCase() === saved) ?? null;
  }, [countries, values.country]);
  const selectedCountryOption: SelectOption | null = selectedCountry
    ? { value: selectedCountry.isoCode, label: selectedCountry.name }
    : null;

  const states = useMemo(
    () => (selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []),
    [selectedCountry]
  );
  const stateOptions: SelectOption[] = useMemo(
    () => states.map((s) => ({ value: s.isoCode, label: s.name })),
    [states]
  );
  const selectedState = useMemo(() => {
    const saved = values.state.trim().toLowerCase();
    if (!saved) return null;
    return states.find((s) => s.name.toLowerCase() === saved) ?? null;
  }, [states, values.state]);
  const selectedStateOption: SelectOption | null = selectedState
    ? { value: selectedState.isoCode, label: selectedState.name }
    : null;

  const handleCountryChange = (option: SelectOption | null) => {
    setFieldValue('country', option?.label ?? '');
    setFieldValue('state', '');
    setFieldValue('city', '');
  };

  const handleStateChange = (option: SelectOption | null) => {
    setFieldValue('state', option?.label ?? '');
    setFieldValue('city', '');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="modal_container" size="2xl" scrollBehavior="inside">
      <ModalContent>
        <form noValidate onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <p className="text-xl font-bold">{isEdit ? 'Edit Address' : 'Add New Address'}</p>
            <p className="text-sm font-normal text-muted-foreground">
              {isEdit
                ? 'Update the details for this saved address.'
                : 'Fill in the details below to save a new address.'}
            </p>
          </ModalHeader>

          <ModalBody className="p-4! custom_scrollbar max-h-[50vh] overflow-y-auto">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="full_name">
                  Full name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  placeholder="Enter your full name"
                  value={values.full_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className={errors.full_name && touched.full_name ? fieldInvalidClassName : undefined}
                />
                {errors.full_name && touched.full_name ? (
                  <p className="text-sm text-red-600">{errors.full_name}</p>
                ) : null}
              </div>

              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="phone">
                  Phone number<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="e.g., 919876543210"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className={errors.phone && touched.phone ? fieldInvalidClassName : undefined}
                />
                {errors.phone && touched.phone ? <p className="text-sm text-red-600">{errors.phone}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">
                  Country<span className="text-red-500">*</span>
                </Label>
                <ReactSelect
                  inputId="country"
                  name="country"
                  classNamePrefix="react-select"
                  options={countryOptions}
                  value={selectedCountryOption}
                  onChange={(option) => handleCountryChange(option as SelectOption | null)}
                  onBlur={() => setFieldTouched('country', true)}
                  placeholder="Select a country"
                  isClearable
                  isDisabled={isLoading}
                  menuPosition="fixed"
                  styles={SELECT_STYLES}
                />
                {errors.country && touched.country ? <p className="text-sm text-red-600">{errors.country}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">
                  State<span className="text-red-500">*</span>
                </Label>
                <ReactSelect
                  inputId="state"
                  name="state"
                  classNamePrefix="react-select"
                  options={stateOptions}
                  value={selectedStateOption}
                  onChange={(option) => handleStateChange(option as SelectOption | null)}
                  onBlur={() => setFieldTouched('state', true)}
                  placeholder={selectedCountry ? 'Select a state' : 'Select a country first'}
                  isClearable
                  isDisabled={isLoading || !selectedCountry}
                  noOptionsMessage={() => (selectedCountry ? 'No states found' : 'Select a country first')}
                  menuPosition="fixed"
                  styles={SELECT_STYLES}
                />
                {errors.state && touched.state ? <p className="text-sm text-red-600">{errors.state}</p> : null}
              </div>

              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="address_line1">
                  Address line 1<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address_line1"
                  name="address_line1"
                  placeholder="House no., Building, Street"
                  value={values.address_line1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className={errors.address_line1 && touched.address_line1 ? fieldInvalidClassName : undefined}
                />
                {errors.address_line1 && touched.address_line1 ? (
                  <p className="text-sm text-red-600">{errors.address_line1}</p>
                ) : null}
              </div>

              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="address_line2">Address line 2</Label>
                <Input
                  id="address_line2"
                  name="address_line2"
                  placeholder="Area, Locality (optional)"
                  value={values.address_line2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="e.g., Indore"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className={errors.city && touched.city ? fieldInvalidClassName : undefined}
                />
                {errors.city && touched.city ? <p className="text-sm text-red-600">{errors.city}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">
                  Postal code<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  placeholder="e.g., 452001"
                  value={values.postal_code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className={errors.postal_code && touched.postal_code ? fieldInvalidClassName : undefined}
                />
                {errors.postal_code && touched.postal_code ? (
                  <p className="text-sm text-red-600">{errors.postal_code}</p>
                ) : null}
              </div>

              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  id="landmark"
                  name="landmark"
                  placeholder="Nearby landmark (optional)"
                  value={values.landmark}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center gap-2.5 sm:col-span-2">
                <Checkbox
                  id="isDefault"
                  checked={values.isDefault}
                  onCheckedChange={(checked) => setFieldValue('isDefault', checked === true)}
                  disabled={isLoading}
                />
                <Label htmlFor="isDefault" className="font-normal text-gray-600">
                  Set as default address
                </Label>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              className="global_btn rounded_full outline_primary"
              onPress={onClose}
              startContent={<X className="h-4 w-4" />}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="global_btn rounded_full bg_primary"
              startContent={<Save className="h-4 w-4" />}
              isDisabled={isLoading}
              isLoading={isLoading}
            >
              {isEdit ? 'Save Changes' : 'Add Address'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
