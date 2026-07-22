'use no memo';

import { createFileRoute } from '@tanstack/react-router';
import { AssetFormPage } from '~/routes/_app/asset/asset-form-page';

const CreateAssetPage = () => {
  return <AssetFormPage />;
};

export const Route = createFileRoute('/_app/asset/create')({ component: CreateAssetPage });
