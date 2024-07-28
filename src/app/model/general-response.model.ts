export interface GeneralResponse {
    success: boolean
    message?: string
    generalErrors?: GenericServerError[]
    fieldErrors?: GenericServerError[]
}

export interface GenericServerError {
    fieldPath?: string
    errorMessage?: string
    errorNumber?: number
    // fieldIndex?: number
}
