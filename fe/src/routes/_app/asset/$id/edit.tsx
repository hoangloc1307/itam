'use no memo';

import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { assetQueries } from '~/api/asset.queries';
import { AssetFormPage } from '~/routes/_app/asset/asset.form';

const EditAssetPage = () => {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(assetQueries.detail(id));

  return <AssetFormPage asset={data?.data} />;
};

export const Route = createFileRoute('/_app/asset/$id/edit')({ component: EditAssetPage });
