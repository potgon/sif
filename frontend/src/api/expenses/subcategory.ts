import apiClient from "../client.ts";
import {Delete, Subcategory} from "./types.ts";

export const createSubcategory = async (name: string): Promise<Subcategory> => {
    const response = await apiClient.post("/subcategory", null, {
        params: {name}
    })
    return response.data
}

export const updateSubcategory = async (subcategory: Subcategory): Promise<Subcategory> => {
    const response = await apiClient.patch("/subcategory", subcategory)
    return response.data
}

export const deleteSubcategory = async (id: number): Promise<Delete> => {
    const response = await apiClient.delete(`/subcategory/${id}`)
    return response.data
}

export const fetchAllSubcategories = async (): Promise<Subcategory[]> => {
    const response = await apiClient.get("/subcategory")
    return response.data
}