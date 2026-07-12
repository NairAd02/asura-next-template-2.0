"use server";

import {
  createWidget,
  editWidget,
  getAllWidgets,
  getWidgetById,
  deleteWidget,
  deleteWidgetsBulk,
  toggleWidgetActive,
  toggleWidgetsBulk,
} from "../services/widget.services";
import {
  CreateWidgetDto,
  EditWidgetDto,
  WidgetDetails,
  WidgetFiltersDto,
  WidgetsResponse,
} from "../types/widget.types";
import type { ServiceResponse } from "@/lib/api-responses";

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function getAllWidgetsAction(
  options: WidgetFiltersDto = {},
): Promise<WidgetsResponse> {
  return await getAllWidgets(options);
}

export async function getWidgetByIdAction(
  id: string,
): Promise<ServiceResponse<WidgetDetails | null>> {
  return await getWidgetById(id);
}

export async function createWidgetAction(
  dto: CreateWidgetDto,
): Promise<ServiceResponse<WidgetDetails>> {
  return await createWidget(dto);
}

export async function editWidgetAction(
  widgetId: string,
  dto: EditWidgetDto,
): Promise<ServiceResponse<WidgetDetails>> {
  return await editWidget(widgetId, dto);
}

export async function deleteWidgetAction(
  id: string,
): Promise<ServiceResponse<void>> {
  return await deleteWidget(id);
}

export async function deleteWidgetsBulkAction(
  ids: string[],
): Promise<ServiceResponse<{ deleted: number; failed: string[] }>> {
  return await deleteWidgetsBulk(ids);
}

export async function toggleWidgetActiveAction(
  id: string,
  isActive: boolean,
): Promise<ServiceResponse<WidgetDetails>> {
  return await toggleWidgetActive(id, isActive);
}

export async function toggleWidgetsBulkAction(
  ids: string[],
  isActive: boolean,
): Promise<ServiceResponse<{ updated: number; failed: string[] }>> {
  return await toggleWidgetsBulk(ids, isActive);
}
