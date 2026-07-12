import CampaignsContent from "@/modules/campaigns/campaigns-content";
import type { CampaignFiltersDto, CampaignStatus } from "@/modules/campaigns/lib/types/campaign.types";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CampaignsPage({ searchParams }: Props) {
  const params = await searchParams;
  const filters: CampaignFiltersDto = {
    page: Number(firstParam(params.page) ?? 1),
    pageSize: Number(firstParam(params.pageSize) ?? 10),
    search: firstParam(params.search),
    status: firstParam(params.status) as CampaignStatus | undefined,
    stateScope: firstParam(params.stateScope),
    organization: firstParam(params.organization),
  };

  return <CampaignsContent filters={filters} />;
}
