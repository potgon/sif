import apiClient from "../client"
import {Param} from "./types"

export const fetchParam = async (paramName: string): Promise<Param> => {
    const response = await apiClient.get(`/params/income/${paramName}`)
    return response.data
}

export const updateParam = async (payload: { key: string, value: string }): Promise<Param> => {
    const response = await apiClient.post(`/params/target`, payload)
    return response.data
}
