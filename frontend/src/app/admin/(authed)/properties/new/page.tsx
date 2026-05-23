'use client';

import PageHeader from '@/components/admin/PageHeader';
import PropertyForm, { emptyProperty } from '@/components/admin/PropertyForm';

export default function NewPropertyPage() {
  return (
    <>
      <PageHeader
        title="New property"
        description="Add a listing. Save as draft or publish straight away."
      />
      <PropertyForm initial={emptyProperty} mode="create" />
    </>
  );
}
